# utils.py
import re
import random

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
    # Add more User-Agent strings as needed
]

def get_random_user_agent():
    return random.choice(USER_AGENTS)

def calculate_keyword_density(text, keyword):
    text_lower = text.lower()
    keyword_lower = keyword.lower()
    
    # Use regex to find all non-overlapping occurrences of the keyword
    pattern = re.escape(keyword_lower)
    matches = re.findall(pattern, text_lower)
    keyword_count = len(matches)
    
    # Calculate total words
    words = re.findall(r'\w+', text_lower)
    total_words = len(words)
    
    # Calculate density
    density = (keyword_count / total_words) * 100 if total_words > 0 else 0
    return round(density, 2)

import urllib.robotparser
import urllib.parse

def can_fetch(url, user_agent='*'):
    parsed_url = urllib.parse.urlparse(url)
    robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(robots_url)
    try:
        rp.read()
        return rp.can_fetch(user_agent, parsed_url.path)
    except:
        return False
