# 🧭 GovtNavigator: Multilingual Bureaucratic Intelligence

**GovtNavigator** is a state-of-the-art, AI-powered platform designed to simplify the complex and fragmented world of Indian government schemes. By parsing regional "Sarkari" legalese into actionable English "How-To" guides, it empowers citizens to discover benefits and navigate documentation with unprecedented clarity.

## 🚀 Vision
*   **Source-First Integrity:** Every result is linked back to a verified `.gov.in` source.
*   **Modular Evolution:** Designed for cross-state scalability via a Unified Scheme Schema.
*   **Empathetic Engineering:** Translates cold rejection logic into actionable gap analysis.

---

## 🏗️ Technical Architecture

### The Brain (Backend)
*   **FastAPI & Python:** High-performance async API layering.
*   **Gemini 1.5 Flash:** Powers the **Interpreter Agent** (JSON parsing) and **Gap Analysis Agent**.
*   **JSON-Logic:** Deterministic, zero-hallucination decision engine for eligibility.
*   **Bhashini (Mocked):** Multilingual translation bridge for 22 Indic languages.

### The Face (Frontend)
*   **React & Vite:** Ultra-fast, modern UI.
*   **Vanilla CSS:** Premium **Glassmorphism** aesthetic with custom micro-animations.
*   **Paperwork Navigator:** Dynamic dependency graphs for document checklists.

### The Ingest (Pipeline)
*   **Automated Crawler:** Scraping regional notifications using `httpx` and `BeautifulSoup4`.

---

## 📦 Deployment

Deploy the entire stack with a single command:

1.  **Set Environment Variables:**
    Create a `.env` file at the root and add your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_key_here
    ```

2.  **Launch:**
    ```bash
    docker-compose up --build -d
    ```

---

## 🛠️ Project Structure
```text
GovtNavigator/
├── backend/            # FastAPI, AI Agents, Crawlers
├── frontend/           # React, Vanilla CSS, Figma-to-Code UI
├── docker-compose.yml  # Full-stack orchestration
├── ARCHITECTURE.md     # Deep-dive tech specs
├── ROADMAP.md          # Sprint-by-sprint history
└── TRUST_FRAMEWORK.md  # Data safety & verification protocols
```

## 📜 Sign-off
Architected and built in **5 Phases** of collaborative development. 

*   **Phase 1:** Requirement Hardening
*   **Phase 2:** Data & Architecture Design
*   **Phase 3:** Prompt Engineering
*   **Phase 4:** Sprint Execution (MVP)
*   **Phase 5:** Governance & Containerization

**GovtNavigator is ready to navigate.** 🇮🇳
