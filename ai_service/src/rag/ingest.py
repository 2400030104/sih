import os
import glob
import re
from typing import List, Dict, Any
from ai_service.src.rag.vector_store import VectorStore

KNOWLEDGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'knowledge'))
STORE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'vector_store', 'knowledge_index.json'))

def chunk_markdown(content: str, filename: str) -> List[Dict[str, Any]]:
    """
    Split markdown document by headers (## and ###) into structured semantic chunks with rich metadata.
    """
    chunks = []
    lines = content.split('\n')
    
    current_section = "Overview"
    current_lines = []
    
    doc_title = os.path.splitext(os.path.basename(filename))[0].replace('_', ' ').title()

    for line in lines:
        if line.startswith('## ') or line.startswith('### '):
            if current_lines:
                chunk_text = '\n'.join(current_lines).strip()
                if len(chunk_text) > 40:
                    chunks.append({
                        "text": chunk_text,
                        "metadata": {
                            "source": doc_title,
                            "section": current_section,
                            "filename": os.path.basename(filename)
                        }
                    })
                current_lines = []
            current_section = line.lstrip('#').strip()
        else:
            current_lines.append(line)

    if current_lines:
        chunk_text = '\n'.join(current_lines).strip()
        if len(chunk_text) > 40:
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    "source": doc_title,
                    "section": current_section,
                    "filename": os.path.basename(filename)
                }
            })

    return chunks

def build_knowledge_index() -> VectorStore:
    """
    Ingests all knowledge documents into the vector store.
    """
    vector_store = VectorStore()
    doc_files = glob.glob(os.path.join(KNOWLEDGE_DIR, '*.md'))

    total_chunks = 0
    for doc_path in doc_files:
        try:
            with open(doc_path, 'r', encoding='utf-8') as f:
                content = f.read()
            chunks = chunk_markdown(content, doc_path)
            for c in chunks:
                vector_store.add_document(c["text"], c["metadata"])
                total_chunks += 1
        except Exception as e:
            print(f"[Ingest Error] Could not process {doc_path}: {e}")

    vector_store.save(STORE_PATH)
    print(f"[RAG Ingestion] Indexed {len(doc_files)} documents ({total_chunks} semantic chunks) -> {STORE_PATH}")
    return vector_store

_global_vector_store = None

def get_vector_store() -> VectorStore:
    global _global_vector_store
    if _global_vector_store is None:
        store = VectorStore()
        if os.path.exists(STORE_PATH):
            store.load(STORE_PATH)
            _global_vector_store = store
        else:
            _global_vector_store = build_knowledge_index()
    return _global_vector_store

if __name__ == '__main__':
    build_knowledge_index()
