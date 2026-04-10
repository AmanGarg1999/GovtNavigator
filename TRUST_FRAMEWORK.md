# GovtNavigator - Phase 5: Governance, Security & Scale (Trust Framework)

**Status:** Draft | **Phase:** 5 (Governance & Scale)

As an AI system giving bureaucratic advice, the highest risk is hallucination or serving stale data. This **Trust Framework** defines our core safety guardrails.

## 1. Source Verification Protocol
*   **The "Ground Truth" Rule:** The application will **never** display an eligibility rule or document requirement without tying it directly to an official array of `.gov.in` or `.nic.in` URLs.
*   **Link Rot & Expiry Handling:**
    *   State portals frequently redesign or take down PDFs.
    *   **Fallback Strategy:** During ingestion, the system must cache a hashed copy of the original PDF in our secure bucket (e.g., AWS S3).
    *   If the live `official_url` returns a 404, the frontend will automatically serve our cached version with a prominent timestamp banner: "Cached on [Date]. Official link currently unavailable."

## 2. Refresh Mechanisms (Anti-Staleness)
*   **Automated Audit:** Our orchestration tool (Temporal/Airflow) will run a weekly HTTP HEAD check on all `official_urls` indexed in the system.
*   **Hash Comparisons:** For critical schemes, the crawler will re-download the source PDF monthly and check its MD5 Hash against our database. If the hash changes, the scheme is marked `Needs Review` and pulled from the active discovery engine until the AI Interpreter Pipeline re-evaluates the new rule sets.

## 3. Data Privacy & Demographic Guardrails
*   **Ephemeral Profiles:** We do not need, nor want, Personally Identifiable Information (PII) like names, mobile numbers (until OTP authentication), or Aadhaar numbers to perform discovery.
*   **Anonymous Sessions:** The Discovery Engine will operate on an ephemeral session ID.
*   **Data Aggregation:** If a user logs in to save their profile, fields like Caste, Income, and Profession are strictly utilized for the `JSON-Logic` execution and are encrypted at rest. We will never sell demographic profiles.

## 4. LLM Hallucination Guardrails
*   **Strict JSON Formatting:** By enforcing JSON schemas (Phase 1) rather than conversational memory, we prevent the LLM from inventing fake rules.
*   **Human-In-The-Loop (HITL) for Extraction:** During the early sprints, 15% of all AI-extracted schema outputs will be funneled to an internal dashboard for manual QA before being published to the live database.
