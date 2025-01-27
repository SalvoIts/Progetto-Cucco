from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import logging

def scrape_serp(keyword, num_results=20):
    query = keyword.replace(" ", "+")
    url = f"https://www.google.com/search?q={query}&num={num_results}"
    
    # Configure Selenium WebDriver options
    options = Options()
    options.headless = True  # Run in headless mode (no UI)
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")

    # Use Chrome WebDriver (or install via `webdriver-manager`)
    driver = webdriver.Chrome(options=options)  # Ensure `chromedriver` is installed
    logging.debug(f"Fetching SERP from URL: {url}")
    
    driver.get(url)
    time.sleep(2)  # Allow the page to load

    # Handle consent page if present
    try:
        consent_button = driver.find_element(By.XPATH, '//button[text()="I agree"]')
        consent_button.click()
        time.sleep(2)  # Allow the page to reload
        logging.debug("Accepted Google's consent page.")
    except Exception:
        logging.debug("No consent page detected.")

    results = []
    links = driver.find_elements(By.CSS_SELECTOR, 'div.yuRUbf > a')
    for link in links:
        href = link.get_attribute('href')
        if href:
            results.append(href)
            if len(results) >= num_results:
                break
    
    driver.quit()
    logging.debug(f"Extracted {len(results)} URLs from SERP.")
    return results
