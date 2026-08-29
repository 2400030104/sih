#!/usr/bin/env python3
"""
Database Setup Script for PRAGATI-AI
Executes all SQL setup files in the correct order.
"""

import os
import sys
import pymysql
from dotenv import load_dotenv

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(__file__), 'backend', '.env')
load_dotenv(env_path)

# Database configuration
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'pragati_ai')

# SQL files to execute in order
SQL_DIR = os.path.join(os.path.dirname(__file__), 'sql')
SQL_FILES = [
    '01_create_database.sql',
    '02_create_tables.sql',
    '03_create_indexes.sql',
    '04_insert_master_data.sql',
    '05_insert_demo_projects.sql',
    '06_insert_demo_monthly_data.sql',
    '07_insert_demo_milestones.sql',
    '08_insert_demo_predictions.sql',
    '09_insert_demo_alerts.sql',
    '10_insert_demo_recommendations.sql',
    '11_create_views.sql',
    '12_validation_queries.sql',
]

def execute_sql_file(connection, filepath, db_name=None):
    """Execute a single SQL file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Split by SOURCE or semicolon for execution
        statements = []
        current_statement = ""
        
        for line in sql_content.split('\n'):
            line = line.strip()
            
            # Skip comments and empty lines
            if not line or line.startswith('--'):
                continue
            
            # Handle SOURCE command
            if line.startswith('SOURCE'):
                if current_statement:
                    statements.append(current_statement)
                    current_statement = ""
                # Extract source file and process recursively
                source_file = line.replace('SOURCE', '').strip().rstrip(';').strip("'\"")
                source_path = os.path.join(os.path.dirname(filepath), source_file)
                if os.path.exists(source_path):
                    print(f"  └─ Processing SOURCE: {source_file}")
                    execute_sql_file(connection, source_path, db_name)
                continue
            
            current_statement += " " + line
            
            if line.endswith(';'):
                if current_statement.strip():
                    statements.append(current_statement.rstrip(';'))
                current_statement = ""
        
        if current_statement.strip():
            statements.append(current_statement.rstrip(';'))
        
        # Execute statements
        cursor = connection.cursor()
        for i, statement in enumerate(statements, 1):
            if statement.strip():
                try:
                    cursor.execute(statement)
                    if 'SELECT' in statement.upper():
                        result = cursor.fetchall()
                        if result:
                            print(f"    ✓ Query result: {result[0] if len(result) == 1 else f'{len(result)} rows'}")
                    else:
                        print(f"    ✓ Statement {i}/{len(statements)} executed")
                except Exception as e:
                    print(f"    ✗ Error executing statement {i}: {str(e)}")
                    raise
        
        connection.commit()
        print(f"✓ {os.path.basename(filepath)} completed successfully")
        
    except Exception as e:
        print(f"✗ Error processing {filepath}: {str(e)}")
        raise

def main():
    print("=" * 70)
    print("PRAGATI-AI Database Setup")
    print("=" * 70)
    print(f"\nDatabase Configuration:")
    print(f"  Host: {DB_HOST}:{DB_PORT}")
    print(f"  User: {DB_USER}")
    print(f"  Database: {DB_NAME}")
    
    try:
        # Connect to MySQL (without database initially for CREATE DATABASE)
        print("\n[1/2] Connecting to MySQL Server...")
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            charset='utf8mb4'
        )
        print("✓ Connected to MySQL")
        
        # Execute setup files
        print("\n[2/2] Executing SQL Setup Files...")
        for sql_file in SQL_FILES:
            filepath = os.path.join(SQL_DIR, sql_file)
            if os.path.exists(filepath):
                print(f"\nProcessing: {sql_file}")
                execute_sql_file(conn, filepath, DB_NAME)
            else:
                print(f"⚠ File not found: {filepath}")
        
        conn.close()
        
        print("\n" + "=" * 70)
        print("✓ DATABASE SETUP COMPLETED SUCCESSFULLY")
        print("=" * 70)
        print(f"\nDatabase '{DB_NAME}' is now ready!")
        print("You can now start the backend service with: npm run dev")
        
    except pymysql.Error as e:
        print(f"\n✗ MySQL Error: {e}")
        print("\nTroubleshooting:")
        print("  1. Ensure MySQL server is running")
        print("  2. Verify database credentials in backend/.env")
        print("  3. Check MySQL user permissions")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
