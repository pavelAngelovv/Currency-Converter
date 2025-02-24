import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Box } from '@mui/material';
import Currencies from './pages/Currencies';

const App = () => {
  return (
    <Router>
      <Box className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/currencies" element={<Currencies />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
