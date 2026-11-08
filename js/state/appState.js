export default class AppState {
  constructor() {
    this.filterType = "all"; // all, category or area
    this.filterValue = "";
    this.search = '';
    this.mealsLoaded = false;
    this.currentMeal = null;
    this.currentNutrition = null;
    this.products = [];
    this.grade = '';
  }
}
