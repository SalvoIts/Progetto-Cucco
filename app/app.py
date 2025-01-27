# app.py

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from scraper import scrape_serp
from analyzer import analyze_pages
import pandas as pd
import os
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s:%(message)s')

# Allow only the React frontend origin
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    keyword = data.get('keyword')
    if not keyword:
        logging.error("No keyword provided in the request.")
        return jsonify({'error': 'Keyword is required.'}), 400

    logging.info(f"Starting analysis for keyword: {keyword}")

    # Scrape SERP using Selenium
    try:
        serp_urls = scrape_serp(keyword)
        logging.info(f"Scraped {len(serp_urls)} URLs from SERP.")
        if not serp_urls:
            logging.warning("No URLs scraped from SERP.")
            return jsonify({'error': 'No URLs found for the given keyword. Try a different keyword.'}), 404
    except Exception as e:
        logging.exception("Error during SERP scraping.")
        return jsonify({'error': f'Error scraping SERP: {str(e)}'}), 500

    # Analyze each URL
    try:
        analyzed_data = analyze_pages(serp_urls, keyword)
        logging.info(f"Analyzed {len(analyzed_data)} URLs.")
        if not analyzed_data:
            logging.warning("No data analyzed from URLs.")
            return jsonify({'error': 'No data analyzed from the scraped URLs.'}), 404
    except Exception as e:
        logging.exception("Error during page analysis.")
        return jsonify({'error': f'Error analyzing pages: {str(e)}'}), 500

    # Save to CSV
    try:
        df = pd.DataFrame(analyzed_data)
        csv_path = 'data/results.csv'
        os.makedirs('data', exist_ok=True)
        df.to_csv(csv_path, index=False)
        logging.info(f"Saved results to {csv_path}.")
    except Exception as e:
        logging.exception("Error saving results to CSV.")
        return jsonify({'error': f'Error saving CSV: {str(e)}'}), 500

    logging.info("Analysis completed successfully.")
    return jsonify(analyzed_data), 200

@app.route('/api/results', methods=['GET'])
def get_results():
    csv_path = 'data/results.csv'
    if not os.path.exists(csv_path):
        logging.warning("No results found for /api/results endpoint.")
        return jsonify({'error': 'No results found. Please perform an analysis first.'}), 404

    df = pd.read_csv(csv_path)
    results = df.to_dict(orient='records')
    logging.info(f"Retrieved {len(results)} results from CSV.")
    return jsonify(results), 200

@app.route('/api/download', methods=['GET'])
def download_csv():
    csv_path = 'data/results.csv'
    if not os.path.exists(csv_path):
        logging.warning("No results found for /api/download endpoint.")
        return jsonify({'error': 'No results to download.'}), 404
    logging.info("Sending CSV file for download.")
    return send_file(csv_path, as_attachment=True)

# Test Route
@app.route('/api/test', methods=['GET'])
def test():
    logging.info("CORS test endpoint accessed.")
    return jsonify({'message': 'CORS is working!'}), 200

if __name__ == '__main__':
    os.makedirs('data', exist_ok=True)
    app.run(debug=True, host="127.0.0.1", port=5001)
