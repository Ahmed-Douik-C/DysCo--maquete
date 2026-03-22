/* ── Données ── */
const sessions = {
  therapist: [
    { score: 20, tags: ["Dyspraxie"] },
    { score: 28, tags: ["Dyspraxie"] },
    { score: 24, tags: ["TDAH"] },
    { score: 35, tags: ["Dyspraxie", "TDAH"] },
    { score: 42, tags: ["Dysgraphie"] },
    { score: 38, tags: ["TDAH"] },
    { score: 50, tags: ["Dyspraxie"] },
    { score: 45, tags: ["Dyslexie"] },
    { score: 58, tags: ["Troubles moteurs"] },
    { score: 65, tags: ["Dyspraxie", "Troubles moteurs"] },
    { score: 60, tags: ["TDAH"] },
    { score: 72, tags: ["Dyspraxie"] },
    { score: 80, tags: ["Troubles de l'attention"] },
    { score: 75, tags: ["Dyspraxie", "TDAH"] },
    { score: 88, tags: ["Dyspraxie"] },
  ],
  home: [
    { score: 15, tags: ["Dyspraxie"] },
    { score: 22, tags: ["TDAH"] },
    { score: 18, tags: ["Dyspraxie"] },
    { score: 30, tags: ["Dysgraphie"] },
    { score: 25, tags: ["TDAH"] },
    { score: 32, tags: ["Dyspraxie"] },
    { score: 28, tags: ["Troubles moteurs"] },
    { score: 40, tags: ["Dyspraxie", "TDAH"] },
    { score: 35, tags: ["Dyslexie"] },
    { score: 42, tags: ["Dyspraxie"] },
  ],
};

let chart = null;
let currentTab = "therapist";
let currentTag = null;

function getFilteredData(tag) {
  const data = sessions[currentTab];
  if (!tag) return data;
  return data.filter((s) => s.tags.includes(tag));
}

function renderStats(data) {
  const scores = data.map((s) => s.score);
  const labels = data.map((_, i) => "Partie " + (i + 1));

  const pointColors = scores.map((v, i) => {
    if (i === 0) return "#378add";
    return v >= scores[i - 1] ? "#1d9e75" : "#d85a30";
  });

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("eloChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Score",
          data: scores,
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
            title: (items) => {
              const idx = items[0].dataIndex;
              const session = data[idx];
              return `Tags: ${session.tags.join(", ")}`;
            },
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

  /* ── Résumé ── */
  document.getElementById("programs-done").textContent = scores.length;
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  document.getElementById("avg-score").textContent = avgScore.toFixed(1);
  document.getElementById("best-score").textContent = Math.max(...scores);

  /* ── Tendance ── */
  const trendBlock = document.querySelector(".trend-block");
  const arrow = document.getElementById("trend-arrow");
  const trendLabel = document.getElementById("trend-label");
  const trendValue = document.getElementById("trend-value");
  const trendContext = document.getElementById("trend-context");
  const trendPeriod = document.getElementById("trend-period");

  trendBlock.classList.remove("up", "down", "stable");

  const n = 5;
  if (scores.length >= n * 2) {
    const recent = scores.slice(-n);
    const previous = scores.slice(-n * 2, -n);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / n;
    const avgPrevious = previous.reduce((a, b) => a + b, 0) / n;
    const diff = avgRecent - avgPrevious;

    trendPeriod.textContent = `Moy. ${n} dernières (${avgRecent.toFixed(1)}) vs ${n} précédentes (${avgPrevious.toFixed(1)})`;

    if (diff > 10) {
      trendBlock.classList.add("up");
      arrow.textContent = "↗";
      trendLabel.textContent = "En forte hausse";
      trendValue.textContent = `+${diff.toFixed(1)} pts`;
      trendContext.textContent = "Progrès significatif — le programme semble adapté";
    } else if (diff > 5) {
      trendBlock.classList.add("up");
      arrow.textContent = "↗";
      trendLabel.textContent = "En hausse";
      trendValue.textContent = `+${diff.toFixed(1)} pts`;
      trendContext.textContent = "Amélioration notable — à maintenir";
    } else if (diff < -10) {
      trendBlock.classList.add("down");
      arrow.textContent = "↘";
      trendLabel.textContent = "En forte baisse";
      trendValue.textContent = `${diff.toFixed(1)} pts`;
      trendContext.textContent = "Baisse importante — revoir le programme ou la difficulté";
    } else if (diff < -5) {
      trendBlock.classList.add("down");
      arrow.textContent = "↘";
      trendLabel.textContent = "En baisse";
      trendValue.textContent = `${diff.toFixed(1)} pts`;
      trendContext.textContent = "Légère baisse — possible fatigue ou surcharge";
    } else {
      trendBlock.classList.add("stable");
      arrow.textContent = "→";
      trendLabel.textContent = "Stable";
      trendValue.textContent = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)} pts`;
      trendContext.textContent = "Performance régulière — pas de changement significatif";
    }
  } else {
    trendBlock.classList.add("stable");
    arrow.textContent = "—";
    trendLabel.textContent = "Pas assez de données";
    trendValue.textContent = `${scores.length}/${n * 2} sessions`;
    trendContext.textContent = `Encore ${n * 2 - scores.length} sessions nécessaires`;
    trendPeriod.textContent = "Nécessite au moins 10 sessions pour comparer";
  }
}

/* ── Tabs ── */
document.querySelectorAll(".stats-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".stats-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    currentTag = null;
    document.querySelectorAll(".tag-chip").forEach((c) => c.classList.remove("active"));
    renderStats(getFilteredData(null));
  });
});

/* ── Tags ── */
document.querySelectorAll(".tag-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const tag = chip.dataset.tag;
    if (currentTag === tag) {
      chip.classList.remove("active");
      currentTag = null;
      renderStats(getFilteredData(null));
    } else {
      document.querySelectorAll(".tag-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentTag = tag;
      renderStats(getFilteredData(tag));
    }
  });
});

renderStats(getFilteredData(currentTag));
