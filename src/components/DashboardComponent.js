import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, Grid } from '@mui/material';
import TemperatureChart from './TemperatureChart';
import WindSpeedGraph from './WindSpeedGraph';
import CurrentWindDirection from './CurrentWindDirectionComponent';
import AirPressureGraph from './AirPressureGraph'; // Make sure to create this component
import database from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

const Dashboard = () => {
  const [currentWindDirection, setCurrentWindDirection] = useState(0);

  useEffect(() => {
    const windRef = ref(database, 'sensordata');
    onValue(windRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lastEntryKey = Object.keys(data).pop();
        const lastEntry = data[lastEntryKey];
        setCurrentWindDirection(lastEntry.windDirection);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TemperatureChart />
          </Grid>
          <Grid item xs={8}>
            <WindSpeedGraph />
          </Grid>
          <Grid item xs={4}>
            <CurrentWindDirection currentDirectionDegrees={currentWindDirection} />
          </Grid>
          <Grid item xs={8}>
            <AirPressureGraph />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
