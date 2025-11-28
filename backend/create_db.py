import os
import sqlite3

DB_FILE = "database.db"

if os.path.exists(DB_FILE):
    os.remove(DB_FILE)
    print(f"Deleted existing database file: {DB_FILE}")

conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

# User table
cursor.execute("""
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
""")

# Image table 
cursor.execute("""
CREATE TABLE IF NOT EXISTS Image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prediction_type TEXT NOT NULL,
    confidence_level REAL NOT NULL,
    image_path TEXT NOT NULL,
    patient_name TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES User(id)
);
""")

conn.commit()
conn.close()

print("Fresh database created with all tables and columns!")
