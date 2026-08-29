import os
import re
from typing import List, Dict, Any, Optional

# 1. Load .env with graceful fallback
try:
    from dotenv import load_dotenv
    load_dotenv()
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'backend', '.env'))
except Exception:
    # Built-in lightweight .env parser if python-dotenv is not initialized
    env_paths = [
        os.path.join(os.path.dirname(__file__), '..', '..', '..', 'backend', '.env'),
        os.path.join(os.getcwd(), '.env')
    ]
    for env_path in env_paths:
        if os.path.exists(env_path):
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'Rohith@12345')
DB_NAME = os.getenv('DB_NAME', 'pragati_ai')

_engine = None

def get_engine():
    """Returns SQLAlchemy Engine with connection pool if available."""
    global _engine
    if _engine is None:
        try:
            from sqlalchemy import create_engine
            from sqlalchemy.engine import URL
            db_url = URL.create(
                drivername="mysql+pymysql",
                username=DB_USER,
                password=DB_PASSWORD,
                host=DB_HOST,
                port=DB_PORT,
                database=DB_NAME,
                query={"charset": "utf8mb4"}
            )
            _engine = create_engine(
                db_url,
                pool_size=10,
                max_overflow=20,
                pool_recycle=3600,
                pool_pre_ping=True
            )
        except Exception:
            _engine = None
    return _engine

def query_db(sql_query: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Executes a parametrized SQL query safely and returns a list of dictionaries.
    Uses SQLAlchemy connection pooling when available, with clean fallback to PyMySQL.
    Automatically commits INSERT/UPDATE/DELETE statements.
    """
    engine = get_engine()
    if engine is not None:
        try:
            from sqlalchemy import text
            with engine.begin() as conn:
                result = conn.execute(text(sql_query), params or {})
                if result.returns_rows:
                    columns = list(result.keys())
                    rows = [dict(zip(columns, row)) for row in result.fetchall()]
                    return rows
                return []
        except Exception as e:
            # If SQLAlchemy query execution encounters an issue, fallback to direct PyMySQL
            pass

    # Direct PyMySQL Driver Fallback
    try:
        import pymysql
        import pymysql.cursors

        formatted_query = sql_query
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True
        )
        try:
            with conn.cursor() as cursor:
                py_query = re.sub(r':([a-zA-Z0-9_]+)', r'%(\1)s', formatted_query)
                cursor.execute(py_query, params or {})
                conn.commit()
                if cursor.description:
                    rows = cursor.fetchall()
                    return list(rows)
                return []
        finally:
            conn.close()
    except Exception as e:
        print(f"[DB Error] Query execution failed: {e}")
        return []
