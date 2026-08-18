import gc
import logging
import re
from pathlib import Path
from typing import List, Optional

from .chunking import split_text
from .embeddings import EmbeddingModel
from .generator_client import generate_answer
from .retriever import retrieve_chunks
from .vectorstore import VectorStore
from ..config import settings
from ..ingestion.loaders import load_documents

logger = logging.getLogger("uvicorn.error")

PORTFOLIO_PROJECTS = [
    {"id": "rag-powered-helpdesk", "name": "Smart Service Desk", "aliases": ["smart service desk", "ssd", "smart-service-desk"]},
    {"id": "semantic-cache-llm", "name": "Semantic Cache LLM", "aliases": ["semantic cache llm", "semantic cache"]},
    {"id": "ai-interview-chatbot", "name": "AI Interview Chatbot", "aliases": ["ai interview chatbot", "interview chatbot"]},
    {"id": "taletm_acquisition", "name": "Talent Acquisition", "aliases": ["talent acquisition", "candidate ranking", "resume ranking"]},
]

PROJECT_ID_ALIASES = {
    "rag-powered-helpdesk": "smart_service_desk",
    "smart-service-desk": "smart_service_desk",
    "smart_service_desk": "smart_service_desk",
    "semantic-cache-llm": "semantic_cache_llm",
    "semantic_cache_llm": "semantic_cache_llm",
    "ai-interview-chatbot": "ai_interview_chatbot",
    "ai_interview_chatbot": "ai_interview_chatbot",
    "talent-acquisition": "talent_acquisition",
    "taletm_acquisition": "talent_acquisition",
    "talent_acquisition": "talent_acquisition",
}

GREETING_PATTERNS = [
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening", "yo",
    "thanks", "thank you", "wow", "nice", "great", "cool", "ok", "okay"
]
GREETING_EXACT_PATTERNS = ["hi", "hello", "hey", "yo", "thanks", "thank you", "wow", "nice", "great", "cool", "ok", "okay"]

CONTACT_KEYWORDS = ["contact", "contact details", "email", "gmail", "mail", "linkedin", "phone", "mobile", "number", "reach", "call"]
OUT_OF_SCOPE_KEYWORDS = ["weather", "sports", "politics", "trivia", "life advice", "random coding"]


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def _read_canonical_facts() -> dict:
    facts_path = Path(__file__).resolve().parents[2] / "knowledge_base" / "canonical_facts.md"
    data: dict = {
        "name": "Aathif Nizam",
        "email": "aathif.knizam@gmail.com",
        "linkedin": "linkedin.com/in/aathif-nizam",
        "phone": "+91 9645860618",
        "education": "B.Tech in Computer Science and Engineering, College of Engineering Karunagappally, 2021-2025, CGPA 6.35",
        "stack": "Python, FastAPI, Django, Django REST Framework, React, SQL, Generative AI, RAG, ChromaDB, Groq",
    }
    if facts_path.exists():
        try:
            raw = facts_path.read_text(encoding="utf-8")
            for line in raw.splitlines():
                if ":" in line:
                    key, value = line.split(":", 1)
                    data[key.strip().lower().replace(" ", "_")] = value.strip()
        except Exception:
            pass
    return data


def classify_intent(question: str) -> str:
    q = normalize_space(question).lower()
    if not q:
        return "UNKNOWN"
    if any(re.search(rf"(?<![a-z]){re.escape(greeting)}(?![a-z])", q) for greeting in GREETING_EXACT_PATTERNS):
        return "GREETING"
    if any(keyword in q for keyword in CONTACT_KEYWORDS):
        return "CONTACT"
    if any(keyword in q for keyword in OUT_OF_SCOPE_KEYWORDS):
        return "OUT_OF_SCOPE"
    if re.search(r"\b(i|we)\s+didn['’]?t\s+ask\s+that\b|\bnot\s+what\s+i\s+asked\b|\bthat\s+isn['’]?t\s+what\s+i\s+asked\b", q):
        return "RESET_CONTEXT"
    if re.search(r"\b(which|what)\s+(repository|repo)\b", q) and not any(alias in q for alias in ["smart service desk", "semantic cache", "ai interview chatbot", "talent acquisition", "smart-service-desk", "semantic-cache-llm", "ai-interview-chatbot", "talent-acquisition"]):
        return "REPOSITORY_UNSPECIFIED"
    if any(token in q for token in ["who is aathif", "about aathif", "tell me about aathif", "aathif nizam"]):
        return "ABOUT"
    if any(token in q for token in ["what has he worked on", "experience", "worked on", "background", "career"]):
        return "EXPERIENCE"
    if any(token in q for token in ["education", "college", "graduation", "degree", "b.tech", "cgpa"]):
        return "EDUCATION"
    if any(token in q for token in ["what projects", "what are his projects", "what are aathif's projects", "projects has", "built", "portfolio projects", "which projects", "how many projects", "his projects"]):
        return "PROJECT_LIST"
    if any(token in q for token in ["best project", "which project is the best", "strongest project", "best showcase"]):
        return "PROJECT_COMPARISON"
    if re.search(r"\b(skills?|what are his skills|what skills does aathif have|what are aathif's skills)\b", q):
        return "SKILL"
    if any(token in q for token in ["what is rag", "what is chromadb", "how does aathif use", "why did he use", "how does aathif do this project", "what is react", "what is fastapi"]) or "rag" in q or "chromadb" in q or "fastapi" in q or "react" in q:
        return "TECHNOLOGY"
    if any(token in q for token in ["stack", "efficient in", "strongest stack", "technologies", "tech stack"]):
        return "SKILL"
    if "what is " in q or "what are " in q or "why did" in q:
        normalized = resolve_entity_alias(q)
        if normalized and normalized != q:
            return "PROJECT_ENTITY"
    if "architecture" in q or "how does" in q or "implementation" in q:
        return "ARCHITECTURE"
    if "contact" in q or "email" in q or "gmail" in q:
        return "CONTACT"
    if "project" in q:
        return "PROJECT_DETAIL"
    return "UNKNOWN"


def resolve_entity_alias(query: str) -> str:
    q = normalize_space(query).lower()
    q = re.sub(r"[^a-z0-9\s]", " ", q)
    q = re.sub(r"\s+", " ", q).strip()

    if not q:
        return ""
    if re.search(r"\b(which|what)\s+(repository|repo)\b", q):
        return ""

    entity_map = {
        "ssd": "Smart Service Desk",
        "smart service desk": "Smart Service Desk",
        "smart service": "Smart Service Desk",
        "semantic cache": "Semantic Cache LLM",
        "semantic cache llm": "Semantic Cache LLM",
        "clinic system": "Clinic Management System",
        "clinic management system": "Clinic Management System",
        "healthcare cms dashboard": "Clinic Management System",
        "ai interview chatbot": "AI Interview Chatbot",
        "interview chatbot": "AI Interview Chatbot",
        "chroma": "ChromaDB",
        "chromadb": "ChromaDB",
        "genai": "Generative AI",
        "generative ai": "Generative AI",
        "django rest": "Django REST Framework",
        "django rest framework": "Django REST Framework",
        "rest": "Django REST Framework",
        "rag": "RAG",
        "talent acquisition": "Talent Acquisition",
    }

    for alias, canonical in entity_map.items():
        if alias in q:
            return canonical

    if "smart service desk" in q or "ssd" in q:
        return "Smart Service Desk"
    return q.title() if q else ""


def normalize_query(question: str, recent_context: Optional[List[str]] = None) -> str:
    q = normalize_space(question)
    lowered = q.lower()

    if not q:
        return q

    if any(re.search(rf"(?<![a-z]){re.escape(greeting)}(?![a-z])", lowered) for greeting in GREETING_EXACT_PATTERNS):
        return "Hi! I'm Aathif's portfolio assistant. Ask me about his projects, skills, technologies, or experience."

    if any(keyword in lowered for keyword in ["aathifs contact", "aathif contact", "contact aathif", "how can i contact aathif", "how do i reach aathif"]):
        return "What are Aathif Nizam's contact details?"

    if "gmail" in lowered:
        return "What is Aathif Nizam's email address?"

    if "what is ssd" in lowered or ("ssd" in lowered and "what" in lowered):
        return "What is the Smart Service Desk?"

    if "what is rag" in lowered:
        return "What is RAG and how does Aathif use it?"

    if "which stack is aathif efficient in" in lowered or "strongest stack" in lowered:
        return "Which technology stack is Aathif strongest in?"

    if "why his cgpa low" in lowered or "cgpa low" in lowered or "why is his cgpa low" in lowered:
        return "Why is Aathif's CGPA low?"

    if "process for building products" in lowered or "your process for building products" in lowered:
        return "What is Aathif's process for building products?"

    if "this project" in lowered and recent_context:
        last = recent_context[-1]
        return q.replace("this project", last)

    if "it" in lowered and recent_context and "why did he use it" in lowered:
        return f"Why did Aathif use {recent_context[-1]}?"

    if any(token in lowered for token in ["what is", "why did", "how does", "which", "who", "how many"]):
        return q

    return q


class RAGPipeline:
    def __init__(self):
        self.settings = settings
        self.embedding_model: EmbeddingModel | None = None
        self.vectorstore: VectorStore | None = None
        self.recent_context: List[str] = []

    def initialize(self):
        if self.vectorstore is not None and self.embedding_model is not None:
            return

        self.vectorstore = VectorStore(
            self.settings.chroma_db_path,
            self.settings.collection_name,
            self.settings.embedding_model,
        )
        self.embedding_model = EmbeddingModel(self.settings.embedding_model)

        logger.info("Embedding backend: %s", self.embedding_model.backend_name)
        logger.info("Embedding model: %s", self.embedding_model.model_name)
        logger.info("Chroma collection: %s", self.vectorstore.collection_name)
        logger.info("Chroma document count: %s", self.vectorstore.collection.count())

        if not self.vectorstore.has_documents():
            self.build_index()

        logger.info("Chroma document count: %s", self.vectorstore.collection.count())

    def build_index(self):
        knowledge_path = Path(__file__).resolve().parents[2] / "knowledge_base"
        documents = load_documents(knowledge_path)
        if not documents:
            return

        chunks = []
        for document in documents:
            text_chunks = split_text(
                document["text"],
                chunk_size=self.settings.chunk_size,
                overlap=self.settings.chunk_overlap,
            )
            for index, chunk_text in enumerate(text_chunks, start=1):
                metadata = dict(document["metadata"])
                metadata["source"] = document["id"]
                for key, value in list(metadata.items()):
                    if value is None:
                        metadata[key] = ""
                    elif not isinstance(value, (str, int, float, bool)):
                        metadata[key] = str(value)
                chunks.append({
                    "id": f"{document['id']}#{index}",
                    "text": chunk_text,
                    "metadata": metadata,
                })

        if not chunks:
            return

        embeddings = self.embedding_model.embed_texts([item["text"] for item in chunks])
        self.vectorstore.add_documents(
            ids=[item["id"] for item in chunks],
            texts=[item["text"] for item in chunks],
            metadatas=[item["metadata"] for item in chunks],
            embeddings=embeddings,
        )
        del embeddings, chunks
        gc.collect()

    def _recent_entity(self, question: str) -> Optional[str]:
        lowered = question.lower()
        if "smart service desk" in lowered or "ssd" in lowered:
            return "Smart Service Desk"
        if "rag" in lowered:
            return "RAG"
        if "semantic cache" in lowered:
            return "Semantic Cache LLM"
        if "interview chatbot" in lowered:
            return "AI Interview Chatbot"
        if "talent acquisition" in lowered:
            return "Talent Acquisition"
        if self.recent_context:
            return self.recent_context[-1]
        return None

    def _contact_answer(self) -> str:
        facts = _read_canonical_facts()
        email = facts.get("email", "aathif.knizam@gmail.com")
        linkedin = facts.get("linkedin", "linkedin.com/in/aathif-nizam")
        phone = facts.get("phone", "+91 9645860618")
        return f"You can reach Aathif at {email}. LinkedIn: {linkedin}. Phone: {phone}."

    def _about_answer(self) -> str:
        facts = _read_canonical_facts()
        return (
            f"Aathif Nizam is a Computer Science graduate focused on Python backend, SQL, REST APIs, and AI-powered application development. "
            f"He studied at the College of Engineering Karunagappally and graduated in 2025 with a CGPA of 6.35."
        )

    def _project_list_answer(self) -> str:
        names = [project["name"] for project in PORTFOLIO_PROJECTS]
        return (
            "The portfolio currently showcases 4 projects: Smart Service Desk, Semantic Cache LLM, AI Interview Chatbot, and Talent Acquisition. "
            "These are the current public portfolio entries, while historical or internal work is kept separate."
        )

    def _project_comparison_answer(self) -> str:
        return (
            "From a portfolio perspective, the Smart Service Desk is the strongest showcase because it combines Django, React, RAG, ChromaDB, JWT authentication, and end-to-end AI support workflows in a single product."
        )

    def _cgpa_answer(self) -> str:
        return "Aathif's CGPA is 6.35. I don't have information in the portfolio about the reasons behind his CGPA, so I don't want to speculate."

    def _product_process_answer(self) -> str:
        return "Aathif typically starts by understanding the problem and requirements, then designs the architecture and data model, builds the backend and frontend, integrates AI and RAG where needed, and iterates through testing and refinement."

    def _stack_answer(self) -> str:
        facts = _read_canonical_facts()
        stack = facts.get("stack", "Python, Django, Django REST Framework, FastAPI, React, SQL, Generative AI, RAG, ChromaDB, Groq")
        return (
            f"Aathif's core skills include: {stack}. His strongest work is in Python backend development, REST APIs, database design, full-stack delivery, and AI/RAG applications."
        )

    def _repository_unspecified_answer(self) -> str:
        return "I don't see a specific repository name in your question, so I don't want to guess or invent one. Ask me about a project, skill, or technology instead."

    def _reset_context_answer(self) -> str:
        self.recent_context.clear()
        return "No problem — I’ll reset the context and start fresh. What would you like to know about Aathif or his work?"

    def _out_of_scope_answer(self) -> str:
        return "I'm Aathif's portfolio assistant, so I can help with his projects, skills, technologies, experience, and background."

    def _casual_answer(self, question: str) -> str:
        lowered = question.lower()
        if "wow" in lowered or "super" in lowered or "nice" in lowered or "great" in lowered or "cool" in lowered:
            return "Glad you liked it! Ask me anything about Aathif or his work."
        if "thanks" in lowered or "thank you" in lowered:
            return "You're welcome!"
        return "Hi! I'm Aathif's portfolio assistant. Ask me about his projects, skills, technologies, or experience."

    async def answer_chat(self, question: str):
        # Ensure pipeline is initialized (in case startup event didn't run or was skipped)
        if self.vectorstore is None or self.embedding_model is None:
            logger.warning("RAG pipeline not initialized; initializing now on first request")
            self.initialize()
        
        clean_question = normalize_space(question)
        lowered = clean_question.lower()
        intent = classify_intent(clean_question)

        if re.search(r"\b(i|we)\s+didn['’]?t\s+ask\s+that\b|\bnot\s+what\s+i\s+asked\b|\bthat\s+isn['’]?t\s+what\s+i\s+asked\b", lowered):
            return {"answer": self._reset_context_answer(), "sources": []}

        if re.search(r"\b(which|what)\s+(repository|repo)\b", lowered) and not any(alias in lowered for alias in ["smart service desk", "semantic cache", "ai interview chatbot", "talent acquisition", "smart-service-desk", "semantic-cache-llm", "ai-interview-chatbot", "talent-acquisition"]):
            return {"answer": self._repository_unspecified_answer(), "sources": []}

        if intent == "GREETING":
            answer = self._casual_answer(clean_question)
            return {"answer": answer, "sources": []}

        if intent == "CASUAL":
            answer = self._casual_answer(clean_question)
            return {"answer": answer, "sources": []}

        if intent == "CONTACT":
            answer = self._contact_answer()
            return {"answer": answer, "sources": []}

        if intent == "ABOUT":
            answer = self._about_answer()
            return {"answer": answer, "sources": []}

        if intent == "PROJECT_LIST":
            answer = self._project_list_answer()
            return {"answer": answer, "sources": []}

        if intent == "PROJECT_COMPARISON":
            answer = self._project_comparison_answer()
            return {"answer": answer, "sources": []}

        if "cgpa" in lowered and ("why" in lowered or "reason" in lowered or "low" in lowered):
            answer = self._cgpa_answer()
            return {"answer": answer, "sources": []}

        if "cgpa" in lowered:
            return {"answer": "Aathif's CGPA is 6.35.", "sources": []}

        if "process for building products" in lowered or "your process for building products" in lowered:
            answer = self._product_process_answer()
            return {"answer": answer, "sources": []}

        if intent == "SKILL":
            answer = self._stack_answer()
            return {"answer": answer, "sources": []}

        if intent == "RESET_CONTEXT":
            return {"answer": self._reset_context_answer(), "sources": []}

        if intent == "REPOSITORY_UNSPECIFIED":
            return {"answer": self._repository_unspecified_answer(), "sources": []}

        if intent == "OUT_OF_SCOPE":
            answer = self._out_of_scope_answer()
            return {"answer": answer, "sources": []}

        selected_entity = self._recent_entity(clean_question) or resolve_entity_alias(clean_question)
        if selected_entity and selected_entity not in {"", "UNKNOWN"}:
            self.recent_context.append(selected_entity)
            self.recent_context = self.recent_context[-5:]

        query_for_retrieval = normalize_query(clean_question, self.recent_context)
        if intent in {"PROJECT_ENTITY", "PROJECT_DETAIL"} and selected_entity:
            query_for_retrieval = f"Tell me about {selected_entity}"
        if intent == "TECHNOLOGY":
            resolved = resolve_entity_alias(clean_question)
            if resolved and resolved != clean_question:
                query_for_retrieval = f"What is {resolved}?"

        chunks = retrieve_chunks(
            query_for_retrieval,
            self.vectorstore,
            self.embedding_model,
            top_k=min(self.settings.max_context_chunks, 3),
            intent=intent,
        )

        if not chunks:
            raise ValueError("I don't have enough information about that in Aathif's portfolio.")

        answer = await generate_answer(query_for_retrieval, chunks)
        sources = [chunk["metadata"].get("source", "") for chunk in chunks]

        if selected_entity and selected_entity not in {"", "UNKNOWN"}:
            self.recent_context.append(selected_entity)
            self.recent_context = self.recent_context[-5:]

        return {"answer": answer, "sources": sources}

    def _project_direct_answer(self, question: str, project_id: str) -> Optional[str]:
        q = normalize_space(question).lower()
        normalized = PROJECT_ID_ALIASES.get(project_id, project_id).strip().lower().replace(" ", "_")

        if normalized == "semantic_cache_llm":
            if "chromadb" in q:
                return (
                    "Aathif used ChromaDB as a persistent semantic cache store for this project. "
                    "It lets the app embed incoming questions, compare them against past requests, and reuse cached answers when the similarity is high, which cuts cost and latency."
                )
            if "rag" in q or "pipeline" in q or "purpose" in q:
                return (
                    "In this project, the pipeline is a semantic caching workflow rather than a document-retrieval RAG system. "
                    "Each query is embedded, compared against prior entries in ChromaDB, and if the similarity is high enough the cached answer is returned immediately; otherwise the system calls Groq and stores the new response for reuse."
                )

        if normalized == "smart_service_desk":
            if "rag" in q or "pipeline" in q or "purpose" in q:
                return (
                    "The Smart Service Desk uses a support-oriented RAG flow: the backend retrieves relevant knowledge from ticket and support content, combines it with the user context, and sends grounded information to the AI layer before responding."
                )

        return None

    async def answer_project(self, question: str, project_id: str):
        assert self.vectorstore is not None and self.embedding_model is not None
        normalized_project_id = PROJECT_ID_ALIASES.get(project_id, project_id)
        normalized_project_id = normalized_project_id.strip().lower().replace(" ", "_")

        direct_answer = self._project_direct_answer(question, project_id)
        if direct_answer is not None:
            return {"answer": direct_answer, "sources": [f"projects/{normalized_project_id}.md"]}

        chunks = retrieve_chunks(
            question,
            self.vectorstore,
            self.embedding_model,
            top_k=min(self.settings.max_context_chunks, 5),
            project_id=normalized_project_id,
            intent="PROJECT_DETAIL",
        )

        if not chunks:
            raise ValueError(f"No knowledge available for project '{project_id}'.")

        answer = await generate_answer(question, chunks)
        sources = [chunk["metadata"].get("source", "") for chunk in chunks]
        return {"answer": answer, "sources": sources}


rag_pipeline = RAGPipeline()
