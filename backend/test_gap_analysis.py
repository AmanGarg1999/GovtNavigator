import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.gap_analyzer import GapAnalyzer
from mock_data import MOCK_USERS, MOCK_SCHEME_RULES, MOCK_SCHEME_NAME
from dotenv import load_dotenv

load_dotenv()

def test_gap_analysis():
    if not os.getenv("GEMINI_API_KEY"):
        print("GEMINI_API_KEY is not set. Please set it in backend/.env to run this test.")
        return

    print("Initializing Gap Analyzer Agent...")
    analyzer = GapAnalyzer()
    
    # We will test User 1 (The 45 year old) which should trigger an age blocker
    test_user = MOCK_USERS[1]
    
    print("\n--- RUNNING JSON-LOGIC DETERMINISTIC FAST EVALUATION ---")
    result = analyzer.evaluate_rules(test_user.model_dump(), MOCK_SCHEME_RULES)
    print(f"Eligibility: {result['eligible']}")
    print(f"Failed Rules: {result['failed_rules']}")
    
    if not result["eligible"]:
        print("\n--- INITIATING GAP ANALYSIS AGENT ---")
        try:
            explanation = analyzer.generate_explanation(
                profile=test_user.model_dump(),
                scheme_name=MOCK_SCHEME_NAME,
                failed_rules=result['failed_rules']
            )
            print("\n--- AI AGENT RESPONSE ---")
            print(explanation.model_dump_json(indent=2))
            print("--------------------------")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_gap_analysis()
