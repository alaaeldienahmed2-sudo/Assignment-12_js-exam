// Changes the URL for every page: #meals, #scanner, #foodlog, #meal-52772
export default class Router {
  constructor(onChange) {
    this.onChange = onChange;
    window.addEventListener("hashchange", () => this.handle());
  }

  go(route) {
    location.hash = route;
  }

  handle() {
    const hash = location.hash.slice(1) || "meals";
    const parts = hash.split("-"); // "meal-52772" -> ["meal", "52772"]
    this.onChange(parts[0], parts[1]);
  }
}
