export default class FoodLog {
  constructor() {
    this.key = "nutriplan-foodlog";
    this.items = JSON.parse(localStorage.getItem(this.key)) || [];
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.items));
  }

  // date as YYYY-MM-DD in the user's local time
  dateKey(date) {
    return date.toLocaleDateString("en-CA");
  }

  add(item) {
    item.id = Date.now();
    item.date = this.dateKey(new Date());
    this.items.push(item);
    this.save();
  }

  remove(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.save();
  }

  // clears today's items only, older days stay for the weekly chart
  clearToday() {
    const today = this.dateKey(new Date());
    this.items = this.items.filter((item) => item.date !== today);
    this.save();
  }

  getToday() {
    const today = this.dateKey(new Date());
    return this.items.filter((item) => item.date === today);
  }

  totals() {
    const t = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const item of this.getToday()) {
      t.calories += item.calories;
      t.protein += item.protein;
      t.carbs += item.carbs;
      t.fat += item.fat;
    }
    return t;
  }

  // calories per day for the last n days (used by the chart)
  lastDays(n) {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this.dateKey(d);
      let calories = 0;
      for (const item of this.items) {
        if (item.date === key) calories += item.calories;
      }
      days.push({ date: key, calories: calories });
    }
    return days;
  }
}
