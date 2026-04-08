// ===== COMPLETE FIXED planUp JavaScript =====
// This file contains ALL fixes:
// ✅ Budget bar animation working
// ✅ Swipe-to-delete/done on item cards
// ✅ All navigation working
// ✅ Insights page working
// ✅ Profile account toggle working

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

  chartGrid.innerHTML = chartData
    .map(
      (item) => `
        <div class="admin-chart-item">
          <span class="admin-chart-label">${item.label}</span>
          <div class="admin-chart-bar" style="width: ${Math.min(item.value * 12 + 20, 100)}%; background: ${item.color};"></div>
          <span class="admin-chart-value">${item.value}</span>
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
const schedulePage = document.getElementById("schedulePage");
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
    div.onclick = () => {
      selectedRange = opt;
      rangeText.textContent = opt;
      closeRangeModal();
    };
    rangeModal.appendChild(div);
  });

  /*const rect = rangeText.getBoundingClientRect();
  rangeModal.style.top = rect.bottom + window.scrollY + 6 + "px";
  rangeModal.style.left = rect.left + window.scrollX + "px";*/

  rangeModal.classList.add("open");
}

function closeRangeModal() {
  if (rangeModal) rangeModal.classList.remove("open");
}

function getRangeStart(period, range) {
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
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

updatePeriodMenu();

breakdownByPriceBtn.addEventListener("click", () => {
  breakdownByPriceBtn.classList.add("expanded");
  breakdownOverlay.classList.add("show");
});
breakdownOverlay.addEventListener("click", () => {
  breakdownByPriceBtn.classList.remove("expanded");
  breakdownOverlay.classList.remove("show");
});

let currentOption = "By used budget" ? "By used budget" : "By total budget";
let priceOption = ["By used budget", "By total budget"];

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

    /*if (toggler.id === "exportToggler") {
      showToast("Export list toggled");
    } else if (toggler.id === "budgetAlertsToggler") {
      showToast("Budget alerts toggled");
    }*/
  });
});

const profileAvatar = document.getElementById("profileAvatar");

const settingsIcon = document.getElementById("settingsIcon");
const settingsPage = document.getElementById("settingsPage");

const dataMangementToggle = document.getElementById("dataMangementToggle");

settingsIcon.addEventListener("click", () => {
  settingsPage.classList.add("show");
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
  notificationPage.classList.add("show");
});

// ===== BACK BUTTONS =====
const backFromPage = document.querySelectorAll(".back-btn");

function closePage() {
  if (notificationPage) notificationPage.classList.remove("show");
  if (toGetListPage) toGetListPage.classList.remove("show");
  if (favoritesPage) favoritesPage.classList.remove("show");
  if (schedulePage) schedulePage.classList.remove("show");
  if (recipePage) recipePage.classList.remove("show");
  if (feedbackPage) feedbackPage.classList.remove("show");
  if (settingsPage) settingsPage.classList.remove("show");
}

backFromPage.forEach((arrow) => {
  arrow.addEventListener("click", closePage);
});

// ===== DRAWER MENU ITEMS =====
const toGetListBtn = document.getElementById("toGetListBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const historyBtn = document.getElementById("historyBtn");
const dashboardBtn = document.getElementById("dashboardBtn");
const scheduleBtn = document.getElementById("scheduleBtn");

const addToGet = document.getElementById("addToGet");

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
const favIngTab = document.getElementById("favIngTab");
const favRecTab = document.getElementById("favRecTab");
const favIngBtn = document.getElementById("favIngredientsBtn");
const favRecBtn = document.getElementById("favRecipeBtn");
const favFiltBtn = document.querySelectorAll(".fav-filter-btn");

favIngredientsBtn.addEventListener("click", () => {
  favFilterContainer.classList.add("ingred");
  favFilterContainer.classList.remove("recipe");
  /*favIngBtn.classList.add('active');
   */
  favRecBtn.classList.remove("active");
  favRecTab.style.transform = "scale(70%)";
  favIngTab.style.transform = "scale(100%)";
  favRecTab.style.transition = ".3s ease";
  favIngTab.style.transition = ".2s ease";
});

favRecipeBtn.addEventListener("click", () => {
  favFilterContainer.classList.add("recipe");
  favFilterContainer.classList.remove("ingred");
  /*favIngBtn.classList.remove('active');
  favRecBtn.classList.add('active');*/
  favIngTab.style.transform = "scale(70%)";
  favRecTab.style.transform = "scale(100%)";
  favIngTab.style.transition = ".3s ease";
  favRecTab.style.transition = ".3s ease";
});

favFiltBtn.forEach((filtBtn) => {
  filtBtn.addEventListener("click", () => {
    favFiltBtn.forEach((filtBtn) => filtBtn.classList.remove("active"));
    filtBtn.classList.add("active");
  });
});

if (scheduleBtn) {
  scheduleBtn.addEventListener("click", () => {
    schedulePage.classList.add("show");

    closeMenu();
  });
}

if (feedbackBtn) {
  feedbackBtn.addEventListener("click", () => {
    feedbackPage.classList.add("show");
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

if (recipeBtn) {
  recipeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    recipePage.classList.add("show");
    closeFab();
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
      full: `This ${itemName} may be low on availability soon. Add it to your next shopping list before the price changes or stock drops.`,
    },
    {
      type: "recommendation",
      summary: "Good match for dinner",
      followUp: "◬ Try a fresh recipe idea",
      full: `This ${itemName} works nicely in a new recipe recommendation based on your recent shopping habits. Tap to explore ideas.`,
    },
    {
      type: "reminder",
      summary: "Use soon",
      followUp: "◬ Looks like it might expire",
      full: `This ${itemName} could be used soon. Check your kitchen stock and schedule it into one of your upcoming meals.`,
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
  if (followEl) followEl.textContent = state.followUp;

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

  section.innerHTML = `
    <div class="item-image-modal"></div>
    <div class="item-card">
      <div class="img" style="border-color: ${accent.border}; background: linear-gradient(145deg, ${accent.background}, ${accent.backgroundFade});">
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 256 256">
          <path fill="currentColor" d="M82 56V24a6 6 0 0 1 12 0v32a6 6 0 0 1-12 0m38 6a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m32 0a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m94 58v8a38 38 0 0 1-36.94 38a94.55 94.55 0 0 1-31.13 44H208a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12h30.07A94.34 94.34 0 0 1 26 136V88a6 6 0 0 1 6-6h176a38 38 0 0 1 38 38m-44 16V94H38v42a82.27 82.27 0 0 0 46.67 74h70.66A82.27 82.27 0 0 0 202 136m32-16a26 26 0 0 0-20-25.29V136a93 93 0 0 1-1.69 17.64A26 26 0 0 0 234 128Z"/>
        </svg>
      </div>
      <div class="details">
        <div class="item-name">${itemName}</div>
        <div class="item-info" tabindex="0" role="button">
          <div class="top-info">
            <div class="source-badge source-${infoStates[0].sourceCategory}" data-source-url="${infoStates[0].sourceUrl}">
              <span class="source-icon">${infoStates[0].sourceIcon}</span>
              <span class="source-label">${infoStates[0].sourceLabel}</span>
            </div>
            <div class="info-line info-${infoStates[0].infoType}">${infoStates[0].infoMessage}</div>
          </div>
          <div class="bottom-info">
            <div class="time-item-added">${infoStates[0].timeLabel}</div>
            <div class="item-time-info">${infoStates[0].followUp}</div>
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
    try {
      const itemName = document.getElementById("itemNameInput").value.trim();
      const quantity =
        parseInt(document.getElementById("quantityInput").value) || 1;
      const price = parseFloat(document.getElementById("priceInput").value);

      // Get selected category
      const selectedCategory = document.querySelector(".category-item.active");
      const category = selectedCategory
        ? selectedCategory.textContent.trim()
        : "Other";

      // Validation
      if (!itemName) {
        showToast("Please enter an item name!");
        recordAdminMetric("errors", 1);
        recordAdminEvent("Invalid add attempt: missing item name");
        return;
      }

      if (!price || isNaN(price) || price <= 0) {
        showToast("Please enter a valid price!");
        recordAdminMetric("errors", 1);
        recordAdminEvent("Invalid add attempt: invalid price");
        return;
      }

      console.log("Adding item:", { itemName, category, quantity, price });

      // Find existing category or create new one
      const cardContainer = document.querySelector(".card-container");
      const categoryCards = document.querySelectorAll(".category-card");
      let categoryFound = false;

      categoryCards.forEach((card) => {
        const cardHeader = card.querySelector(".card-header");
        const categoryName = getCategoryNameFromHeader(cardHeader);

        if (categoryName.toLowerCase() === category.toLowerCase()) {
          categoryFound = true;

          const existingItemSection = Array.from(
            card.querySelectorAll(".item-card-sec"),
          ).find((section) => {
            const itemTitle = section.querySelector(".item-name");
            return (
              itemTitle &&
              itemTitle.textContent.trim().toLowerCase() ===
                itemName.toLowerCase()
            );
          });

          if (existingItemSection) {
            const itemCard = existingItemSection.querySelector(".item-card");
            const qtyEl = itemCard?.querySelector(".item-qty");
            const priceEl = itemCard?.querySelector(".item-price");
            const currentQty = qtyEl
              ? parseInt(qtyEl.textContent.replace(/[^0-9]/g, "")) || 0
              : 0;
            const currentPrice = priceEl
              ? parseFloat(priceEl.textContent.replace(/[^0-9\.]/g, "")) || 0
              : 0;
            const newQty = currentQty + quantity;
            const newPrice = currentPrice + price;

            if (qtyEl)
              qtyEl.textContent = `• ${newQty} item${newQty === 1 ? "" : "s"}`;
            if (priceEl) priceEl.textContent = `$${newPrice.toFixed(2)}`;

            existingItemSection.dataset.infoStates = JSON.stringify(
              getItemInfoStates(itemName, category),
            );
            updateCardInfoState(existingItemSection, 0);

            const existingDataItem = items.find(
              (item) =>
                item.name.toLowerCase() === itemName.toLowerCase() &&
                item.category.toLowerCase() === category.toLowerCase(),
            );

            if (existingDataItem) {
              existingDataItem.quantity = newQty;
              existingDataItem.price = newPrice;
              existingDataItem.updatedAt = new Date().toISOString();
            }
          } else {
            const newItemSection = createItemCardSection(
              itemName,
              quantity,
              price,
            );
            card.appendChild(newItemSection);
          }
        }
      });

      if (!categoryFound && cardContainer) {
        const newCategoryCard = document.createElement("div");
        newCategoryCard.className = "category-card";
        newCategoryCard.appendChild(
          createNewCategoryCardSection(category, itemName, quantity, price),
        );
        cardContainer.appendChild(newCategoryCard);
      }

      // Store item with timestamp
      const itemData = {
        id: Date.now(),
        name: itemName,
        category: category,
        quantity: quantity,
        price: price,
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
      };
      items.push(itemData);
      localStorage.setItem("planup_items", JSON.stringify(items));
      recordAdminMetric("itemsAdded", 1);
      recordAdminEvent(`Item added: ${itemName} (${category})`);

      // Update budget progress
      updateBudgetProgress();
      updateCategoryEmptyState();
      updateGlobalEmptyState();
      updateFilterSortVisibility();
      updateFilterBar(); // Update filter bar with new categories
      filterCategories(activeFilter);

      // Re-initialize interactions
      setTimeout(() => {
        initializeSwipe();
        initializeCardExpansion();
        initializeImageModals();
      }, 100);

      // Close modal and show success
      closeModal();
      showToast("Item added successfully!");
    } catch (error) {
      console.error("Error saving item:", error);
      showToast("Error saving item. Please try again.");
      recordAdminMetric("errors", 1);
      recordAdminEvent(`Save item error: ${error.message}`);
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
    sound: "metal",
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
  }, 2000); // 2 second delay

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

    if (type === "metal") {
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
  const cards = document.querySelectorAll(".item-card");

  cards.forEach((card) => {
    // Remove old listeners to prevent duplicates
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);

    newCard.addEventListener("click", function (e) {
      // Don't expand if swiping
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

// ===== TOAST NOTIFICATION =====
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

// ===== SETTINGS PAGE FUNCTIONALITY =====
const settingsOptions = {
  "theme-toggle": () => {
    const body = document.body;
    body.classList.toggle("dark-mode");
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
    if (
      confirm("Are you sure you want to clear all data? This cannot be undone.")
    ) {
      localStorage.clear();
      location.reload();
    }
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

const text = document.querySelector(".text");
const expandModal = document.querySelector(".expand-modal");

if (text && expandModal) {
  text.addEventListener("click", () => {
    expandModal.classList.toggle("expanded");
  });
}

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

      const targetProgress = currentProgress > 0.5 ? 1 : 0;
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
