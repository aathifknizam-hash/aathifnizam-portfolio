from typing import List

from fastembed import TextEmbedding


class EmbeddingModel:
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.backend_name = "FastEmbed (ONNX Runtime / CPU)"
        self.model = TextEmbedding(model_name=model_name)

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        vectors = list(self.model.embed(texts))
        return [list(map(float, vector)) for vector in vectors]

    def embed_query(self, text: str) -> List[float]:
        vectors = list(self.model.embed([text]))
        return [float(value) for value in vectors[0]]
