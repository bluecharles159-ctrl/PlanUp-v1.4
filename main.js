// ===== ELEMENT REFERENCES =====
const periodBtn = document.getElementById("periodBtn");
const periodWrapper = document.getElementById("periodWrapper");
const periodMenu = document.getElementById("periodMenu");
const periodValue = document.getElementById("periodValue");
const rangeModal = document.getElementById("rangeModal");
const rangeText = document.getElementById("rangeText");

// Insights page elements
const insightTotal = document.getElementById("insightTotal");
const insightItems = document.getElementById("insightItems");
const budgetLabel = document.getElementById("budgetLabel");
const insightBudget = document.getElementById("insightBudget");
const insightTopCategory = document.getElementById("insightTopCategory");
const breakdownByPriceBtn = document.getElementById("breakdownByPriceBtn");
const breakdownOverlay = document.querySelector(".breakdown-overlay");

// Budget elements - THE KEY TO MAKING IT WORK!
const budgetCard = document.getElementById("budgetCard");
const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");
const progressStatus = document.getElementById("progressStatus");
const budgetValue = document.getElementById("budgetValue");
const estimatesValue = document.getElementById("estimatesValue");
const remainingValue = document.getElementById("remainingValue");
const avgSpending = document.getElementById("avgSpending");
const itemCount = document.getElementById("itemCount");

let isScrolling;

window.addEventListener(
  "scroll",
  () => {
    document.body.classList.add("show-scrollbar");

    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
      document.body.classList.remove("show-scrollbar");
    }, 1200);
  },
  { passive: true },
);

// State variables
let items = JSON.parse(localStorage.getItem("planup_items")) || [];
let budget = 500;
let currentPeriod = "month";
let selectedRange = "This month";
let budgetExceededNotified = false;
let activeNotifications = [];

const ADMIN_PASSWORD = "planupadmin";
const ADMIN_METRIC_KEY = "planup_admin_metrics";
let adminMetrics = loadAdminMetrics();

function loadAdminMetrics() {
  const stored = localStorage.getItem(ADMIN_METRIC_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn("Unable to load admin metrics", error);
    }
  }
  return {
    totalUsers: 1,
    loginCount: 0,
    activeSessions: 0,
    errors: 0,
    notifications: 0,
    itemsAdded: 0,
    recentEvents: [],
  };
}

function saveAdminMetrics() {
  localStorage.setItem(ADMIN_METRIC_KEY, JSON.stringify(adminMetrics));
}

function recordAdminMetric(key, amount = 1) {
  adminMetrics[key] = (adminMetrics[key] || 0) + amount;
  saveAdminMetrics();
}

function recordAdminEvent(message) {
  adminMetrics.recentEvents = adminMetrics.recentEvents || [];
  adminMetrics.recentEvents.unshift({
    time: new Date().toISOString(),
    message,
  });
  adminMetrics.recentEvents = adminMetrics.recentEvents.slice(0, 12);
  saveAdminMetrics();
}

function updateAdminChart() {
  const chartGrid = document.getElementById("adminChartGrid");
  if (!chartGrid) return;

  const chartData = [
    { label: "Users", value: adminMetrics.totalUsers, color: "#4caf50" },
    { label: "Logins", value: adminMetrics.loginCount, color: "#2196f3" },
    { label: "Errors", value: adminMetrics.errors, color: "#ff5722" },
    { label: "Notifs", value: adminMetrics.notifications, color: "#ffca28" },
    { label: "Items", value: adminMetrics.itemsAdded, color: "#9c27b0" },
  ];

  // Find max value for scaling
  const maxValue = Math.max(...chartData.map(item => item.value), 1);
  const barHeightPercent = (value) => Math.max((value / maxValue) * 100, 10);

  chartGrid.innerHTML = chartData
    .map(
      (item) => `
        <div class="admin-chart-item">
          <span class="admin-chart-value">${item.value}</span>
          <div class="admin-chart-bar" style="height: ${barHeightPercent(item.value)}%; background: ${item.color};"></div>
          <span class="admin-chart-label">${item.label}</span>
        </div>
      `,
    )
    .join("");
}

function updateAdminEvents() {
  const eventsContainer = document.getElementById("adminEventsContainer");
  if (!eventsContainer) return;

  if (!adminMetrics.recentEvents || adminMetrics.recentEvents.length === 0) {
    eventsContainer.innerHTML = `<p style="text-align:center;color:#999;">No admin activity yet</p>`;
    return;
  }

  eventsContainer.innerHTML = adminMetrics.recentEvents
    .slice(0, 8)
    .map(
      (event) => `
        <div class="admin-event-row">
          <span class="admin-event-message">${event.message}</span>
          <span class="admin-event-time">${new Date(event.time).toLocaleString()}</span>
        </div>
      `,
    )
    .join("");
}

// Navigation elements
const menuBtn = document.getElementById("menuBtn");
const menuPage = document.getElementById("menuPage");
const menuOverlay = document.getElementById("menuOverlay");
const notificationBtn = document.getElementById("notificationBtn");
const notificationBar = document.getElementById("notificationBar");
const notificationMessage = document.getElementById("notificationMessage");
const searchBar = document.getElementById("searchBar");
const feedbackBtn = document.getElementById("feedbackBtn");

// Pages
const homePage = document.getElementById("homePage");
const insightsPage = document.getElementById("insightsPage");
const profilePage = document.getElementById("profilePage");
const toGetListPage = document.getElementById("toGetListPage");
const notificationPage = document.getElementById("notificationPage");
const favoritesPage = document.getElementById("favoritesPage");
const historyPage = document.getElementById("historyPage");
const dashboardPage = document.getElementById("dashboardPage");
const scheduledPage = document.getElementById("scheduledPage");
const feedbackPage = document.getElementById("feedbackPage");

document.getElementById("navMyItems").onclick = () => {
  homePage.style.display = "block";
  fab.classList.remove("hide");

  navMyItems.classList.add("active");
  homePage.classList.remove("hide");
  navInsights.classList.remove("active");
  insightsPage.classList.remove("show");
  navProfiles.classList.remove("active");
  profilePage.classList.remove("show");

  sortModal.classList.remove("show");
  sortOverlay.classList.remove("show");
};

//Insights Page
document.getElementById("navInsights").onclick = () => {
  insightsPage.style.display = "block";
  fab.classList.add("hide");

  insightsPage.classList.add("show");
  navInsights.classList.add("active");
  navMyItems.classList.remove("active");
  homePage.classList.add("hide");
  navProfiles.classList.remove("active");
  profilePage.classList.remove("show");

  sortModal.classList.remove("show");
  sortOverlay.classList.remove("show");

  closeModal();
  renderInsightsChart();
};

if (periodBtn && periodWrapper) {
  periodBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeRangeModal();
    periodWrapper.classList.toggle("open");
    updatePeriodMenu();
  });
}

function updatePeriodMenu() {
  const option = periodMenu.querySelector(".option");
  if (option) {
    if (currentPeriod === "month") {
      option.textContent = "Week";
    } else {
      option.textContent = "Month";
    }
  }
}

if (periodMenu) {
  periodMenu.addEventListener("click", () => {
    currentPeriod = currentPeriod === "month" ? "week" : "month";
    if (periodValue) periodValue.textContent = capitalize(currentPeriod);
    selectedRange = currentPeriod === "month" ? "This month" : "This week";
    if (rangeText) rangeText.textContent = selectedRange;
    updatePeriodMenu();
    periodWrapper.classList.remove("open");
  });
}

document.addEventListener("click", (e) => {
  if (periodWrapper && !periodWrapper.contains(e.target)) {
    periodWrapper.classList.remove("open");
  }

  if (rangeModal && !rangeModal.contains(e.target) && e.target !== rangeText) {
    closeRangeModal();
  }
});

if (rangeText) {
  rangeText.addEventListener("click", (e) => {
    e.stopPropagation();
    if (periodWrapper) periodWrapper.classList.remove("open");

    if (rangeModal.classList.contains("open")) {
      closeRangeModal();
    } else {
      openRangeModal();
    }
  });
}

/* function openRangeModal() {
  rangeModal.innerHTML = "";

  const options =
    currentPeriod === "month"
      ? ["This month", "Last month", "Last 2 months", "Last 3 months"]
      : ["This week", "Last week", "Last 2 weeks", "Last 3 weeks"];

  options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "range-option";
    div.textContent = opt;
    div.onclick = () => {
      selectedRange = opt;
      rangeText.textContent = opt;
      closeRangeModal();
    };
    rangeModal.appendChild(div);
  });

  rangeModal.classList.add("open");
} */

function openRangeModal() {
  rangeModal.innerHTML = "";

  const options =
    currentPeriod === "month"
      ? ["This month", "Last month", "Last 2 months", "Last 3 months"]
      : ["This week", "Last week", "Last 2 weeks", "Last 3 weeks"];

  options.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "range-option";
    div.textContent = opt;

    // FIX: Clear layout and click states cleanly
    div.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents global listener conflicts
      selectedRange = opt;
      if (rangeText) rangeText.textContent = opt;
      closeRangeModal();
    });

    rangeModal.appendChild(div);
  });

  // Position the modal directly under the rangeText control
  if (rangeText) {
    const rect = rangeText.getBoundingClientRect();
    // Ensure modal is absolutely positioned so we can control exact placement
    rangeModal.style.position = "absolute";
    // Add small top offset so it appears below the text
    const top = rect.bottom + window.scrollY + 6;
    const left = rect.left + window.scrollX;
    rangeModal.style.top = `${top}px`;
    // Keep modal left-aligned with the range text, but ensure it doesn't overflow
    rangeModal.style.left = `${Math.max(8, left)}px`;
    // Optionally match width to the trigger
    rangeModal.style.minWidth = `${Math.max(160, rect.width)}px`;
  }

  rangeModal.classList.add("open");

  // Reposition on window resize/scroll to stay under the trigger
  const reposition = () => {
    if (!rangeModal.classList.contains("open") || !rangeText) return;
    const r = rangeText.getBoundingClientRect();
    rangeModal.style.top = `${r.bottom + window.scrollY + 6}px`;
    rangeModal.style.left = `${Math.max(8, r.left + window.scrollX)}px`;
  };
  window.addEventListener("resize", reposition);
  window.addEventListener("scroll", reposition, { passive: true });
}

function closeRangeModal() {
  if (rangeModal) rangeModal.classList.remove("open");
}

/* function getRangeStart(period, range) {
  const now = new Date();

  if (period === "week") {
    if (range === "This week") now.setDate(now.getDate() - 7);
    if (range === "Last week") now.setDate(now.getDate() - 14);
    if (range === "Last 2 weeks") now.setDate(now.getDate() - 21);
    if (range === "Last 3 weeks") now.setDate(now.getDate() - 28);
  }

  if (period === "month") {
    if (range === "This month") now.setMonth(now.getMonth() - 1);
    if (range === "Last month") now.setMonth(now.getMonth() - 2);
    if (range === "Last 2 months") now.setMonth(now.getMonth() - 3);
    if (range === "Last 3 months") now.setMonth(now.getMonth() - 4);
  }

  return now.getTime();
} */

function getRangeStart(period, range) {
  const now = new Date();

  // FIX: Mutate dates correctly backward from today
  if (period === "week") {
    if (range === "This week") now.setDate(now.getDate() - 7);
    if (range === "Last week") now.setDate(now.getDate() - 14);
    if (range === "Last 2 weeks") now.setDate(now.getDate() - 21);
    if (range === "Last 3 weeks") now.setDate(now.getDate() - 28);
  }

  if (period === "month") {
    if (range === "This month") now.setMonth(now.getMonth() - 1);
    if (range === "Last month") now.setMonth(now.getMonth() - 2);
    if (range === "Last 2 months") now.setMonth(now.getMonth() - 3);
    if (range === "Last 3 months") now.setMonth(now.getMonth() - 4);
  }

  return now.getTime();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

updatePeriodMenu();

let currentBreakdownOption =
  breakdownByPriceBtn.querySelector("span")?.textContent.trim() ||
  "By total budget";

function setBreakdownOption(option) {
  currentBreakdownOption = option;
  const label = breakdownByPriceBtn.querySelector("span");
  if (label) label.textContent = option;

  breakdownByPriceBtn.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.textContent.trim() === option);
  });

  breakdownOverlay.classList.remove("show");
  breakdownByPriceBtn.classList.remove("expanded");
}

breakdownByPriceBtn.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") return;
  breakdownByPriceBtn.classList.toggle("expanded");
  breakdownOverlay.classList.toggle("show");
});

breakdownByPriceBtn.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setBreakdownOption(event.currentTarget.textContent.trim());
  });
});

breakdownOverlay.addEventListener("click", () => {
  breakdownByPriceBtn.classList.remove("expanded");
  breakdownOverlay.classList.remove("show");
});

setBreakdownOption(currentBreakdownOption);

function getInsightsChartData() {
  const aggregated = items.reduce((acc, item) => {
    const name = item.name.trim();
    if (!name) return acc;
    const key = name.toLowerCase();
    if (!acc[key]) {
      acc[key] = {
        name,
        quantity: 0,
        expense: 0,
        uses: 0,
      };
    }
    acc[key].quantity += item.quantity || 0;
    acc[key].expense += item.price || 0;
    acc[key].uses += 1;
    return acc;
  }, {});

  return Object.values(aggregated)
    .sort((a, b) => {
      if (b.quantity !== a.quantity) return b.quantity - a.quantity;
      if (b.expense !== a.expense) return b.expense - a.expense;
      return b.uses - a.uses;
    })
    .slice(0, 5);
}

function renderInsightsChart() {
  const canvas = document.getElementById("myChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(320, rect.width || 320);
  const height = Math.max(240, rect.height || 240);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const chartData = getInsightsChartData();
  if (!chartData.length) {
    ctx.fillStyle = "#444";
    ctx.font = "16px Inter, sans-serif";
    ctx.fillText("Add items to see ranking chart", 14, 34);
    return;
  }

  const padding = 18;
  const labelWidth = 130;
  const rowHeight = (height - padding * 2) / chartData.length;
  const maxQuantity = Math.max(...chartData.map((item) => item.quantity), 1);
  const barAreaWidth = width - padding * 2 - labelWidth - 20;

  chartData.forEach((item, index) => {
    const y = padding + index * rowHeight;
    const barWidth = Math.max(8, (item.quantity / maxQuantity) * barAreaWidth);

    ctx.fillStyle = "#000000";
    ctx.fillRect(padding + labelWidth, y + 8, barWidth, rowHeight * 0.4);

    ctx.fillStyle = "#111";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${index + 1}. ${item.name}`, padding, y + 16);

    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = "#555";
    ctx.fillText(
      `Qty ${item.quantity} · $${item.expense.toFixed(2)} · Uses ${item.uses}`,
      padding,
      y + 34,
    );
  });

  ctx.fillStyle = "#777";
  ctx.font = "600 12px Inter, sans-serif";
  ctx.fillText(
    "Top 5 ranked items by quantity, expense, and usage",
    padding,
    height - 10,
  );
}

// ===== FAVORITES MANAGEMENT =====
const FAVORITES_STORAGE_KEY = "planup_favorites";

function getFavorites() {
  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : { recipes: [], ingredients: [] };
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  displayFavorites();
}

function getRecipeCategory(recipeName) {
  const categories = {
    pastry: ["cake", "pie", "tart", "croissant", "donut", "pastry", "bread", "biscuit", "cookie"],
    snack: ["chips", "popcorn", "nuts", "trail mix", "snack", "appetizer", "dip"],
    meat: ["chicken", "beef", "pork", "lamb", "turkey", "steak", "ribs", "ham", "sausage", "meatball"],
    beverage: ["juice", "smoothie", "coffee", "tea", "shake", "drink", "cocktail", "wine", "beer", "latte"],
    salad: ["salad", "slaw", "coleslaw", "greens"],
    pudding: ["pudding", "mousse", "dessert", "tiramisu", "cheesecake", "brownie"],
    seafood: ["fish", "salmon", "tuna", "shrimp", "crab", "lobster", "squid", "oyster", "seafood"],
    pasta: ["pasta", "spaghetti", "lasagna", "noodle", "ravioli"],
    soup: ["soup", "broth", "stew", "chowder", "bisque"],
    vegetarian: ["tofu", "vegetable", "veggie", "vegan", "greens", "spinach", "kale"]
  };
  
  const lowerName = recipeName.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }
  return "meal";
}

function getRecipeImage(recipeName, category) {
  const images = {
    pastry: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop",
    snack: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=200&h=200&fit=crop",
    meat: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
    beverage: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop",
    salad: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop",
    pudding: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop",
    seafood: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop",
    pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop",
    soup: "https://images.unsplash.com/photo-1547069900-7f62f0e71cb9?w=200&h=200&fit=crop",
    vegetarian: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",
    meal: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"
  };
  return images[category] || images.meal;
}

function addFavorite(type, name, origin = "") {
  const favorites = getFavorites();
  const category = type === "recipe" ? getRecipeCategory(name) : "";
  const image = type === "recipe" ? getRecipeImage(name, category) : "";
  const item = { name: name.trim(), origin: origin.trim(), category, image, id: `${type}-${name}-${origin}` };
  
  if (type === "recipe") {
    if (!favorites.recipes.find(r => r.id === item.id)) {
      favorites.recipes.push(item);
      saveFavorites(favorites);
      return true;
    }
  } else if (type === "ingredient") {
    if (!favorites.ingredients.find(i => i.id === item.id)) {
      favorites.ingredients.push(item);
      saveFavorites(favorites);
      return true;
    }
  }
  return false;
}

function removeFavorite(type, name, origin = "") {
  const favorites = getFavorites();
  const itemId = `${type}-${name}-${origin}`;
  
  if (type === "recipe") {
    favorites.recipes = favorites.recipes.filter(r => r.id !== itemId);
  } else if (type === "ingredient") {
    favorites.ingredients = favorites.ingredients.filter(i => i.id !== itemId);
  }
  
  saveFavorites(favorites);
  return true;
}

function isFavorite(type, name, origin = "") {
  const favorites = getFavorites();
  const itemId = `${type}-${name}-${origin}`;
  
  if (type === "recipe") {
    return favorites.recipes.some(r => r.id === itemId);
  } else if (type === "ingredient") {
    return favorites.ingredients.some(i => i.id === itemId);
  }
  return false;
}

function displayFavorites() {
  const favorites = getFavorites();
  const favRecipesContainer = document.querySelector(".fav-recipes");
  const favIngredientsContainer = document.querySelector(".fav-ingredients");
  
  if (favRecipesContainer) {
    favRecipesContainer.innerHTML = "";
    if (favorites.recipes.length === 0) {
      favRecipesContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No favourite recipes yet</div>';
    } else {
      favorites.recipes.forEach(recipe => {
        const recipeEl = createFavRecipeElement(recipe);
        favRecipesContainer.appendChild(recipeEl);
      });
    }
  }
  
  if (favIngredientsContainer) {
    favIngredientsContainer.innerHTML = "";
    if (favorites.ingredients.length === 0) {
      favIngredientsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No favourite ingredients yet</div>';
    } else {
      favorites.ingredients.forEach(ingredient => {
        const ingredientEl = createFavIngredientElement(ingredient);
        favIngredientsContainer.appendChild(ingredientEl);
      });
    }
  }
}

function createFavRecipeElement(recipe) {
  const div = document.createElement("div");
  div.className = "fav-recipe-item";
  div.setAttribute("data-name", recipe.name);
  div.setAttribute("data-origin", recipe.origin);
  const imageUrl = recipe.image || getRecipeImage(recipe.name, recipe.category || "meal");
  const categoryDisplay = recipe.category ? recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1) : "Meal";
  
  div.innerHTML = `
    <div class="fav-recipe-image-container">
      <img src="${imageUrl}" alt="${recipe.name}" class="fav-recipe-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'">
      <div class="fav-recipe-blur-bg"></div>
    </div>
    <div class="fav-recipe-content">
      <div class="fav-recipe-name">${recipe.name}</div>
      <div class="fav-recipe-meta">
        <span class="fav-recipe-category">${categoryDisplay}</span>
        <span class="fav-recipe-origin">${recipe.origin}</span>
      </div>
    </div>
    <div class="fav-recipe-heart like-item liked" data-type="recipe" data-name="${recipe.name}" data-origin="${recipe.origin}">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="m8.962 18.91l.464-.588zM12 5.5l-.54.52a.75.75 0 0 0 1.08 0zm3.038 13.41l.465.59zm-5.612-.588C7.91 17.127 6.253 15.96 4.938 14.48C3.65 13.028 2.75 11.335 2.75 9.137h-1.5c0 2.666 1.11 4.7 2.567 6.339c1.43 1.61 3.254 2.9 4.68 4.024zM2.75 9.137c0-2.15 1.215-3.954 2.874-4.713c1.612-.737 3.778-.541 5.836 1.597l1.08-1.04C10.1 2.444 7.264 2.025 5 3.06C2.786 4.073 1.25 6.425 1.25 9.137zM8.497 19.5c.513.404 1.063.834 1.62 1.16s1.193.59 1.883.59v-1.5c-.31 0-.674-.12-1.126-.385c-.453-.264-.922-.628-1.448-1.043zm7.006 0c1.426-1.125 3.25-2.413 4.68-4.024c1.457-1.64 2.567-3.673 2.567-6.339h-1.5c0 2.198-.9 3.891-2.188 5.343c-1.315 1.48-2.972 2.647-4.488 3.842zM22.75 9.137c0-2.712-1.535-5.064-3.75-6.077c-2.264-1.035-5.098-.616-7.54 1.92l1.08 1.04c2.058-2.137 4.224-2.333 5.836-1.596c1.659.759 2.874 2.562 2.874 4.713zm-8.176 9.185c-.526.415-.995.779-1.448 1.043s-.816.385-1.126.385v1.5c.69 0 1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16z" />
      </svg>
    </div>
  `;
  return div;
}

function createFavIngredientElement(ingredient) {
  const div = document.createElement("div");
  div.className = "ingredient-item";
  div.innerHTML = `
    <div class="ingredient-name-qty">${ingredient.name}</div>
    <div class="like-item liked" data-type="ingredient" data-name="${ingredient.name}" data-origin="${ingredient.origin}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="m8.962 18.91l.464-.588zM12 5.5l-.54.52a.75.75 0 0 0 1.08 0zm3.038 13.41l.465.59zm-5.612-.588C7.91 17.127 6.253 15.96 4.938 14.48C3.65 13.028 2.75 11.335 2.75 9.137h-1.5c0 2.666 1.11 4.7 2.567 6.339c1.43 1.61 3.254 2.9 4.68 4.024zM2.75 9.137c0-2.15 1.215-3.954 2.874-4.713c1.612-.737 3.778-.541 5.836 1.597l1.08-1.04C10.1 2.444 7.264 2.025 5 3.06C2.786 4.073 1.25 6.425 1.25 9.137zM8.497 19.5c.513.404 1.063.834 1.62 1.16s1.193.59 1.883.59v-1.5c-.31 0-.674-.12-1.126-.385c-.453-.264-.922-.628-1.448-1.043zm7.006 0c1.426-1.125 3.25-2.413 4.68-4.024c1.457-1.64 2.567-3.673 2.567-6.339h-1.5c0 2.198-.9 3.891-2.188 5.343c-1.315 1.48-2.972 2.647-4.488 3.842zM22.75 9.137c0-2.712-1.535-5.064-3.75-6.077c-2.264-1.035-5.098-.616-7.54 1.92l1.08 1.04c2.058-2.137 4.224-2.333 5.836-1.596c1.659.759 2.874 2.562 2.874 4.713zm-8.176 9.185c-.526.415-.995.779-1.448 1.043s-.816.385-1.126.385v1.5c.69 0 1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16z" />
      </svg>
    </div>
  `;
  return div;
}

// ===== UPDATE LIKE BUTTON STATES =====
function updateLikeButtonStates() {
  const likeButtons = document.querySelectorAll(".like-item:not(.in-favorites)");
  
  likeButtons.forEach((btn) => {
    const recipeItem = btn.closest(".recipe-item");
    const mealName = recipeItem?.querySelector(".meal-name");
    const placeOfRecipe = recipeItem?.querySelector(".place-of-recipe");
    
    if (!mealName) return;
    
    const name = mealName.textContent.split('\n')[0].trim();
    const origin = placeOfRecipe ? placeOfRecipe.textContent.trim() : "";
    
    if (isFavorite("recipe", name, origin)) {
      btn.classList.add("liked");
    } else {
      btn.classList.remove("liked");
    }
  });
}

// ===== INITIALIZE LIKE BUTTONS =====
function initializeLikeButtons() {
  const likeButtons = document.querySelectorAll(".like-item");
  
  likeButtons.forEach((heart) => {
    // Skip if already initialized
    if (heart.dataset.initialized === "true") return;
    heart.dataset.initialized = "true";
    
    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Get item information from the parent structure
      const recipeItem = heart.closest(".recipe-item");
      const mealName = recipeItem?.querySelector(".meal-name");
      const placeOfRecipe = recipeItem?.querySelector(".place-of-recipe");
      
      if (!mealName) return;
      
      const name = mealName.textContent.split('\n')[0].trim();
      const origin = placeOfRecipe ? placeOfRecipe.textContent.trim() : "";
      
      heart.classList.toggle("liked");
      
      if (heart.classList.contains("liked")) {
        addFavorite("recipe", name, origin);
        showToast(`✓ ${name} added to favorites`);
      } else {
        removeFavorite("recipe", name, origin);
        showToast(`✕ ${name} removed from favorites`);
      }
    });
  });
  
  // Handle like buttons in favorites containers with event delegation
  const favRecipesContainer = document.querySelector(".fav-recipes");
  const favIngredientsContainer = document.querySelector(".fav-ingredients");
  
  if (favRecipesContainer) {
    favRecipesContainer.addEventListener("click", (e) => {
      const likeBtn = e.target.closest(".fav-recipe-heart, .like-item");
      if (!likeBtn) return;
      
      e.stopPropagation();
      const recipeItem = likeBtn.closest(".fav-recipe-item, .recipe-item");
      
      if (!recipeItem) return;
      
      let name, origin;
      
      // Handle new thin recipe format
      if (recipeItem.classList.contains("fav-recipe-item")) {
        name = recipeItem.getAttribute("data-name");
        origin = recipeItem.getAttribute("data-origin") || "";
      } else {
        // Handle old format
        const mealName = recipeItem.querySelector(".meal-name");
        if (!mealName) return;
        name = mealName.textContent.split('\n')[0].trim();
        origin = recipeItem.querySelector(".place-of-recipe")?.textContent.trim() || "";
      }
      
      if (!name) return;
      removeFavorite("recipe", name, origin);
      showToast(`✕ ${name} removed from favorites`);
    });
  }
  
  if (favIngredientsContainer) {
    favIngredientsContainer.addEventListener("click", (e) => {
      const likeBtn = e.target.closest(".like-item");
      if (!likeBtn) return;
      
      e.stopPropagation();
      const ingredientName = likeBtn.previousElementSibling?.textContent.trim();
      
      if (!ingredientName) return;
      
      removeFavorite("ingredient", ingredientName, "");
      showToast("✕ Removed from favorites");
    });
  }
}

function setupInsightRecipeFavorites() {
  const insightsRecipeSection = insightsPage?.querySelector(".item-recipe-details");
  if (!insightsRecipeSection) return;

  insightsRecipeSection.addEventListener("click", (e) => {
    const recipeItem = e.target.closest(".recipe-item");
    if (!recipeItem) return;
    if (e.target.closest(".like-item") || e.target.closest(".expand-item")) return;

    const mealName = recipeItem.querySelector(".meal-name");
    const placeOfRecipe = recipeItem.querySelector(".place-of-recipe");
    if (!mealName) return;

    const name = mealName.textContent.split("\n")[0].trim();
    const origin = placeOfRecipe ? placeOfRecipe.textContent.trim() : "";
    if (!name) return;

    const wasAdded = addFavorite("recipe", name, origin);
    if (wasAdded) {
      showToast("✓ Recipe added to favorites");
      updateLikeButtonStates();
    }
  });
}

const recipeItem = document.querySelectorAll(".recipe-item");

const expandRecipe = document.querySelectorAll(".expand-item");

/* expandRecipe.forEach(arrow => {
  arrow.addEventListener("click", () => {
    recipeItem.classList.toggle("expand");
  })
}) */

/* expandRecipe.forEach(arrow => {
  arrow.addEventListener("click", () => {
    
    recipeItem.forEach(recipe => {
      recipe.forEach(allRecipe => {
        allRecipe.classList.remove("expand");
      })
      recipe.classList.toggle("expand");
    })
  })
}) */

/* const expandRecipe = document.querySelectorAll(".expand-item");
expandRecipe.forEach((arrow) => {
  recipeItem.forEach((recipe) => {
    arrow.addEventListener("click", () => {
      recipe.classList.toggle("expand");
    });
  });
}); */

/* recipeItem.forEach((recipe) => {
  expandRecipe.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      recipe.classList.toggle("expand");
    });
  });
}); */
recipeItem.forEach((recipe) => {
  recipe.addEventListener("click", () => {
    recipe.classList.toggle("expand");
  });
});

//Profile Page
document.getElementById("navProfiles").onclick = () => {
  homePage.style.display = "none";
  insightsPage.style.display = "none";
  profilePage.style.display = "block";

  navProfiles.classList.add("active");
  profilePage.classList.add("show");
  navMyItems.classList.remove("active");
  homePage.classList.add("hide");
  navInsights.classList.remove("active");
  insightsPage.classList.remove("show");
  fab.classList.add("hide");

  sortModal.classList.remove("show");
  sortOverlay.classList.remove("show");

  closeModal();
};

const accountToggle = document.getElementById("accountToggle");
const accWrapper = document.querySelector(".acc-wrapper");
const profileForeground = document.querySelector(".prof-fg-cont");
const dataManagementToggle = document.getElementById("dataManagementToggle");

// Generic header toggle handler
function setupHeaderToggle(toggleBtn, toggleContainer) {
  if (!toggleBtn || !toggleContainer) return;

  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("expanded");
    toggleContainer.classList.toggle("expanded");
  });
}

// Account toggle
if (accountToggle && accWrapper) {
  setupHeaderToggle(accountToggle, accWrapper);
}

// Data management toggle
if (dataManagementToggle) {
  dataManagementToggle.addEventListener("click", () => {
    dataManagementToggle.classList.toggle("expanded");
    document.getElementById("dataManagementCard").classList.toggle("expanded");
  });
}

document.querySelectorAll(".toggler").forEach((toggler) => {
  const toggleGround = toggler.querySelector(".toggle-ground");
  const toggle = toggler.querySelector(".toggle");
  const clickListener = toggler.querySelector(".click-listener");

  if (!clickListener || !toggleGround || !toggle) return;

  clickListener.addEventListener("click", () => {
    toggle.classList.toggle("on");
    toggleGround.classList.toggle("on");

    /* if (toggler.id === "exportToggler") {
      showToast("Export list toggled");
    } else if (toggler.id === "budgetAlertsToggler") {
      showToast("Budget alerts toggled");
    } */
  });
});

const profileAvatar = document.getElementById("profileAvatar");

const settingsIcon = document.getElementById("settingsIcon");
const settingsPage = document.getElementById("settingsPage");

const dataMangementToggle = document.getElementById("dataMangementToggle");

settingsIcon.addEventListener("click", () => {
  settingsPage.classList.add("show");
});

settingsBtn.addEventListener("click", () => {
  settingsPage.classList.add("show");
  closeMenu();
});

const currencyDiv = document.querySelector(".currency-div");
const currencyOverlay = document.querySelector(".currency-overlay");
const currencyModal = document.querySelector(".currency-selector-div");

currencyDiv.addEventListener("click", () => {
  currencyModal.classList.add("show");
  currencyOverlay.classList.add("show");
  profilePage.style.transform = "scale(1.01)";
});
currencyOverlay.addEventListener("click", (e) => {
  e.stopPropagation();
  currencyModal.classList.remove("show");
  currencyOverlay.classList.remove("show");
  profilePage.style.transform = "scale(1)";
});

const currencyOptions = document.querySelectorAll(".currency-div-select");
let selectedCurrency = "";
let currencySymbol = "";

currencyOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedCurrency =
      option.innerHTML.trim().charAt(6) + " " + option.innerHTML;
    let charArr = [...selectedCurrency];
    charArr.splice(5);
    const finalCurrency =
      charArr[0] + charArr[1] + charArr[2] + charArr[3] + charArr[4];
    selectedCurrency = finalCurrency;
    currencyDiv.innerHTML = selectedCurrency;
    selectedCurrency = "";
    currencyModal.classList.remove("show");
    currencyOverlay.classList.remove("show");
    profilePage.style.transform = "scale(1)";
  });
});

const deleteActions = document.querySelectorAll("#deleteAction");
const deletePanel = document.getElementById("deletePanel");

// Attach handler to all delete action buttons (some pages may duplicate the id)
if (deleteActions && deleteActions.length) {
  deleteActions.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      showDeletePanel();
    });
  });
}

// Create and manage a modal overlay for delete confirmation
let _deleteOverlay = null;
function ensureDeleteOverlay() {
  if (_deleteOverlay) return _deleteOverlay;
  _deleteOverlay = document.createElement("div");
  _deleteOverlay.className = "delete-overlay";
  // Ensure overlay is visible even without CSS
  Object.assign(_deleteOverlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "rgba(0,0,0,0.45)",
    zIndex: "9997",
    display: "none",
    opacity: "0",
    transition: "opacity 180ms ease-in-out",
  });
  document.body.appendChild(_deleteOverlay);
  _deleteOverlay.addEventListener("click", () => {
    closeDeletePanel();
  });
  return _deleteOverlay;
}

function showDeletePanel() {
  // Close settings page if open
  if (settingsPage) settingsPage.classList.remove("show");
  // Ensure overlay exists and show
  ensureDeleteOverlay();
  // show overlay (inline styles) - set z-index higher than overlay
  if (_deleteOverlay) {
    _deleteOverlay.style.display = "block";
    _deleteOverlay.style.zIndex = "9997";
    setTimeout(() => (_deleteOverlay.style.opacity = "1"), 20);
  }

  if (deletePanel) {
    deletePanel.classList.add("show");
    // Ensure panel is on top of overlay
    deletePanel.style.position = "relative";
    deletePanel.style.zIndex = "9999";
  }

  // Find confirm button and attach input creation to button click
  const confirmBtn = document.getElementById("confirmDeleteAction");
  if (confirmBtn) {
    confirmBtn.disabled = true;
    
    // Only show input when user clicks to delete
    const onDeleteClick = () => {
      // Create input if it doesn't exist yet
      let input = deletePanel.querySelector("#confirmDeleteInput");
      if (!input) {
        input = document.createElement("input");
        input.id = "confirmDeleteInput";
        input.placeholder = 'Type "clear" to enable deletion';
        input.className = "confirm-delete-input";
        input.style.marginBottom = "10px";
        const instructions = document.createElement("div");
        instructions.className = "confirm-delete-instructions";
        instructions.textContent = 'Type "clear" (without quotes) to confirm clearing all data.';
        instructions.style.marginBottom = "10px";
        instructions.style.fontSize = "12px";
        // Insert above the confirm button
        confirmBtn.parentNode.insertBefore(instructions, confirmBtn);
        confirmBtn.parentNode.insertBefore(input, confirmBtn);

        // Attach input listener for case-sensitive 'clear'
        const onInput = (e) => {
          const val = e.target.value.trim();
          confirmBtn.disabled = val !== "clear";
        };
        input._deleteInputListener = onInput;
        input.addEventListener("input", onInput);
      }
      // Focus the input
      input.focus();
    };

    confirmBtn.removeEventListener("click", confirmBtn._deleteClickListener || (() => {}));
    confirmBtn._deleteClickListener = onDeleteClick;
    // First click shows the input
    confirmBtn.addEventListener("click", onDeleteClick);

    // Confirm action clears localStorage and reloads
    const onConfirm = () => {
      // Only proceed if enabled
      if (confirmBtn.disabled) return;
      // Clear all local storage and reload
      localStorage.clear();
      showToast("All data cleared.");
      // Close overlays and reload after short delay
      closeDeletePanel();
      setTimeout(() => location.reload(), 300);
    };

    // Override the click handler to check if input exists and is valid
    confirmBtn.onclick = (e) => {
      const input = deletePanel.querySelector("#confirmDeleteInput");
      if (!input) {
        // Input doesn't exist, show it
        onDeleteClick();
        e.preventDefault();
      } else if (input.value.trim() === "clear") {
        // Input exists and is correct, confirm the action
        onConfirm();
      }
    };
  }
}

function closeDeletePanel() {
  if (deletePanel) deletePanel.classList.remove("show");
  if (_deleteOverlay) {
    _deleteOverlay.style.opacity = "0";
    setTimeout(() => {
      _deleteOverlay.style.display = "none";
    }, 200);
  }
  // cleanup input state and remove it so it appears fresh next time
  const input = deletePanel?.querySelector("#confirmDeleteInput");
  const instructions = deletePanel?.querySelector(".confirm-delete-instructions");
  if (input) {
    input.value = "";
    input.remove();
  }
  if (instructions) {
    instructions.remove();
  }
  const confirmBtn = document.getElementById("confirmDeleteAction");
  if (confirmBtn) confirmBtn.disabled = true;
}

const faqBox = document.querySelector(".faqs-box");
const faqNAnsWrapper = document.querySelector(".faq-n-ans-wrapper");
const faqNAns = document.querySelectorAll(".faq-n-ans");
const faqQuest = document.querySelectorAll(".faq-quest");
const faqAns = document.querySelectorAll(".faq-ans");

function updateFaqWrapperState() {
  const hasOpenFaq = Array.from(faqNAns).some((faq) =>
    faq.classList.contains("expand"),
  );

  if (faqNAnsWrapper.classList.contains("expand")) {
    faqNAnsWrapper.classList.remove("expand-partial");
    return;
  }

  if (hasOpenFaq) {
    faqNAnsWrapper.classList.add("expand-partial");
  } else {
    faqNAnsWrapper.classList.remove("expand-partial");
  }
}

faqNAns.forEach((faq) => {
  faq.addEventListener("click", () => {
    const wasOpen = faq.classList.contains("expand");

    if (wasOpen) {
      faq.classList.remove("expand");
    } else {
      faqNAns.forEach((otherFaq) => {
        if (otherFaq !== faq) {
          otherFaq.classList.remove("expand");
        }
      });
      faq.classList.add("expand");
    }

    faqNAnsWrapper.classList.remove("expand");
    updateFaqWrapperState();
  });
});

const showMoreFaqs = document.querySelector(".show-more");

showMoreFaqs.addEventListener("click", () => {
  const isExpanded = faqNAnsWrapper.classList.toggle("expand");
  if (isExpanded) {
    faqNAnsWrapper.classList.remove("expand-partial");
  } else {
    updateFaqWrapperState();
  }
  if (faqNAnsWrapper.classList.contains("expand")) {
    showMoreFaqs.textContent = "show less";
  } else {
    showMoreFaqs.textContent = "show more";
  }
});

const cancelAction = document.getElementById("cancelAction");
const confirmDeleteAction = document.getElementById("confirmDeleteAction");

cancelAction.addEventListener("click", () => {
  closeDeletePanel();
});

// ===== MENU =====
menuBtn.addEventListener("click", () => {
  menuPage.classList.add("show");
  menuOverlay.classList.add("show");
});

menuOverlay.addEventListener("click", () => {
  menuPage.classList.remove("show");
  menuOverlay.classList.remove("show");
});

// ===== NOTIFICATIONS =====
notificationBtn.addEventListener("click", () => {
  showNotificationPage();
});

notificationBar?.addEventListener("click", () => {
  showNotificationPage();
});

// ===== BACK BUTTONS =====
const backFromPage = document.querySelectorAll(".back-btn");

function closePage() {
  if (notificationPage) notificationPage.classList.remove("show");
  if (toGetListPage) toGetListPage.classList.remove("show");
  if (favoritesPage) favoritesPage.classList.remove("show");
  if (scheduledPage) scheduledPage.classList.remove("show");
  if (historyPage) historyPage.classList.remove("show");
  if (recipePage) recipePage.classList.remove("show");
  if (feedbackPage) feedbackPage.classList.remove("show");
  if (settingsPage) settingsPage.classList.remove("show");
  if (makeRecipePage) makeRecipePage.classList.remove("show");
  menuPage.classList.remove("show");
  menuOverlay.classList.remove("show");
  if (typeof closeToGetModal === "function") {
    closeToGetModal();
  }
}

backFromPage.forEach((arrow) => {
  arrow.addEventListener("click", closePage);
});

// ===== DRAWER MENU ITEMS =====
const toGetListBtn = document.getElementById("toGetListBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const historyBtn = document.getElementById("historyBtn");
const dashboardBtn = document.getElementById("dashboardBtn");
const scheduledBtn = document.getElementById("scheduledBtn");

const addToGet = document.getElementById("addToGet");
const addToGetModal = document.getElementById("addToGetModal");
const toGetModalOverlay = document.getElementById("toGetModalOverlay");
const addToGetBtn = document.getElementById("addToGetBtn");
const addFromRecipeBtn = document.querySelector("#addFromRecipeBtn");
const toGetItemName = document.querySelector("#toGetItemName");
const toGetItemQty = document.querySelector("#toGetItemQty");
const toGetItemPrice = document.querySelector("#toGetItemPrice");
const toGetItemStore = document.querySelector("#toGetItemStore");
const TO_GET_STORAGE_KEY = "planup_to_get_items";
let editingToGetItemId = null;

if (addToGet) {
  addToGet.addEventListener("click", () => {
    editingToGetItemId = null;
    addToGetModal?.classList.add("show");
    toGetModalOverlay?.classList.add("show");
    if (toGetListPage) toGetListPage.style.transform = "scale(1.01)";
  });
}
function closeToGetModal() {
  editingToGetItemId = null;
  addToGetModal?.classList.remove("show");
  toGetModalOverlay?.classList.remove("show");
  if (toGetListPage) toGetListPage.style.transform = "scale(1)";
}
if (toGetModalOverlay) {
  toGetModalOverlay.addEventListener("click", closeToGetModal);
}

function getToGetItems() {
  const stored = localStorage.getItem(TO_GET_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveToGetItems(items) {
  localStorage.setItem(TO_GET_STORAGE_KEY, JSON.stringify(items));
}

function clearToGetModalFields() {
  if (toGetItemName) toGetItemName.value = "";
  if (toGetItemQty) toGetItemQty.value = "";
  if (toGetItemPrice) toGetItemPrice.value = "";
  if (toGetItemStore) toGetItemStore.value = "";
}

function createToGetItemElement(item) {
  const div = document.createElement("div");
  div.className = "to-get-item-card";
  div.dataset.itemId = item.id;
  div.innerHTML = `
    <div class="to-get-item-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 8h1a3 3 0 0 1 0 6h-1v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8h12Zm-2 7h1a1 1 0 0 0 0-2h-1v2Zm-8-9V4h8v2H8Zm-2 0H4V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4H6Zm2 0h8V6H10v2Z"/></svg>
    </div>
    <div class="to-get-item-details">
      <div class="to-get-item-name">${item.name}</div>
      <div class="to-get-item-meta">
        <span>${item.qty ? `Qty: ${item.qty}` : ""}</span>
        <span>${item.price ? `Price: $${item.price}` : ""}</span>
        <span>${item.store ? item.store : ""}</span>
      </div>
      <div class="to-get-item-actions">
        <input type="checkbox" id="toGetItemChecker">
        <div class="to-get-item-options" title="More options">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"/></svg>
        </div>
      </div>
    </div>
  `;
  return div;
}

const toGetItemModal = document.querySelector(".to-get-item-modal");
const toGetItemModalOptions = document.querySelectorAll(".to-get-item-modal-option");

function openToGetItemModal(card) {
  if (!toGetItemModal || !card) return;
  toGetItemModal.dataset.itemId = card.dataset.itemId || "";
  toGetItemModal.classList.add("show");
}

function closeToGetItemModal() {
  if (!toGetItemModal) return;
  toGetItemModal.classList.remove("show");
  delete toGetItemModal.dataset.itemId;
}

toGetItemModalOptions.forEach((option) => {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    const action = option.textContent.trim();
    const itemId = toGetItemModal.dataset.itemId;
    const items = getToGetItems();
    const itemIndex = items.findIndex((item) => String(item.id) === String(itemId));

    if (action === "Remove" && itemIndex !== -1) {
      items.splice(itemIndex, 1);
      saveToGetItems(items);
      renderToGetItems();
      showToast("Item removed from your to-get list.");
    }

    if (action === "Edit" && itemIndex !== -1) {
      const item = items[itemIndex];
      editingToGetItemId = item.id;
      if (toGetItemName) toGetItemName.value = item.name || "";
      if (toGetItemQty) toGetItemQty.value = item.qty || "";
      if (toGetItemPrice) toGetItemPrice.value = item.price || "";
      if (toGetItemStore) toGetItemStore.value = item.store || "";
      addToGetModal?.classList.add("show");
      toGetModalOverlay?.classList.add("show");
      if (toGetListPage) toGetListPage.style.transform = "scale(1.01)";
      showToast("Edit the item and save changes.");
    }

    if (action === "Add to item list" && itemIndex !== -1) {
      const item = items[itemIndex];
      const mainItem = {
        id: Date.now(),
        name: item.name,
        quantity: item.qty ? Number(item.qty) : 1,
        price: item.price ? parseFloat(item.price) || 0 : 0,
        store: item.store || "",
        createdAt: new Date().toISOString(),
        category: "Misc",
      };
      const mainItems = JSON.parse(localStorage.getItem("planup_items")) || [];
      mainItems.push(mainItem);
      localStorage.setItem("planup_items", JSON.stringify(mainItems));
      showToast("Item added to main list.");
    }

    if (action === "Set reminder") {
      showToast("Reminder feature is coming soon.");
    }

    closeToGetItemModal();
  });
});

function renderToGetItems() {
  let container = document.querySelector(".to-get-items");
  const pageContent = toGetListPage?.querySelector(".full-page-content");
  const emptyCard = pageContent?.querySelector(".notification-empty .empty-page-card");

  if (!container && pageContent) {
    container = document.createElement("div");
    container.className = "to-get-items";
    pageContent.appendChild(container);
  }

  const items = getToGetItems();
  if (container) {
    container.innerHTML = "";
    if (items.length === 0) {
      if (emptyCard) emptyCard.style.display = "block";
      container.style.display = "none";
    } else {
      if (emptyCard) emptyCard.style.display = "none";
      items.forEach((item) => {
        container.appendChild(createToGetItemElement(item));
      });
      container.style.display = "flex";
    }
  }

  const optionButtons = document.querySelectorAll(".to-get-item-options");
  optionButtons.forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      const card = button.closest(".to-get-item-card");
      openToGetItemModal(card);
    };
  });
}

if (document) {
  document.addEventListener("click", (event) => {
    if (
      toGetItemModal &&
      toGetItemModal.classList.contains("show") &&
      !event.target.closest(".to-get-item-modal") &&
      !event.target.closest(".to-get-item-options")
    ) {
      closeToGetItemModal();
    }
  });
}

if (addToGetBtn) {
  addToGetBtn.addEventListener("click", () => {
    const name = toGetItemName?.value.trim() || "";
    const qty = toGetItemQty?.value.trim();
    const price = toGetItemPrice?.value.trim();
    const store = toGetItemStore?.value.trim();

    if (!name) {
      showToast("Please enter an item name.");
      return;
    }

    const items = getToGetItems();
    if (editingToGetItemId) {
      const editIndex = items.findIndex(
        (item) => String(item.id) === String(editingToGetItemId),
      );
      if (editIndex !== -1) {
        items[editIndex] = {
          ...items[editIndex],
          name,
          qty,
          price,
          store,
          updatedAt: new Date().toISOString(),
        };
        showToast("Item updated in your to-get list.");
      }
    } else {
      items.push({
        id: Date.now(),
        name,
        qty,
        price,
        store,
        createdAt: new Date().toISOString(),
      });
      showToast("Item added to your to-get list.");
    }

    saveToGetItems(items);
    renderToGetItems();
    closeToGetModal();
    clearToGetModalFields();
  });
}

if (addFromRecipeBtn) {
  addFromRecipeBtn.addEventListener("click", () => {
    closeToGetModal();
    closePage();
    if (typeof openRecipePage === "function") {
      openRecipePage();
    } else {
      console.error("openRecipePage is not defined.");
    }
    console.log("Navigating to recipe page from to-get list");
  });
}

/*  addFromRecipeBtn.addEventListener("click", () => {
   closeModal(); // Hide modal so back button works again
   
   // Ensure these two functions are actually defined in your script!
   if (typeof closePage === "function" && typeof openRecipePage === "function") {
     closePage();
     openRecipePage();
   } else {
     console.error("closePage or openRecipePage is not defined.");
   }
 }); */

const addIngredient = document.querySelectorAll(".add-ingredient");

addIngredient.forEach(add => {
  add.addEventListener("click", (e) => {
    e.stopPropagation();

  })
})

const prepareRecipeButton = document.getElementById("prepareRecipeButton");
const makeRecipePage = document.getElementById("makeRecipePage");

prepareRecipeButton.addEventListener("click", (e) => {
  e.stopPropagation();
  makeRecipePage.classList.add("show");
})

function closeMenu() {
  menuPage.classList.remove("show");
  menuOverlay.classList.remove("show");
}

if (toGetListBtn) {
  toGetListBtn.addEventListener("click", () => {
    toGetListPage.classList.add("show");

    closeMenu();
  });
}

if (favoritesBtn) {
  favoritesBtn.addEventListener("click", () => {
    favoritesPage.classList.add("show");

    closeMenu();
  });
}

if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    historyPage.classList.add("show");

    closeMenu();
  });
}

if (dashboardBtn) {
  dashboardBtn.addEventListener("click", () => {
    const password = prompt("Admin password required:");
    if (password === ADMIN_PASSWORD) {
      recordAdminMetric("loginCount", 1);
      adminMetrics.activeSessions = 1;
      saveAdminMetrics();
      showDashboard();
    } else {
      showToast("Admin access denied.");
    }
    closeMenu();
  });
}

const favIngredientsBtn = document.getElementById("favIngredientsBtn");
const favRecipeBtn = document.getElementById("favRecipeBtn");
const favFilterContainer = document.getElementById("favFilterContainer");
const favIngredientsTab = document.getElementById("favIngredientsTab");
const favRecipesTab = document.getElementById("favRecipesTab");
const favRecipesBtn = document.getElementById("favRecipeBtn");
const favFiltBtn = document.querySelectorAll(".fav-filter-btn");

favIngredientsBtn.addEventListener("click", () => {
  favFilterContainer.classList.add("ingredients");
  favFilterContainer.classList.remove("recipes");
  /*favIngredientsBtn.classList.add('active');
   */
  favRecipesBtn.classList.remove("active");
  favRecipesTab.style.transform = "scale(70%)";
  favIngredientsTab.style.transform = "scale(100%)";
  favRecipesTab.style.transition = ".3s ease";
  favIngredientsTab.style.transition = ".2s ease";
});

favRecipeBtn.addEventListener("click", () => {
  favFilterContainer.classList.add("recipes");
  favFilterContainer.classList.remove("ingredients");
  /*favIngredientsBtn.classList.remove('active');
  favRecipesBtn.classList.add('active');*/
  favIngredientsTab.style.transform = "scale(70%)";
  favRecipesTab.style.transform = "scale(100%)";
  favIngredientsTab.style.transition = ".3s ease";
  favRecipesTab.style.transition = ".3s ease";
});

favFiltBtn.forEach((filtBtn) => {
  filtBtn.addEventListener("click", () => {
    favFiltBtn.forEach((filtBtn) => filtBtn.classList.remove("active"));
    filtBtn.classList.add("active");
  });
});

if (scheduledBtn) {
  scheduledBtn.addEventListener("click", () => {
    scheduledPage.classList.add("show");
    closeMenu();
  });
}

if (feedbackBtn) {
  feedbackBtn.addEventListener("click", () => {
    feedbackPage.classList.add("show");
    closeMenu();
  });
}

const sortBtn = document.getElementById("sortBtn");
const sortModal = document.getElementById("sortModal");
const sortOverlay = document.querySelector(".sort-overlay");
const sortIndicator = document.getElementById("sortIndicator");
const sortSvg = document.getElementById("sortSvg");
const sortPty = document.querySelectorAll(".sort-pty");
const filterBar = document.querySelector(".filter-bar");
const sortContainer = document.querySelector(".sort-container");
let activeFilter = "all";

function updateFilterBar() {
  if (!filterBar) return;

  // Get all unique categories from existing category cards
  const cardContainer = document.querySelector(".card-container");
  const categoryCards = cardContainer
    ? cardContainer.querySelectorAll(".category-card")
    : [];
  const availableCategories = new Set();

  categoryCards.forEach((card) => {
    const cardHeader = card.querySelector(".card-header");
    if (cardHeader) {
      const categoryName = getCategoryNameFromHeader(cardHeader);
      if (categoryName) {
        availableCategories.add(categoryName);
      }
    }
  });

  // Clear and rebuild filter chips
  filterBar.innerHTML = `<button class="filter-chip active" data-category="all">All</button>`;

  // Add chips only for available categories
  availableCategories.forEach((category) => {
    const chip = document.createElement("button");
    chip.className = "filter-chip";
    chip.dataset.category = category.toLowerCase();
    chip.textContent = category;
    filterBar.appendChild(chip);
  });

  // Re-attach event listeners to all chips
  const filterChips = filterBar.querySelectorAll(".filter-chip");
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.category
        ? chip.dataset.category.toLowerCase().trim()
        : chip.textContent.toLowerCase().trim();
      filterCategories(activeFilter);
    });
  });

  // Hide filter bar if no categories exist
  if (availableCategories.size === 0) {
    filterBar.style.display = "none";
  } else {
    filterBar.style.display = "flex";
  }
}

sortBtn.addEventListener("click", () => {
  sortModal.classList.toggle("show");
  sortOverlay.classList.toggle("show");
});
sortOverlay.addEventListener("click", () => {
  sortModal.classList.remove("show");
  sortOverlay.classList.remove("show");
});
sortSvg.addEventListener("click", () => {
  sortIndicator.classList.toggle("accend");
});

// ===== FAB MENU =====
const fab = document.getElementById("fab");
const fabMenu = document.getElementById("fabMenu");
const overlay = document.getElementById("fabOverlay");
const fabCamera = document.getElementById("fabCamera");
const recipeBtn = document.getElementById("recipeBtn");
const frequentItemsBtn = document.getElementById("frequentItemsBtn");
const smartSort = document.getElementById("smartSort");

fab.addEventListener("click", () => {
  fab.classList.toggle("expanded");
  fabMenu.classList.toggle("expanded");
  fabCamera.classList.toggle("visible");
  overlay.classList.toggle("show");
  sortModal.classList.remove("show");
  sortOverlay.classList.remove("show");
});

overlay.addEventListener("click", () => {
  sortModal.classList.remove("show");

  closeFab();
});

if (fabCamera) {
  fabCamera.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Camera clicked");
  });
}

function openRecipePage() {
  recipePage.classList.add("show");
  closeFab();
  closeMenu();
}

if (recipeBtn) {
  recipeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openRecipePage();
  });
}

if (frequentItemsBtn) {
  frequentItemsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    favoritesPage.classList.add("show");
    closeFab();
  });
}

if (smartSort) {
  smartSort.addEventListener("click", (e) => {
    e.stopPropagation();
    // Trigger sort modal
    sortModal.classList.toggle("show");
    sortOverlay.classList.toggle("show");
    closeFab();
  });
}

// // ===== ITEM CARD EXPANSION =====
// function initializeCardExpansion() {
//   const cards = document.querySelectorAll('.item-card');

//   cards.forEach(card => {
//     // Remove old listeners to prevent duplicates
//     const newCard = card.cloneNode(true);
//     card.parentNode.replaceChild(newCard, card);

//     newCard.addEventListener('click', function(e) {
//       // Don't expand if swiping
//       if (this.classList.contains('dragging')) return;
//       this.classList.toggle('expanded');
//     });
//   });
// }

// initializeCardExpansion();

// ===== ADD ITEM MODAL - FIXED VERSION =====
const addItemModal = document.getElementById("addItemModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveItemBtn = document.getElementById("saveItemBtn");
const addItemBtn = document.getElementById("addItemBtn");

// Category keywords mapping for AI-like categorization
const categoryKeywords = {
  Vegetables: [
    "lettuce",
    "carrot",
    "broccoli",
    "spinach",
    "kale",
    "cabbage",
    "potato",
    "onion",
    "garlic",
    "tomato",
    "cucumber",
    "bell pepper",
    "zucchini",
    "asparagus",
    "beans",
    "peas",
    "corn",
    "eggplant",
    "celery",
    "radish",
  ],
  Fruits: [
    "apple",
    "banana",
    "orange",
    "grape",
    "strawberry",
    "blueberry",
    "raspberry",
    "blackberry",
    "watermelon",
    "mango",
    "pineapple",
    "peach",
    "pear",
    "cherry",
    "lime",
    "lemon",
    "kiwi",
    "coconut",
    "papaya",
    "avocado",
  ],
  Protein: [
    "chicken",
    "beef",
    "pork",
    "lamb",
    "fish",
    "salmon",
    "cod",
    "tuna",
    "shrimp",
    "egg",
    "tofu",
    "tempeh",
    "lentils",
    "chickpeas",
    "beans",
    "nuts",
    "almonds",
    "peanuts",
  ],
  Dairy: [
    "milk",
    "cheese",
    "yogurt",
    "butter",
    "cream",
    "ice cream",
    "mozzarella",
    "cheddar",
    "feta",
    "parmesan",
  ],
  Grains: [
    "bread",
    "rice",
    "pasta",
    "cereal",
    "oats",
    "wheat",
    "barley",
    "flour",
    "noodles",
    "quinoa",
  ],
  Snacks: [
    "chips",
    "crackers",
    "popcorn",
    "candy",
    "chocolate",
    "cookies",
    "granola",
    "nuts",
    "dried fruit",
  ],
  Beverages: [
    "juice",
    "soda",
    "coffee",
    "tea",
    "water",
    "milk",
    "beer",
    "wine",
    "whiskey",
    "vodka",
  ],
  Spices: [
    "salt",
    "pepper",
    "cinnamon",
    "paprika",
    "cumin",
    "oregano",
    "basil",
    "thyme",
    "ginger",
    "turmeric",
  ],
};

// Auto-categorization function using heuristic matching
function suggestCategory(itemName) {
  const nameLower = itemName.toLowerCase().trim();

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword) || keyword.includes(nameLower)) {
        return category;
      }
    }
  }

  // If no match found, check existing categories
  const cardContainer = document.querySelector(".card-container");
  if (cardContainer) {
    const categoryCards = cardContainer.querySelectorAll(".category-card");
    for (const card of categoryCards) {
      const cardHeader = card.querySelector(".card-header");
      if (cardHeader) {
        const category = getCategoryNameFromHeader(cardHeader);
        if (category && nameLower.includes(category.toLowerCase())) {
          return category;
        }
      }
    }
  }

  // Default category
  return "Other";
}

// Open modal
function openAddItemModal() {
  addItemModal.classList.add("show");
  closeFab();
  // if (addItemModal) {homePage.style.transform = "scale(0.9)"}
  // else {homePage.style.transform = "scale(1)"}
  homePage.style.transform = "scale(0.98)";
}

// Close modal
function closeModal() {
  addItemModal.classList.remove("show");
  // Clear inputs
  const itemNameInput = document.getElementById("itemNameInput");
  const quantityInput = document.getElementById("quantityInput");
  const priceInput = document.getElementById("priceInput");
  const categorySelect = document.getElementById("categorySelect");

  if (itemNameInput) itemNameInput.value = "";
  if (quantityInput) quantityInput.value = "1";
  if (priceInput) priceInput.value = "";
  if (categorySelect) categorySelect.value = "Food";

  homePage.style.transform = "scale(1)";
}

if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
if (addItemBtn) addItemBtn.addEventListener("click", openAddItemModal);

addItemModal?.addEventListener("click", (e) => {
  if (e.target === addItemModal) closeModal();
});

// ===== QUANTITY CONTROLS =====
const increaseQty = document.getElementById("increaseQty");
const decreaseQty = document.getElementById("decreaseQty");
const quantityInput = document.getElementById("quantityInput");

if (decreaseQty) {
  decreaseQty.addEventListener("click", () => {
    const current = parseInt(quantityInput.value) || 1;
    if (current > 1) {
      quantityInput.value = current - 1;
    }
  });
}

if (increaseQty) {
  increaseQty.addEventListener("click", () => {
    const current = parseInt(quantityInput.value) || 1;
    quantityInput.value = current + 1;
  });
}

const concurrentContainer = document.querySelector(
  ".concurrent-items-container",
);
const concurrentItems = document.querySelectorAll(".concurrent-items-wrapper");

concurrentContainer.addEventListener("click", (e) => {
  e.stopPropagation();
  concurrentContainer.classList.toggle("expand");

  if (!concurrentContainer.classList.contains("expand")) {
    concurrentItems.forEach((item) => {
      item.classList.remove("expand");
    });
  }
});
concurrentItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!concurrentContainer.classList.contains("expand")) {
      return;
    }
    const isExpanded = item.classList.contains("expand");

    concurrentItems.forEach((otherItem) => {
      otherItem.classList.remove("expand");
      otherItem.style.transformOrigin = "";
    });

    if (!isExpanded) {
      item.classList.add("expand");

      // Get item position in container to set transform-origin
      const itemRect = item.getBoundingClientRect();
      const containerRect = concurrentContainer.getBoundingClientRect();
      const relativeTop = itemRect.top - containerRect.top;
      const relativeLeft = itemRect.left - containerRect.left;
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Determine vertical anchor point
      /* let verticalOrigin = "center";
      let horizontalOrigin = "centeright";
      if (relativeTop < containerHeight * 0.33 && relativeLeft < containerWidth * 0.33) {
        verticalOrigin = "top";
        horizontalOrigin = "left";
        item.style.backgroundColor = "red";
      } else if (relativeTop < containerHeight * 0.33 && relativeLeft > containerWidth * 0.66) {
        verticalOrigin = "top";
        horizontalOrigin = "right";
        item.style.marginRight = "36px";
        item.style.backgroundColor = "yellow";
      } else if (relativeTop > containerHeight * 0.66 && relativeLeft > containerWidth * 0.66) {
        verticalOrigin = "bottom";
        horizontalOrigin = "right";
        item.style.marginRight = "36px";
        item.style.backgroundColor = "violet";
      } else if (relativeTop > containerHeight * 0.66 && relativeLeft < containerWidth * 0.66) {
        verticalOrigin = "bottom";
        horizontalOrigin = "left";
        item.style.backgroundColor = "blue";
      } else if (relativeTop > containerHeight * 0.66 && relativeLeft < containerWidth * 0.33) {
        verticalOrigin = "bottom";
        horizontalOrigin = "left";
        item.style.backgroundColor = "brown";
      } else if (relativeTop < containerHeight * 0.66 && relativeLeft < containerWidth * 0.33) {
        verticalOrigin = "bottom";
        horizontalOrigin = "left";
        item.style.backgroundColor = "green";
      } else if (relativeTop < containerHeight * 0.66 && relativeLeft > containerWidth * 0.33) {
        verticalOrigin = "bottom";
        horizontalOrigin = "right";
        item.style.backgroundColor = "rgba(115, 230, 115)";
      } else if (relativeTop > containerHeight * 0.66 && relativeLeft > containerWidth * 0.33) {
        verticalOrigin = "bottom";
        horizontalOrigin = "right";
        item.style.backgroundColor = "rgba(115, 20, 115)";
      }

      item.style.transformOrigin = `${horizontalOrigin} ${verticalOrigin}`; */

      let position = "";

      switch (true) {
        // TOP ROW (relatieTop < 3)
        case relativeTop < containerHeight * 0.33 &&
          relativeLeft < containerWidth * 0.66:
          position = "isTopLeft";
          break;
        case relativeTop < containerHeight * 0.33 &&
          relativeLeft > containerWidth * 0.33 &&
          relativeLeft < containerWidth * 0.66:
          position = "isTopCenter";
          break;
        case relativeTop < containerHeight * 0.33 &&
          relativeLeft > containerWidth * 0.66:
          position = "isTopRight";
          break;

        // MIDDLE ROW  (relativeTop between 3 and 6)
        case relativeTop < containerHeight * 0.66 &&
          relativeTop < containerHeight * 0.66 &&
          relativeLeft < containerWidth * 0.33:
          position = "isMiddleLeft";
        case relativeTop > containerHeight * 0.33 &&
          relativeTop < containerHeight * 0.66 &&
          relativeLeft > containerWidth * 0.33 &&
          relativeLeft < containerWidth * 0.66:
          position = "isMiddleCenter";
          break;
        case relativeTop > containerHeight * 0.33 &&
          relativeTop < containerHeight * 0.66 &&
          relativeLeft > containerWidth * 0.66:
          position = "isMiddleRight";
          break;

        // BOTTOM ROW (relativeTio > 6)
        case relativeTop > containerHeight * 0.66 &&
          relativeLeft < containerWidth * 0.33:
          position = "isBottomLeft";
          break;
        case relativeTop > containerHeight * 0.66 &&
          relativeLeft > containerWidth * 0.33 &&
          relativeLeft < containerWidth * 0.66:
          position = "isBottomCenter";
          break;
        case relativeTop > containerHeight * 0.66 &&
          relativeLeft > containerWidth * 0.66:
          position = "isBottomRight";
          break;

        default:
          position = "unknown";
      }

      if (position === "isTopLeft") {
        // item.style.backgroundColor = "red";
        item.style.transformOrigin = "left top";
      }
      if (position === "isTopCenter") {
        // item.style.backgroundColor = "yellow";
      }
      if (position === "isTopRight") {
        // item.style.backgroundColor = "green";
        item.style.transformOrigin = "right top";
      }
      if (position === "isMiddleLeft") {
        // item.style.backgroundColor = " blue";
      }
      if (position === "isMiddleCenter") {
        // item.style.backgroundColor = "orange";
        item.style.transformOrigin = "left center";
      }
      if (position === "isMiddleRight") {
        // item.style.backgroundColor = "greenyellow";
        item.style.transformOrigin = "right center";
      }
      if (position === "isBottomLeft") {
        // item.style.backgroundColor = "indigo";
        item.style.transformOrigin = "left bottom";
      }
      if (position === "isBottomCenter") {
        // item.style.backgroundColor = "gray";
        item.style.transformOrigin = "center bottom";
      }
      if (position === "isBottomRight") {
        // item.style.backgroundColor = "gold";
        item.style.transformOrigin = "right bottom";
      }

      /* if (relativeLeft < containerWidth * 0.33) {
        horizontalOrigin = "left";
      } else if (relativeLeft > containerWidth * 0.66) {
        horizontalOrigin = "right";
      }
      item.style.transformOrigin = `right ${verticalOrigin}`; */
    }
  });
});
document.addEventListener("click", () => {
  concurrentContainer.classList.remove("expand");
  concurrentItems.forEach((item) => {
    item.classList.remove("expand");
  });
});

function getCategoryNameFromHeader(header) {
  if (!header) return "";
  return Array.from(header.childNodes)
    .filter((node) => node.nodeType === 3)
    .map((node) => node.textContent.trim())
    .join(" ")
    .trim();
}

function createItemRow(quantity, price) {
  const row = document.createElement("div");
  row.className = "indie-item-info";
  row.innerHTML = `
    <div class="item-times">
      <h3>Qty: ${quantity}</h3>
    </div>
    <div class="list-item-price">
      <h3>• $${price.toFixed(2)}</h3>
    </div>
  `;
  return row;
}

function updateItemCardTotals(itemCardSec) {
  const itemRows = itemCardSec.querySelectorAll(".indie-item-info");
  let totalPrice = 0;
  let totalQty = 0;

  itemRows.forEach((row) => {
    const qtyEl = row.querySelector(".item-times h3");
    const priceEl = row.querySelector(".list-item-price h3");

    const qtyValue = qtyEl
      ? parseInt(qtyEl.textContent.replace("Qty:", ""))
      : 0;
    const priceValue = priceEl
      ? parseFloat(priceEl.textContent.replace("• $", ""))
      : NaN;

    if (!isNaN(qtyValue)) {
      totalQty += qtyValue;
    }
    if (!isNaN(priceValue)) {
      totalPrice += priceValue;
    }
  });

  const details = itemCardSec.querySelectorAll(".indie-item-details");
  if (details[0]) details[0].textContent = `${totalQty} items`;
  if (details[1]) details[1].textContent = `$${totalPrice.toFixed(2)}`;
}

function hashString(value) {
  return Array.from(String(value)).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
}

function getRandomAccentColor(seed = 0) {
  const hue = seed % 360;
  return {
    border: `hsl(${hue}, 82%, 52%)`,
    background: `hsla(${hue}, 85%, 90%, 1)`,
    backgroundFade: `hsla(${hue}, 85%, 80%, 0.9)`,
  };
}

function getItemInfoStates(itemName, category) {
  const base = hashString(itemName + category);
  const sources = [
    { label: "Insights", category: "insight", icon: "ℹ", url: "#insights" },
    { label: "Recipe", category: "recipe", icon: "⁜", url: "#recipe" },
    { label: "Trending", category: "trending", icon: "⇲", url: "#trending" },
    {
      label: "Marketplace",
      category: "purchase",
      icon: "⇘",
      url: "#marketplace",
    },
  ];

  const infoTypes = [
    {
      type: "warning",
      summary: "Low stock detected",
      followUp: "◬ Reorder before it runs out",
      full: `${itemName} may be low on availability soon. Add it to your next To-Get list before the price changes or stock drops.`,
    },
    {
      type: "recommendation",
      summary: "Good match for dinner",
      followUp: "◬ Try a fresh recipe idea",
      full: `${itemName} works nicely in a new recipe recommendation based on your recent shopping habits. Tap to explore ideas.`,
    },
    {
      type: "reminder",
      summary: "Use soon",
      followUp: "◬ Looks like it might expire",
      full: `${itemName} could be used soon. Check your kitchen stock and schedule it into one of your upcoming meals.`,
    },
  ];

  const times = ["◷ 2w ago", "◷ 2d ago", "◷ 12h ago", "◷ 1w ago", "◷ today"];

  return Array.from({ length: 3 }, (_, index) => {
    const source = sources[(base + index * 13) % sources.length];
    const infoType = infoTypes[(base + index * 7) % infoTypes.length];
    return {
      sourceLabel: source.label,
      sourceCategory: source.category,
      sourceIcon: source.icon,
      sourceUrl: source.url,
      infoType: infoType.type,
      infoMessage: infoType.summary,
      followUp: infoType.followUp,
      fullMessage: infoType.full,
      timeLabel: times[(base + index * 5) % times.length],
    };
  });
}

function getDateInfo(infoType) {
  switch (infoType) {
    case "warning":
      return { bg: "#fee2e2", color: "#b91c1c" };
    case "recommendation":
      return { bg: "#e6ffed", color: "#166534" };
    case "reminder":
      return { bg: "#fff7cd", color: "#92400e" };
    default:
      return { bg: "#eef2ff", color: "#4338ca" };
  }
}

function formatQuantity(quantity) {
  return `• ${quantity} item${quantity === 1 ? "" : "s"}`;
}

function updateCardInfoState(section, nextIndex = 0) {
  const rawStates = section.dataset.infoStates || "[]";
  const states = JSON.parse(rawStates);
  if (!states.length) return;

  const index = nextIndex % states.length;
  const state = states[index];

  section.dataset.infoIndex = index;

  const sourceBadge = section.querySelector(".source-badge");
  if (sourceBadge) {
    sourceBadge.className = `source-badge source-${state.sourceCategory}`;
    sourceBadge.dataset.sourceUrl = state.sourceUrl;
    sourceBadge.innerHTML = `
      <span class="source-icon">${state.sourceIcon}</span>
      <span class="source-label">${state.sourceLabel}</span>
    `;
  }

  const infoLine = section.querySelector(".info-line");
  if (infoLine) {
    infoLine.className = `info-line info-${state.infoType}`;
    infoLine.textContent = state.infoMessage;
  }

  const timeEl = section.querySelector(".time-item-added");
  if (timeEl) timeEl.textContent = state.timeLabel;

  const followEl = section.querySelector(".item-time-info");
  if (followEl) {
    const dateInfo = getDateInfo(state.infoType);
    followEl.textContent = state.followUp;
    followEl.style.background = dateInfo.bg;
    followEl.style.color = dateInfo.color;
  }

  const fullMessage = section.querySelector(".info-full-message");
  if (fullMessage) fullMessage.textContent = state.fullMessage;

  const sourceBtn = section.querySelector(".info-source-btn");
  if (sourceBtn) {
    sourceBtn.dataset.sourceUrl = state.sourceUrl;
    sourceBtn.innerHTML = `
      <span class="source-icon">${state.sourceIcon}</span>
      Open ${state.sourceLabel}
    `;
  }

  const expandable = section.querySelector(".info-expandable");
  if (expandable) expandable.classList.remove("open");
}

function initializeInfoListeners() {
  document.querySelectorAll(".item-info").forEach((infoBlock) => {
    if (infoBlock.dataset.infoListener === "true") return;
    infoBlock.dataset.infoListener = "true";

    infoBlock.addEventListener("click", (e) => {
      e.stopPropagation();
      const expandable = infoBlock.querySelector(".info-expandable");
      if (!expandable) return;
      expandable.classList.toggle("open");
    });

    infoBlock.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        infoBlock.click();
      }
    });
  });

  document
    .querySelectorAll(".info-source-btn, .source-badge")
    .forEach((button) => {
      if (button.dataset.sourceListener === "true") return;
      button.dataset.sourceListener = "true";

      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const url = button.dataset.sourceUrl;
        if (!url) return;
        window.location.href = url;
      });
    });
}

function initializeInfoRotation() {
  if (window.__planUpInfoRotation) {
    clearInterval(window.__planUpInfoRotation);
  }

  document
    .querySelectorAll(".item-card-sec[data-info-states]")
    .forEach((section) => {
      const currentIndex = parseInt(section.dataset.infoIndex, 10) || 0;
      updateCardInfoState(section, currentIndex);
    });

  window.__planUpInfoRotation = setInterval(() => {
    document
      .querySelectorAll(".item-card-sec[data-info-states]")
      .forEach((section) => {
        const currentIndex = parseInt(section.dataset.infoIndex, 10) || 0;
        updateCardInfoState(section, currentIndex + 1);
      });
  }, 10000);
}

function createItemCardSection(itemName, quantity, price) {
  const section = document.createElement("div");
  section.className = "item-card-sec";

  const accent = getRandomAccentColor(hashString(itemName));
  const infoStates = getItemInfoStates(itemName, "Other");
  section.dataset.infoStates = JSON.stringify(infoStates);
  section.dataset.infoIndex = "0";

  const dateInfo = getDateInfo(infoStates[0].infoType);

  section.innerHTML = `
    <div class="item-image-modal"></div>
    <div class="item-card">
      <div class="img" style="border-left-color: ${accent.border}; background-image: url(images/image1.jpg)"></div>
      <div class="details">
        <div class="item-name">${itemName}</div>
        <div class="item-info" tabindex="0" role="button">
          <div class="top-info">
            <div class="store-purchased-from source-badge source-${infoStates[0].sourceCategory}" data-source-url="${infoStates[0].sourceUrl}">
              <span class="source-icon">${infoStates[0].sourceIcon}</span>
              <span class="source-label">${infoStates[0].sourceLabel}</span>
            </div>
            <div class="store-info info-line info-${infoStates[0].infoType}">${infoStates[0].infoMessage}</div>
          </div>
          <div class="bottom-info">
            <div class="time-item-added" data-index="0">${infoStates[0].timeLabel}</div>
            <div class="item-time-info" style="background:${dateInfo.bg}; color:${dateInfo.color}">${infoStates[0].followUp}</div>
          </div>
          <div class="info-expandable">
            <div class="info-full-message">${infoStates[0].fullMessage}</div>
            <button type="button" class="info-source-btn" data-source-url="${infoStates[0].sourceUrl}">
              <span class="source-icon">${infoStates[0].sourceIcon}</span>
              Open ${infoStates[0].sourceLabel}
            </button>
          </div>
        </div>
      </div>
      <div class="item-summary">
        <div class="item-qty">${formatQuantity(quantity)}</div>
        <div class="item-price">$${price.toFixed(2)}</div>
      </div>
    </div>
  `;

  return section;
}

function createNewCategoryCardSection(category, itemName, quantity, price) {
  const newCategoryCard = document.createElement("div");
  newCategoryCard.innerHTML = `
    <div class="card-header">
      <div class="category-name"></div>
      ${category}
      <div class="category-card-sort-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 6v36M7 17.9l12-12m10 36.2v-36m0 36l12-12"/>
        </svg>
      </div>
    </div>
  `;
  newCategoryCard.appendChild(createItemCardSection(itemName, quantity, price));
  return newCategoryCard;
}

// ===== SORTING FUNCTIONALITY =====
let currentSortProperty = "date"; // default
let currentSortDirection = "desc"; // descending by default

sortPty.forEach((pty) => {
  pty.addEventListener("click", () => {
    // Remove active from all
    sortPty.forEach((p) => p.classList.remove("active"));
    // Add active to clicked
    pty.classList.add("active");

    // Get sort property from text content
    const sortText = pty.textContent.trim().toLowerCase();

    // Map text to property
    switch (sortText) {
      case "name":
        currentSortProperty = "name";
        break;
      case "date":
        currentSortProperty = "date";
        break;
      case "price":
        currentSortProperty = "price";
        break;
      case "qty":
        currentSortProperty = "qty";
        break;
      case "most used":
        currentSortProperty = "mostUsed";
        break;
      default:
        currentSortProperty = "date";
    }

    // Apply sorting
    sortAllCategories();

    // Close sort modal
    sortModal.classList.remove("show");
    sortOverlay.classList.remove("show");
  });
});

// Toggle sort direction when clicking the arrow icon
sortSvg.addEventListener("click", (e) => {
  e.stopPropagation();
  sortIndicator.classList.toggle("accend");

  // Toggle direction
  currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";

  // Re-apply sorting
  sortAllCategories();
});

// Main sorting function
function sortAllCategories() {
  const cardContainer = document.querySelector(".card-container");
  if (!cardContainer) return;

  const categoryCards = Array.from(
    cardContainer.querySelectorAll(".category-card"),
  );

  // Extract data from each category
  const categoriesData = categoryCards.map((card) => {
    const cardHeader = card.querySelector(".card-header");
    const categoryName = cardHeader
      ? cardHeader.textContent.trim().replace(/\s+/g, " ")
      : "";
    const totalPriceText =
      card.querySelector("#totalItemPrice")?.textContent?.trim() || "$0";
    const numItemsText =
      card.querySelector("#numOfItems")?.textContent?.trim() || "0 items";

    const totalPrice = parseFloat(totalPriceText.replace("$", "")) || 0;
    const numItems = parseInt(numItemsText.replace(" items", "")) || 0;

    // Calculate total qty by summing all qtys in the category
    const qtyElements = card.querySelectorAll(".item-times h3");
    let totalQty = 0;
    qtyElements.forEach((el) => {
      const qty = parseInt(el.textContent.replace("Qty:", "").trim()) || 0;
      totalQty += qty;
    });

    return {
      element: card,
      name: categoryName,
      totalPrice: totalPrice,
      totalQty: totalQty,
      mostUsed: totalPrice, // Use total price as "most used"
      date: 0, // Placeholder, since no date data
    };
  });

  // Sort based on current property and direction
  categoriesData.sort((a, b) => {
    let comparison = 0;

    switch (currentSortProperty) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "date":
        comparison = a.date - b.date; // Not really useful without dates
        break;
      case "price":
        comparison = a.totalPrice - b.totalPrice;
        break;
      case "qty":
        comparison = a.totalQty - b.totalQty;
        break;
      case "mostUsed":
        comparison = a.mostUsed - b.mostUsed;
        break;
    }

    // Apply sort direction
    return currentSortDirection === "asc" ? comparison : -comparison;
  });

  // Clear the container
  cardContainer.innerHTML = "";

  // Re-append categories in sorted order
  categoriesData.forEach((data) => {
    cardContainer.appendChild(data.element);
  });
}

function normalizeCategoryValue(value) {
  return String(value).toLowerCase().trim();
}

function filterCategories(filterCategory) {
  const cardContainer = document.querySelector(".card-container");
  if (!cardContainer) return;

  const categoryCards = Array.from(
    cardContainer.querySelectorAll(".category-card"),
  );
  let anyVisible = false;

  categoryCards.forEach((card) => {
    const cardHeader = card.querySelector(".card-header");
    const categoryName = normalizeCategoryValue(
      getCategoryNameFromHeader(cardHeader),
    );
    const shouldShow =
      filterCategory === "all" ||
      categoryName === normalizeCategoryValue(filterCategory);

    card.style.display = shouldShow ? "" : "none";
    if (shouldShow) anyVisible = true;
  });

  updateCategoryEmptyState();
  updateGlobalEmptyState();
  updateFilterSortVisibility(anyVisible);
}

function updateCategoryEmptyState() {
  const categoryCards = document.querySelectorAll(".category-card");

  categoryCards.forEach((card) => {
    const itemSections = card.querySelectorAll(".item-card-sec");
    const emptyMessage = card.querySelector(".empty-state-message");

    if (itemSections.length === 0) {
      if (!emptyMessage) {
        const message = document.createElement("div");
        message.className = "empty-state-message";
        message.textContent = "No items in this category yet.";
        card.appendChild(message);
      }
    } else if (emptyMessage) {
      emptyMessage.remove();
    }
  });
}

function updateGlobalEmptyState() {
  const cardContainer = document.querySelector(".card-container");
  if (!cardContainer) return;

  const visibleCards = Array.from(
    cardContainer.querySelectorAll(".category-card"),
  ).filter((card) => card.style.display !== "none");
  let globalMessage = cardContainer.querySelector(".empty-state-global");

  if (visibleCards.length === 0) {
    if (!globalMessage) {
      globalMessage = document.createElement("div");
      globalMessage.className = "empty-state-global";
      globalMessage.textContent = "Nothing added yet.";
      // globalMessage.textContent = "No items in your list.";
      cardContainer.appendChild(globalMessage);
    }
  } else if (globalMessage) {
    globalMessage.remove();
  }
}

function updateFilterSortVisibility(hasVisibleCategories = true) {
  const visibleCards = Array.from(
    document.querySelectorAll(".category-card"),
  ).filter((card) => card.style.display !== "none");
  const hasItems = visibleCards.some((card) =>
    card.querySelector(".item-card-sec"),
  );
  const showControls =
    hasVisibleCategories && visibleCards.length > 0 && hasItems;

  if (sortContainer) sortContainer.style.display = showControls ? "" : "none";
  if (filterBar) filterBar.style.display = showControls ? "" : "none";
}

// Sort items within a single category (commented out, now sorting categories)
// function sortCategoryItems(categoryCard) {
//   const itemList = categoryCard.querySelector('.item-list');
//   if (!itemList) return;

//   const itemName = categoryCard.querySelector('.item-name h2');
//   if (!itemName) return;

//   const mainItemName = itemName.textContent.trim();

//   // Get all indie-item-info elements
//   const items = Array.from(itemList.querySelectorAll('.indie-item-info'));

//   // Extract data from each item
//   const itemsData = items.map((item, index) => {
//     const qtyText = item.querySelector('.item-times h3')?.textContent || 'Qty: 0';
//     const priceText = item.querySelector('.list-item-price h3')?.textContent || '• $0';

//     const qty = parseInt(qtyText.replace('Qty:', '').trim()) || 0;
//     const price = parseFloat(priceText.replace('• $', '').trim()) || 0;

//     return {
//       element: item,
//       name: mainItemName,
//       qty: qty,
//       price: price,
//       date: index, // Use index as date (items added first have lower index)
//       mostUsed: qty * price // Calculate "most used" as qty × price
//     };
//   });

//   // Sort based on current property and direction
//   itemsData.sort((a, b) => {
//     let comparison = 0;

//     switch(currentSortProperty) {
//       case 'name':
//         comparison = a.name.localeCompare(b.name);
//         break;
//       case 'date':
//         comparison = a.date - b.date;
//         break;
//       case 'price':
//         comparison = a.price - b.price;
//         break;
//       case 'qty':
//         comparison = a.qty - b.qty;
//         break;
//       case 'mostUsed':
//         comparison = a.mostUsed - b.mostUsed;
//         break;
//     }

//     // Apply sort direction
//     return currentSortDirection === 'asc' ? comparison : -comparison;
//   });

//   // Clear the item list
//   itemList.innerHTML = '';

//   // Re-append items in sorted order
//   itemsData.forEach(data => {
//     itemList.appendChild(data.element);
//   });

//   // Update totals after sorting
//   updateCategoryTotals(categoryCard);
// }

// Auto-sort when new items are added
// ===== SAVE ITEM - FIXED FOR YOUR STRUCTURE =====
if (saveItemBtn) {
  saveItemBtn.addEventListener("click", () => {
    saveItemBtn.disabled = true;
    try {
      const itemNameInput = document.getElementById("itemNameInput");
      const quantityInput = document.getElementById("quantityInput");
      const priceInput = document.getElementById("priceInput");

      const itemName = itemNameInput?.value.trim() || "";
      const quantity = Math.max(1, parseInt(quantityInput?.value, 10) || 1);
      const price = parseFloat(priceInput?.value);
      const selectedCategory = document.querySelector(".category-item.active");
      const category = selectedCategory
        ? selectedCategory.textContent.trim() || "Other"
        : "Other";

      if (itemName.length === 0) {
        itemNameInput.focus();
      }

      if (!itemName) {
        showToast("Please enter an item name!");
        itemNameInput.style.borderColor = "red";
        itemNameInput.focus();
        if (itemName.length > 0) {
          itemNameInput.style.borderColor = "blue";
        }
        recordAdminMetric("errors", 1);
        recordAdminEvent("Invalid add attempt: missing item name");
        return;
      }

      if (isNaN(price) || price <= 0) {
        showToast("Please enter a valid price!");
        priceInput.style.borderColor = "red";
        priceInput.focus();
        recordAdminMetric("errors", 1);
        recordAdminEvent("Invalid add attempt: invalid price");
        return;
      }

      const normalizedName = itemName.toLowerCase();
      const normalizedCategory = category.toLowerCase();
      const cardContainer = document.querySelector(".card-container");
      const categoryCards = cardContainer
        ? cardContainer.querySelectorAll(".category-card")
        : [];
      let categoryCard = null;

      categoryCards.forEach((card) => {
        const cardHeader = card.querySelector(".card-header");
        const categoryName = getCategoryNameFromHeader(cardHeader);
        if (categoryName.toLowerCase() === normalizedCategory) {
          categoryCard = card;
        }
      });

      const existingDataItem = items.find(
        (item) =>
          item.name.toLowerCase() === normalizedName &&
          item.category.toLowerCase() === normalizedCategory,
      );

      const existingItemSection = categoryCard
        ? Array.from(categoryCard.querySelectorAll(".item-card-sec")).find(
          (section) => {
            const itemTitle = section.querySelector(".item-name");
            return (
              itemTitle &&
              itemTitle.textContent.trim().toLowerCase() === normalizedName
            );
          },
        )
        : null;

      let updatedQuantity = quantity;
      let updatedPrice = price;

      if (existingDataItem) {
        updatedQuantity = existingDataItem.quantity + quantity;
        updatedPrice = existingDataItem.price + price;
        existingDataItem.quantity = updatedQuantity;
        existingDataItem.price = updatedPrice;
        existingDataItem.updatedAt = new Date().toISOString();
      }

      if (existingItemSection) {
        const itemCard = existingItemSection.querySelector(".item-card");
        const qtyEl = itemCard?.querySelector(".item-qty");
        const priceEl = itemCard?.querySelector(".item-price");

        if (qtyEl) qtyEl.textContent = formatQuantity(updatedQuantity);
        if (priceEl) priceEl.textContent = `$${updatedPrice.toFixed(2)}`;

        existingItemSection.dataset.infoStates = JSON.stringify(
          getItemInfoStates(itemName, category),
        );
        updateCardInfoState(existingItemSection, 0);
      }

      if (!existingItemSection) {
        if (categoryCard) {
          categoryCard.appendChild(
            createItemCardSection(itemName, updatedQuantity, updatedPrice),
          );
        } else if (cardContainer) {
          const newCategoryCard = document.createElement("div");
          newCategoryCard.className = "category-card";
          newCategoryCard.appendChild(
            createNewCategoryCardSection(
              category,
              itemName,
              updatedQuantity,
              updatedPrice,
            ),
          );
          cardContainer.appendChild(newCategoryCard);
        }
      }

      if (!existingDataItem) {
        items.push({
          id: Date.now(),
          name: itemName,
          category: category,
          quantity: updatedQuantity,
          price: updatedPrice,
          timestamp: new Date().toISOString(),
          createdAt: new Date(),
          updatedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem("planup_items", JSON.stringify(items));
      recordAdminMetric("itemsAdded", 1);
      recordAdminEvent(`Item added: ${itemName} (${category})`);

      updateBudgetProgress();
      updateCategoryEmptyState();
      updateGlobalEmptyState();
      updateFilterSortVisibility();
      updateFilterBar();
      filterCategories(activeFilter);
      renderInsightsChart();

      setTimeout(() => {
        initializeSwipe();
        initializeCardExpansion();
        initializeImageModals();
      }, 100);

      closeModal();
      showToast("Item added successfully!");
    } catch (error) {
      console.error("Error saving item:", error);
      showToast("Error saving item. Please try again.");
      recordAdminMetric("errors", 1);
      recordAdminEvent(`Save item error: ${error.message}`);
    } finally {
      saveItemBtn.disabled = false;
    }
  });
}

// ===== CATEGORY SELECTION =====
const categoryItems = document.querySelectorAll(".category-item");
const autoCategorizeBtn = document.getElementById("autoCategorizeBtn");
const itemNameInput = document.getElementById("itemNameInput");

categoryItems.forEach((item) => {
  item.addEventListener("click", function () {
    categoryItems.forEach((cat) => cat.classList.remove("active"));
    this.classList.add("active");
  });
});

// Auto-categorize button handler
if (autoCategorizeBtn && itemNameInput) {
  autoCategorizeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const itemName = itemNameInput.value.trim();

    if (!itemName) {
      showToast("Please enter an item name first!");
      return;
    }

    // Get suggested category
    const suggestedCategory = suggestCategory(itemName);

    // Update active category
    categoryItems.forEach((cat) => cat.classList.remove("active"));
    const targetCategory = Array.from(categoryItems).find(
      (cat) =>
        cat.textContent.trim().toLowerCase() ===
        suggestedCategory.toLowerCase(),
    );

    if (targetCategory) {
      targetCategory.classList.add("active");
      showToast(`Auto-categorized as: ${suggestedCategory}`);
    } else {
      // If category doesn't exist, select the first one (default)
      if (categoryItems.length > 0) {
        categoryItems[0].classList.add("active");
      }
      showToast(`Suggested: ${suggestedCategory}`);
    }
  });
}

// ===== UPDATE CATEGORY TOTALS =====

function updateBudgetProgress() {
  if (!budgetCard || !progressFill) return;

  const allPrices = document.querySelectorAll(".item-price");
  let totalEstimated = 0;
  let totalItems = 0;

  allPrices.forEach((el) => {
    const price = parseFloat(el.textContent.replace("$", "").trim());
    if (!isNaN(price)) {
      totalEstimated += price;
      totalItems++;
    }
  });

  const budgetAmount = budget;
  const remaining = budgetAmount - totalEstimated;
  const percentage = (totalEstimated / budgetAmount) * 100;
  const avgPerItem = totalItems > 0 ? totalEstimated / totalItems : 0;
  const remainingLabel = document.getElementById("remainingLabel");

  const trendIcon = document.querySelector(".trend-icon");

  if (estimatesValue)
    estimatesValue.textContent = `$${totalEstimated.toFixed(2)}`;
  if (remainingValue)
    remainingValue.textContent = `$${Math.abs(remaining).toFixed(2)}`;
  if (avgSpending) avgSpending.textContent = `$${avgPerItem.toFixed(2)}`;
  if (itemCount) itemCount.textContent = `•${totalItems} items`;
  if (progressPercentage)
    progressPercentage.textContent = `${Math.round(percentage)}%`;

  // Animate progress bar
  progressFill.style.width = "0%";
  setTimeout(() => {
    progressFill.style.width = `${Math.min(percentage, 100)}%`;
  }, 50);

  // Update states
  budgetCard.className = "budget-card";
  if (trendIcon) trendIcon.className = "trend-icon";

  if (percentage < 70) {
    budgetCard.classList.add("normal");
    if (trendIcon) trendIcon.classList.add("normal");
    if (progressStatus) progressStatus.textContent = "On Track";
    budgetExceededNotified = false; // Reset notification flag
  } else if (percentage >= 70 && percentage < 100) {
    budgetCard.classList.add("warning");
    if (trendIcon) trendIcon.classList.add("warning");
    if (progressStatus) progressStatus.textContent = "Watch Spending";
    budgetExceededNotified = false; // Reset notification flag
  } else if (percentage === 100) {
    budgetCard.classList.add("warning");
    if (trendIcon) trendIcon.classList.add("warning");
    if (progressStatus) progressStatus.textContent = "Budget Reached";
    budgetExceededNotified = false;
  } else {
    budgetCard.classList.add("over");
    if (trendIcon) trendIcon.classList.add("over");
    if (progressStatus) progressStatus.textContent = "Over Budget!";
    remainingLabel.textContent = "Over budget";

    // Trigger notification when budget is exceeded (only once)
    if (!budgetExceededNotified) {
      showBudgetNotification();
      budgetExceededNotified = true;
    }
  }
}

function showBudgetNotification() {
  showNotification({
    message: "Budget exceeded!",
    type: "warning",
    icon: "budget",
    sound: "iphone",
    autoHide: true,
    onClick: () => {
      showNotificationPage();
    },
  });
}

function getNotificationIcon(type) {
  const icons = {
    budget: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    recipe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    food: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18M6 9v6M9 9v6M12 9v6M15 9v6M18 9v6"/></svg>`,
    tip: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-20C5.9 1 3 3.9 3 7c0 2.55 1.92 4.63 4.39 4.94.63 3.12.95 5.82 1.61 7.06H15c.66-1.24.98-3.94 1.61-7.06C19.08 11.63 21 9.55 21 7c0-3.1-2.9-6-6-6z"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  };
  return icons[type] || icons.info;
}

function showNotification(options) {
  const {
    message = "Notification",
    type = "info",
    icon = null,
    sound = "metal",
    autoHide = true,
    onClick = null,
  } = options;

  if (!notificationBar || !notificationBtn || !searchBar) return;

  // Delay notification appearance by 2 seconds
  setTimeout(() => {
    // Update notification message
    notificationMessage.textContent = message;

    // Shake the bell
    notificationBtn.classList.add("shake");
    setTimeout(() => notificationBtn.classList.remove("shake"), 500);

    // Show notification bar with animation
    notificationBar.classList.add("show");
    searchBar.classList.add("shrink");
    notificationMessage.classList.add("show");
    notificationBtn.classList.add("expand");

    // Play sound
    playNotificationSound(sound);

    // Make clickable
    if (onClick) {
      notificationBar.onclick = onClick;
    }

    // Auto-hide after 5 seconds
    if (autoHide) {
      setTimeout(() => {
        hideNotification();
      }, 5000);
    }
  }, 2000);

  // Add to active notifications immediately (not delayed)
  const notificationId = Date.now();
  activeNotifications.push({
    id: notificationId,
    message,
    type,
    icon: icon || type,
    timestamp: new Date(),
  });

  recordAdminMetric("notifications", 1);
  if (type === "error") {
    recordAdminMetric("errors", 1);
  }
  recordAdminEvent(`Notification: ${message}`);

  // Update notification page
  updateNotificationPage();
}

function hideNotification() {
  if (!notificationBar || !searchBar) return;

  notificationBar.classList.remove("show");
  searchBar.classList.remove("shrink");
  notificationMessage.classList.remove("show");
  notificationBtn.classList.remove("expand");

  setTimeout(() => {
    notificationMessage.textContent = "";
  }, 500);
}

function playNotificationSound(type = "metal") {
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "iphone") {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(950, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        820,
        audioContext.currentTime + 0.18,
      );
      gainNode.gain.setValueAtTime(0.18, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.35,
      );

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1400, audioContext.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.18,
      );
      gain2.gain.setValueAtTime(0.12, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.35,
      );

      gain2.connect(audioContext.destination);
      osc2.connect(gain2);

      const now = audioContext.currentTime;
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (type === "metal") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        330,
        audioContext.currentTime + 0.18,
      );
      gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.35,
      );
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.35);
    } else if (type === "chime") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4,
      );
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.4);
    } else {
      osc.type = "square";
      osc.frequency.setValueAtTime(720, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.3,
      );
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.3);
    }
  } catch (e) {
    console.log("Notification sound not supported");
  }
}

updateBudgetProgress();
updateCategoryEmptyState();
updateGlobalEmptyState();
updateFilterSortVisibility();
updateFilterBar(); // Initialize filter bar
filterCategories(activeFilter);
renderInsightsChart();

// UPDATE CATEGORY TOTALS
function updateCategoryTotals(card) {
  const allPrices = card.querySelectorAll(".item-price");
  let totalPrice = 0;
  let count = 0;

  allPrices.forEach((el) => {
    const price = parseFloat(el.textContent.replace("$", ""));
    if (!isNaN(price)) {
      totalPrice += price;
      count++;
    }
  });

  const itemDetails = card.querySelectorAll(".indie-item-details");
  if (itemDetails.length >= 2) {
    itemDetails[0].textContent = `${count} items`;
    itemDetails[1].textContent = `$${totalPrice.toFixed(2)}`;
  }
}

// CARD EXPANSION
function initializeCardExpansion() {
  document.querySelectorAll(".item-card").forEach((card) => {
    if (card.dataset.expansionInit === "true") return;
    card.dataset.expansionInit = "true";

    card.addEventListener("click", function (e) {
      if (this.classList.contains("dragging")) return;
      this.classList.toggle("expanded");
    });
  });
}

const imageModalOverlay = document.createElement("div");
imageModalOverlay.className = "item-image-modal-overlay";
document.body.appendChild(imageModalOverlay);

function closeAllImageModals() {
  document.querySelectorAll(".item-image-modal.show").forEach((modal) => {
    modal.classList.remove("show");
  });
  imageModalOverlay.classList.remove("show");
}

imageModalOverlay.addEventListener("click", closeAllImageModals);

// ITEM IMAGE MODAL
function initializeImageModals() {
  const imageCards = document.querySelectorAll(".item-image-card, .img");
  imageCards.forEach((card) => {
    if (card.dataset.imageListener === "true") return;
    card.dataset.imageListener = "true";

    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const section = card.closest(".item-card-sec");
      if (!section) return;
      const modal = section.querySelector(".item-image-modal");
      if (!modal) return;

      const itemName =
        section.querySelector(".item-name")?.textContent || "Item";
      const price = section.querySelector(".item-price")?.textContent || "";

      modal.innerHTML = `
        <div class="image-modal-title">${itemName}</div>
        <div class="image-modal-preview">
          <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 256 256">
            <path fill="currentColor" d="M82 56V24a6 6 0 0 1 12 0v32a6 6 0 0 1-12 0m38 6a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m32 0a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m94 58v8a38 38 0 0 1-36.94 38a94.55 94.55 0 0 1-31.13 44H208a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12h30.07A94.34 94.34 0 0 1 26 136V88a6 6 0 0 1 6-6h176a38 38 0 0 1 38 38m-44 16V94H38v42a82.27 82.27 0 0 0 46.67 74h70.66A82.27 82.27 0 0 0 202 136m32-16a26 26 0 0 0-20-25.29V136a93 93 0 0 1-1.69 17.64A26 26 0 0 0 234 128Z"/>
          </svg>
        </div>
        <div class="image-modal-description">${price}</div>
        <div class="image-modal-actions">
          <button type="button" class="image-modal-btn add-image-btn">Add Image</button>
          <button type="button" class="image-modal-btn take-photo-btn">Take Photo</button>
        </div>
      `;

      modal
        .querySelector(".add-image-btn")
        ?.addEventListener("click", (event) => {
          event.stopPropagation();
          showToast("Add image flow opened");
          closeAllImageModals();
        });

      modal
        .querySelector(".take-photo-btn")
        ?.addEventListener("click", (event) => {
          event.stopPropagation();
          showToast("Take photo flow opened");
          closeAllImageModals();
        });

      closeAllImageModals();
      modal.classList.add("show");
      imageModalOverlay.classList.add("show");
    });
  });
}

// SWIPE TO DELETE/DONE
function initializeSwipe() {
  const itemCards = document.querySelectorAll(".item-card");

  itemCards.forEach((card) => {
    if (card.hasAttribute("data-swipe-init")) return;
    card.setAttribute("data-swipe-init", "true");

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let dragStartTime = 0;

    card.style.transition = "transform 0.3s ease, background 0.3s ease";

    // TOUCH START
    card.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        dragStartTime = Date.now();
        card.classList.add("dragging");
        card.style.transition = "none";
      },
      { passive: true },
    );

    // TOUCH MOVE
    card.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        currentX = e.touches[0].clientX;
        const distance = currentX - startX;
        card.style.transform = `translateX(${distance}px)`;
      },
      { passive: true },
    );

    // TOUCH END
    card.addEventListener("touchend", () => {
      if (!isDragging) return;

      const distance = currentX - startX;
      const threshold = 60;
      const dragDuration = Date.now() - dragStartTime;
      const velocity = Math.abs(distance) / dragDuration;
      const isQuickSwipe = velocity > 0.5;

      card.classList.remove("dragging");

      if (distance < -threshold || (distance < -30 && isQuickSwipe)) {
        // SWIPED LEFT - Delete
        card.style.transform = "";
        card.style.transition = "";
        card.classList.add("deleted");

        setTimeout(() => {
          const categoryCard = card.closest(".category-card");
          if (categoryCard) {
            categoryCard.remove();
            updateBudgetProgress();
          }
        }, 500);
      } else if (distance > threshold || (distance > 30 && isQuickSwipe)) {
        // SWIPED RIGHT - Mark as done
        card.style.transform = "";
        card.style.transition = "";
        card.classList.add("mark-done");

        setTimeout(() => {
          const categoryCard = card.closest(".category-card");
          if (categoryCard) {
            categoryCard.remove();
            updateBudgetProgress();
          }
        }, 500);
      } else {
        // SNAP BACK
        card.style.transition =
          "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.3s ease";
        card.style.transform = "translateX(0)";
        card.style.background = "#F3F6F2";
      }

      isDragging = false;
    });
  });
}

// Initialize on page load
initializeSwipe();
initializeCardExpansion();
initializeImageModals();
initializeInfoListeners();
initializeInfoRotation();

// Watch for new cards
const cardObserver = new MutationObserver(() => {
  initializeSwipe();
  initializeCardExpansion();
  initializeImageModals();
  initializeInfoListeners();
});

const cardContainer = document.querySelector(".card-container");
if (cardContainer) {
  cardObserver.observe(cardContainer, {
    childList: true,
    subtree: true,
  });
}

// TOAST NOTIFICATION
function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2000);
}

// CLOSE FAB
function closeFab() {
  fab.classList.remove("expanded");
  fabMenu.classList.remove("expanded");
  overlay.classList.remove("show");
  fabCamera.classList.remove("visible");
}

// ===== SETTINGS PAGE FUNCTIONALITY =====
const settingsOptions = {
  "theme-toggle": () => {
    const body = document.body;
    body.classList.toggle("dark-mode");
    //if()
    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark" : "light",
    );
    showToast("Theme updated");
  },
  "notification-toggle": () => {
    showToast("Notifications updated");
  },
  "currency-setting": () => {
    showToast("Currency settings opened");
  },
  "budget-setting": () => {
    const newBudget = prompt("Enter new monthly budget:", budget);
    if (newBudget && !isNaN(newBudget)) {
      budget = parseFloat(newBudget);
      updateBudgetProgress();
      showToast(`Budget updated to $${budget}`);
    }
  },
  "export-data": () => {
    const data = {
      items: items,
      budget: budget,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "planup-data.json";
    a.click();
    showToast("Data exported");
  },
  "clear-data": () => {
    // Close settings and open the typed confirmation delete panel
    if (settingsPage) settingsPage.classList.remove("show");
    showDeletePanel();
  },
  "privacy-policy": () => {
    showToast("Opening privacy policy...");
  },
  "terms-service": () => {
    showToast("Opening terms of service...");
  },
  "contact-support": () => {
    showToast("Opening support...");
  },
  "rate-app": () => {
    showToast("Thank you for rating planUp!");
  },
};

// Attach settings handlers
Object.entries(settingsOptions).forEach(([id, handler]) => {
  document.getElementById(id)?.addEventListener("click", handler);
});

// ===== PROFILE PAGE FUNCTIONALITY =====
const profileActions = {
  "edit-profile": () => {
    showToast("Profile editing coming soon");
  },
  "upgrade-premium": () => {
    showToast("Premium features coming soon");
  },
  "share-profile": () => {
    showToast("Profile sharing coming soon");
  },
};

Object.entries(profileActions).forEach(([id, handler]) => {
  document.getElementById(id)?.addEventListener("click", handler);
});

const atPlaceBtn = document.querySelector(".at-place-btn");
const atPlaceText = document.querySelector(".at-place-text");
const atPlaceModal = document.querySelector(".at-place-modal");

if (atPlaceBtn) {
  atPlaceBtn.addEventListener("click", () => {
    atPlaceBtn.classList.toggle("expand");
  });
}
atPlaceText.innerText = "@" + "Home";

// ===== TOGGLE SWITCHES FUNCTIONALITY =====
// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    const body = document.body;
    body.classList.toggle("dark-mode");
    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark" : "light",
    );
    showToast(
      body.classList.contains("dark-mode")
        ? "Dark mode enabled"
        : "Light mode enabled",
    );
  });
}

// Notifications Toggle
const notifToggle = document.getElementById("notifToggle");
if (notifToggle) {
  notifToggle.addEventListener("change", () => {
    const status = notifToggle.checked ? "enabled" : "disabled";
    localStorage.setItem("notificationsEnabled", notifToggle.checked);
    showToast(`Notifications ${status}`);
  });
}

// Load saved toggle states
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" && darkModeToggle) {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
  }

  const notificationsEnabled = localStorage.getItem("notificationsEnabled");
  if (notificationsEnabled === "false" && notifToggle) {
    notifToggle.checked = false;
  }
  
  // Initialize favorites display and like buttons
  displayFavorites();
  initializeLikeButtons();
  updateLikeButtonStates();
  if (typeof setupInsightRecipeFavorites === "function") {
    setupInsightRecipeFavorites();
  }
  if (typeof renderToGetItems === "function") {
    renderToGetItems();
  }
});

// ===== PROFILE PAGE SCROLL EFFECT =====
const profFgHeader = document.querySelector(".prof-fg-header");
const profileName = document.querySelector(".profile-name");
const profileSub = document.querySelector(".profile-sub");

if (profileForeground) {
  let scrollTimeout;
  let currentProgress = 0;
  let isAnimating = false;

  profileForeground.style.setProperty("--scroll-progress", 0);

  profileForeground.addEventListener("scroll", () => {
    const scrollTop = profileForeground.scrollTop;
    currentProgress = Math.min(scrollTop / 80, 1); // 0 to 1 over 80px
    profileForeground.style.setProperty("--scroll-progress", currentProgress);

    // Toggle classes for header and text at 50px
    if (scrollTop > 50) {
      if (profFgHeader && !profFgHeader.classList.contains("small")) {
        profFgHeader.classList.add("small");
      }
      if (profileAvatar && !profileAvatar.classList.contains("small")) {
        profileAvatar.classList.add("small");
      }
      if (profileName && !profileName.classList.contains("small")) {
        profileName.classList.add("small");
      }
      if (profileSub && !profileSub.classList.contains("small")) {
        profileSub.classList.add("small");
      }
    } else {
      if (profFgHeader) profFgHeader.classList.remove("small");
      if (profileAvatar) profileAvatar.classList.remove("small");
      if (profileName) profileName.classList.remove("small");
      if (profileSub) profileSub.classList.remove("small");
    }

    // Clear existing timeout
    clearTimeout(scrollTimeout);

    // Detect when scrolling stops and complete animation with momentum
    scrollTimeout = setTimeout(() => {
      if (isAnimating) return;
      isAnimating = true;

      const targetProgress = currentProgress >= 0.5 ? 1 : 0;
      const startProgress = currentProgress;
      const startTime = performance.now();
      const duration = 300; // milliseconds for completion animation

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const newProgress =
          startProgress + (targetProgress - startProgress) * easeProgress;

        profileForeground.style.setProperty("--scroll-progress", newProgress);
        currentProgress = newProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Final state
          profileForeground.style.setProperty(
            "--scroll-progress",
            targetProgress,
          );
          currentProgress = targetProgress;

          // Ensure classes match final state
          const shouldBeSmall = targetProgress > 0.5;
          if (shouldBeSmall) {
            if (profFgHeader) profFgHeader.classList.add("small");
            if (profileAvatar) profileAvatar.classList.add("small");
            if (profileName) profileName.classList.add("small");
            if (profileSub) profileSub.classList.add("small");
          } else {
            if (profFgHeader) profFgHeader.classList.remove("small");
            if (profileAvatar) profileAvatar.classList.remove("small");
            if (profileName) profileName.classList.remove("small");
            if (profileSub) profileSub.classList.remove("small");
          }
          isAnimating = false;
        }
      };

      requestAnimationFrame(animate);
    }, 150); // Wait 150ms after scroll stops to start momentum animation
  });
}

// ===== NOTIFICATION PAGE FUNCTIONALITY =====
function showNotificationPage() {
  const notificationPage = document.getElementById("notificationPage");
  if (notificationPage) {
    notificationPage.classList.add("show");
    updateNotificationPage();
  }
}

function updateNotificationPage() {
  const notificationContent = document.querySelector(
    "#notificationPage .full-page-content",
  );
  if (!notificationContent) return;

  // Clear existing notifications
  const existingNotifications =
    notificationContent.querySelectorAll(".notification-item");
  existingNotifications.forEach((item) => item.remove());

  const emptyState = notificationContent.querySelector(".notification-empty");

  if (activeNotifications.length === 0) {
    // Show empty state
    if (emptyState) emptyState.style.display = "flex";
  } else {
    // Hide empty state and show notifications
    if (emptyState) emptyState.style.display = "none";

    // Sort notifications by timestamp (newest first)
    const sortedNotifications = [...activeNotifications].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    sortedNotifications.forEach((notification) => {
      const notificationItem = document.createElement("div");
      notificationItem.className = `notification-item ${notification.type}`;

      // Get icon based on type
      const iconSvg = getNotificationIcon(
        notification.icon || notification.type,
      );

      // Format timestamp
      const timeAgo = getTimeAgo(notification.timestamp);

      // Get title for the type
      const typeTitle = getNotificationTitle(notification.type);

      notificationItem.innerHTML = `
        <div class="notification-icon">
          ${iconSvg}
        </div>
        <div class="notification-text">
          <h3>${notification.message}</h3>
          <div class="notification-type-label ${notification.type}">
            ${typeTitle}
          </div>
          <div class="notification-summary">
          itemNameInput.value alone used over 10% of your budget. Check your insights to find more
          </div>
          <div class="time-container">
            <span class="notification-time">${timeAgo}</span>
          </div>
        </div>
      `;

      notificationContent.insertBefore(notificationItem, emptyState);
    });
  }
}

function getNotificationTitle(type) {
  const titles = {
    budget: "Budget Alert",
    recipe: "Recipe Tip",
    food: "Food",
    tip: "Tip",
    info: "Info",
    warning: "Warning",
    error: "Error",
    success: "Success",
  };
  return titles[type] || "Notification";
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Back button handler for notification page
document
  .getElementById("backFromNotifications")
  ?.addEventListener("click", () => {
    const notificationPage = document.getElementById("notificationPage");
    if (notificationPage) {
      notificationPage.classList.remove("show");
    }
  });

// ===== DASHBOARD FUNCTIONALITY =====
function showDashboard() {
  const dashboardPage = document.getElementById("dashboardPage");
  if (dashboardPage) {
    dashboardPage.classList.add("show");
    updateDashboard();
  }
}

function updateDashboard() {
  // Get all item prices
  const allPrices = document.querySelectorAll(".item-price");
  let totalSpent = 0;
  let itemCount = 0;

  allPrices.forEach((el) => {
    const price = parseFloat(el.textContent.replace("$", "").trim());
    if (!isNaN(price)) {
      totalSpent += price;
      itemCount++;
    }
  });

  // Update budget overview
  document.getElementById("dashboardTotalSpent").textContent =
    `$${totalSpent.toFixed(2)}`;
  document.getElementById("dashboardBudget").textContent =
    `$${budget.toFixed(2)}`;
  const remaining = budget - totalSpent;
  document.getElementById("dashboardRemaining").textContent =
    `$${remaining.toFixed(2)}`;

  // Update quick stats
  document.getElementById("dashboardItemCount").textContent = itemCount;
  const avgPrice = itemCount > 0 ? totalSpent / itemCount : 0;
  document.getElementById("dashboardAvgPrice").textContent =
    `$${avgPrice.toFixed(2)}`;

  const usageRate = ((totalSpent / budget) * 100).toFixed(0);
  document.getElementById("dashboardUsageRate").textContent = `${usageRate}%`;

  document.getElementById("adminTotalUsers").textContent =
    adminMetrics.totalUsers ?? 1;
  document.getElementById("adminLoginCount").textContent =
    adminMetrics.loginCount ?? 0;
  document.getElementById("adminErrorCount").textContent =
    adminMetrics.errors ?? 0;
  document.getElementById("adminNotificationsCount").textContent =
    adminMetrics.notifications ?? 0;

  updateAdminChart();
  updateAdminEvents();

  // Update category breakdown
  updateCategoryBreakdown();

  // Update recent items
  updateRecentItems();
}

function updateCategoryBreakdown() {
  const container = document.getElementById("categoryBreakdownContainer");
  container.innerHTML = "";

  const cardContainer = document.querySelector(".card-container");
  if (!cardContainer) return;

  const categoryCards = cardContainer.querySelectorAll(".category-card");
  if (categoryCards.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #999;">No items yet</p>`;
    return;
  }

  const categoryData = [];
  let maxValue = 0;

  categoryCards.forEach((card) => {
    const cardHeader = card.querySelector(".card-header");
    const categoryName = getCategoryNameFromHeader(cardHeader);
    const priceElements = card.querySelectorAll(".item-price");
    let categoryTotal = 0;

    priceElements.forEach((el) => {
      const price = parseFloat(el.textContent.replace("$", "").trim());
      if (!isNaN(price)) {
        categoryTotal += price;
      }
    });

    if (categoryTotal > 0) {
      categoryData.push({ name: categoryName, total: categoryTotal });
      maxValue = Math.max(maxValue, categoryTotal);
    }
  });

  categoryData.forEach((cat) => {
    const percentage = (cat.total / maxValue) * 100;
    const item = document.createElement("div");
    item.className = "category-breakdown-item";
    item.innerHTML = `
      <span class="category-name">${cat.name}</span>
      <div class="category-bar-container">
        <div class="category-bar-fill" style="width: ${percentage}%"></div>
      </div>
      <span class="category-amount">$${cat.total.toFixed(2)}</span>
    `;
    container.appendChild(item);
  });

  // Find top category
  if (categoryData.length > 0) {
    const topCat = categoryData.sort((a, b) => b.total - a.total)[0];
    document.getElementById("dashboardTopCategory").textContent = topCat.name;
  }
}

function updateRecentItems() {
  const container = document.getElementById("recentItemsContainer");
  container.innerHTML = "";

  // Get items from DOM (newest first)
  const itemCards = document.querySelectorAll(".item-card-sec");
  const recentItems = [];

  itemCards.forEach((card) => {
    const nameEl = card.querySelector(".item-name");
    const priceEl = card.querySelector(".item-price");
    const categoryCard = card.closest(".category-card");
    const categoryHeader = categoryCard?.querySelector(".card-header");
    const categoryName = getCategoryNameFromHeader(categoryHeader);

    if (nameEl && priceEl) {
      const price = parseFloat(priceEl.textContent.replace("$", "").trim());
      if (!isNaN(price)) {
        recentItems.push({
          name: nameEl.textContent.trim(),
          price: price,
          category: categoryName,
        });
      }
    }
  });

  if (recentItems.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #999;">No items yet</p>`;
    return;
  }

  // Show last 5 items
  recentItems.slice(0, 5).forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "recent-item";
    itemDiv.innerHTML = `
      <span class="recent-item-name">${item.name}</span>
      <span class="recent-item-price">$${item.price.toFixed(2)}</span>
      <span class="recent-item-category">${item.category}</span>
    `;
    container.appendChild(itemDiv);
  });
}

// Back button handler for dashboard
document.getElementById("backFromDashboard")?.addEventListener("click", () => {
  const dashboardPage = document.getElementById("dashboardPage");
  if (dashboardPage) {
    dashboardPage.classList.remove("show");
    adminMetrics.activeSessions = 0;
    saveAdminMetrics();
  }
});
