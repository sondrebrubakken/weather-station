import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ref, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path as needed

// Import Chart.js components (ensure these are registered as in TemperatureChart.js)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        tooltipFormat: 'HH:mm',
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
        text: 'Wind Speed (m/s)'
      }
    }
  },
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.parsed.y} m/s`;
        }
      }
    }
  }
};

const WindSpeedGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Wind Speed',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const windRef = ref(database, 'sensordata');
    onValue(windRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Filter data for the last 24 hours
      const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
      const filteredData = Object.values(data).filter(entry => new Date(entry.date).getTime() >= oneDayAgo)
        .map(entry => ({
          date: entry.date,
          windSpeed: entry.windOneMinute, // Adjust based on your data structure
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure the data is sorted by date

      setChartData({
        labels: filteredData.map(entry => entry.date),
        datasets: [
          {
            label: 'Wind Speed',
            data: filteredData.map(entry => ({x: entry.date, y: entry.windSpeed})),
            borderColor: 'rgb(53, 162, 235)',
            tension: 0.1,
          },
        ],
      });
    });
  }, []);

  return <Line options={options} data={chartData} />;
};

export default WindSpeedGraph;
