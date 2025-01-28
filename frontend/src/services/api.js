// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5001/api';

export const analyzeKeyword = async (keyword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, { keyword });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network Error' };
  }
};

export const getResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/results`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network Error' };
  }
};

export const downloadCSV = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download`, {
      responseType: 'blob', // Important for file downloads
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Network Error' };
  }
};
