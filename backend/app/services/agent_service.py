from openai import OpenAI
from app.core.config import settings
from duckduckgo_search import DDGS
import json
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are the "GovtNavigator AI Consultant", a specialist in Indian government bureaucracy, paperwork, and legal processes.
Your goal is to help users navigate complex tasks (e.g., starting a business, getting a certificate, understanding a scheme).

## OPERATIONAL MODE: ReAct (Reasoning & Action)
1. **Thought**: Analyze the user's request. Do you have enough information? (State, specific document name, etc.)
2. **Action**: If you need more info, ASK the user. If you need updated info, use the `internet_search` tool.
3. **Observation**: Review the search results or user input.
4. **Final Response**: Provide a curated, actionable guide with specific steps and official portal links.

## TOOLS:
- `internet_search(query)`: Searches the live web for official Indian government procedures.
- `ask_clarification(question)`: Asks the user for missing details like "Which state are you in?".

## CONSTRAINTS:
- Always prefer official `.gov.in` or `.nic.in` sources.
- If the user's request is vague (e.g., "I want to start a shop"), ask for the state and shop type.
- Synthesize search results into a "Standard Operating Procedure" (SOP).
"""

class ConsultantAgent:
    def __init__(self):
        self.client = OpenAI(
            base_url=settings.OLLAMA_BASE_URL,
            api_key="ollama",
        )
        self.model = settings.OLLAMA_ANALYZER_MODEL
        self.ddgs = DDGS()

    def search_web(self, query: str) -> str:
        """Execute a live search and return concatenated snippets."""
        # Sanitize query: Ensure "official portal" and "govt.in" are prioritized
        refined_query = f"{query} official portal govt.in procedure"
        logger.info(f"Executing refined web search for: {refined_query}")
        try:
            results = self.ddgs.text(refined_query, max_results=8)
            formatted_results = "\n".join([f"- {r['title']}: {r['body']} (Link: {r['href']})" for r in results])
            return formatted_results if formatted_results else "No relevant official results found in the current crawl."
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return f"Search error: {e}"

    def chat(self, message: str, history: List[Dict[str, str]] = None) -> Dict:
        """Handle a single turn of conversation."""
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": message})

        # Initial Thought + Tool Call check
        try:
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                )
                content = response.choices[0].message.content
            except Exception as llm_error:
                logger.error(f"LLM Connection failed, using robust fallback: {llm_error}")
                # Enhanced fallback logic for common documents
                if any(x in message.lower() for x in ["ration card", "ration", "food"]):
                    content = "Thought: User is asking about a Ration Card. I will provide the general procedure for Delhi/UP/Maharashtra and search for live updates.\nAction: internet_search(\"how to apply for ration card online\")"
                elif any(x in message.lower() for x in ["passport", "reissue", "renewal"]):
                    content = "Thought: User wants to know about Passport services. I need to point to Passport Seva Kendra.\nAction: internet_search(\"passport seva official portal application procedure\")"
                else:
                    return {
                        "response": "Currently, the AI backend is experiencing high load or connectivity issues. However, you can typically find all government forms on the 'National Government Services Portal' (services.india.gov.in). Please specify your state for more targeted links.",
                        "thought": "LLM connection failed. Defaulting to National Services Portal recommendation.",
                        "clarification_needed": False
                    }
            
            # Check if agent wants to search
            if "internet_search(" in content:
                try:
                    # Robust extraction
                    import re
                    match = re.search(r'internet_search\("(.*?)"\)', content)
                    query = match.group(1) if match else message
                    
                    search_data = self.search_web(query)
                    
                    # Second pass with search results
                    messages.append({"role": "assistant", "content": content})
                    messages.append({"role": "system", "content": f"OBSERVATION: {search_data}"})
                    
                    try:
                        final_response = self.client.chat.completions.create(
                            model=self.model,
                            messages=messages,
                        )
                        return {
                            "response": final_response.choices[0].message.content,
                            "thought": content,
                            "clarification_needed": False
                        }
                    except:
                        # Logic fallback for second pass failure
                        return {
                            "response": f"I found the following official information for you:\n\n{search_data}\n\n**Actionable Summary:** Visit the first link above (usually the State Food Supply or Passport Seva portal) to register. Ensure you have your Aadhaar and proof of residence ready.",
                            "thought": content,
                            "clarification_needed": False
                        }
                except Exception as search_parse_error:
                    logger.error(f"Failed to parse or execute search: {search_parse_error}")
                    return {
                        "response": "I tried to search for information but encountered an error indexing the results. Please try again with a more specific query.",
                        "thought": f"Search parsing error: {search_parse_error}",
                        "clarification_needed": False
                    }

            return {
                "response": content,
                "thought": "Analyzing request locally...",
                "clarification_needed": "?" in content
            }
            
        except Exception as e:
            logger.error(f"Agent chat failed: {e}")
            return {
                "response": "I apologize, but my processing engine is currently unavailable. Please try again in a few minutes.",
                "thought": f"Critical Failure: {str(e)}",
                "clarification_needed": False
            }

agent_service = ConsultantAgent()
