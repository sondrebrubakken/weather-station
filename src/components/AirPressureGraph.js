import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ref, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust this import to your actual path

// Import Chart.js components
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

// Import and register the time scale and date-fns adapter
import { TimeScale } from 'chart.js'; 
import 'chartjs-adapter-date-fns';

// Register necessary components including the TimeScale
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale // Register the TimeScale
);

const options = {
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Pressure (hPa)',
      },
    },
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        stepSize: 0.5, // Display an axis label every half hour
        tooltipFormat: 'MMM d, yyyy h:mm a',
        displayFormats: {
          hour: 'HH:mm',
        },
      },
      title: {
        display: true,
        text: 'Time',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
};

const AirPressureGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Air Pressure (hPa)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const pressureRef = ref(database, 'sensordata');
    onValue(pressureRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Get the timestamp for 24 hours ago
      const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);

      // Filter data to include one entry every 30 minutes within the last 24 hours
      const halfHourlyFilteredData = {};
      Object.entries(data).forEach(([key, entry]) => {
        const entryDate = new Date(entry.date);
        if (entryDate.getTime() >= oneDayAgo) {
          const minutes = entryDate.getMinutes() < 30 ? '00' : '30';
          const halfHourKey = `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}-${entryDate.getDate()}T${entryDate.getHours()}:${minutes}`;
          halfHourlyFilteredData[halfHourKey] = entry;
        }
      });

      const formattedData = Object.values(halfHourlyFilteredData).sort((a, b) => new Date(a.date) - new Date(b.date));

      setChartData({
        labels: formattedData.map(entry => entry.date),
        datasets: [{
          ...chartData.datasets[0],
          data: formattedData.map(entry => entry.pressure),
        }],
      });
    });
  }, []);

  return <Line data={chartData} options={options} />;
};

export default AirPressureGraph;
