// src/components/ResultsChart.js
import React, { useState } from 'react';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ResultsChart = ({ data }) => {
  const [metric, setMetric] = useState('Keyword Density (%)');
  const [chartType, setChartType] = useState('Bar');

  const metricsOptions = [
    'Keyword Density (%)',
    'Title Length',
    'Meta Description Length',
  ];

  const chartTypes = ['Bar', 'Pie', 'Line'];

  const labels = data.map((item) => item.URL.split('//')[1].split('/')[0]); // Extract domain names

  const chartData = {
    labels,
    datasets: [
      {
        label: metric,
        data: data.map((item) => item[metric]),
        backgroundColor: [
          '#3f51b5',
          '#ff9800',
          '#4caf50',
          '#f44336',
          '#9c27b0',
          '#00bcd4',
          '#ffc107',
          '#8bc34a',
          '#e91e63',
          '#2196f3',
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${metric} by Domain` },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'Bar':
        return <Bar data={chartData} options={options} />;
      case 'Pie':
        return <Pie data={chartData} options={options} />;
      case 'Line':
        return <Line data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Data Visualization
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="metric-select-label">Select Metric</InputLabel>
          <Select
            labelId="metric-select-label"
            value={metric}
            label="Select Metric"
            onChange={(e) => setMetric(e.target.value)}
          >
            {metricsOptions.map((option) => (
              <MenuItem value={option} key={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="chart-type-select-label">Select Chart Type</InputLabel>
          <Select
            labelId="chart-type-select-label"
            value={chartType}
            label="Select Chart Type"
            onChange={(e) => setChartType(e.target.value)}
          >
            {chartTypes.map((type) => (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {renderChart()}
    </Paper>
  );
};

export default ResultsChart;
