# GovtNavigator - Technical Architecture

**Status:** Architectural Draft | **Phase:** 2 (Data & Architecture Design)

## 1. System Overview
GovtNavigator solves the "cross-state fragmentation" problem by completely decoupling **Data Ingestion** from **User Search**. Instead of live-crawling regional websites upon user request, we employ an asynchronous, multi-stage ETL pipeline that standardizes all data into the Unified Scheme Schema (JSON).

## 2. Global Architecture Diagram

```mermaid
flowchart TD
    %% Define Styles
    classDef external fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef processing fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef storage fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    classDef user fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;

    subgraph "Phase 1: Ingestion (The Crawl)"
        A1[State Gazette Portals]:::external
        A2[District Portals .nic.in]:::external
        A3[Central Repositories]:::external
        CRAWL(Playwright / Scrapy Cluster):::processing
        ORCH(Temporal / Airflow Orchestration):::processing
        
        A1 --> CRAWL
        A2 --> CRAWL
        A3 --> CRAWL
        CRAWL --> ORCH
    end
    
    subgraph "Phase 2: Multilingual Translation"
        ORCH -->|Raw Hindi/Marathi/Kannada PDFs| TRANS(Bhashini API / IndicLLM):::processing
    end
    
    subgraph "Phase 3: The AI Interpreter (Parse)"
        TRANS -->|Rough Translated English| LLM{LLM: Gemini / GPT-4o}:::processing
        LLM -->|Extract Data to JSON| SCHEMA[Unified Scheme Schema JSON]:::processing
    end
    
    subgraph "Phase 4: Storage & Indexing"
        SCHEMA -->|Relational Data & Rules| DB[(PostgreSQL)]:::storage
        SCHEMA -->|Semantic Text Embeddings| VDB[(pgvector / Pinecone)]:::storage
    end
    
    subgraph "Phase 5: User Query & Gap Analysis"
        CLIENT[User Frontend / Chatbot]:::user
        RAG(Retrieval Augmented Generation):::processing
        RULE(JSON-Logic / Rule Engine):::processing
        
        CLIENT -->|Natural Language Search| RAG
        CLIENT -->|User Profile Demographics| RULE
        
        RAG <--> VDB
        RULE <--> DB
        
        RAG --> RESULT((Curated Results & Gap Analysis)):::user
        RULE --> RESULT
        RESULT --> CLIENT
    end
```

## 3. Recommended Tool-Stack

### 3.1 Data Ingestion & Orchestration
*   **Crawlers:** `Python` + `Scrapy` for standard pages, `Playwright` for dynamic Javascript-heavy regional portals.
*   **Orchestration Engine:** `Temporal` or `Apache Airflow`. This is crucial to manage failures, timeouts, and cron schedules across 700+ unreliable district government websites.

### 3.2 Multilingual Engine
*   **Primary AI Translation:** `Bhashini API` (National Language Translation Mission). Native, deep understanding of "Sarkari" (bureaucratic) terminology across 22 Indic languages.
*   **Fallback:** Open-source `IndicLLM` or Gemini API if Bhashini limits are reached/timed-out.

### 3.3 The "Interpreter" (Parsing)
*   **LLM Provider:** `Gemini 1.5 Pro` or `OpenAI GPT-4o`.
*   **Task:** Uses *Structured Outputs* (function calling) to ingest rough Bhashini translations and output the strict `Unified Scheme Schema` established in Phase 1.

### 3.4 Storage Layer
*   **Relational Database:** `PostgreSQL` (via Supabase or AWS RDS). Perfect for mapping user profiles and storing JSON Schema representations of schemes.
*   **Vector Database:** `pgvector` (as an extension on Postgres) or `Pinecone` for high-throughput semantic search on the actual policy guidelines. 

### 3.5 Rule Engine (Matching Engine)
*   **Logic Execution:** `JSON-Logic` running in a Node.js or Python backend.
*   **Functionality:** Safely compares User payload `{ "age": 28, "caste": "general", "state": "UP" }` against the generated Schema to natively determine **Gap Analysis** without repeatedly invoking LLMs.
