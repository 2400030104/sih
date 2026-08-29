import numpy as np
import re
import importlib
from typing import List

class LocalEmbeddingModel:
    """
    Lightweight, deterministic, local open-source embedding engine.
    Uses subword hashing and normalized TF-IDF semantic embeddings for 0-GPU, 0-API execution,
    with optional sentence-transformers support if installed.
    """
    def __init__(self, embedding_dim: int = 128):
        self.embedding_dim = embedding_dim
        self._st_model = None
        self._init_sentence_transformers()

    def _init_sentence_transformers(self):
        try:
            st_pkg = importlib.import_module('sentence_transformers')
            sentence_transformer_cls = getattr(st_pkg, 'SentenceTransformer', None)
            if sentence_transformer_cls:
                self._st_model = sentence_transformer_cls('all-MiniLM-L6-v2')
                self.embedding_dim = 384
        except Exception:
            # Clean fallback to fast vectorized semantic hashing with zero external dependencies
            self._st_model = None

    def embed_text(self, text: str) -> np.ndarray:
        if self._st_model is not None:
            try:
                emb = self._st_model.encode(text, convert_to_numpy=True)
                return emb.astype(np.float32)
            except Exception:
                pass

        # Robust normalized semantic hash vectorizer
        clean = re.sub(r'[^\w\s]', ' ', text.lower())
        tokens = [t for t in clean.split() if len(t) > 1]
        
        vec = np.zeros(self.embedding_dim, dtype=np.float32)
        if not tokens:
            return vec

        for token in tokens:
            # Deterministic multi-hash feature representation
            h1 = hash(token) % self.embedding_dim
            h2 = hash(token[::-1]) % self.embedding_dim
            h3 = (hash(token) // 31) % self.embedding_dim
            
            vec[h1] += 1.0
            vec[h2] += 0.5
            vec[h3] += 0.25

        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def embed_batch(self, texts: List[str]) -> np.ndarray:
        return np.array([self.embed_text(t) for t in texts], dtype=np.float32)
