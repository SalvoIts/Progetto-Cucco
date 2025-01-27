# analyzer.py

import requests
from bs4 import BeautifulSoup
import re
import logging

def analyze_pages(urls, keyword):
    analyzed_data = []
    for url in urls:
        try:
            logging.debug(f"Fetching URL: {url}")
            response = requests.get(url, timeout=10)
            if response.status_code != 200:
                logging.warning(f"Failed to fetch {url}, status code: {response.status_code}")
                continue
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract title
            title_tag = soup.find('title')
            title = title_tag.text.strip() if title_tag else 'N/A'
            title_length = len(title)
            
            # Extract meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            meta_description = meta_desc['content'].strip() if meta_desc else 'N/A'
            meta_length = len(meta_description)
            
            # Extract headings
            headings = {f'H{i}': [] for i in range(1,7)}
            for i in range(1,7):
                for tag in soup.find_all(f'h{i}'):
                    headings[f'H{i}'].append(tag.text.strip())
            
            # Check for missing H1
            has_h1 = len(headings['H1']) > 0
            
            # Calculate keyword density
            text = soup.get_text(separator=' ', strip=True)
            words = re.findall(r'\w+', text.lower())
            total_words = len(words)
            keyword_count = words.count(keyword.lower())
            keyword_density = (keyword_count / total_words) * 100 if total_words > 0 else 0
            
            analyzed_data.append({
                'URL': url,
                'Title': title,
                'Title Length': title_length,
                'Meta Description': meta_description,
                'Meta Description Length': meta_length,
                'Has H1': has_h1,
                'H1 Tags': headings['H1'],
                'H2 Tags': headings['H2'],
                'H3 Tags': headings['H3'],
                'H4 Tags': headings['H4'],
                'H5 Tags': headings['H5'],
                'H6 Tags': headings['H6'],
                'Keyword Density (%)': round(keyword_density, 2)
            })
            logging.debug(f"Analyzed data for URL: {url}")
        except Exception as e:
            logging.exception(f"Error processing {url}: {e}")
            continue
    return analyzed_data
