// Draws the Meals page (categories + recipes).
import { spinner, emptyState, categoryCard, recipeCard } from "./1.components.js";

export default class MealsView {
  constructor() {
    this.categoriesGrid = document.getElementById("categories-grid");
    this.recipesGrid = document.getElementById("recipes-grid");
    this.count = document.getElementById("recipes-count");
  }

  renderCategories(categories) {
    this.categoriesGrid.innerHTML = categories.map(categoryCard).join("");
  }

  renderRecipes(meals) {
    if (meals.length === 0) {
      this.recipesGrid.innerHTML = emptyState("No recipes found", "Try searching for something else");
    } else {
      this.recipesGrid.innerHTML = meals.map(recipeCard).join("");
    }
    this.count.textContent = "Showing " + meals.length + " recipes";
  }

  showLoading() {
    this.recipesGrid.innerHTML = spinner();
  }

  showError() {
    this.recipesGrid.innerHTML = emptyState("Something went wrong", "Check your internet and try again");
  }
}
