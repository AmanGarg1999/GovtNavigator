from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import init_db, get_session
from app.schemas.scheme import UnifiedSchemeSchema, Scheme
from app.services.interpreter import InterpreterAgent
from app.services.gap_analyzer import GapAnalyzer, GapAnalysisResponse
from pydantic import BaseModel
from typing import Dict, Any, List
from sqlmodel import Session, select

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
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Database initialization failed: {e}")

@app.get("/")
def read_root():
    return {"message": "GovtNavigator API is online", "status": "active"}

@app.get("/api/v1/schemes", response_model=List[Scheme])
def get_schemes(session: Session = Depends(get_session)):
    """Fetch all verified government schemes from the database."""
    # For now, we fetch all, but in prod we would filter by is_verified=True
    statement = select(Scheme)
    results = session.exec(statement).all()
    return results

@app.post("/api/v1/schemes/ingest", response_model=Scheme)
def ingest_scheme(scheme_data: UnifiedSchemeSchema, session: Session = Depends(get_session)):
    """Ingest a new scheme into the database."""
    db_scheme = Scheme(
        id=None,
        scheme_id=scheme_data.scheme_id,
        name=scheme_data.basic_details.title_english,
        state=scheme_data.basic_details.state,
        department=scheme_data.basic_details.department,
        is_verified=True,  # Defaulting to true for now to show on frontend
        data=scheme_data.model_dump()
    )
    session.add(db_scheme)
    session.commit()
    session.refresh(db_scheme)
    return db_scheme

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
