from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import init_db
from app.schemas.scheme import UnifiedSchemeSchema
from app.services.interpreter import InterpreterAgent
from app.services.gap_analyzer import GapAnalyzer, GapAnalysisResponse
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    try:
        init_db()
    except Exception as e:
        print(f"Database initialization temporarily skipped: {e}")

@app.get("/")
def read_root():
    return {"message": "GovtNavigator API is online", "status": "active"}

class ParseRequest(BaseModel):
    document_text: str

@app.post("/api/v1/interpreter/parse", response_model=UnifiedSchemeSchema)
def parse_scheme_document(request: ParseRequest):
    agent = InterpreterAgent()
    try:
        schema = agent.analyze_document(request.document_text)
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interpretation failed: {str(e)}")

class EligibilityRequest(BaseModel):
    user_profile: Dict[str, Any]
    scheme_rules: Dict[str, Any]
    scheme_name: str

@app.post("/api/v1/eligibility/analyze")
def analyze_eligibility(request: EligibilityRequest):
    agent = GapAnalyzer()
    try:
        # 1. Deterministic evaluation
        result = agent.evaluate_rules(request.user_profile, request.scheme_rules)
        if result["eligible"]:
            return {"status": "Eligible", "message": "You passed all logical requirements."}
            
        # 2. AI Explainability
        explanation = agent.generate_explanation(
            profile=request.user_profile,
            scheme_name=request.scheme_name,
            failed_rules=result["failed_rules"]
        )
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gap analysis failed: {str(e)}")
