// src/components/ErrorAlert.js
import React from 'react';
import { Alert } from '@mui/material';

const ErrorAlert = ({ message }) => (
  <Alert severity="error" sx={{ mb: 2 }}>
    {message}
  </Alert>
);

export default ErrorAlert;
