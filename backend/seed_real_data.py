import requests
import json

API_URL = "http://localhost:8000/api/v1/schemes/ingest"

REAL_SCHEMES = [
    {
        "scheme_id": "PMEGP-2024",
        "basic_details": {
            "title_english": "Prime Minister's Employment Generation Programme (PMEGP)",
            "title_regional": "प्रधानमंत्री रोजगार सृजन कार्यक्रम",
            "state": "Central",
            "department": "Ministry of MSME",
            "scheme_tags": ["Subsidy", "Employment", "Manufacturing", "Service"],
            "target_personas": ["Entrepreneur", "Unemployed Youth"]
        },
        "source_verification": {
            "official_urls": ["https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp"],
            "document_pdfs": ["https://msme.gov.in/sites/default/files/PMEGP_Revised_Guidelines_2022.pdf"],
            "last_updated": "2024-03-15"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": {
                "age_min": 18,
                "age_max": 45,
                "domicile": ["All"],
                "education_min": "8th Pass",
                "income_limit": None,
                "gender_specific": None
            },
            "business_criteria": {
                "enterprise_type": ["Manufacturing", "Service"],
                "project_cost_max": {"Manufacturing": 5000000, "Service": 2000000},
                "conditions": ["New projects only", "No defaulters"]
            }
        },
        "benefits": {
            "margin_money_subsidy_percentage": 35,
            "description": "Subsidy of 25% to 35% on project cost. Balance as term loan from banks."
        },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "PAN", "name": "PAN Card", "mandatory": True},
                {"doc_id": "AADHAAR", "name": "Aadhaar Card", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "EDU-CERT", "name": "Highest Education Certificate", "mandatory": True},
                {"doc_id": "DPR", "name": "Detailed Project Report (DPR)", "mandatory": True},
                {"doc_id": "CASTE", "name": "Caste Certificate (if applicable)", "mandatory": False}
            ],
            "instructional": [
                {"instruction": "Project report must include financial projections for 3 years.", "mandatory": True}
            ]
        },
        "application_process": {
            "mode": ["Online"],
            "portal_url": "https://www.kviconline.gov.in/",
            "steps": ["Register on Portal", "Upload Documents", "Bank Verification", "Interview"]
        }
    },
    {
        "scheme_id": "MUDRA-TARUN",
        "basic_details": {
            "title_english": "Pradhan Mantri MUDRA Yojana (Tarun)",
            "title_regional": "प्रधानमंत्री मुद्रा योजना (तरुण)",
            "state": "Central",
            "department": "Department of Financial Services",
            "scheme_tags": ["Loan", "Working Capital", "Business Expansion"],
            "target_personas": ["Micro Enterprise", "Small Business"]
        },
        "source_verification": {
            "official_urls": ["https://www.mudra.org.in/"],
            "document_pdfs": ["https://www.mudra.org.in/PMMYGuidelines"],
            "last_updated": "2024-01-10"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": {
                "age_min": 18,
                "age_max": 65,
                "domicile": ["All"],
                "education_min": None,
                "income_limit": None
            },
            "business_criteria": {
                "enterprise_type": ["Manufacturing", "Service", "Trading"],
                "project_cost_max": {"All": 1000000},
                "conditions": ["Non-farm income generating activities"]
            }
        },
        "benefits": {
            "description": "Loans between ₹5 Lakh and ₹10 Lakh without collateral."
        },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "ID", "name": "Identity Proof (Voter ID/Driving License)", "mandatory": True},
                {"doc_id": "ADDR", "name": "Address Proof", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "QUOT", "name": "Quotations for Machinery/Items", "mandatory": True},
                {"doc_id": "OWNER", "name": "Proof of Business Address", "mandatory": True}
            ],
            "instructional": []
        },
        "application_process": {
            "mode": ["Online", "Offline"],
            "portal_url": "https://www.jansamarth.in/",
            "steps": ["Apply via JanSamarth", "Select Bank", "Disbursal"]
        }
    },
    {
        "scheme_id": "SISFS-STARTUP",
        "basic_details": {
            "title_english": "Startup India Seed Fund Scheme (SISFS)",
            "title_regional": "स्टार्टअप इंडिया सीड फंड योजना",
            "state": "Central",
            "department": "DPIIT",
            "scheme_tags": ["Grant", "Seed Fund", "Innovation"],
            "target_personas": ["Startup Founder", "Innovator"]
        },
        "source_verification": {
            "official_urls": ["https://seedfund.startupindia.gov.in/"],
            "last_updated": "2024-02-20"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": {
                "age_min": 18,
                "domicile": ["All"]
            },
            "business_criteria": {
                "enterprise_type": ["IT", "Deep Tech", "Social Impact"],
                "project_cost_max": {"All": 2000000},
                "conditions": ["DPIIT Recognized Startup", "Incorporated less than 2 years ago"]
            }
        },
        "benefits": {
            "description": "Up to ₹20 Lakh grant for Proof of Concept (PoC)."
        },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "COI", "name": "Certificate of Incorporation", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "DPIIT", "name": "DPIIT Recognition Certificate", "mandatory": True},
                {"doc_id": "PITCH", "name": "Pitch Deck", "mandatory": True}
            ],
            "instructional": []
        },
        "application_process": {
            "mode": ["Online"],
            "portal_url": "https://seedfund.startupindia.gov.in/apply"
        }
    }
]

def seed():
    print("Starting database seeding with REAL government data...")
    for scheme in REAL_SCHEMES:
        try:
            response = requests.post(API_URL, json=scheme)
            if response.status_code == 200:
                print(f"SUCCESS: Ingested {scheme['basic_details']['title_english']}")
            else:
                print(f"FAILED: {scheme['basic_details']['title_english']} - {response.text}")
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    seed()
