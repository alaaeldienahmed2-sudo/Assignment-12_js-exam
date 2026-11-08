export class Meal {
  constructor(raw) {
    this.raw = raw;
    this.id = raw.id;
    this.name = raw.name;
    this.category = raw.category;
    this.area = raw.area;
    this.image = raw.thumbnail;
    this.tags = raw.tags || [];
    // the API gives { ingredient, measure }, the views use { name, measure }
    this.ingredients = raw.ingredients.map((i) => ({ name: i.ingredient, measure: i.measure }));
  }

  getSteps() {
    return this.raw.instructions;
  }

  // youtube watch link -> embed link 
  getVideoUrl() {
    if (!this.raw.youtube) return "";
    return this.raw.youtube.replace("watch?v=", "embed/");
  }
}

export default class MealDBService {
  constructor() {
    this.base = "https://nutriplan-api.vercel.app/api/meals";
  }

  async get(path) {
    const res = await fetch(this.base + path);
    if (!res.ok) throw new Error("Request failed: " + res.status);
    return res.json();
  }

  async getCategories() {
    const data = await this.get("/categories");
    return data.results;
  }

  async search(name) {
    const data = await this.get("/search?q=" + encodeURIComponent(name) + "&page=1&limit=25");
    return data.results || [];
  }

  async getRandom(count) {
    const data = await this.get("/random?count=" + count);
    return data.results || [data.result];
  }

  // meals for the first load: an empty search first, random meals if that gives nothing
  async getHomeMeals() {
    try {
      const meals = await this.search("");
      if (meals.length > 0) return meals;
    } catch (error) {
      console.log(error);
    }
    return this.getRandom(25);
  }

  // type is "category" or "area" (filter returns full meal details)
  async filterBy(type, value) {
    const data = await this.get("/filter?" + type + "=" + encodeURIComponent(value) + "&page=1&limit=25");
    return data.results || [];
  }

  async getById(id) {
    const data = await this.get("/" + id);
    return data.result;
  }
}
