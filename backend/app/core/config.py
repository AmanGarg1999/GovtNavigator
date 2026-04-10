import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GovtNavigator API"
    
    # LLM Settings (Ollama)
    OLLAMA_BASE_URL: str = "http://host.docker.internal:11434/v1"
    OLLAMA_INTERPRETER_MODEL: str = "mistral:latest"
    OLLAMA_ANALYZER_MODEL: str = "llama3:8b"
    
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/govt_navigator"

    class Config:
        env_file = ".env"

settings = Settings()
