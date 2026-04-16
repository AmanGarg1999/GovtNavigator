import requests
import json

API_URL = "http://localhost:8000/api/v1/schemes/ingest"

# Optimized seeder for specialized business certificates
SPECIAL_GUIDES = [
    {
        "scheme_id": "STARTUP-INDIA-DPIIT",
        "basic_details": {
            "title_english": "Startup India: DPIIT Recognition",
            "title_regional": "स्टार्टअप इंडिया पंजीकरण",
            "category": "Bureaucracy",
            "complexity_score": 8,
            "state": "Central",
            "department": "DPIIT",
            "scheme_tags": ["Startup", "Innovation", "Tax Benefit"],
            "target_personas": ["Entrepreneur", "Startup Founder"]
        },
        "source_verification": {
            "official_urls": ["https://www.startupindia.gov.in/"],
            "last_verified": "2024-04-14",
            "accuracy_score": 100
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 18, "domicile": ["All"] },
            "business_criteria": { 
                "enterprise_type": ["Private Limited", "LLP", "Partnership"],
                "project_cost_max": {"All": 1000000000},
                "conditions": ["Must be working on innovation/scalability", "Age of entity < 10 years"]
            }
        },
        "benefits": { "description": "Access tax exemptions (80-IAC), easy public procurement, and self-certification of labor laws." },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "GLOBAL-PAN-ENTITY", "name": "Company/LLP PAN Card", "mandatory": True},
                {"doc_id": "GLOBAL-COI", "name": "Certificate of Incorporation", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "PITCH-DECK", "name": "Pitch Deck (PDF: Innovation & Scalability focus)", "mandatory": True},
                {"doc_id": "GLOBAL-AUTH-LETTER", "name": "Board Resolution / Authorization Letter", "mandatory": True}
            ],
            "instructional": [
                {"instruction": "Write a clear innovation summary (Max 500 words).", "mandatory": True},
                {"instruction": "Register entity on Startup India Hub first.", "mandatory": True}
            ]
        },
        "application_process": { "mode": ["Online"], "portal_url": "https://www.startupindia.gov.in/", "steps": ["Portal Registration", "Fill Recognition Form", "Upload Docs", "DPIIT Review"] }
    },
    {
        "scheme_id": "DGFT-IEC",
        "basic_details": {
            "title_english": "Import Export Code (IEC)",
            "title_regional": "आयात निर्यात कोड",
            "category": "Bureaucracy",
            "complexity_score": 4,
            "state": "Central",
            "department": "DGFT",
            "scheme_tags": ["Trade", "Export", "Commerce"],
            "target_personas": ["Entrepreneur", "Manufacturer"]
        },
        "source_verification": {
            "official_urls": ["https://www.dgft.gov.in/"],
            "last_verified": "2024-04-14",
            "accuracy_score": 100
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 18, "domicile": ["All"] },
            "business_criteria": { "enterprise_type": ["All"], "project_cost_max": {"All": 1000000000}, "conditions": [] }
        },
        "benefits": { "description": "Mandatory code for importing or exporting goods and services from India." },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "GLOBAL-PAN-ENTITY", "name": "Entity PAN Card", "mandatory": True},
                {"doc_id": "GLOBAL-AUTH-ADDR", "name": "Business Address Proof (Elec Bill/Rent Agree)", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "CANCELLED-CHEQUE", "name": "Cancelled Cheque / Bank Certificate", "mandatory": True},
                {"doc_id": "DSC", "name": "Digital Signature (Class 3) or Aadhaar e-Sign", "mandatory": True}
            ],
            "instructional": [{"instruction": "Pay Govt Fee of ₹500 via NetBanking/UPI.", "mandatory": True}]
        },
        "application_process": { "mode": ["Online"], "portal_url": "https://www.dgft.gov.in/", "steps": ["TRN Generation", "Fill ANF-2A", "Upload Docs", "Digital Signing"] }
    },
    {
        "scheme_id": "MSME-UDYAM",
        "basic_details": {
            "title_english": "MSME Udyam Registration",
            "title_regional": "उद्यम पंजीकरण",
            "category": "Bureaucracy",
            "complexity_score": 2,
            "state": "Central",
            "department": "Ministry of MSME",
            "scheme_tags": ["Business", "Subsidy", "Loans"],
            "target_personas": ["Entrepreneur", "Startup Founder", "Small Business"]
        },
        "source_verification": {
            "official_urls": ["https://udyamregistration.gov.in/"],
            "last_verified": "2024-04-14",
            "accuracy_score": 100
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 18, "domicile": ["All"] },
            "business_criteria": { "enterprise_type": ["All"], "project_cost_max": {"All": 500000000}, "conditions": [] }
        },
        "benefits": { "description": "Collateral-free credit, 1% OD interest rate subsidy, and priority in public procurement." },
        "document_dependency_graph": {
            "foundational": [
                 {"doc_id": "GLOBAL-AADHAAR-FOUNDER", "name": "Founder's Aadhaar (Synced)", "mandatory": True},
                 {"doc_id": "GLOBAL-PAN-ENTITY", "name": "Entity PAN Card", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "GLOBAL-GSTIN", "name": "GSTIN (If turnover > limit)", "mandatory": False}
            ],
            "instructional": [{"instruction": "Self-declaration based; No physical documents to upload.", "mandatory": True}]
        },
        "application_process": { "mode": ["Online"], "portal_url": "https://udyamregistration.gov.in/", "steps": ["Aadhaar Validation", "Business Detail Entry", "GST/PAN sync", "Certificate Download"] }
    },
    {
        "scheme_id": "FSSAI-BASIC",
        "basic_details": {
            "title_english": "FSSAI License (Food Safety)",
            "title_regional": "खाद्य सुरक्षा लाइसेंस",
            "category": "Bureaucracy",
            "complexity_score": 6,
            "state": "Central",
            "department": "FSSAI",
            "scheme_tags": ["Food", "Health", "Compliance"],
            "target_personas": ["Entrepreneur", "Restaurant", "Food Startup"]
        },
        "source_verification": {
            "official_urls": ["https://foscos.fssai.gov.in/"],
            "last_verified": "2024-04-14",
            "accuracy_score": 100
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 18, "domicile": ["All"] },
            "business_criteria": { "enterprise_type": ["All"], "project_cost_max": {"All": 100000000}, "conditions": [] }
        },
        "benefits": { "description": "Legal permission to manufacture, store, distribute, or sell food products in India." },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "GLOBAL-AADHAAR-FOUNDER", "name": "Founder ID Proof", "mandatory": True},
                {"doc_id": "GLOBAL-AUTH-ADDR", "name": "Premises Possession Proof (Rent/Own)", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "FOOD-CAT-LIST", "name": "Selected List of Food Categories", "mandatory": True},
                {"doc_id": "LAYOUT-PLAN", "name": "Blueprint / Layout Plan of Premises", "mandatory": True}
            ],
            "instructional": [{"instruction": "Ensure kitchen meets hygiene standards before inspection.", "mandatory": True}]
        },
        "application_process": { "mode": ["Online"], "portal_url": "https://foscos.fssai.gov.in/", "steps": ["Select Category", "Upload Blueprint", "Pay Fee", "Inspection (if state/central)"] }
    }
]

def seed():
    print("Seeding Specialized Business Power-Guides...")
    for guide in SPECIAL_GUIDES:
        try:
            response = requests.post(API_URL, json=guide)
            if response.status_code == 200:
                print(f"SUCCESS: Ingested Specialized Guide: {guide['basic_details']['title_english']}")
            else:
                print(f"FAILED: {guide['basic_details']['title_english']} - {response.text}")
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    seed()
