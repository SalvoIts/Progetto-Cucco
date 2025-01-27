import re

def calculate_keyword_density(text, keyword):
    words = re.findall(r'\w+', text.lower())
    total_words = len(words)
    keyword_count = words.count(keyword.lower())
    density = (keyword_count / total_words) * 100 if total_words > 0 else 0
    return round(density, 2)
