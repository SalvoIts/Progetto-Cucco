import requests
from bs4 import BeautifulSoup

def get_duckduckgo_urls(keyword):
    # Construct the DuckDuckGo search URL
    search_url = f"https://duckduckgo.com/html/?q={keyword}"
    
    # Send GET request to fetch the search results page
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}
    
    response = requests.get(search_url, headers=headers)
    if response.status_code != 200:
        print("Failed to retrieve search results.")
        return []

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all 'a' tags that contain the result URLs
    links = []
    for a_tag in soup.find_all('a', {'class': 'result__a'}, href=True):
        link = a_tag['href']
        links.append(link)
    
    return links

# Main function to test the scraping
def main():
    keyword = input("Enter the keyword for search: ")
    urls = get_duckduckgo_urls(keyword)

    if urls:
        print(f"\nFound URLs for keyword '{keyword}':")
        for idx, url in enumerate(urls, start=1):
            print(f"{idx}. {url}")
    else:
        print("No URLs found.")

if __name__ == "__main__":
    main()
