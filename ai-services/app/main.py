from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="ReqForge AI Service",
    description="AI-powered BRD generation service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes
from app.routes import generation, chat, scraping, analysis

app.include_router(generation.router, prefix="/api/ai", tags=["generation"])
app.include_router(chat.router, prefix="/api/ai", tags=["chat"])
app.include_router(scraping.router, prefix="/api/ai", tags=["scraping"])
app.include_router(analysis.router, prefix="/api/ai", tags=["analysis"])

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ReqForge AI Service",
        "version": "1.0.0"
    }

@app.get("/")
def root():
    return {
        "message": "ReqForge AI Service API",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)