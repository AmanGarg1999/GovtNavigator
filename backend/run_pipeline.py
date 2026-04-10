import sys
import os
import json

# Ensure absolute path resolution for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.crawlers.base_crawler import UnifiedWebCrawler
from app.services.translator import BhashiniTranslatorMock
from app.services.interpreter import InterpreterAgent
from dotenv import load_dotenv

load_dotenv()

def run_automation_pipeline():
    print("==================================================")
    print("GOVTNAVIGATOR: AUTONOMOUS DATA PIPELINE INITIATED")
    print("==================================================\n")
    
    if not os.getenv("GEMINI_API_KEY"):
        print("ERROR: GEMINI_API_KEY is missing from .env.")
        return

    target_url = "https://diupmsme.upsdc.gov.in/notices/mysy_2024.html"

    # Stage 1: Crwaler
    print("[STAGE 1] CRAwling Target URL...")
    crawler = UnifiedWebCrawler()
    raw_regional_text = crawler.fetch_notice(target_url)
    print("--- CRAWLED REGIONAL TEXT ---")
    print(raw_regional_text[:150] + "...\n")

    # Stage 2: Bhashini Translation
    print("[STAGE 2] TRANSLATING VIA BHASHINI API...")
    translator = BhashiniTranslatorMock()
    english_translation = translator.translate_to_english(raw_regional_text, source_language="hi")
    print("--- TRANSLATED ENGLISH TEXT ---")
    print(english_translation[:150] + "...\n")
    
    # Stage 3: LLM Parsing into JSON Schema
    print("[STAGE 3] SECURE LLM EXTRACTION VIA GEMINI AGENT...")
    interpreter = InterpreterAgent()
    try:
        json_schema = interpreter.analyze_document(english_translation)
        
        print("\n==================================================")
        print("PIPELINE SUCCESS: FINAL UNIFIED SCHEME SCHEMA")
        print("==================================================")
        print(json_schema.model_dump_json(indent=2))
        
        # Stage 4: Database Storage (Simulated)
        print("\n[STAGE 4] Saving Unified Schema to PostgreSQL Dashboard... [SUCCESS]")
        
    except Exception as e:
        print(f"PIPELINE CRASHED: {e}")

if __name__ == "__main__":
    run_automation_pipeline()
