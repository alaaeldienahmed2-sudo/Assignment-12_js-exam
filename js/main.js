// importing data 
import MealDBService, { Meal } from "./api/mealdb.js";
import ProductService from "./api/products.js";
import NutritionService from "./api/nutrition.js";
import AppState from "./state/appState.js";
import FoodLog from "./state/foodLog.js";
import Router from "./router.js";
import MealsView from "./ui/2.mealsView.js";
import MealDetailsView from "./ui/3.mealDetailsView.js";
import FoodLogView from "./ui/4.foodLogView.js";
import ProductsView from "./ui/5.productsView.js";

// which sections of index.html belong to which page
const PAGE_SECTIONS = {
  meals: ["search-filters-section", "meal-categories-section", "all-recipes-section"],
  meal: ["meal-details"],
  scanner: ["products-section"],
  foodlog: ["foodlog-section"],
};

class App {
  constructor() {
    this.mealApi = new MealDBService();
    this.productApi = new ProductService();
    this.nutritionApi = new NutritionService();
    this.state = new AppState();
    this.foodLog = new FoodLog();

    this.mealsView = new MealsView();
    this.detailsView = new MealDetailsView();
    this.foodLogView = new FoodLogView();
    this.productsView = new ProductsView();

    this.router = new Router((page, id) => this.showPage(page, id));
  }

  async start() {
    this.setupNavigation();
    this.setupFilterButtons();
    this.setupEvents();

    try {
      this.mealsView.renderCategories(await this.mealApi.getCategories());
    } catch (error) {
      console.log(error);
    }

    this.router.handle(); // open the page that matches the URL
    document.getElementById("app-loading-overlay").classList.add("loading"); // hide loading screen
  }
  // ***************************
  // ---------- pages ----------

  showSections(page) {
    for (const name in PAGE_SECTIONS) {
      for (const id of PAGE_SECTIONS[name]) {
        document.getElementById(id).style.display = "none";
      }
    }
    for (const id of PAGE_SECTIONS[page]) {
      document.getElementById(id).style.display = "";
    }
  }

  highlightNav(page) {
    const routes = ["meals", "scanner", "foodlog"];
    const current = page === "meal" ? "meals" : page;
    document.querySelectorAll(".nav-link").forEach((link, index) => {
      const active = routes[index] === current;
      link.classList.toggle("bg-emerald-50", active);
      link.classList.toggle("text-emerald-700", active);
      link.classList.toggle("text-gray-600", !active);
    });
  }

  async showPage(page, id) {
    if (!PAGE_SECTIONS[page]) page = "meals"; // unknown URL -> home
    this.showSections(page);
    this.highlightNav(page);
    window.scrollTo(0, 0);

    if (page === "meals" && !this.state.mealsLoaded) await this.loadRecipes();
    if (page === "meal") await this.loadMealDetails(id);
    if (page === "foodlog") this.foodLogView.render(this.foodLog);
  }

  // ***************************
  // ---------- meals ----------

  async loadRecipes() {
    this.mealsView.showLoading();
    try {
      let meals = [];
      if (this.state.filterType === "all" && this.state.search === "") {
        meals = await this.mealApi.getHomeMeals();
      } else if (this.state.filterType === "all") {
        meals = await this.mealApi.search(this.state.search);
      } else {
        meals = await this.mealApi.filterBy(this.state.filterType, this.state.filterValue);
      }
      this.mealsView.renderRecipes(meals.slice(0, 25)); // the exam wants 25 meals
      this.state.mealsLoaded = true;
    } catch (error) {
      console.log(error);
      this.mealsView.showError();
    }
  }

  async loadMealDetails(id) {
    this.detailsView.showLoading();
    try {
      const meal = new Meal(await this.mealApi.getById(id));
      let nutrition;
      try {
        nutrition = await this.nutritionApi.getNutrition(meal);
      } catch (error) {
        console.log(error);
        nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, note: "Nutrition data not available (check the API key in api/nutrition.js)." };
      }
      this.state.currentMeal = meal;
      this.state.currentNutrition = nutrition;
      this.detailsView.render(meal, nutrition);
    } catch (error) {
      console.log(error);
      this.detailsView.box.innerHTML = "<p class='text-center py-12 text-gray-500'>Could not load this meal.</p>";
    }
  }

  logCurrentMeal() {
    const meal = this.state.currentMeal;
    const n = this.state.currentNutrition;
    this.foodLog.add({
      type: "meal", name: meal.name, image: meal.image,
      calories: n.calories, protein: n.protein, carbs: n.carbs, fat: n.fat,
    });
    this.toast("Meal added to your food log");
  }

  
  // ***************************
  // ---------- products ----------

  async searchProducts(byBarcode) {
    const input = document.getElementById(byBarcode ? "barcode-input" : "product-search-input");
    const text = input.value.trim();
    if (text === "") return;

    this.productsView.showLoading();
    try {
      if (byBarcode) {
        this.state.products = await this.productApi.getByBarcode(text);
      } else {
        this.state.products = await this.productApi.search(text);
      }
      this.showProducts();
    } catch (error) {
      console.log(error);
      this.productsView.showError();
    }
  }

  async loadProductCategory(name) {
    this.productsView.showLoading();
    try {
      this.state.products = await this.productApi.getByCategory(name);
      this.showProducts();
    } catch (error) {
      console.log(error);
      this.productsView.showError();
    }
  }

  // applies the nutri-score filter before drawing
  showProducts() {
    let list = this.state.products;
    if (this.state.grade !== "") {
      list = list.filter((p) => p.grade === this.state.grade);
    }
    this.productsView.render(list);
  }

  logProduct(barcode) {
    const p = this.state.products.find((item) => item.barcode === barcode);
    if (!p) return;
    this.foodLog.add({
      type: "product", name: p.name, image: p.image,
      calories: p.calories, protein: p.protein, carbs: p.carbs, fat: p.fat,
    });
    this.toast("Product added to your food log");
  }

  // ***************************
  // ---------- events ----------

  setupNavigation() {
    const routes = ["meals", "scanner", "foodlog"];
    document.querySelectorAll(".nav-link").forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.router.go(routes[index]);
      });
    });
  }

  // the filter buttons 
  setupFilterButtons() {
    const buttons = document.querySelectorAll("#search-filters-section button");
    buttons.forEach((button, index) => {
      const name = button.textContent.trim().replace("Egyptain", "Egyptian"); // fix typo in the HTML
      button.textContent = name;
      button.classList.add("area-filter-btn");
      button.dataset.area = index === 0 ? "" : name; // first button = all recipes
    });
  }

  setupEvents() {
    // search with a small delay so we don't send a request on every key
    let timer;
    document.getElementById("search-input").addEventListener("input", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.state.filterType = "all";
        this.state.search = e.target.value.trim();
        this.loadRecipes();
      }, 400);
    });

    document.getElementById("search-product-btn").addEventListener("click", () => this.searchProducts(false));
    document.getElementById("lookup-barcode-btn").addEventListener("click", () => this.searchProducts(true));

    // one click listener for everything
    document.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    const target = e.target;

    const categoryCard = target.closest(".category-card");
    if (categoryCard) {
      this.state.filterType = "category";
      this.state.filterValue = categoryCard.dataset.category;
      document.getElementById("search-input").value = "";
      this.loadRecipes();
      return;
    }

    const areaButton = target.closest(".area-filter-btn");
    if (areaButton) {
      const area = areaButton.dataset.area;
      this.state.filterType = area === "" ? "all" : "area";
      this.state.filterValue = area;
      this.state.search = "";
      document.getElementById("search-input").value = "";
      this.loadRecipes();
      return;
    }

    const recipeCard = target.closest(".recipe-card");
    if (recipeCard) {
      this.router.go("meal-" + recipeCard.dataset.mealId);
      return;
    }

    if (target.closest("#back-to-meals-btn")) {
      this.router.go("meals");
      return;
    }

    if (target.closest("#log-meal-btn")) {
      this.logCurrentMeal();
      return;
    }

    const addProduct = target.closest(".add-product-btn");
    if (addProduct) {
      this.logProduct(addProduct.dataset.barcode);
      return;
    }

    const gradeButton = target.closest("[data-grade]");
    if (gradeButton) {
      this.state.grade = gradeButton.dataset.grade;
      this.showProducts();
      return;
    }

    const productCategory = target.closest("#product-categories button");
    if (productCategory) {
      this.loadProductCategory(productCategory.textContent.trim().toLowerCase());
      return;
    }

    const removeButton = target.closest(".remove-item-btn");
    if (removeButton) {
      this.foodLog.remove(Number(removeButton.dataset.id));
      this.foodLogView.render(this.foodLog);
      return;
    }

    if (target.closest("#clear-foodlog")) {
      this.foodLog.clearToday();
      this.foodLogView.render(this.foodLog);
    }
  }

  // small popup message (SweetAlert2 is loaded in index.html)
  toast(message) {
    if (typeof Swal === "undefined") return;
    Swal.fire({ toast: true, position: "top-end", icon: "success", title: message, showConfirmButton: false, timer: 1500 });
  }
}

new App().start();
