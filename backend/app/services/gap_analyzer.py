from openai import OpenAI
import json
import logging
from pydantic import BaseModel
from typing import List, Dict, Any
from json_logic import jsonLogic
from app.core.config import settings

logger = logging.getLogger(__name__)

class GapAnalysisResponse(BaseModel):
    status: str
    hard_blockers: List[str]
    fixable_gaps: List[str]
    summary_message: str

SYSTEM_PROMPT = """
You are the empathetic, solution-oriented Citizen Success Guide for GovtNavigator. 
The backend Rule Engine has evaluated a Citizen's Profile against a Government Scheme and determined they are INELIGIBLE. 

## YOUR TASK:
Translate the deterministic JSON-Logic failures into actionable, clear English. 

## OPERATIONAL GUIDELINES:
1. BE DIRECT BUT HELPFUL: Do not just list failures. Explain them clearly.
2. IDENTIFY THE GAPS: Point out easily fixable gaps vs. hard blockers. Age is a hard blocker. Missing a certification is a fixable gap.
3. SUGGEST PIVOTS: If possible, use the context to suggest an alternative.

## OUTPUT FORMAT:
Return a JSON object STRICTLY matching the expected format:
"status": "Ineligible",
"hard_blockers": ["List of non-fixable issues"],
"fixable_gaps": ["List of actionable steps"],
"summary_message": "Friendly explanation."
"""

class GapAnalyzer:
    def __init__(self):
        # Initialize OpenAI client pointing to Ollama
        self.client = OpenAI(
            base_url=settings.OLLAMA_BASE_URL,
            api_key="ollama",
        )
        self.model_name = settings.OLLAMA_ANALYZER_MODEL

    def evaluate_rules(self, profile: dict, rules: dict) -> Dict[str, Any]:
        """
        Runs json-logic deterministically on the citizen profile.
        Returns a dict indicating if they passed, and what failed.
        """
        failed_rules = []
        for rule_name, logic in rules.items():
            if not jsonLogic(logic, profile):
                failed_rules.append(rule_name)
                
        if not failed_rules:
            return {"eligible": True, "failed_rules": []}
            
        return {"eligible": False, "failed_rules": failed_rules}

    def generate_explanation(self, profile: dict, scheme_name: str, failed_rules: List[str]) -> GapAnalysisResponse:
        """Calls Ollama to explain the failed_rules"""
        logger.info(f"Generating explanation with Ollama model: {self.model_name}")
            
        prompt = f"""
        Citizen Profile: {json.dumps(profile)}
        Scheme Name: {scheme_name}
        Failed Logical Constraints: {failed_rules}
        """

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            parsed_data = json.loads(content)
            return GapAnalysisResponse(**parsed_data)
        except Exception as e:
            logger.error(f"Failed to generate explanation or parse response: {e}")
            raise e
