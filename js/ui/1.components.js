export function spinner() {
  return `
    <div style="grid-column: 1 / -1" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>`;
}

export function emptyState(title, text) {
  return `
    <div style="grid-column: 1 / -1" class="flex flex-col items-center justify-center py-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
      </div>
      <p class="text-gray-500 text-lg">${title}</p>
      <p class="text-gray-400 text-sm mt-2">${text}</p>
    </div>`;
}

export function categoryCard(cat) {
  return `
    <div class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
         data-category="${cat.name}">
      <div class="flex items-center gap-2.5">
        <img src="${cat.thumbnail}" alt="" class="w-9 h-9 object-contain" />
        <h3 class="text-sm font-bold text-gray-900">${cat.name}</h3>
      </div>
    </div>`;
}

export function recipeCard(meal) {
  // show the labels only when we have the data
  const categoryLabel = meal.category
    ? `<span class="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full text-gray-700">${meal.category}</span>` : "";
  const areaLabel = meal.area
    ? `<span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.area}</span>` : "";
  return `
    <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
         data-meal-id="${meal.id}">
      <div class="relative h-48 overflow-hidden">
        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
             src="${meal.thumbnail}" alt="${meal.name}" loading="lazy" />
        <div class="absolute bottom-3 left-3 flex gap-2">${categoryLabel}${areaLabel}</div>
      </div>
      <div class="p-4">
        <h3 class="text-base font-bold text-gray-900 line-clamp-1">${meal.name}</h3>
      </div>
    </div>`;
}

export function productCard(p) {
  const grade = p.grade
    ? `<div class="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">Nutri-Score ${p.grade.toUpperCase()}</div>` : "";
  return `
    <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all" data-barcode="${p.barcode}">
      <div class="relative h-40 bg-gray-100">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain" loading="lazy" />
        ${grade}
      </div>
      <div class="p-4">
        <p class="text-xs text-emerald-600 font-semibold mb-1">${p.brand}</p>
        <h3 class="text-sm font-bold text-gray-900 line-clamp-2 mb-2">${p.name}</h3>
        <p class="text-xs text-gray-500 mb-3">${p.quantity} ${p.calories} kcal / 100g</p>
        <div class="grid grid-cols-4 gap-2 text-center text-xs mb-3">
          <div><p class="font-bold text-gray-900">${p.protein}g</p><p class="text-gray-500">Protein</p></div>
          <div><p class="font-bold text-gray-900">${p.carbs}g</p><p class="text-gray-500">Carbs</p></div>
          <div><p class="font-bold text-gray-900">${p.fat}g</p><p class="text-gray-500">Fat</p></div>
          <div><p class="font-bold text-gray-900">${p.sugar}g</p><p class="text-gray-500">Sugar</p></div>
        </div>
        <button class="add-product-btn w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all"
                data-barcode="${p.barcode}">Add to log</button>
      </div>
    </div>`;
}

export function loggedItem(item) {
  const kind = item.type === "meal" ? "Meal" : "Product (100g)";
  return `
    <div class="flex items-center gap-4 py-3 border-b border-gray-100">
      <img src="${item.image}" alt="" class="w-12 h-12 rounded-lg object-cover" />
      <div class="flex-1">
        <p class="font-semibold text-gray-900 text-sm">${item.name}</p>
        <p class="text-xs text-gray-500">${kind} - P ${item.protein}g - C ${item.carbs}g - F ${item.fat}g</p>
      </div>
      <span class="font-bold text-emerald-600 text-sm">${item.calories} kcal</span>
      <button class="remove-item-btn text-gray-400 hover:text-red-500 p-2" data-id="${item.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>`;
}

// a progress bar that turns red when the goal is passed
export function progressBar(label, value, goal, unit) {
  const percent = Math.min(100, Math.round((value / goal) * 100));
  const color = value > goal ? "bg-red-500" : "bg-emerald-500";
  return `
    <div class="mb-4">
      <div class="flex justify-between text-sm mb-1">
        <span class="font-medium text-gray-700">${label}</span>
        <span class="text-gray-600">${Math.round(value)} / ${goal} ${unit}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="${color} h-2.5 rounded-full progress-bar" style="width: ${percent}%"></div>
      </div>
    </div>`;
}
