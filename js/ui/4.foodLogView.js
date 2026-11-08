// Draws the Food Log page (today's totals, the list and the weekly chart).
import { emptyState, loggedItem, progressBar } from "./1.components.js";

export default class FoodLogView {
  constructor() {
    this.section = document.getElementById("foodlog-today-section");
    this.date = document.getElementById("foodlog-date");
    this.goals = { calories: 2000, protein: 50, carbs: 250, fat: 65 };
  }

  render(foodLog) {
    const totals = foodLog.totals();
    const items = foodLog.getToday();

    this.date.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

    const list = items.length > 0
      ? items.map(loggedItem).join("")
      : emptyState("No meals logged today", "Add meals from the Meals page or scan products");

    const clearButton = items.length > 0
      ? `<button id="clear-foodlog" class="text-red-500 hover:text-red-600 text-sm font-medium">
           <i class="fa-solid fa-trash mr-1"></i>Clear All</button>` : "";

    this.section.innerHTML = `
      <h3 class="text-lg font-bold text-gray-900 mb-4">Today's Nutrition</h3>
      ${progressBar("Calories", totals.calories, this.goals.calories, "kcal")}
      ${progressBar("Protein", totals.protein, this.goals.protein, "g")}
      ${progressBar("Carbs", totals.carbs, this.goals.carbs, "g")}
      ${progressBar("Fat", totals.fat, this.goals.fat, "g")}
      <div class="flex items-center justify-between mt-6 mb-2">
        <h4 class="font-bold text-gray-900">Logged Items (${items.length})</h4>
        ${clearButton}
      </div>
      <div id="logged-items-list">${list}</div>`;

    this.drawChart(foodLog.lastDays(7));
  }

  // weekly chart with Plotly (the script is loaded in index.html)
  drawChart(days) {
    const chart = document.getElementById("weekly-chart");
    if (typeof Plotly === "undefined") return;
    chart.innerHTML = "";
    const data = [{
      x: days.map((d) => d.date),
      y: days.map((d) => d.calories),
      type: "bar",
      marker: { color: "#10b981" },
    }];
    const layout = { margin: { t: 10, l: 45, r: 10, b: 40 }, yaxis: { title: "kcal" } };
    Plotly.newPlot(chart, data, layout, { displayModeBar: false, responsive: true });
  }
}
