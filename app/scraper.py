import requests
from bs4 import BeautifulSoup
import logging
import time

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def scrape_serp(keyword, num_results=20):
    query = keyword.replace(" ", "+")
    url = f"https://duckduckgo.com/html/?q={query}"

    # Headers to simulate a real browser request (avoid detection as a bot)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    }

    # Send GET request to fetch the SERP page
    logging.debug(f"Fetching SERP from URL: {url}")
    response = requests.get(url, headers=headers, allow_redirects=True)

    # Wait a moment to handle redirection and cookies (simulate browser behavior)
    time.sleep(2)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")

    # Extract the URLs of the search results (DuckDuckGo's structure)
    results = []
    links = soup.select('.result__a')  # Correct selector for DuckDuckGo search results

    for link in links:
        href = link.get('href')
        if href:
            results.append(href)
            if len(results) >= num_results:
                break

    logging.debug(f"Extracted {len(results)} URLs from SERP.")
    return results

# Example usage
if __name__ == "__main__":
    keyword = "cisop"
    num_results = 20
    urls = scrape_serp_duckduckgo(keyword, num_results)
    
    if urls:
        print(f"Scraped {len(urls)} URLs from DuckDuckGo SERP:")
        for idx, url in enumerate(urls, start=1):
            print(f"{idx}. {url}")
    else:
        print("No URLs found.")
