# GovtNavigator - Phase 4: MVP Roadmap & Sprint Planning

**Status:** Draft | **Phase:** 4 (Roadmap & Sprints)

The goal of the MVP is to quickly prove the value of our **Discovery** and **Requirement Verification** engine. Instead of a massive monolithic build, we will sequence our delivery into functional 2-week sprints, initially constraining our scope to MSME (Business) schemes in **Uttar Pradesh**.

---

## Sprint 1: Foundation & "The Brain" (Weeks 1-2)
**Goal:** Establish the core data schemas and the AI Parsing pipeline. Prove that we can ingest a Sarkari PDF and output the Unified JSON Schema.

*   **[EPIC] Backend Architecture:**
    *   Set up PostgreSQL + pgvector infrastructure layer.
    *   Initialize backend framework (Node.js/Express or Python/FastAPI).
*   **[EPIC] The Interpreter Pipeline:**
    *   Integrate Gemini/GPT-4o API.
    *   Implement "Sarkari-to-English" Prompt Architecture.
    *   Test extraction on 5 complex UP MSME policy PDFs to validate the JSON Schema completeness.

## Sprint 2: Rule Engine & Gap Analysis (Weeks 3-4)
**Goal:** Build the logical matching engine that connects a mock User Profile to the ingested schemes.

*   **[EPIC] JSON-Logic Engine:**
    *   Implement `json-logic-js` on the backend.
    *   Create 5 diverse mocked User Demographics for testing.
*   **[EPIC] Gap Analysis Service:**
    *   Implement the LLM pipeline that translates deterministic JSON-Logic failures into english explanations.
    *   Verify the return payload contains "Hard Blockers" vs "Fixable Gaps".

## Sprint 3: The MVP Interface (Weeks 5-6)
**Goal:** Build the frontend "Discovery" loop for the user.

*   **[EPIC] 60-Second Onboarding:**
    *   Build React/Next.js UI for capturing User Persona demographics (Age, State, Business Type, etc.).
*   **[EPIC] Results & The Dependency Graph UI:**
    *   Build the List View of "Eligible" & "Ineligible" schemes.
    *   Design the "Document Checklist" component representing the Foundational, Contextual, and Instructional dependencies.
    *   Implement the "Source Sidebar" showing iframe links or highlights of the official `.gov.in` PDFs.

## Sprint 4: Data Pipeline Automation & Launch (Weeks 7-8)
**Goal:** Replace manual PDF loading with an automated crawler and prepare for Beta invite testing.

*   **[EPIC] The Crawler & Translation:**
    *   Build Playwright/Scrapy bot tailored to `diupmsme.upsdc.gov.in`.
    *   Connect Bhashini API to translate scraped Marathi/Hindi PDFs.
*   **[EPIC] Launch Ops:**
    *   End-to-End integration testing.
    *   Deploy MVP to staging.
    *   Onboard 10 test users (Consultants/Entrepreneurs).
