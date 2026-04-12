import httpx
from bs4 import BeautifulSoup
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class UnifiedWebCrawler:
    def __init__(self):
        # We configure httpx with timeouts optimized for slow .nic.in portals
        self.client = httpx.Client(timeout=15.0)

    def fetch_notice(self, url: str) -> Optional[str]:
        """
        Fetches a text notice from a target URL using real HTTP requests.
        Optimized for slow government portals with appropriate headers and timeouts.
        """
        logger.info(f"Crawling URL: {url}")
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }

        try:
            response = self.client.get(url, headers=headers, follow_redirects=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Clean up unwanted elements
            for script in soup(["script", "style"]):
                script.decompose()

            # Attempt to find the main content body (Govt sites vary widely)
            content = soup.find('div', class_='content') or soup.find('article') or soup.find('body')
            
            if not content:
                logger.warning(f"No clear content found at {url}")
                return None

            notice_text = content.get_text(separator="\n", strip=True)
            return notice_text
            
        except httpx.HTTPError as e:
            logger.error(f"HTTP error occurred while crawling {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error while crawling {url}: {e}")
            return None
