from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, Field
from sqlmodel import SQLModel, Field as SQLField, Column, JSON
from sqlalchemy.dialects.postgresql import JSONB

class BasicDetails(BaseModel):
    title_english: str = Field(..., description="English title of the scheme")
    title_regional: Optional[str] = Field(None, description="Regional title of the scheme")
    state: str = Field(..., description="State where the scheme applies. 'Central' if everywhere")
    department: str = Field(..., description="Department handling the scheme")
    scheme_tags: List[str] = Field(..., description="Array of tags like 'Subsidy', 'Loan', 'Agriculture'")
    target_personas: List[str] = Field(..., description="E.g., Entrepreneur, Farmer, Individual")

class SourceVerification(BaseModel):
    official_urls: List[str] = Field(default_factory=list, description="Array of .gov.in URLs")
    document_pdfs: List[str] = Field(default_factory=list, description="Array of PDF URLs")
    last_updated: Optional[str] = Field(None, description="Format YYYY-MM-DD")

class DemographicsCriteria(BaseModel):
    age_min: Optional[int] = Field(None, description="Minimum age limit")
    age_max: Optional[int] = Field(None, description="Maximum age limit")
    domicile: List[str] = Field(default_factory=lambda: ["All"], description="Eligible states")
    education_min: Optional[str] = Field(None, description="Minimum education requirement")
    income_limit: Optional[int] = Field(None, description="Maximum income limitation")
    gender_specific: Optional[str] = Field(None, description="Target gender, if any")

class BusinessCriteria(BaseModel):
    enterprise_type: List[str] = Field(default_factory=list, description="E.g., Manufacturing, Service")
    project_cost_max: Dict[str, int] = Field(default_factory=dict, description="Max cost mapped to business type")
    conditions: List[str] = Field(default_factory=list, description="Other custom rules to follow")

class EligibilityRules(BaseModel):
    logic_framework: str = "json-logic"
    demographics: DemographicsCriteria
    business_criteria: BusinessCriteria

class Benefits(BaseModel):
    margin_money_subsidy_percentage: Optional[int] = None
    description: str

class DependencyDoc(BaseModel):
    doc_id: str
    name: str
    mandatory: bool
    condition: Optional[str] = None

class DocumentDependencyGraph(BaseModel):
    foundational: List[DependencyDoc] = Field(default_factory=list)
    contextual: List[DependencyDoc] = Field(default_factory=list)

class InstructionalDoc(BaseModel):
    instruction: str
    mandatory: bool

class FullDependencyGraph(DocumentDependencyGraph):
    instructional: List[InstructionalDoc] = Field(default_factory=list)

class ApplicationProcess(BaseModel):
    mode: List[str] = Field(default_factory=lambda: ["Online"])
    portal_url: Optional[str] = None
    steps: List[str] = Field(default_factory=list)

class UnifiedSchemeSchema(BaseModel):
    scheme_id: str
    basic_details: BasicDetails
    source_verification: SourceVerification
    eligibility_rules: EligibilityRules
    benefits: Benefits
    document_dependency_graph: FullDependencyGraph
    application_process: ApplicationProcess

class Scheme(SQLModel, table=True):
    __tablename__ = "schemes"
    
    id: Optional[int] = SQLField(default=None, primary_key=True)
    scheme_id: str = SQLField(index=True, unique=True)
    name: str = SQLField(index=True)
    state: str = SQLField(index=True)
    department: str = SQLField(index=True)
    is_verified: bool = SQLField(default=False)
    
    # Store the entire UnifiedSchemeSchema as a JSONB blob
    data: Dict[str, Any] = SQLField(default_factory=dict, sa_column=Column(JSONB))
