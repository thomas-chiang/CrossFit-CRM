import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register({
  id: "customSpacingLegend",
  beforeInit(chart) {
    const originalFit = chart.legend.fit; // Get reference to the original fit function
    chart.legend.fit = function fit() {
      // Override the fit function
      originalFit.bind(chart.legend)(); // Call original function and bind scope in order to use `this` correctly inside it
      this.height += 80; // Change the height as suggested in another answers
    };
  }
});

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      align: "center",
      position: "top",
      labels: {
        font: {
          size: 16
        }
      }
    },
    datalabels: {
      backgroundColor: function (context) {
        return context.dataset.backgroundColor;
      },
      borderRadius: 4,
      color: "white",
      font: {
        weight: "bold"
      },
      formatter: Math.round,
      padding: 2,
      align: "center",
      anchor: "end"
    }
  },
  scales: {
    x: {
      ticks: {
        padding: 20
      }
    }
  }
};

export default function App({ barData }) {
  return (
    <div style={{ height: 400, width: Math.max(barData.labels.length * 80, 100) }}>
      <Bar data={barData} height={null} width={null} options={options} />
    </div>
  );
}
