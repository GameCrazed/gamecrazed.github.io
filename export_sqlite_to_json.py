import sqlite3
import json
import os
import sys

DB_PATH = "src/utils/data-store.sqlite3"  # Adjust if your DB is elsewhere
OUTPUT_DIR = "src/utils"  # Output JSON files here

def export_table_to_json(cursor, table_name, output_dir):
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        columns = [description[0] for description in cursor.description]
        data = [dict(zip(columns, row)) for row in rows]
        out_path = os.path.join(output_dir, f"{table_name.replace(' ', '_').lower()}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Exported {table_name} to {out_path}")
    except Exception as e:
        print(f"Failed to export {table_name}: {e}")

def main():
    if not os.path.exists(DB_PATH):
        print(f"Database file not found: {DB_PATH}")
        sys.exit(1)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    if not tables:
        print("No tables found in the database.")
        sys.exit(1)
    for table in tables:
        export_table_to_json(cursor, table, OUTPUT_DIR)
    conn.close()
    print("All tables exported.")

if __name__ == "__main__":
    main()
