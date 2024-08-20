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

const customLegendPlugin = {
  id: 'customLegend',
  beforeDraw(chart, args, options) {
    const { ctx, chartArea, legend } = chart;
    const { labels } = legend.options;

   
    ctx.clearRect(0, 0, chartArea.width, chartArea.height);

    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `bold 12px Arial`;

    legend.legendItems.forEach((item, index) => {
      ctx.fillStyle = labels.color || '#000';
      const x = chartArea.left + 10;
      const y = chartArea.top + (index + 1) * 20;

      ctx.fillText(item.text, x, y);
    });
  },
};

const colors = ['#16db65', '#495057', '#0496ff', '#ffc300', '#FF0000'];
const barWidths = [50, 50, 50, 50, 50];

const BarGraph = ({ graphData }) => {
  const data = {
    labels: graphData.map((entry) => `${entry.name} (${entry.number})`),
    datasets: [
      {
        label: 'Percentage(%)',
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
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#FF00FF',
          generateLabels: () => [],
        },

        plugins: [customLegendPlugin],
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
        ticks: {
          padding: 10,
        },
        title: {
          display: true,
          text: 'Status',
          color: '#000000',
          font: {
            size: 14,
            weight: 'bold',
          },
        },

        offset: true,
      },
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage(%)',
          color: '#000000',
          font: {
            size: 15,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '900px', height: '450px', paddingTop:'20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
