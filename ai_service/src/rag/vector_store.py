import os
import json
import numpy as np
from typing import List, Dict, Any, Optional

class VectorStore:
    """
    Open-source in-memory & persisted vector database with cosine similarity search
    and structured source citation metadata.
    """
    def __init__(self, embedding_model=None):
        from ai_service.src.rag.embeddings import LocalEmbeddingModel
        self.embedding_model = embedding_model or LocalEmbeddingModel()
        self.documents: List[Dict[str, Any]] = []
        self.vectors: Optional[np.ndarray] = None

    def add_document(self, text: str, metadata: Dict[str, Any]):
        vec = self.embedding_model.embed_text(text)
        doc_entry = {
            "id": len(self.documents),
            "text": text,
            "metadata": metadata
        }
        self.documents.append(doc_entry)

        if self.vectors is None:
            self.vectors = np.array([vec], dtype=np.float32)
        else:
            self.vectors = np.vstack([self.vectors, vec.reshape(1, -1)])

    def search(self, query: str, top_k: int = 3, min_score: float = 0.15) -> List[Dict[str, Any]]:
        if not self.documents or self.vectors is None or len(self.documents) == 0:
            return []

        q_vec = self.embedding_model.embed_text(query)
        q_norm = np.linalg.norm(q_vec)
        if q_norm == 0:
            return []

        # Cosine similarity matrix multiplication
        scores = np.dot(self.vectors, q_vec) / (
            np.linalg.norm(self.vectors, axis=1) * q_norm + 1e-9
        )

        ranked_indices = np.argsort(scores)[::-1]

        results = []
        for idx in ranked_indices[:top_k]:
            score = float(scores[idx])
            if score >= min_score:
                doc = self.documents[idx]
                results.append({
                    "score": round(score, 4),
                    "text": doc["text"],
                    "metadata": doc["metadata"],
                    "citation": f"Source: {doc['metadata'].get('source', 'PRAGATI-AI Knowledge Base')} | Section: {doc['metadata'].get('section', 'General')}"
                })
        return results

    def save(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        data = {
            "documents": self.documents,
            "vectors": self.vectors.tolist() if self.vectors is not None else []
        }
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

    def load(self, filepath: str):
        if not os.path.exists(filepath):
            return False
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        self.documents = data.get("documents", [])
        vecs = data.get("vectors", [])
        if vecs:
            self.vectors = np.array(vecs, dtype=np.float32)
        return True
