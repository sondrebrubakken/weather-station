import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import Dashboard from '../src/components/DashboardComponent'; // Adjust the import path as needed

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Dashboard />
      </Container>
    </React.Fragment>
  );
}

export default App;
