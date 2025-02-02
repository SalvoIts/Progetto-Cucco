import logging
import time
from selenium import webdriver
from selenium.webdriver.common.by import By

def scrape_serp(keyword, num_results=20):
    query = keyword.replace(" ", "+")
    results = []
    
    driver = webdriver.Safari()
    
    try:
        num_pages = 4
        for page in range(num_pages):
            offset = page * 10
            url = f"https://duckduckgo.com/html/?q={query}&s={offset}"  # To bypass google's security and anti-bot checks
            logging.debug(f"Fetching SERP page {page+1}: {url}")
            driver.get(url)
            time.sleep(5)
            
            links = driver.find_elements(By.CSS_SELECTOR, ".result__a")
            for link in links:
                href = link.get_attribute("href")
                if href and href not in results:
                    results.append(href)
                    if len(results) >= num_results:
                        break
            if len(results) >= num_results:
                break

        logging.debug(f"Extracted {len(results)} URLs from SERP using Selenium.")
        return results[:num_results]
    except Exception as e:
        logging.exception(f"Error fetching SERP with Selenium: {e}")
        return []
    finally:
        driver.quit()
