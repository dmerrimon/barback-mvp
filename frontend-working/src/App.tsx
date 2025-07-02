import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import AdminDashboard from './components/AdminDashboard';
import BartenderDashboard from './components/BartenderDashboard';
import HomePage from './components/HomePage';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/:venueId" element={<AdminDashboard />} />
          <Route path="/bartender/:venueId" element={<BartenderDashboard />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;
