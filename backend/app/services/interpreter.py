from openai import OpenAI
from app.core.config import settings
from app.schemas.scheme import UnifiedSchemeSchema
import json
import logging

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are the Senior Bureaucratic Intelligence Engine for GovtNavigator. 
Your objective is to ingest raw, translated Indian government policy documents and extract structured data using the strict Unified Scheme JSON Schema provided to you.

## OPERATIONAL GUIDELINES:
1. DECODE LEGALESE: Indian government documents contain complex "Sarkari" dialect. Convert this into plain, simplified English while keeping the official terminology strictly mapped to the source.
2. ELIGIBILITY ABSTRACTION: Extract precise numeric boundaries (Age, Income limits) and boolean states. If a constraint is ambiguous, leave it out or put it in custom conditions. Do NOT hallucinate numbers.
3. DEPENDENCY GRAPH MAPPING: Carefully separate required documents into:
   - Foundational (Identity, standard proofs)
   - Contextual (Specific to this scheme - e.g., Detailed Project Report, Caste Certificate)
   - Instructional (Specific formatting rules - e.g., "Self-attested", "Rs. 100 Stamp paper")
4. EXPLICIT JSON ONLY: Your output must strictly conform to the expected Pydantic schema structure. Do not output markdown code blocks outside of the JSON payload. Ensure it maps exactly.
"""

class InterpreterAgent:
    def __init__(self):
        # Initialize OpenAI client pointing to Ollama
        self.client = OpenAI(
            base_url=settings.OLLAMA_BASE_URL,
            api_key="ollama",  # Ollama doesn't require an API key
        )
        self.model_name = settings.OLLAMA_INTERPRETER_MODEL

    def analyze_document(self, document_text: str) -> UnifiedSchemeSchema:
        logger.info(f"Analyzing document with Ollama model: {self.model_name}")
        
        prompt = f"Analyze the following Indian government policy document and output a JSON matching the Unified Scheme Schema:\n\n{document_text}"

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
            return UnifiedSchemeSchema(**parsed_data)
        except Exception as e:
            logger.error(f"Failed to analyze document or parse response: {e}")
            raise e
