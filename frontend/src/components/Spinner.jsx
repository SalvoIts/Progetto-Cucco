// src/components/Spinner.js
import React from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Box } from '@mui/material';

const Spinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
    <TailSpin
      height="80"
      width="80"
      color="#3f51b5"
      ariaLabel="loading"
    />
  </Box>
);

export default Spinner;
