// src/App.jsx
import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import ResultsChart from './components/ResultsChart';
import Spinner from './components/Spinner';
import ErrorAlert from './components/ErrorAlert';
import WebsiteDetailsSection from './components/WebsiteDetailsSection'; // NEW component
import { analyzeKeyword, downloadCSV } from './services/api';

const App = () => {
  const [results, setResults] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a ref to scroll to the website details section
  const detailsRef = useRef(null);

  // Called when a search is performed
  const handleAnalyze = async (keyword) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedWebsite(null); // Clear previously selected website
    try {
      const data = await analyzeKeyword(keyword);
      setResults(data);
    } catch (err) {
      setError(err.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Called when the Download CSV button is clicked
  const handleDownload = async () => {
    try {
      const blob = await downloadCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'results.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.error || 'Failed to download CSV.');
    }
  };

  // Called when a row in the table is clicked.
  // This function sets the selected website and scrolls to the details section.
  const handleRowClick = (rowData) => {
    setSelectedWebsite(rowData);
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        backgroundColor: '#f0f4f8',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        SEO Competitiveness Analysis
      </Typography>
      <SearchForm isLoading={loading} onSubmit={handleAnalyze} />
      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}
      {!loading && results.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download CSV
            </Button>
          </Box>
          {/* Pass the row-click handler to ResultsTable */}
          <ResultsTable data={results} onRowClick={handleRowClick} />
          <ResultsChart data={results} />
          {/* Detailed Website Information section */}
          <WebsiteDetailsSection
            websites={results}
            selectedWebsite={selectedWebsite}
            detailsRef={detailsRef}
          />
        </>
      )}
    </Container>
  );
};

export default App;
