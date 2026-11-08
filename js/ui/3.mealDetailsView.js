// Draws the Meal Details page.
import { spinner } from "./1.components.js";

export default class MealDetailsView {
  constructor() {
    this.box = document.getElementById("meal-details");
  }

  showLoading() {
    this.box.innerHTML = spinner();
  }

  row(label, value, unit) {
    return `
      <div class="flex justify-between py-2 border-b border-gray-100 text-sm">
        <span class="text-gray-600">${label}</span>
        <span class="font-semibold text-gray-900">${value}${unit}</span>
      </div>`;
  }

  render(meal, nutrition) {
    const tags = [meal.category, meal.area].concat(meal.tags).filter((t) => t); // area can be null
    const labels = tags.map((t) =>
      `<span class="px-3 py-1 bg-white/90 text-xs font-semibold rounded-full text-gray-700">${t}</span>`).join("");

    const ingredients = meal.ingredients.map((i) => `
      <div class="flex items-center gap-2 text-sm">
        <input type="checkbox" />
        <span><span class="font-semibold">${i.measure}</span> ${i.name}</span>
      </div>`).join("");

    const steps = meal.getSteps().map((s, index) => `
      <div class="flex gap-4">
        <div class="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">${index + 1}</div>
        <p class="text-gray-700 text-sm">${s}</p>
      </div>`).join("");

    const video = meal.getVideoUrl()
      ? `<div class="bg-white rounded-2xl shadow-lg p-6">
           <h2 class="text-xl font-bold text-gray-900 mb-4">Video Tutorial</h2>
           <iframe src="${meal.getVideoUrl()}" class="w-full aspect-video rounded-xl" allowfullscreen></iframe>
         </div>` : "";

    const note = nutrition.note ? `<p class="text-xs text-gray-400 mt-3">${nutrition.note}</p>` : "";

    this.box.innerHTML = `
      <div class="max-w-7xl mx-auto">
        <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
          <i class="fa-solid fa-arrow-left"></i><span>Back to Recipes</span>
        </button>

        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div class="relative h-80 md:h-96">
            <img src="${meal.image}" alt="${meal.name}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="flex flex-wrap gap-2 mb-3">${labels}</div>
              <h1 class="text-3xl font-bold text-white mb-2">${meal.name}</h1>
              <span id="hero-calories" class="text-white/90 text-sm">${nutrition.calories} cal/serving</span>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <button id="log-meal-btn" data-meal-id="${meal.id}" class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
            <i class="fa-solid fa-plus mr-2"></i>Log This Meal
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Ingredients (${meal.ingredients.length})</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${ingredients}</div>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
              <div class="space-y-4">${steps}</div>
            </div>
            ${video}
          </div>

          <div>
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h2>
              <div id="nutrition-facts-container">
                <div class="text-center py-4 mb-4 bg-emerald-50 rounded-xl">
                  <p class="text-3xl font-bold text-emerald-600">${nutrition.calories}</p>
                  <p class="text-sm text-gray-600">Calories per serving</p>
                </div>
                ${this.row("Protein", nutrition.protein, "g")}
                ${this.row("Carbs", nutrition.carbs, "g")}
                ${this.row("Fat", nutrition.fat, "g")}
                ${note}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }
}
