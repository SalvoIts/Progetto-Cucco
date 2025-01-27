// TabularGraphPage.jsx

import React, { useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { saveAs } from 'file-saver';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TabularGraphPage = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testMessage, setTestMessage] = useState("");

  const API_BASE_URL = '/api'; // Relative URL due to Vite proxy

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setError("Please enter a keyword.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        keyword: searchKeyword
      });
      console.log("Response Data:", response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setResults(response.data);
      } else {
        setError("No data found for the given keyword.");
      }
    } catch (err) {
      console.error("Error during analyze:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while fetching data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    axios.get(`${API_BASE_URL}/download`, {
      responseType: 'blob',
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'seo_results.csv');
    })
    .catch((error) => {
      console.error("Error downloading the file", error);
      setError("An error occurred while downloading the CSV.");
    });
  };

  const handleTest = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/test`);
      setTestMessage(response.data.message);
    } catch (err) {
      console.error(err);
      setTestMessage("Error testing CORS");
    }
  };

  const chartData = {
    labels: results.map((result, index) => `Result ${index + 1}`),
    datasets: [
      {
        label: "Keyword Density (%)",
        data: results.map(result => result['Keyword Density (%)']),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-100 to-blue-50 m-0 p-0 w-full">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg w-full">
        <h1 className="text-4xl font-extrabold text-center tracking-wide">
          SEO Analytics and Web Scraping Viewer
        </h1>
        <p className="text-center mt-2 text-lg">
          Analyze search results with ease and visualize data effectively
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 w-full">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8 flex flex-col w-full h-full">
          {/* Search Input */}
          <div className="mb-6 flex flex-col sm:flex-row items-center">
            <input
              type="text"
              className="flex-grow p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-0 sm:mr-4"
              placeholder="Enter a keyword to search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button
              className="px-6 py-3 rounded-lg font-bold bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Test Button for CORS */}
          <div className="mb-6">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleTest}
            >
              Test CORS
            </button>
            {testMessage && <p className="mt-2">{testMessage}</p>}
          </div>

          {/* Tab Buttons */}
          {results.length > 0 && (
            <>
              <div className="flex space-x-6 mb-6">
                <button
                  className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === "table"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("table")}
                >
                  Table View
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === "graph"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("graph")}
                >
                  Graph View
                </button>
                <button
                  className="px-6 py-3 rounded-lg font-bold bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all duration-200"
                  onClick={handleDownload}
                >
                  Download CSV
                </button>
              </div>

              {/* Conditional Rendering based on activeTab */}
              {activeTab === "table" && (
                <div className="overflow-x-auto flex-grow">
                  <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-6 py-3 text-left font-bold text-blue-700">URL</th>
                        <th className="px-6 py-3 text-left font-bold text-blue-700">Title</th>
                        <th className="px-6 py-3 text-left font-bold text-blue-700">Title Length</th>
                        <th className="px-6 py-3 text-left font-bold text-blue-700">Meta Description</th>
                        <th className="px-6 py-3 text-left font-bold text-blue-700">Meta Length</th>
                        <th className="px-6 py-3 text-left font-bold text-blue-700">Has H1</th>
                        <th className="px-6 py-3 text-left font-bold text-blue-700">Keyword Density (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr
                          key={index}
                          className={`border-t ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="px-6 py-3">
                            <a
                              href={result.URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {result.URL}
                            </a>
                          </td>
                          <td className="px-6 py-3">{result.Title}</td>
                          <td className="px-6 py-3">{result['Title Length']}</td>
                          <td className="px-6 py-3">{result['Meta Description']}</td>
                          <td className="px-6 py-3">{result['Meta Description Length']}</td>
                          <td className="px-6 py-3">{result['Has H1'] ? 'Yes' : 'No'}</td>
                          <td className="px-6 py-3">{result['Keyword Density (%)']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "graph" && (
                <div className="h-96">
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                        },
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 shadow-lg w-full">
        <p className="text-center">
          &copy; 2025 SEO Analytics Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default TabularGraphPage;
