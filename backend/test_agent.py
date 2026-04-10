import sys
import os

# Add backend directory to sys path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.interpreter import InterpreterAgent
from dotenv import load_dotenv

load_dotenv()

MOCK_DOC = """
Scheme Name: UP MSME Loan Subsidy Scheme 2024 (Mukhyamantri Yuva Swarozgar Yojana)
Objective: To encourage youth of Uttar Pradesh to establish new micro enterprises.
Eligibility: 
1. The applicant should be a resident of Uttar Pradesh.
2. The minimum age of the applicant should be 18 years and maximum age 40 years.
3. Minimum education qualification is high school (10th pass).
4. The applicant must not be a defaulter of any nationalized bank or financial institution.
Benefits:
- A margin money subsidy of 25% of the project cost will be provided.
- Maximum project cost for industry sector is Rs. 25.00 Lakhs and for service sector is Rs. 10.00 Lakhs.
Documents Required:
- Aadhaar Card
- PAN Card
- Domicile Certificate of UP
- 10th marksheet
- Detailed Project Report (DPR)
- Caste certificate (if applicable for ST/SC)
- An affidavit on a Rs 10 non-judicial stamp paper stating the applicant is not a defaulter.
All copies must be self-attested.
Application Process: Applications are to be submitted online at the diupmsme.upsdc.gov.in portal.
"""

def test():
    if not os.getenv("GEMINI_API_KEY"):
        print("GEMINI_API_KEY is not set. Please set it in backend/.env to run this test.")
        return

    print("Initializing Interpreter Agent...")
    agent = InterpreterAgent()
    
    print("Sending mock document to Gemini API...")
    try:
        result = agent.analyze_document(MOCK_DOC)
        print("\n--- EXTRACTION SUCCESS ---")
        print(result.model_dump_json(indent=2))
        print("--------------------------")
    except Exception as e:
        print(f"\n--- EXTRACTION FAILED ---")
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
