from pathlib import Path
from typing import Dict, List


def _is_markdown(file_path: Path) -> bool:
    return file_path.suffix.lower() in {".md", ".txt"}


def load_documents(base_path: Path) -> List[Dict]:
    documents: List[Dict] = []
    base_path = base_path.resolve()

    for file_path in sorted(base_path.rglob("*")):
        if not file_path.is_file() or not _is_markdown(file_path):
            continue

        raw_text = file_path.read_text(encoding="utf-8").strip()
        if not raw_text:
            continue

        relative_path = file_path.relative_to(base_path)
        metadata = {
            "source": str(relative_path).replace("\\", "/"),
            "type": None,
            "project_id": None,
            "technology_id": None,
        }

        if relative_path.parts[0] == "projects" and len(relative_path.parts) >= 2:
            metadata["type"] = "project"
            metadata["project_id"] = relative_path.stem
        elif relative_path.parts[0] == "technologies":
            metadata["type"] = "technology"
            metadata["technology_id"] = relative_path.stem
        else:
            metadata["type"] = "general"

        documents.append(
            {
                "id": str(relative_path).replace("\\", "/"),
                "text": raw_text,
                "metadata": metadata,
            }
        )

    return documents
