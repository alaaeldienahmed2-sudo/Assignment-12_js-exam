export default class ProductService {
  constructor() {
    this.base = "https://nutriplan-api.vercel.app/api/products";
  }

  async get(path) {
    const res = await fetch(this.base + path);
    if (!res.ok) throw new Error("Request failed: " + res.status);
    return res.json();
  }

  async search(text) {
    const data = await this.get("/search?q=" + encodeURIComponent(text) + "&page=1&limit=24");
    return (data.results || []).map((p) => this.clean(p));
  }

  async getByBarcode(code) {
    try {
      const data = await this.get("/barcode/" + encodeURIComponent(code));
      return data.result ? [this.clean(data.result)] : [];
    } catch (error) {
      return []; // unknown barcode
    }
  }

  async getByCategory(name) {
    const data = await this.get("/category/" + encodeURIComponent(name) + "?page=1&limit=24");
    return (data.results || []).map((p) => this.clean(p));
  }

  
  clean(p) {
    const n = p.nutrients || {};
    const round = (x) => Math.round((x || 0) * 10) / 10;
    const grade = p.nutritionGrade && p.nutritionGrade !== "unknown" ? p.nutritionGrade.toLowerCase() : "";
    return {
      barcode: p.barcode,
      name: p.name || "Unknown product",
      brand: p.brand || "",
      image: p.image || "",
      quantity: "",
      grade: grade,
      calories: Math.round(n.calories || 0),
      protein: round(n.protein),
      carbs: round(n.carbs),
      fat: round(n.fat),
      sugar: round(n.sugar),
    };
  }
}
