/* ── Données ── */
/* Remplace ce tableau par tes vraies données */
const eloHistory = [
  1200, 1220, 1208, 1235, 1250, 1238, 1260, 1245, 1270, 1288, 1275, 1295, 1310,
  1298, 1320,
];

const labels = eloHistory.map((_, i) => (i === 0 ? "Départ" : "#" + i));

const pointColors = eloHistory.map((v, i) => {
  if (i === 0) return "#378add";
  return v >= eloHistory[i - 1] ? "#1d9e75" : "#d85a30";
});

new Chart(document.getElementById("eloChart"), {
  type: "line",
  data: {
    labels,
    datasets: [
      {
        label: "Score",
        data: eloHistory,
        borderColor: "#378add",
        backgroundColor: "rgba(55,138,221,0.08)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: pointColors,
        fill: true,
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => " Elo : " + ctx.raw,
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 }, color: "#888" },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
      y: {
        ticks: { font: { size: 12 }, color: "#888" },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  },
});
