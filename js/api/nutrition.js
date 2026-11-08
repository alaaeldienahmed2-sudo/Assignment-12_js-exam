const API_KEY = "mHpHMrWzjkcw8gLjNDKk7bRHTfN8PHPHLqLtt7k8";

export default class NutritionService {
  constructor() {
    this.url = "https://nutriplan-api.vercel.app/api/nutrition/analyze";
  }

  async getNutrition(meal) {
    const body = {
      recipeName: meal.name,
      ingredients: meal.ingredients.map((i) => (i.measure + " " + i.name).trim()),
    };
    const res = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Nutrition request failed: " + res.status);
    const data = await res.json();
    console.log("nutrition response:", data);

    // 1) if the API gives a "per serving" block
    const perServing = this.findObject(data, ["perserving"]);
    if (perServing) {
      return this.readValues(perServing, 1);
    }

    // 2) else => the numbers are the totals of the whole recipe, so we divide by the servings
    const totals = this.findObject(data, ["totals", "total", "nutritiontotals"]) || data;
    const servings = this.findNumber(data, ["servings", "serving"]) || 1;
    return this.readValues(totals, servings);
  }

  // reads calories / protein / carbs / fat from an object and divides them by the servings
  readValues(obj, servings) {
    return {
      calories: Math.round(this.findNumber(obj, ["calories", "kcal", "energy"]) / servings),
      protein: Math.round(this.findNumber(obj, ["protein"]) / servings),
      carbs: Math.round(this.findNumber(obj, ["carbs", "carbohydrates", "carbohydrate"]) / servings),
      fat: Math.round(this.findNumber(obj, ["fat", "totalfat"]) / servings),
    };
  }

  // makes "per_serving" and "perServing" look the same
  clean(key) {
    return key.toLowerCase().replace(/_/g, "");
  }

  findObject(obj, names) {
    if (obj === null || typeof obj !== "object") return null;
    for (const key in obj) {
      if (names.includes(this.clean(key)) && obj[key] !== null && typeof obj[key] === "object") {
        return obj[key];
      }
    }
    for (const key in obj) {
      const found = this.findObject(obj[key], names);
      if (found) return found;
    }
    return null;
  }

  findNumber(obj, names) {
    if (obj === null || typeof obj !== "object") return 0;
    for (const key in obj) {
      if (names.includes(this.clean(key)) && typeof obj[key] === "number") {
        return obj[key];
      }
    }
    for (const key in obj) {
      const found = this.findNumber(obj[key], names);
      if (found) return found;
    }
    return 0;
  }
}
