// Draws the Product Scanner results.
import { spinner, emptyState, productCard } from "./1.components.js";

export default class ProductsView {
  constructor() {
    this.grid = document.getElementById("products-grid");
    this.count = document.getElementById("products-count");
  }

  showLoading() {
    this.grid.innerHTML = spinner();
  }

  showError() {
    this.grid.innerHTML = emptyState("Something went wrong", "Check your internet and try again");
  }

  render(products) {
    if (products.length === 0) {
      this.grid.innerHTML = emptyState("No products found", "Try another name or barcode");
    } else {
      this.grid.innerHTML = products.map(productCard).join("");
    }
    this.count.textContent = products.length + " products found";
  }
}
