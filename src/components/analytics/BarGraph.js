import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const colors = ['#00FF00', '#808080', '#0000FF', '#FFFF00', '#FF0000'];
const barWidths = [50, 50, 50, 50, 50];

const BarGraph = ({ graphData }) => {
  const data = {
    //labels: graphData.map((entry) => `${entry.name} (${entry.number}) : ${entry.value}%`),
    labels: graphData.map((entry) => `${entry.name} (${entry.number})`),
    datasets: [
      {
        // label: null,
        data: graphData.map((entry) => entry.value),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        barThickness: barWidths[0],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `Value: ${context.raw}%`,
        },
      },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        formatter: (value) => `${value}%`,
        font: {
          weight: 'bold',
          size: 12,
        },
        padding: {
          top: 2,
          bottom: 4,
        },
        clamp: true,
        offset: 4,
      },
    },
    scales: {
      x: {
        barPercentage: 0.8,
        categoryPercentage: 1.0,
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div style={{ width: '700px', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
