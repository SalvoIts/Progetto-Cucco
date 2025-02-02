// src/components/SearchForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchForm = ({ isLoading, onSubmit }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() !== '') {
      onSubmit(keyword.trim());
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        backgroundColor: '#fff',
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <TextField
        label="Enter Keyword"
        variant="outlined"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        required
        sx={{ flexGrow: 1, mr: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color={isLoading ? "secondary" : "primary"}
        disabled={isLoading}
        startIcon={<SearchIcon />}
      >
        Analyze
      </Button>
    </Box>
  );
};

export default SearchForm;
