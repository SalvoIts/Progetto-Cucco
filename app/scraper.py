# scraper.py
import requests
from bs4 import BeautifulSoup
import logging
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from utils import get_random_user_agent

def scrape_serp(keyword, num_results=20):
    query = keyword.replace(" ", "+")
    url = f"https://duckduckgo.com/html/?q={query}"

    headers = {
        "User-Agent": get_random_user_agent()
    }

    session = requests.Session()
    retries = Retry(total=5,
                    backoff_factor=1,
                    status_forcelist=[500, 502, 503, 504],
                    allowed_methods=["GET", "POST"])
    adapter = HTTPAdapter(max_retries=retries)
    session.mount('https://', adapter)
    session.mount('http://', adapter)

    try:
        logging.debug(f"Fetching SERP from URL: {url}")
        response = session.get(url, headers=headers, allow_redirects=True)
        response.raise_for_status()
        time.sleep(2)  # To mimic human behavior and avoid detection

        soup = BeautifulSoup(response.text, "html.parser")
        results = []
        links = soup.select('.result__a')

        for link in links:
            href = link.get('href')
            if href:
                results.append(href)
                if len(results) >= num_results:
                    break

        logging.debug(f"Extracted {len(results)} URLs from SERP.")
        return results
    except requests.exceptions.RequestException as e:
        logging.exception(f"Error fetching SERP: {e}")
        return []
