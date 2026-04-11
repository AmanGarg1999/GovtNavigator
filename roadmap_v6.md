# GovtNavigator Roadmap: Phase 6 (Advanced Document Intelligence)

**Status:** Proposed | **Phase:** 6 (Vision & RAG Integration)

This roadmap outlines the evolution of GovtNavigator from a metadata-extraction engine to an autonomous document verification and policy reasoning platform, utilizing your local `llama3.2-vision` and `nomic-embed-text` models.

---

## 🏗️ Sprint 5: Multimodal Verification (Vision OCR)
**Goal:** Enable zero-entry citizen profiling via certificate analysis.

*   **[EPIC] Vision Agent Integration:**
    *   Implement the `OllamaVisionService` to interface with `llama3.2-vision:11b`.
    *   Build base64 image handling and prompt tuning for high-fidelity certificate extraction.
*   **[EPIC] Auto-Fill Profile UI:**
    *   Add a "Snap & Verify" button to the Onboarding form.
    *   Automatically populate Age, State, and Income data from extracted JSON.

## 🏗️ Sprint 6: Policy Intelligence (RAG Engine)
**Goal:** Move beyond high-level summaries into deep-document querying and semantic search.

*   **[EPIC] Vector Pipeline:**
    *   Implement Chunking & Embedding logic using `nomic-embed-text`.
    *   Populate `pgvector` store with full text from ingested Gazettes.
*   **[EPIC] "Ask Sarkari-AI" Chat UI:**
    *   Integrate the RAG loop into a new Assistant sidebar.
    *   Enable citation-backed answers where the AI links responses directly to a line in an official `.gov.in` PDF.

## 🏗️ Sprint 7: Community & Real-world Analytics
**Goal:** Capture crowdsourced data to calculate actual success rates.

*   **[EPIC] Feedback Loop:**
    *   Allow users to report "Application Submitted" and "Sanction Received".
    *   Generate real-world "Approval Timelines" dashboards for each state.

---

## Technical Debt & Infrastructure
*   **VRAM Management:** Implement a dynamic model switcher to prevent server crashes when running `llama3.3` (70B) and `llama3.2-vision` simultaneously.
*   **Link Rot Defense:** Move from ephemeral scraping to persistent S3-backed PDF archiving.
