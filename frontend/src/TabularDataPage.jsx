// TabularGraphPage.jsx

import React, { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TabularGraphPage = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [results, setResults] = useState([
    {
      url: "https://placeholder.com",
      snippet: "This is a placeholder snippet for the search result.",
    },
    {
      url: "https://example.com",
      snippet: "Example website found for the keyword.",
    },
  ]);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    // Placeholder functionality: Replace with actual backend API integration
    setResults([
      {
        url: "https://newplaceholder.com",
        snippet: `Results for '${e.target.value}' - example snippet.`,
      },
      {
        url: "https://anotherexample.com",
        snippet: `Additional results for '${e.target.value}'.`,
      },
      {
        url: "https://extramockresult.com",
        snippet: `Mock result for '${e.target.value}'.`,
      },
    ]);
  };

  const chartData = {
    labels: results.map((_, index) => `Result ${index + 1}`),
    datasets: [
      {
        label: "Keyword Relevance (Mock Data)",
        data: results.map(() => Math.floor(Math.random() * 100)),
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
          <div className="mb-6">
            <input
              type="text"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a keyword to search..."
              value={searchKeyword}
              onChange={handleSearch}
            />
          </div>

          {/* Tab Buttons */}
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
          </div>

          {/* Conditional Rendering based on activeTab */}
          {activeTab === "table" && (
            <div className="overflow-x-auto flex-grow">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="px-6 py-3 text-left font-bold text-blue-700">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left font-bold text-blue-700">
                      Snippet
                    </th>
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
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {result.url}
                        </a>
                      </td>
                      <td className="px-6 py-3">{result.snippet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "graph" && (
            <div className="h-full flex-grow">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
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
