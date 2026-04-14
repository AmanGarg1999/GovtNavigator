import requests
import json

API_URL = "http://localhost:8000/api/v1/schemes/ingest"

BUREAUCRACY_GUIDES = [
    {
        "scheme_id": "AADHAAR-CORRECTION",
        "basic_details": {
            "title_english": "Aadhaar Card: Name/Address Correction",
            "title_regional": "आधार कार्ड सुधार",
            "state": "Central",
            "department": "UIDAI",
            "scheme_tags": ["Identity", "Document", "Bureaucracy"],
            "target_personas": ["Individual", "Citizen"]
        },
        "source_verification": {
            "official_urls": ["https://myaadhaar.uidai.gov.in/"],
            "last_updated": "2024-04-01"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": {
                "age_min": 5,
                "domicile": ["All"]
            },
            "business_criteria": {
                "enterprise_type": ["All"],
                "project_cost_max": {"All": 100000000},
                "conditions": ["Must have valid mobile linked"]
            }
        },
        "benefits": {
            "description": "Correct errors in your Aadhaar profile to ensure seamless access to all government services."
        },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "AUTH", "name": "Mobile Linked with Aadhaar", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "ADDR-PROOF", "name": "Valid Address Proof (Rent Agreement/Utility Bill)", "mandatory": True},
                {"doc_id": "ID-PROOF", "name": "Passport or Voter ID", "mandatory": True}
            ],
            "instructional": [
                {"instruction": "Ensure the scan is in color and original document is used.", "mandatory": True}
            ]
        },
        "application_process": {
            "mode": ["Online", "Offline"],
            "portal_url": "https://myaadhaar.uidai.gov.in/",
            "steps": ["Login with Aadhaar", "Submit Correction Request", "Upload Proof", "Pay Fee (₹50)"]
        }
    },
    {
        "scheme_id": "PAN-APPLY",
        "basic_details": {
            "title_english": "Permanent Account Number (PAN) Application",
            "title_regional": "पैन कार्ड आवेदन",
            "state": "Central",
            "department": "Income Tax Department",
            "scheme_tags": ["Identity", "Tax", "Bureaucracy"],
            "target_personas": ["Individual", "Entrepreneur"]
        },
        "source_verification": {
            "official_urls": ["https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"],
            "last_updated": "2024-01-01"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": {
                "age_min": 18,
                "domicile": ["All"]
            },
            "business_criteria": {
                "enterprise_type": ["All"],
                "project_cost_max": {"All": 100000000},
                "conditions": []
            }
        },
        "benefits": {
            "description": "Obtain your unique PAN card for financial transactions, company registration, and tax filing."
        },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "AADHAAR", "name": "Aadhaar Card", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "PHOTO", "name": "Recent Passport size photograph", "mandatory": True}
            ],
            "instructional": [
                {"instruction": "Signature must be within the provided box on the printed form.", "mandatory": True}
            ]
        },
        "application_process": {
            "mode": ["Online"],
            "portal_url": "https://www.onlineservices.nsdl.com/",
            "steps": ["Fill Form 49A", "e-Sign with Aadhaar", "Payment", "Acknowledgment"]
        }
    },
    {
        "scheme_id": "DOMICILE-CERT",
        "basic_details": {
            "title_english": "Domicile/Residence Certificate",
            "title_regional": "निवास प्रमाण पत्र",
            "state": "Multiple",
            "department": "Revenue Department",
            "scheme_tags": ["Residence", "Document", "Bureaucracy"],
            "target_personas": ["Student", "Individual"]
        },
        "source_verification": {
            "official_urls": ["https://edistrict.up.gov.in/"],
            "last_updated": "2023-12-15"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": {
                "age_min": 0,
                "domicile": ["All"]
            },
            "business_criteria": {
                "enterprise_type": ["All"],
                "project_cost_max": {"All": 100000000},
                "conditions": ["Continuous stay for 15+ years (varies by state)"]
            }
        },
        "benefits": {
            "description": "Proof of residence required for state government jobs and school/college admissions."
        },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "AADHAAR", "name": "Aadhaar Card", "mandatory": True},
                {"doc_id": "PHOTO", "name": "Self Declaration form", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "RES-PROOF", "name": "Voter ID / Electricity Bill / Ration Card", "mandatory": True},
                {"doc_id": "EDU-PROOF", "name": "School Leaving Certificate", "mandatory": True}
            ],
            "instructional": []
        },
        "application_process": {
            "mode": ["Online", "Offline"],
            "portal_url": "https://edistrict.up.gov.in/",
            "steps": ["Apply on e-District portal", "Physical Verification by Lekhpal", "Certificate Issuance"]
        }
    }
]

def seed():
    print("Seeding Bureaucracy Expansion Guides...")
    for guide in BUREAUCRACY_GUIDES:
        try:
            response = requests.post(API_URL, json=guide)
            if response.status_code == 200:
                print(f"SUCCESS: Ingested Bureaucracy Guide: {guide['basic_details']['title_english']}")
            else:
                print(f"FAILED: {guide['basic_details']['title_english']} - {response.text}")
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    seed()
