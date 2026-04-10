# Product Requirements Document (PRD): GovtNavigator v1.0

**Status:** Draft | **Target Launch:** Phase 1 (Information & Discovery)

---

## 1. Executive Summary
GovtNavigator is a multilingual bureaucratic intelligence platform designed to bridge the gap between complex, fragmented government data and the end citizen. It uses AI to parse cross-state, multi-language documents into simplified English "How-To" guides, providing users with a clear path to eligibility and success.

### 1.1 Problem Statement
*   **Fragmentation:** Information is scattered across 700+ district portals and 30+ state websites.
*   **Language Barrier:** Official notifications are often in regional languages or dense "Sarkari" legalese.
*   **Opacity:** Citizens lack clarity on why applications fail or what specific document nuances are required.

---

## 2. Target Audience & User Personas
*   **The Individual:** Seeking personal benefits (subsidies, caste/domicile certificates).
*   **The Entrepreneur:** Navigating business approvals and licenses (MSME, Food, Trade).
*   **The Consultant:** Local agents or "Village Experts" using the tool to assist others.

---

## 3. Functional Requirements

### 3.1 Personalized Discovery Engine
*   **Requirement:** Users input demographic data (Age, State, Caste, Income, Profession).
*   **Outcome:** A curated list of "Eligible" vs "Ineligible" schemes.
*   **Logic:** Perform a **Gap Analysis**—if ineligible, explicitly state which requirement is not met (e.g., "Income exceeds threshold").

### 3.2 Cross-Lingual Interpretation (Backend)
*   **Requirement:** Ingest regional language sources (Hindi, Marathi, Kannada, etc.) and present findings in English.
*   **Outcome:** A "Service Summary" in English including:
    *   Objective of the scheme/approval.
    *   Simplified Eligibility Criteria.
    *   Step-by-step application process.

### 3.3 The "Paperwork Navigator" (Document Checklist)
*   **Requirement:** Generate a "Document Dependency Graph" for any service.
*   **Outcome:** A checklist categorized by:
    *   **Foundational:** Aadhaar, PAN.
    *   **Contextual:** Land records, NOC from local bodies.
    *   **Instructional:** Photo requirements, specific stamp types.

### 3.4 Source Verification & Trust
*   **Requirement:** Link every piece of information back to an official government source (.nic.in or .gov.in).
*   **Outcome:** A "Source Sidebar" showing the original PDF/URL with relevant sections highlighted or translated.

---

## 4. Technical Specifications

| Component | Requirement | Technology |
| :--- | :--- | :--- |
| **Data Ingestion** | Automated crawling of S3WaaS district portals. | Python (Scrapy), Playwright |
| **Translation** | Accurate translation of bureaucratic dialects. | Bhashini API / IndicLLM |
| **Intelligence** | RAG for document comprehension. | Gemini Flash / OpenAI GPT-4o |
| **Rule Engine** | Policy-as-Code for eligibility matching. | JSON-Logic / OPA (Rego) |
| **Storage** | Relational & Vector data. | PostgreSQL + Pinecone |

---

## 5. User Experience (UX) Flow
1.  **Onboarding:** User fills a 60-second "Citizen Profile" (Privacy-first).
2.  **Query:** User asks a natural language question (e.g., "I want to start a small cold storage in UP").
3.  **Analysis:** System scans Central and UP State databases.
4.  **Results:** 
    *   Matched Schemes: "You qualify for X subsidy."
    *   Required Approvals: "You need a Trade License and Fire NOC."
5.  **Action Plan:** A unified checklist of documents and a "How to get" guide for each approval.

---

## 6. Success Metrics (KPIs)
*   **Accuracy Rate:** % of AI-generated checklists matching official documentation.
*   **Discovery Success:** Average number of relevant schemes found per user profile.
*   **Source Transparency:** 100% of results must include a link to a .gov.in or .nic.in source.