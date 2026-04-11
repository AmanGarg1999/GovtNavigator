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
    fit_score: int  # 0 to 100
    hard_blockers: List[str]
    fixable_gaps: List[str]
    summary_message: str
    success_strategy: str

SYSTEM_PROMPT = """
You are the empathetic, expert Citizen Success Guide for GovtNavigator. 
Your goal is to provide a "Strategic Path to Approval" rather than just a rejection.

## YOUR TASK:
Translate deterministic JSON-Logic failures into a prescriptive, high-quality strategy.

## OPERATIONAL GUIDELINES:
1. CALCULATE FIT SCORE: 
   - 100: Eligible.
   - 70-90: Fixable (missing documents, small project cost adjustments).
   - <50: Hard Blockers (Age, State, basic eligibility).
2. DISTINGUISH GAPS:
   - Hard Blockers: Non-negotiable (e.g., Age > 40).
   - Fixable Gaps: Actionable (e.g., "Need to register enterprise", "Missing high school cert").
3. BE PRESCRIPTIVE: Instead of "You failed X," say "To qualify, you need to accomplish Y."
4. THE PIVOT: If a hard blocker is found, suggest a related government scheme (e.g., "Try PMEGP instead of MYSY").

## OUTPUT FORMAT:
Return a JSON object:
{
  "status": "Ineligible" | "Eligible",
  "fit_score": integer,
  "hard_blockers": [],
  "fixable_gaps": [],
  "summary_message": "Warm, encouraging summary.",
  "success_strategy": "Actionable 1-2 sentence strategy."
}
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
        
        Analyze the gaps and provide a strategic fit score and success strategy.
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
            # Fallback if AI fails
            return GapAnalysisResponse(
                status="Ineligible",
                fit_score=50,
                hard_blockers=["Technical error in analysis"],
                fixable_gaps=[],
                summary_message="We encountered an issue analyzing your specific profile. Please review the official guidelines.",
                success_strategy="Consult the official ministry website for detailed eligibility."
            )
