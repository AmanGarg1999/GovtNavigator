import requests
import json

API_URL = "http://localhost:8000/api/v1/schemes/ingest"

BUREAUCRACY_GUIDES = [
    {
        "scheme_id": "AADHAAR-CORRECTION",
        "basic_details": {
            "title_english": "Aadhaar Card: Name/Address Correction",
            "title_regional": "आधार कार्ड सुधार",
            "category": "Bureaucracy",
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
            "demographics": { "age_min": 5, "domicile": ["All"] },
            "business_criteria": { "enterprise_type": ["All"], "project_cost_max": {"All": 100000000}, "conditions": ["Mobile link required"] }
        },
        "benefits": { "description": "Correct errors in your Aadhaar profile for seamless access to Digital India services." },
        "document_dependency_graph": {
            "foundational": [{"doc_id": "AUTH", "name": "Mobile Linked with Aadhaar", "mandatory": True}],
            "contextual": [
                {"doc_id": "ADDR-PROOF", "name": "Address Proof (Rent Agreement/Utility Bill)", "mandatory": True},
                {"doc_id": "ID-PROOF", "name": "Passport or Voter ID", "mandatory": True}
            ],
            "instructional": [{"instruction": "Scan original documents in color.", "mandatory": True}]
        },
        "application_process": { "mode": ["Online"], "portal_url": "https://myaadhaar.uidai.gov.in/", "steps": ["Login", "Submit Update", "Pay ₹50"] }
    },
    {
        "scheme_id": "PASSPORT-NEW",
        "basic_details": {
            "title_english": "Fresh Passport Application",
            "title_regional": "नया पासपोर्ट आवेदन",
            "category": "Bureaucracy",
            "state": "Central",
            "department": "Ministry of External Affairs",
            "scheme_tags": ["Identity", "Travel", "Bureaucracy"],
            "target_personas": ["Individual", "Entrepreneur"]
        },
        "source_verification": {
            "official_urls": ["https://www.passportindia.gov.in/"],
            "last_updated": "2024-01-01"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 0, "domicile": ["All"] },
            "business_criteria": { "enterprise_type": ["All"], "project_cost_max": {"All": 100000000}, "conditions": [] }
        },
        "benefits": { "description": "Obtain an official Indian passport for international travel and identity proof." },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "AADHAAR", "name": "Aadhaar Card", "mandatory": True},
                {"doc_id": "PAN", "name": "PAN Card (Optional)", "mandatory": False}
            ],
            "contextual": [
                {"doc_id": "DOB-PROOF", "name": "Birth Certificate (Mandatory if born after Oct 2023)", "mandatory": True},
                {"doc_id": "ADDR-PROOF", "name": "Valid Present Address Proof", "mandatory": True}
            ],
            "instructional": [
                {"instruction": "Book appointment at PSK/POPSK.", "mandatory": True},
                {"instruction": "Carry original documents for physical verification.", "mandatory": True}
            ]
        },
        "application_process": { "mode": ["In-Person"], "portal_url": "https://www.passportindia.gov.in/", "steps": ["Register", "Fill Form", "Pay Fee", "Schedule Appointment"] }
    },
    {
        "scheme_id": "GST-REG-PROP",
        "basic_details": {
            "title_english": "GST Registration (Sole Proprietorship)",
            "title_regional": "जीएसटी पंजीकरण",
            "category": "Bureaucracy",
            "state": "Central",
            "department": "GST Council",
            "scheme_tags": ["Tax", "Business", "Bureaucracy"],
            "target_personas": ["Entrepreneur"]
        },
        "source_verification": {
            "official_urls": ["https://www.gst.gov.in/"],
            "last_updated": "2024-03-01"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 18, "domicile": ["All"] },
            "business_criteria": { "enterprise_type": ["Proprietorship"], "project_cost_max": {"All": 100000000}, "conditions": [] }
        },
        "benefits": { "description": "Legally register your business for tax compliance and inter-state trade." },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "PAN-IND", "name": "PAN Card of Proprietor", "mandatory": True},
                {"doc_id": "AADHAAR", "name": "Aadhaar Card", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "PHOTO", "name": "Passport size photo of Proprietor", "mandatory": True},
                {"doc_id": "BIZ-ADDR", "name": "Electricity Bill / Property Tax Receipt of Business Place", "mandatory": True}
            ],
            "instructional": [{"instruction": "Aadhaar authentication is mandatory for fast-track approval.", "mandatory": True}]
        },
        "application_process": { "mode": ["Online"], "portal_url": "https://www.gst.gov.in/", "steps": ["TRN Generation", "Form Submission", "Aadhaar Auth", "ARN Issuance"] }
    },
    {
        "scheme_id": "DL-MAHARASHTRA",
        "basic_details": {
            "title_english": "Driving License (Maharashtra)",
            "title_regional": "चालक परवाना (महाराष्ट्र)",
            "category": "Bureaucracy",
            "state": "Maharashtra",
            "department": "Transport Department, Maharashtra",
            "scheme_tags": ["License", "Transport", "Bureaucracy"],
            "target_personas": ["Individual"]
        },
        "source_verification": {
            "official_urls": ["https://transport.maharashtra.gov.in/"],
            "last_updated": "2024-02-01"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 18, "domicile": ["Maharashtra"] },
            "business_criteria": { "enterprise_type": ["All"], "project_cost_max": {"All": 100000000}, "conditions": [] }
        },
        "benefits": { "description": "Obtain a legal permit to drive motor vehicles in Maharashtra and across India." },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "AADHAAR", "name": "Aadhaar Card", "mandatory": True},
                {"doc_id": "AGE-PROOF", "name": "Birth Certificate or School Leaving Certificate", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "LL", "name": "Learner's License (Active)", "mandatory": True},
                {"doc_id": "FORM-1A", "name": "Medical Certificate (if age > 40)", "mandatory": False}
            ],
            "instructional": [
                {"instruction": "Book slot for physical driving test at your local RTO via Sarathi portal.", "mandatory": True}
            ]
        },
        "application_process": { "mode": ["Online/Physical"], "portal_url": "https://sarathi.parivahan.gov.in/", "steps": ["Apply for LL", "Wait 30 Days", "Apply for Permanent DL", "RTO Test"] }
    },
    {
        "scheme_id": "DL-DELHI",
        "basic_details": {
            "title_english": "Driving License (Delhi)",
            "title_regional": "ड्राइविंग लाइसेंस (दिल्ली)",
            "category": "Bureaucracy",
            "state": "Delhi",
            "department": "Transport Department, Delhi",
            "scheme_tags": ["License", "Transport", "Bureaucracy"],
            "target_personas": ["Individual"]
        },
        "source_verification": {
            "official_urls": ["https://transport.delhi.gov.in/"],
            "last_updated": "2024-02-01"
        },
        "eligibility_rules": {
            "logic_framework": "json-logic",
            "demographics": { "age_min": 18, "domicile": ["Delhi"] },
            "business_criteria": { "enterprise_type": ["All"], "project_cost_max": {"All": 100000000}, "conditions": [] }
        },
        "benefits": { "description": "Apply for a Driving License in the national capital through the faceless service portal." },
        "document_dependency_graph": {
            "foundational": [
                {"doc_id": "AADHAAR", "name": "Aadhaar Card with Delhi Address", "mandatory": True}
            ],
            "contextual": [
                {"doc_id": "LL", "name": "Learner's License (Faceless online test result)", "mandatory": True}
            ],
            "instructional": [
                {"instruction": "Delhi offers faceless LL services; no RTO visit required for LL.", "mandatory": True},
                {"instruction": "Final driving test is at automated driving tracks (IDTRE).", "mandatory": True}
            ]
        },
        "application_process": { "mode": ["Online/Faceless"], "portal_url": "https://transport.delhi.gov.in/", "steps": ["Apply Online", "Take Online LL Test", "Schedule DL Test at IDTRE", "License Delivery by Post"] }
    }
]

def seed():
    print("Master Seeding Expanded Bureaucracy Navigator...")
    for guide in BUREAUCRACY_GUIDES:
        try:
            category = guide['basic_details'].get('category', 'Welfare')
            response = requests.post(API_URL, json=guide)
            if response.status_code == 200:
                print(f"SUCCESS: Ingested {category} Guide: {guide['basic_details']['title_english']}")
            else:
                print(f"FAILED: {guide['basic_details']['title_english']} - {response.text}")
        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    seed()
