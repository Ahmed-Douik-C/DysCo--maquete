/* ── Données ── */
/* Remplace ce tableau par tes vraies données */
const eloHistory = [20, 28, 24, 35, 42, 38, 50, 45, 58, 65, 60, 72, 80, 75, 88];

const labels = eloHistory.map((_, i) => "Partie " + (i + 1));

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
          label: (ctx) => `Score ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Parties",
          font: { size: 18, weight: "bold" },
          color: "#333",
        },
        ticks: { font: { size: 16 }, color: "#555" },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Score",
          font: { size: 18, weight: "bold" },
          color: "#333",
        },
        ticks: { font: { size: 16 }, color: "#555" },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  },
});

document.getElementById("programs-done").textContent = eloHistory.length;
