from typing import Optional, List
from pydantic import BaseModel, Field

class CitizenProfile(BaseModel):
    age: int = Field(..., description="Age of the citizen")
    domicile_state: str = Field(..., description="State of residence")
    education_level: str = Field(..., description="Current highest education level")
    income_annual: int = Field(..., description="Annual income in INR")
    gender: str = Field(..., description="Male, Female, Other")
    caste_category: str = Field(default="General", description="General, OBC, SC, ST")
    
    # Business specific fields mapping to our target schemes
    enterprise_type: Optional[str] = Field(None, description="e.g., Manufacturing, Service, Retail")
    project_cost: Optional[int] = Field(None, description="Total project cost proposed in INR")
    is_defaulter: bool = Field(default=False, description="Has the applicant defaulted on loans?")
