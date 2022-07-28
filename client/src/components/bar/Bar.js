import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  maintainAspectRatio: false,
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2
    }
  },
  responsive: true,
  plugins: {
    legend: {
      marginBottom: 0,
      position: "top",
      align: "center"
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
      align: "left",
      anchor: "end"
    }
  }
};

export default function App({ barData }) {
  return (
    <div style={{ height: barData.labels.length * 110 > 200 ? barData.labels.length * 110 : 200 }}>
      <Bar options={options} data={barData} />
    </div>
  );
}
