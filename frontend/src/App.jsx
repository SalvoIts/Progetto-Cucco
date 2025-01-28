// src/App.js
import React, { useState } from 'react';
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
import { analyzeKeyword, downloadCSV } from './services/api';

const App = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (keyword) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await analyzeKeyword(keyword);
      setResults(data);
    } catch (err) {
      setError(err.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        SEO Competitiveness Analysis
      </Typography>
      <SearchForm onSubmit={handleAnalyze} />
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
          <ResultsTable data={results} />
          <ResultsChart data={results} />
        </>
      )}
    </Container>
  );
};

export default App;
