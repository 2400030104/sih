import os
import sys
import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_service.src.database.db import query_db, get_engine
import pymysql

def create_backup():
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(os.path.dirname(__file__), '..', 'sql', 'backups')
    os.makedirs(backup_dir, exist_ok=True)
    backup_file = os.path.join(backup_dir, f'pragati_ai_before_reset_{timestamp}.sql')

    print(f"Creating backup at: {backup_file}")
    
    # Get all base tables
    tables = query_db("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'")
    table_names = [list(t.values())[0] for t in tables]

    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(f"-- PRAGATI-AI FULL DATABASE BACKUP\n")
        f.write(f"-- Timestamp: {datetime.datetime.now().isoformat()}\n")
        f.write(f"-- Database: pragati_ai\n\n")
        f.write("SET FOREIGN_KEY_CHECKS = 0;\n\n")

        for table in table_names:
            f.write(f"-- --------------------------------------------------\n")
            f.write(f"-- Table structure for `{table}`\n")
            f.write(f"-- --------------------------------------------------\n")
            create_tbl_res = query_db(f"SHOW CREATE TABLE `{table}`")
            create_sql = list(create_tbl_res[0].values())[1]
            f.write(f"{create_sql};\n\n")

            # Dump data
            rows = query_db(f"SELECT * FROM `{table}`")
            if rows:
                f.write(f"-- Dumping data for `{table}` ({len(rows)} rows)\n")
                cols = list(rows[0].keys())
                col_list = ", ".join([f"`{c}`" for c in cols])
                
                f.write(f"INSERT INTO `{table}` ({col_list}) VALUES\n")
                val_lines = []
                for r in rows:
                    vals = []
                    for c in cols:
                        v = r[c]
                        if v is None:
                            vals.append("NULL")
                        elif isinstance(v, (int, float)):
                            vals.append(str(v))
                        elif isinstance(v, (datetime.date, datetime.datetime)):
                            vals.append(f"'{v}'")
                        else:
                            # Escape string
                            escaped = str(v).replace("'", "''").replace("\\", "\\\\")
                            vals.append(f"'{escaped}'")
                    val_lines.append(f"({', '.join(vals)})")
                f.write(",\n".join(val_lines) + ";\n\n")

        f.write("SET FOREIGN_KEY_CHECKS = 1;\n")

    print(f"Backup successfully created: {backup_file} ({os.path.getsize(backup_file)} bytes)")
    return backup_file

if __name__ == '__main__':
    create_backup()
