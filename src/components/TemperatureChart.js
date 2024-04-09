import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ref, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path as needed

// Import and register Chart.js components and the date adapter
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        displayFormats: {
          hour: 'HH:mm'
        }
      },
      title: {
        display: true,
        text: 'Time'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Temperature (°C)'
      }
    }
  }
};

const TemperatureChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const tempRef = ref(database, 'sensordata');
    onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Calculate the timestamp for 24 hours ago from the current time
      const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);

      // Filter the data to only include entries from the last 24 hours
      const filteredData = Object.values(data).filter(entry => new Date(entry.date).getTime() >= oneDayAgo)
        .map(entry => ({
          date: entry.date, // Ensure your data structure matches
          temperature: entry.temperature, // Adjust if your field is different
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date to maintain order

      setChartData({
        labels: filteredData.map(entry => entry.date),
        datasets: [{
          ...chartData.datasets[0],
          data: filteredData.map(entry => ({ x: entry.date, y: entry.temperature })),
        }],
      });
    });
  }, []);

  return <Line options={options} data={chartData} />;
};

export default TemperatureChart;
