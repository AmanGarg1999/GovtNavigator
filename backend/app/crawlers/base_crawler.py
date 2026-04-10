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
        Fetches a text notice from a target URL.
        Note: For Sprint 4 MBP testing, we mock the scraping via a dummy payload 
        to avoid live HTTP requests hanging on slow regional sites.
        """
        logger.info(f"Crawling URL: {url}")
        
        # MOCKED HTML RESPONSE FOR SPRINT 4 (Simulating a Hindi UP Gazette Notification)
        mock_html = """
        <html>
            <body>
                <div class="notification-body">
                    <h2>सूचना: मुख्यमंत्री युवा स्वरोजगार योजना 2024</h2>
                    <p>योजना का उद्देश्य उत्तर प्रदेश के शिक्षित बेरोजगार युवाओं को स्वरोजगार के अवसर प्रदान करना है।</p>
                    <p>पात्रता मानदंड:</p>
                    <ul>
                        <li>आवेदक उत्तर प्रदेश का मूल निवासी होना चाहिए।</li>
                        <li>आवेदक की आयु 18 से 40 वर्ष के बीच होनी चाहिए।</li>
                        <li>न्यूनतम शैक्षिक योग्यता हाई स्कूल उत्तीर्ण होनी चाहिए।</li>
                        <li>किसी भी बैंक का डिफॉल्टर नहीं होना चाहिए।</li>
                    </ul>
                    <p>लाभ: परियोजना लागत का 25% मार्जिन मनी सब्सिडी। उद्योग के लिए अधिकतम 25 लाख और सेवा क्षेत्र के लिए 10 लाख।</p>
                </div>
            </body>
        </html>
        """
        
        try:
            soup = BeautifulSoup(mock_html, 'html.parser')
            # Extract main text
            notice_text = soup.find('div', class_='notification-body').get_text(separator="\n", strip=True)
            return notice_text
        except Exception as e:
            logger.error(f"Failed to crawl {url}: {e}")
            return None
