from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, UTC

import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200",
                   "https://mlatonzea-forum.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def startup():
    conn = sqlite3.connect("forum.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

class Post(BaseModel):
    username: str
    content: str

@app.get("/")
def root():
    return {"message": "API is working!"}

@app.get("/posts")
def get_posts():
    with sqlite3.connect("forum.db") as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM posts ORDER BY id DESC")
        rows = cursor.fetchall()
        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "username": row[1],
                "content": row[2],
                "timestamp": row[3]
            })
        return posts

@app.post("/posts")
def create_post(post: Post):
    with sqlite3.connect("forum.db") as conn:
        cursor = conn.cursor()
        timestamp = datetime.now(UTC).strftime("%d/%m/%Y %H:%M:%S")
        cursor.execute("""
            INSERT INTO posts (username, content, timestamp)
            VALUES (?, ?, ?)
        """, (post.username, post.content, timestamp))
    return {"ok": True}