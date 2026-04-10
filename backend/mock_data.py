from app.schemas.user import CitizenProfile

# Mock Scheme with json-logic
# MYSY UP MSME Rules
# 1. Age <= 40
# 2. State == UP
# 3. is_defaulter == False
# 4. Enterprise Type in Manufacturing/Service
# 5. Project Cost check based on enterprise type
MOCK_SCHEME_RULES = {
    "age_check_max": { "<=": [{"var": "age"}, 40] },
    "age_check_min": { ">=": [{"var": "age"}, 18] },
    "domicile_check": { "==": [{"var": "domicile_state"}, "Uttar Pradesh"] },
    "defaulter_check": { "==": [{"var": "is_defaulter"}, False] },
    "enterprise_type_check": { "in": [{"var": "enterprise_type"}, ["Manufacturing", "Service"]] }
}

MOCK_SCHEME_NAME = "Mukhyamantri Yuva Swarozgar Yojana (MYSY)"

MOCK_USERS = [
    CitizenProfile(
        age=25,
        domicile_state="Uttar Pradesh",
        education_level="Bachelors",
        income_annual=300000,
        gender="Male",
        enterprise_type="Manufacturing",
        project_cost=2000000,
        is_defaulter=False
    ), # 0. Ideal Applicant
    CitizenProfile(
        age=45,
        domicile_state="Uttar Pradesh",
        education_level="Bachelors",
        income_annual=300000,
        gender="Female",
        enterprise_type="Manufacturing",
        project_cost=2000000,
        is_defaulter=False
    ), # 1. Hard Blocker (Age)
    CitizenProfile(
        age=28,
        domicile_state="Delhi",
        education_level="Bachelors",
        income_annual=300000,
        gender="Male",
        enterprise_type="Retail",
        project_cost=500000,
        is_defaulter=True
    ) # 2. Multiple hard block + fixable (State, Retail, Defaulter)
]
