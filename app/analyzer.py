# analyzer.py
import requests
from bs4 import BeautifulSoup
import re
import logging
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from utils import calculate_keyword_density, get_random_user_agent, can_fetch
import random
import time

def analyze_pages(urls, keyword):
    analyzed_data = []
    failed_urls = []

    session = requests.Session()
    retries = Retry(total=3,
                    backoff_factor=1,
                    status_forcelist=[500, 502, 503, 504],
                    allowed_methods=["GET", "POST"])
    adapter = HTTPAdapter(max_retries=retries)
    session.mount('https://', adapter)
    session.mount('http://', adapter)

    for url in urls:
        if not can_fetch(url, user_agent=get_random_user_agent()):
            logging.warning(f"Disallowed by robots.txt: {url}")
            continue

        try:
            headers = {"User-Agent": get_random_user_agent()}
            logging.debug(f"Fetching URL: {url}")
            response = session.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract title
            title_tag = soup.find('title')
            title = title_tag.text.strip() if title_tag else 'N/A'
            title_length = len(title)
            title_best_practice = 50 <= title_length <= 60  # Adjust range as needed

            # Extract meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            meta_description = meta_desc['content'].strip() if meta_desc else 'N/A'
            meta_length = len(meta_description)
            meta_best_practice = 120 <= meta_length <= 160  # Adjust range as needed

            # Extract headings
            headings = {f'H{i}': [] for i in range(1, 7)}
            for i in range(1, 7):
                for tag in soup.find_all(f'h{i}'):
                    headings[f'H{i}'].append(tag.text.strip())

            # Check for missing H1
            has_h1 = len(headings['H1']) > 0

            # Calculate keyword density using the improved function
            text = soup.get_text(separator=' ', strip=True)
            keyword_density = calculate_keyword_density(text, keyword)

            analyzed_data.append({
                'URL': url,
                'Title': title,
                'Title Length': title_length,
                'Title Length Within Best Practice': title_best_practice,
                'Meta Description': meta_description,
                'Meta Description Length': meta_length,
                'Meta Description Within Best Practice': meta_best_practice,
                'Has H1': has_h1,
                'H1 Tags': headings['H1'],
                'H2 Tags': headings['H2'],
                'H3 Tags': headings['H3'],
                'H4 Tags': headings['H4'],
                'H5 Tags': headings['H5'],
                'H6 Tags': headings['H6'],
                'Keyword Density (%)': keyword_density
            })
            logging.debug(f"Analyzed data for URL: {url}")

            # Rate limiting to avoid being detected as a bot
            time.sleep(random.uniform(1, 3))  # Sleep between 1 to 3 seconds

        except requests.exceptions.HTTPError as http_err:
            logging.warning(f"HTTP error occurred for {url}: {http_err}")
            failed_urls.append(url)
        except requests.exceptions.ConnectionError as conn_err:
            logging.warning(f"Connection error occurred for {url}: {conn_err}")
            failed_urls.append(url)
        except requests.exceptions.Timeout as timeout_err:
            logging.warning(f"Timeout error occurred for {url}: {timeout_err}")
            failed_urls.append(url)
        except requests.exceptions.RequestException as req_err:
            logging.warning(f"Request exception for {url}: {req_err}")
            failed_urls.append(url)
        except Exception as e:
            logging.exception(f"Unexpected error processing {url}: {e}")
            failed_urls.append(url)
            continue

    if failed_urls:
        logging.info(f"Failed to process the following URLs: {failed_urls}")

    return analyzed_data
