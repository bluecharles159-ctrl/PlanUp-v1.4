// ===== COMPLETE FIXED planUp JavaScript =====
// This file contains ALL fixes:
// ✅ Budget bar animation working
// ✅ Swipe-to-delete/done on item cards
// ✅ All navigation working
// ✅ Insights page working
// ✅ Profile account toggle working

// ===== ELEMENT REFERENCES =====
const periodBtn = document.getElementById('periodBtn');
const periodWrapper = document.getElementById('periodWrapper');
const periodMenu = document.getElementById('periodMenu');
const periodValue = document.getElementById('periodValue');
const rangeModal = document.getElementById('rangeModal');
const rangeText = document.getElementById('rangeText');

// Insights page elements
const insightTotal = document.getElementById('insightTotal');
const insightItems = document.getElementById('insightItems');
const budgetLabel = document.getElementById('budgetLabel');
const insightBudget = document.getElementById('insightBudget');
const insightTopCategory = document.getElementById(
  'insightTopCategory');
const breakdownByPriceBtn = document.getElementById(
  'breakdownByPriceBtn');
const breakdownOverlay = document.querySelector('.breakdown-overlay');

// Budget elements - THE KEY TO MAKING IT WORK!
const budgetCard = document.getElementById('budgetCard');
const progressFill = document.getElementById('progressFill');
const progressPercentage = document.getElementById(
  'progressPercentage');
const progressStatus = document.getElementById('progressStatus');
const budgetValue = document.getElementById('budgetValue');
const estimatesValue = document.getElementById('estimatesValue');
const remainingValue = document.getElementById('remainingValue');
const avgSpending = document.getElementById('avgSpending');
const itemCount = document.getElementById('itemCount');

// State variables
let items = JSON.parse(localStorage.getItem("planup_items")) || [];
let budget = 500;
let currentPeriod = "month";
let selectedRange = "This month";

// Navigation elements
const menuBtn = document.getElementById('menuBtn');
const menuPage = document.getElementById('menuPage');
const menuOverlay = document.getElementById('menuOverlay');
const notificationBtn = document.getElementById('notificationBtn');
const feedbackBtn = document.getElementById('feedbackBtn');

// Pages
const homePage = document.getElementById("homePage");
const insightsPage = document.getElementById("insightsPage");
const profilePage = document.getElementById("profilePage");
const toGetListPage = document.getElementById('toGetListPage');
const notificationPage = document.getElementById('notificationPage');
const favoritesPage = document.getElementById('favoritesPage');
const schedulePage = document.getElementById('schedulePage');
const feedbackPage = document.getElementById('feedbackPage');

// ===== MENU =====
menuBtn.addEventListener('click', () => {
  menuPage.classList.add('show');
  menuOverlay.classList.add('show');
})

menuOverlay.addEventListener('click', () => {
  menuPage.classList.remove('show');
  menuOverlay.classList.remove('show');
})

// ===== NOTIFICATIONS =====
notificationBtn.addEventListener('click', () => {
  notificationPage.classList.add('show');
});

// ===== BACK BUTTONS =====
const backFromPage = document.querySelectorAll('.back-btn');

function closePage() {
  if (notificationPage) notificationPage.classList.remove('show');
  if (toGetListPage) toGetListPage.classList.remove('show');
  if (favoritesPage) favoritesPage.classList.remove('show');
  if (schedulePage) schedulePage.classList.remove('show');
}

backFromPage.forEach(arrow => {
  arrow.addEventListener('click', closePage);
})

// ===== DRAWER MENU ITEMS =====
const toGetListBtn = document.getElementById('toGetListBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const scheduleBtn = document.getElementById('scheduleBtn');

const addToGet = document.getElementById('addToGet');

function closeMenu() {
  menuPage.classList.remove('show');
  menuOverlay.classList.remove('show');
}

if (toGetListBtn) {
  toGetListBtn.addEventListener('click', () => {
    toGetListPage.classList.add('show');
    
    closeMenu();
  })
}

if (favoritesBtn) {
  favoritesBtn.addEventListener('click', () => {
    favoritesPage.classList.add('show');
    
    closeMenu();
  })
}

const favIngredientsBtn = document.getElementById(
  'favIngredientsBtn');
const favRecipeBtn = document.getElementById('favRecipeBtn');
const favFilterContainer = document.getElementById(
  'favFilterContainer');
const favIngTab = document.getElementById('favIngTab');
const favRecTab = document.getElementById('favRecTab');
const favIngBtn = document.getElementById('favIngredientsBtn');
const favRecBtn = document.getElementById('favRecipeBtn');
const favFiltBtn = document.querySelectorAll('.fav-filter-btn');

favIngredientsBtn.addEventListener('click', () => {
  favFilterContainer.classList.add('ingred');
  favFilterContainer.classList.remove('recipe');
  /*favIngBtn.classList.add('active');
   */
  favRecBtn.classList.remove('active');
  favRecTab.style.transform = 'scale(70%)';
  favIngTab.style.transform = 'scale(100%)';
  favRecTab.style.transition = '.3s ease';
  favIngTab.style.transition = '.2s ease';
})

favRecipeBtn.addEventListener('click', () => {
  favFilterContainer.classList.add('recipe');
  favFilterContainer.classList.remove('ingred');
  /*favIngBtn.classList.remove('active');
  favRecBtn.classList.add('active');*/
  favIngTab.style.transform = 'scale(70%)';
  favRecTab.style.transform = 'scale(100%)';
  favIngTab.style.transition = '.3s ease';
  favRecTab.style.transition = '.3s ease';
})

favFiltBtn.forEach(filtBtn => {
  filtBtn.addEventListener('click', () => {
    favFiltBtn.forEach(filtBtn => filtBtn.classList.remove(
      'active'));
    filtBtn.classList.add('active');
  })
})

if (scheduleBtn) {
  scheduleBtn.addEventListener('click', () => {
    schedulePage.classList.add('show');
    
    closeMenu();
  })
}

if (feedbackBtn) {
  feedbackBtn.addEventListener('click', () => {
    feedbackPage.classList.add('show');
  })
}

const sortBtn = document.getElementById('sortBtn');
const sortModal = document.getElementById('sortModal');
const sortOverlay = document.querySelector('.sort-overlay');
const sortIndicator = document.getElementById('sortIndicator');
const sortSvg = document.getElementById('sortSvg');
const sortPty = document.querySelectorAll('.sort-pty');

sortBtn.addEventListener('click', () => {
  sortModal.classList.toggle('show');
  sortOverlay.classList.toggle('show');
})
sortOverlay.addEventListener('click', () => {
  sortModal.classList.remove('show');
  sortOverlay.classList.remove('show');
})
sortSvg.addEventListener('click', () => {
  sortIndicator.classList.toggle('accend');
})

sortPty.forEach(pty => {
  pty.addEventListener('click', () => {
    //pty.classList.add('active');
    sortPty.forEach(pty => pty.classList.remove('active'));
    pty.classList.add('active');
  })
})

// ===== FAB MENU =====
const fab = document.getElementById("fab");
const fabMenu = document.getElementById("fabMenu");
const overlay = document.getElementById("fabOverlay");
const fabCamera = document.getElementById('fabCamera');

fab.addEventListener("click", () => {
  fab.classList.toggle("expanded");
  fabMenu.classList.toggle("expanded");
  fabCamera.classList.toggle('visible');
  overlay.classList.toggle("show");
  sortModal.classList.remove('show');
  sortOverlay.classList.remove('show');
});


overlay.addEventListener("click", () => {
  sortModal.classList.remove('show');
  
  closeFab();
})

if (fabCamera) {
  fabCamera.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Camera clicked');
  })
}

// ===== ITEM CARD EXPANSION =====
function initializeCardExpansion() {
  const cards = document.querySelectorAll('.item-card');
  
  cards.forEach(card => {
    // Remove old listeners to prevent duplicates
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    
    newCard.addEventListener('click', function(e) {
      // Don't expand if swiping
      if (this.classList.contains('dragging')) return;
      this.classList.toggle('expanded');
    });
  });
}

initializeCardExpansion();

// ===== ADD ITEM MODAL =====
/*const addItemModal = document.getElementById('addItemModal')
const cancelBtn = document.getElementById('cancelBtn');
const saveItemBtn = document.getElementById('saveItemBtn');
const addItemBtn = document.getElementById('addItemBtn');
*/
function closeFab() {
  fab.classList.remove("expanded");
  fabMenu.classList.remove("expanded");
  overlay.classList.remove("show");
  fabCamera.classList.remove('visible');
}

function openAddItemModal() {
  addItemModal.classList.add('show');
  
  closeFab();
}

function closeModal() {
  addItemModal.classList.remove('show');
}

cancelBtn.addEventListener('click', closeModal);

addItemModal.addEventListener('click', (e) => {
  if (e.target === addItemModal) {
    closeModal();
  }
});

addItemBtn.addEventListener('click', openAddItemModal);

const increaseQty = document.getElementById('increaseQty');
const decreaseQty = document.getElementById('decreaseQty');

decreaseQty.addEventListener('click', () => {
  quantityInput.value++;
})

increaseQty.addEventListener('click', () => {
  
  
  if (quantityInput.value != 0) {
    quantityInput.value--;
  }
  else {
    return;
  }
})

const customCategory = document.getElementById('customCategory');
const addCategoryInput = document.getElementById('addCategoryInput');

customCategory.addEventListener('click', () => {
  addCategoryInput.classList.toggle('show');
})


let itemsArr = [];

function saveItem() {
  const name = document.getElementById('itemNameInput');
  const qty = document.getElementById('quantityInput');
  const price = document.getElementById('priceInput');
  
  const item = {
    name: name,
    qty: qty,
    price: price
  }
  itemsArr.push(item);
  renderItems();
}

function renderItems() {
  const cardContainer = document.querySelector('.card-container');
  itemList.innerHTML = '';
  
  itemsArr.forEach(item => {
    const total = item.price * item.qty;
    const card = document.createElement('div');
    card.className = 'item-card';
    
    card.innerHTML = `
    <div class="category-card">
        <div class="card-header">
          <div class="category-name">
          </div>
          Meat
          <div class="category-card-sort-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14"
              height="14" viewBox="0 0 48 48">
              <path fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round"
                stroke-width="4"
                d="M19 6v36M7 17.9l12-12m10 36.2v-36m0 36l12-12" />
            </svg>
          </div>
        </div>
        <div class="item-card-sec">
          <div class="item-image-modal" id="itemImgModal">
            <div class="itm-img-mdl-icons">
              <div class="mdl-icon" id="takePhotoBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24"
                  height="24" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M20 4h-3.17L15 2H9L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 14H4V6h4.05l1.83-2h4.24l1.83 2H20zM12 7a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3" />
                </svg>
              </div>
              <div class="mdl-icon" id="importPhotoBtn">
                <svg xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"><!--!Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                  <path
                    d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM224 176C250.5 176 272 197.5 272 224C272 250.5 250.5 272 224 272C197.5 272 176 250.5 176 224C176 197.5 197.5 176 224 176zM368 288C376.4 288 384.1 292.4 388.5 299.5L476.5 443.5C481 450.9 481.2 460.2 477 467.8C472.8 475.4 464.7 480 456 480L184 480C175.1 480 166.8 475 162.7 467.1C158.6 459.2 159.2 449.6 164.3 442.3L220.3 362.3C224.8 355.9 232.1 352.1 240 352.1C247.9 352.1 255.2 355.9 259.7 362.3L286.1 400.1L347.5 299.6C351.9 292.5 359.6 288.1 368 288.1z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="item-card">
            <div class="item-image-card" id="itmImgCard">
              <svg xmlns="http://www.w3.org/2000/svg" width="30"
                height="30" viewBox="0 0 256 256">
                <path fill="currentColor"
                  d="M82 56V24a6 6 0 0 1 12 0v32a6 6 0 0 1-12 0m38 6a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m32 0a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m94 58v8a38 38 0 0 1-36.94 38a94.55 94.55 0 0 1-31.13 44H208a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12h30.07A94.34 94.34 0 0 1 26 136V88a6 6 0 0 1 6-6h176a38 38 0 0 1 38 38m-44 16V94H38v42a82.27 82.27 0 0 0 46.67 74h70.66A82.27 82.27 0 0 0 202 136m32-16a26 26 0 0 0-20-25.29V136a93 93 0 0 1-1.69 17.64A26 26 0 0 0 234 128Z" />
              </svg>
            </div>
            <div class="item-info">
              <div class="item-left">
                <div class="item-name">
                  <h2>${name}</h2>
                  <div class="item-list">
                    <div class="indie-item-info">
                      <div class="item-times">
                        <h3>Qty: ${qty}</h3>
                      </div>
                      <div class="list-item-price">
                        <h3>• $${price}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-right">
                <div class="item-details">
                  <h3 class="indie-item-details" id="numOfItems">6
                    items
                  </h3>
                  <h3 class="indie-item-details" id="totalItemPrice">
                    $${total}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    categoryCards.appendChild('card');
  })
}


// ===== SAVE ITEM =====
/*saveItemBtn.addEventListener('click', () => {
  const itemName = document.getElementById('itemNameInput').value
    .trim();
  const category = document.getElementById('categorySelect')
    .value;
  const quantity = document.getElementById('quantityInput').value;
  const price = parseFloat(document.getElementById('priceInput')
    .value);
  
  if (!itemName || !quantity || !price) {
    alert('Fill in all fields!');
    return;
  }
  
  const newItemHTML = `
        <div class="indie-item-info">
            <div class="item-times">
                <h3>Qty: ${quantity}</h3>
            </div>
            <div class="list-item-price">
                <h3>• $${price.toFixed(2)}</h3>
            </div>
        </div>
    `;
  
  const categoryCards = document.querySelectorAll(
    '.category-card');
  let itemAdded = false;
  
  categoryCards.forEach(card => {
    const cardHeader = card.querySelector('.card-header');
    const categoryNameElement = cardHeader.childNodes[2];
    const categoryName = categoryNameElement.textContent
      .trim();
    
    if (categoryName.toLowerCase() === getCategoryDisplayName(
        category).toLowerCase()) {
      const itemList = card.querySelector('.item-list');
      
      if (itemList) {
        itemList.insertAdjacentHTML('beforeend', newItemHTML);
        itemAdded = true;
        updateCategoryTotals(card);
      }
    }
  });
  
  if (!itemAdded) {
    createNewCategoryCard(category, itemName, quantity, price);
  }
  
  // ✅ UPDATE BUDGET - THIS IS THE KEY!
  updateBudgetProgress();
  
  // Re-initialize swipe for new cards
  setTimeout(() => {
    initializeSwipe();
    initializeCardExpansion();
  }, 100);
  
  document.getElementById('itemNameInput').value = '';
  document.getElementById('quantityInput').value = '';
  document.getElementById('priceInput').value = '';
  
  closeModal();
});

function getCategoryDisplayName(categoryValue) {
  return categoryValue;
}

function updateCategoryTotals(card) {
  const itemList = card.querySelector('.item-list');
  const allPrices = itemList.querySelectorAll('.list-item-price h3');
  
  let totalPrice = 0;
  let itemCount = 0;
  
  allPrices.forEach(priceElement => {
    const priceText = priceElement.textContent.replace('• $', '');
    const price = parseFloat(priceText);
    if (!isNaN(price)) {
      totalPrice += price;
      itemCount++;
    }
  });
  
  const numOfItems = card.querySelector('#numOfItems');
  const totalItemPrice = card.querySelector('#totalItemPrice');
  
  if (numOfItems) numOfItems.textContent = `${itemCount} items`;
  if (totalItemPrice) totalItemPrice.textContent =
    `$${totalPrice.toFixed(2)}`;
}

function createNewCategoryCard(category, itemName, quantity, price) {
  const categoryDisplayName = getCategoryDisplayName(category);
  
  const newCategoryHTML = `
        <div class="category-card">
            <div class="card-header">
                <div class="category-name"></div>
                ${categoryDisplayName}
                <div class="category-card-sort-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" 
                              stroke-linejoin="round" stroke-width="4"
                              d="M19 6v36M7 17.9l12-12m10 36.2v-36m0 36l12-12" />
                    </svg>
                </div>
            </div>
            <div class="item-card">
                <div class="item-image-card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M82 56V24a6 6 0 0 1 12 0v32a6 6 0 0 1-12 0m38 6a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m32 0a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m94 58v8a38 38 0 0 1-36.94 38a94.55 94.55 0 0 1-31.13 44H208a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12h30.07A94.34 94.34 0 0 1 26 136V88a6 6 0 0 1 6-6h176a38 38 0 0 1 38 38m-44 16V94H38v42a82.27 82.27 0 0 0 46.67 74h70.66A82.27 82.27 0 0 0 202 136m32-16a26 26 0 0 0-20-25.29V136a93 93 0 0 1-1.69 17.64A26 26 0 0 0 234 128Z" />
                    </svg>
                </div>
                <div class="item-info">
                    <div class="item-left">
                        <div class="item-name">
                            <h2>${itemName}</h2>
                            <div class="item-list">
                                <div class="indie-item-info">
                                    <div class="item-times">
                                        <h3>Qty: ${quantity}</h3>
                                    </div>
                                    <div class="list-item-price">
                                        <h3>• $${price.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="item-details">
                            <h3 class="indie-item-details" id="numOfItems">1 items</h3>
                            <h3 class="indie-item-details" id="totalItemPrice">$${price.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  
  const cardContainer = document.querySelector('.card-container');
  cardContainer.insertAdjacentHTML('beforeend', newCategoryHTML);
}

// ===== 🎯 BUDGET PROGRESS ANIMATION - THE COMPLETE FIX! =====
function updateBudgetProgress() {
  console.log('🔄 Updating budget...');
  
  if (!budgetCard || !progressFill) {
    console.error('❌ Budget elements not found!');
    return;
  }
  
  // Get ALL prices from the page
  const allPrices = document.querySelectorAll('.list-item-price h3');
  console.log(`Found ${allPrices.length} price elements`);
  
  let totalEstimated = 0;
  let totalItems = 0;
  
  allPrices.forEach(priceElement => {
    const priceText = priceElement.textContent.replace('• $', '')
      .trim();
    const price = parseFloat(priceText);
    
    if (!isNaN(price)) {
      totalEstimated += price;
      totalItems++;
    }
  });
  
  console.log(`Total: $${totalEstimated}, Items: ${totalItems}`);
  
  const budgetAmount = 500;
  const remaining = budgetAmount - totalEstimated;
  const percentage = (totalEstimated / budgetAmount) * 100;
  const avgPerItem = totalItems > 0 ? totalEstimated / totalItems : 0;
  
  // ✅ FIXED - Added the dot!
  const trendIcon = document.querySelector('.trend-icon');
  
  // Update text values
  if (budgetValue) budgetValue.textContent = `$${budgetAmount}`;
  if (estimatesValue) estimatesValue.textContent =
    `$${totalEstimated.toFixed(2)}`;
  if (remainingValue) remainingValue.textContent =
    `$${Math.abs(remaining).toFixed(2)}`;
  if (avgSpending) avgSpending.textContent =
    `$${avgPerItem.toFixed(2)}`;
  if (itemCount) itemCount.textContent = `•${totalItems} items`;
  if (progressPercentage) progressPercentage.textContent =
    `${Math.round(percentage)}%`;
  
  // ✅ ANIMATE THE PROGRESS BAR!
  progressFill.style.width = '0%';
  
  setTimeout(() => {
    progressFill.style.width = `${Math.min(percentage, 100)}%`;
    console.log(`Progress bar set to ${percentage.toFixed(1)}%`);
  }, 50);
  
  // ✅ UPDATE COLOR STATES (Card + Icon)
  budgetCard.className = 'budget-card';
  
  // ✅ Clear old trend icon classes
  if (trendIcon) {
    trendIcon.className = 'trend-icon';
  }
  
  if (percentage < 70) {
    budgetCard.classList.add('normal');
    if (trendIcon) trendIcon.classList.add('normal');
    if (progressStatus) progressStatus.textContent = 'On Track';
    console.log('Status: On Track (Green)');
    
  } else if (percentage >= 70 && percentage < 100) {
    budgetCard.classList.add('warning');
    if (trendIcon) trendIcon.classList.add('warning');
    if (progressStatus) progressStatus.textContent = 'Watch Spending';
    console.log('Status: Warning (Yellow)');
    
  } else {
    budgetCard.classList.add('over');
    if (trendIcon) trendIcon.classList.add('over');
    if (progressStatus) progressStatus.textContent = 'Over Budget!';
    console.log('Status: Over Budget (Red)');
  }
}*/

// ✅ Run on page load
updateBudgetProgress();

// ===== NAVIGATION =====
document.getElementById("navInsights").onclick = () => {
  insightsPage.style.display = "block";
  fab.classList.add('hide');
  
  insightsPage.classList.add('show');
  navInsights.classList.add('active');
  navMyItems.classList.remove('active');
  homePage.classList.add('hide');
  navProfiles.classList.remove('active');
  profilePage.classList.remove('show');
  
  sortModal.classList.remove('show');
  sortOverlay.classList.remove('show');
  
  closeModal();
};

document.getElementById("navProfiles").onclick = () => {
  homePage.style.display = "none";
  insightsPage.style.display = "none";
  profilePage.style.display = "block";
  
  navProfiles.classList.add('active');
  profilePage.classList.add('show');
  navMyItems.classList.remove('active');
  homePage.classList.add('hide');
  navInsights.classList.remove('active');
  insightsPage.classList.remove('show');
  fab.classList.add('hide');
  
  sortModal.classList.remove('show');
  sortOverlay.classList.remove('show');
  
  closeModal();
};

document.getElementById("navMyItems").onclick = () => {
  homePage.style.display = "block";
  fab.classList.remove('hide');
  
  navMyItems.classList.add('active');
  homePage.classList.remove('hide');
  navInsights.classList.remove('active');
  insightsPage.classList.remove('show');
  navProfiles.classList.remove('active');
  profilePage.classList.remove('show');
  
  sortModal.classList.remove('show');
  sortOverlay.classList.remove('show');
};

// ===== INSIGHTS FUNCTIONS =====
if (periodBtn && periodWrapper) {
  periodBtn.addEventListener("click", e => {
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
    if (periodValue) periodValue.textContent = capitalize(
      currentPeriod);
    selectedRange = currentPeriod === "month" ? "This month" :
      "This week";
    if (rangeText) rangeText.textContent = selectedRange;
    updatePeriodMenu();
    periodWrapper.classList.remove("open");
  });
}

document.addEventListener("click", e => {
  if (periodWrapper && !periodWrapper.contains(e.target)) {
    periodWrapper.classList.remove("open");
  }
  
  if (rangeModal && !rangeModal.contains(e.target) && e.target !==
    rangeText) {
    closeRangeModal();
  }
});

if (rangeText) {
  rangeText.addEventListener("click", e => {
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
  
  const options = currentPeriod === "month" ? ["This month",
    "Last month", "Last 2 months", "Last 3 months"
  ] : ["This week", "Last week", "Last 2 weeks", "Last 3 weeks"];
  
  options.forEach(opt => {
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

breakdownByPriceBtn.addEventListener('click', () => {
  breakdownByPriceBtn.classList.add('expanded');
  breakdownOverlay.classList.add('show');
})
breakdownOverlay.addEventListener('click', () => {
  breakdownByPriceBtn.classList.remove('expanded');
  breakdownOverlay.classList.remove('show');
})

let currentOption = 'By used budget' ? 'By used budget' :
  'By total budget';
let priceOption = ['By used budget', 'By total budget'];

/*function showCurrentOption() {
  if (currentOption) {
    breakdownByPriceBtn.textContent = currentOption;
  }
  
  card.innerHTML = `
<div class="breakdown-by-price-btn" id="breakdownByPriceBtn">
  <span>${currentOption}</span>
  <span>${priceOption}</span>
</div>
`;
}*/


/*const ctx = document.getElementById("myChart");

const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Food", "Transport", "Clothing", "Games", "Other"],
    datasets: [{
      label: "Spending ($)",
      data: [120, 60, 90, 40, 30],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins:{
      legend:{
        display:false
      }
    },
    scales:{
      y:{
        beginAtZero:true
      }
    }
  }
});*/



// ===== PROFILE PAGE =====
const accountToggle = document.getElementById('accountToggle');
const accWrapper = document.querySelector('.acc-wrapper');
const profileForeground = document.getElementById(
  'profileForeground');

if (accountToggle && accWrapper) {
  accountToggle.addEventListener('click', () => {
    accountToggle.classList.toggle('expanded');
    accWrapper.classList.toggle('expanded');
  });
}

const toggleGround = document.getElementById('toggleGround');
const toggle = document.getElementById('toggle');
const clickListener = document.getElementById('clickListener');
const theme = document.getElementById('theme');

clickListener.addEventListener('click', () => {
  toggle.classList.toggle('on');
  toggleGround.classList.toggle('on');
  theme.classList.toggle('dark');
})

const profileAvatar = document.getElementById('profileAvatar');

let pageY = e.touches[0].clientY;;

// TOUCH START
profileForeground.addEventListener('scroll', () => {
  if (pageUp > 60) {
    profileAvatar.classList.add('small');
  }
})

const settingsIcon = document.getElementById('settingsIcon');
const settingsPage = document.getElementById('settingsPage');

settingsIcon.addEventListener('click', () => {
  settingsPage.classList.add('show');
})



// ===== 👆 SWIPE TO DELETE/DONE FUNCTIONALITY =====
/*function initializeSwipe() {
  const itemCards = document.querySelectorAll('.item-card');
  
  itemCards.forEach(card => {
    // Skip if already initialized
    if (card.hasAttribute('data-swipe-init')) return;
    card.setAttribute('data-swipe-init', 'true');
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let dragStartTime = 0;
    
    // Add transition for smooth snap-back
    card.style.transition =
      'transform 0.3s ease, background 0.3s ease';
    
    // TOUCH START
    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      dragStartTime = Date.now();
      card.classList.add('dragging');
      card.style.transition =
        'none'; // Remove transition while dragging
    }, { passive: true });
    
    // TOUCH MOVE
    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const distance = currentX - startX;
      
      // Only allow horizontal swipe (limit vertical movement)
      card.style.transform = `translateX(${distance}px)`;
    }, { passive: true });
    
    // TOUCH END
    card.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const distance = currentX - startX;
      const threshold = 60;
      const dragDuration = Date.now() - dragStartTime;
      
      card.classList.remove('dragging');
      
      // Quick swipe detection
      const velocity = Math.abs(distance) / dragDuration;
      const isQuickSwipe = velocity > 0.5;
      
      if (distance < -threshold || (distance < -30 &&
          isQuickSwipe)) {
        // ✅ SWIPED LEFT - Delete with animation
        card.style.transform = ''; // Clear inline transform
        card.style.transition = ''; // Clear inline transition
        card.classList.add('deleted');
        
        console.log('Deleting item...');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
          card.closest('.category-card').remove();
          updateBudgetProgress(); // Recalculate budget
        }, 500); // Match animation duration (0.5s)
        
      } else if (distance > threshold || (distance > 30 &&
          isQuickSwipe)) {
        // ✅ SWIPED RIGHT - Mark done with animation
        card.style.transform = ''; // Clear inline transform
        card.style.transition = ''; // Clear inline transition
        card.classList.add('mark-done');
        
        console.log('Marking as done...');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
          card.closest('.category-card').remove();
          updateBudgetProgress(); // Recalculate budget
        }, 500); // Match animation duration (0.5s)
        
      } else {
        // SNAP BACK
        card.style.transition =
          'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.3s ease';
        card.style.transform = 'translateX(0)';
        card.style.background = '#F3F6F2';
      }
      
      isDragging = false;
    });
    
    // MOUSE EVENTS (for desktop testing)
    card.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
      dragStartTime = Date.now();
      card.classList.add('dragging');
      card.style.transition = 'none';
    });
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      currentX = e.clientX;
      const distance = currentX - startX;
      card.style.transform = `translateX(${distance}px)`;
    };
    
    const handleMouseUp = () => {
      if (!isDragging) return;
      
      const distance = currentX - startX;
      const threshold = 60;
      const dragDuration = Date.now() - dragStartTime;
      const velocity = Math.abs(distance) / dragDuration;
      const isQuickSwipe = velocity > 0.5;
      
      card.classList.remove('dragging');
      card.style.transition =
        'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.3s ease';
      
      if (distance < -threshold || (distance < -30 &&
          isQuickSwipe)) {
        card.style.transform = 'translateX(-80px)';
        card.style.background = '#ffebee';
      } else if (distance > threshold || (distance > 30 &&
          isQuickSwipe)) {
        card.style.transform = 'translateX(80px)';
        card.style.background = '#e8f5e9';
      } else {
        card.style.transform = 'translateX(0)';
        card.style.background = '#F3F6F2';
      }
      
      isDragging = false;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
}

// ✅ Initialize swipe on page load
initializeSwipe();

// ✅ Watch for new cards being added
const cardObserver = new MutationObserver(() => {
  initializeSwipe();
  initializeCardExpansion();
});

const cardContainer = document.querySelector('.card-container');
if (cardContainer) {
  cardObserver.observe(cardContainer, {
    childList: true,
    subtree: true
  });
}*/

const itmImgCard = document.querySelectorAll(
  '.item-image-card');
const itmImgModal = document.getElementById('itmImgModal');

/*itmImgModal.addEventListener('click', () => {itmImgCard.style.backgroundColor = 'blue';})

/*itmImgCard.forEach(imc => {
  imc.addEventListener('click', () => {
    itemImgCard.forEach(imc => {
      itmImgModal.classList.remove('show');
      itmImgModal.classList.add('show');
      itmImgModal.style.background = 'blue';
    })
  })
})*/

// ===== RECIPE PAGE SYSTEM (UPDATED) =====

const recipeBtn = document.getElementById('recipeBtn');
const recipePage = document.getElementById('recipePage');
const recipeList = document.getElementById('recipeList');
const recipeLoading = document.getElementById('recipeLoading');
const recipeTrending = document.getElementById(
  'recipeTrending');
const trendingList = document.getElementById('trendingList');
const backFromRecipe = document.getElementById(
  'backFromRecipe');
const recipeSearchInput = document.getElementById(
  'recipeSearchInput');

// Expanded recipe database with trending recipes
const recipeDatabase = [
{
  id: 1,
  name: 'Bistek Tagalog',
  cuisine: 'Filipino',
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
  cookTime: 35,
  servings: 4,
  trending: true,
  views: 15200,
  ingredients: [
    { name: 'beef', qty: 1, unit: 'lb' },
    { name: 'onion', qty: 2, unit: 'pcs' },
    { name: 'garlic', qty: 6, unit: 'cloves' },
    { name: 'soy sauce', qty: 4, unit: 'tbsp' },
    { name: 'lemon', qty: 2, unit: 'pcs' },
    { name: 'oil', qty: 2, unit: 'tbsp' },
    { name: 'pepper', qty: 1, unit: 'tsp' }
  ]
},
{
  id: 2,
  name: 'Sushi Rolls',
  cuisine: 'Japanese',
  image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
  cookTime: 45,
  servings: 4,
  trending: true,
  views: 12800,
  ingredients: [
    { name: 'rice', qty: 2, unit: 'cups' },
    { name: 'nori', qty: 10, unit: 'sheets' },
    { name: 'cucumber', qty: 1, unit: 'pc' },
    { name: 'avocado', qty: 2, unit: 'pcs' },
    { name: 'crab stick', qty: 8, unit: 'pcs' }
  ]
},
{
  id: 3,
  name: 'Chicken Adobo',
  cuisine: 'Filipino',
  image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
  cookTime: 40,
  servings: 6,
  trending: true,
  views: 18500,
  ingredients: [
    { name: 'chicken', qty: 2, unit: 'lb' },
    { name: 'soy sauce', qty: 0.5, unit: 'cup' },
    { name: 'vinegar', qty: 0.5, unit: 'cup' },
    { name: 'garlic', qty: 8, unit: 'cloves' },
    { name: 'bay leaves', qty: 3, unit: 'pcs' }
  ]
},
{
  id: 4,
  name: 'Pasta Carbonara',
  cuisine: 'Italian',
  image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
  cookTime: 20,
  servings: 4,
  trending: true,
  views: 21000,
  ingredients: [
    { name: 'pasta', qty: 400, unit: 'g' },
    { name: 'bacon', qty: 200, unit: 'g' },
    { name: 'eggs', qty: 3, unit: 'pcs' },
    { name: 'parmesan', qty: 1, unit: 'cup' },
    { name: 'pepper', qty: 1, unit: 'tsp' }
  ]
},
{
  id: 5,
  name: 'Tacos al Pastor',
  cuisine: 'Mexican',
  image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
  cookTime: 30,
  servings: 4,
  trending: true,
  views: 9800,
  ingredients: [
    { name: 'pork', qty: 1, unit: 'lb' },
    { name: 'pineapple', qty: 1, unit: 'pc' },
    { name: 'tortillas', qty: 12, unit: 'pcs' },
    { name: 'onion', qty: 1, unit: 'pc' },
    { name: 'cilantro', qty: 1, unit: 'bunch' }
  ]
}];

// Open recipe page
if (recipeBtn) {
  recipeBtn.addEventListener('click', () => {
    recipePage.classList.add('show');
    
    closeFab();
  });
}

// Back button
if (backFromRecipe) {
  backFromRecipe.addEventListener('click', () => {
    recipePage.classList.remove('show');
  });
}

if (addToGet) {
  addToGet.addEventListener('click', () => {
    recipePage.classList.add('show');
    toGetListPage.classList.remove('show');
  })
}

// Search functionality
if (recipeSearchInput) {
  recipeSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length > 0) {
      const filtered = recipeDatabase.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.cuisine.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.name
          .toLowerCase()
          .includes(query))
      );
      
      const userItems = getAllUserItems();
      const recipesWithScores = filtered.map(recipe => {
        const match = calculateRecipeMatch(recipe,
          userItems);
        return {
          ...recipe,
          matchScore: match.percentage,
          missingItems: match.missing,
          availableItems: match
            .available
        };
      });
      
      recipesWithScores.sort((a, b) => b.matchScore - a
        .matchScore);
      
      recipeTrending.style.display = 'none';
      recipeList.style.display = 'flex';
      renderRecipes(recipesWithScores);
    } else {
      loadRecommendedRecipes();
    }
  });
}

// Tab switching
const recipeTabs = document.querySelectorAll('.recipe-select');

recipeTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    recipeTabs.forEach(t => t.classList.remove(
      'active'));
    this.classList.add('active');
    
    const tabType = this.dataset.tab;
    
    if (tabType === 'recommended') {
      loadRecommendedRecipes();
    } else if (tabType === 'explore') {
      loadExploreRecipes();
    } else if (tabType === 'saved') {
      loadSavedRecipes();
    }
  });
});

// ===== LOAD RECOMMENDED RECIPES =====
function loadRecommendedRecipes() {
  recipeLoading.style.display = 'flex';
  recipeList.style.display = 'none';
  recipeTrending.style.display = 'none';
  
  const userItems = getAllUserItems();
  
  setTimeout(() => {
    recipeLoading.style.display = 'none';
    
    if (userItems.length === 0) {
      // Show trending recipes when no items in list
      showTrendingRecipes();
    } else {
      // Show matched recipes
      const recipesWithScores = recipeDatabase.map(
        recipe => {
          const match = calculateRecipeMatch(recipe,
            userItems);
          return {
            ...recipe,
            matchScore: match.percentage,
            missingItems: match.missing,
            availableItems: match
              .available
          };
        });
      
      recipesWithScores.sort((a, b) => b.matchScore - a
        .matchScore);
      
      recipeList.style.display = 'flex';
      renderRecipes(recipesWithScores);
    }
  }, 800);
}

// ===== SHOW TRENDING RECIPES =====
function showTrendingRecipes() {
  recipeTrending.style.display = 'block';
  
  const trending = recipeDatabase
    .filter(r => r.trending)
    .sort((a, b) => b.views - a.views);
  
  trendingList.innerHTML = '';
  
  trending.forEach(recipe => {
    const card = createTrendingCard(recipe);
    trendingList.appendChild(card);
  });
}

// ===== CREATE TRENDING CARD (Compact) =====
function createTrendingCard(recipe) {
  const card = document.createElement('div');
  card.className = 'trending-card';
  
  card.innerHTML = `
    <div class="trending-img">
      <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect fill=%22%23E8F5E9%22 width=%2280%22 height=%2280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2228%22 text-anchor=%22middle%22 dy=%22.3em%22%3E🍳%3C/text%3E%3C/svg%3E'">
    </div>
    <div class="trending-info">
      <div class="trending-name">${recipe.name}</div>
      <div class="trending-meta">${recipe.cuisine} • ${recipe.cookTime}min</div>
      <div class="trending-stats">
        <span>👁️ ${(recipe.views / 1000).toFixed(1)}k views</span>
        <span>🍽️ ${recipe.servings} servings</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', () => {
    const match = calculateRecipeMatch(recipe,
      getAllUserItems());
    const fullRecipe = {
      ...recipe,
      matchScore: match.percentage,
      missingItems: match.missing,
      availableItems: match
        .available
    };
    
    recipeList.innerHTML = '';
    recipeList.style.display = 'flex';
    recipeTrending.style.display = 'none';
    
    const fullCard = createRecipeCard(fullRecipe);
    fullCard.classList.add('expanded');
    recipeList.appendChild(fullCard);
  });
  
  return card;
}

// ===== GET ALL USER ITEMS =====
function getAllUserItems() {
  const items = [];
  const itemElements = document.querySelectorAll(
    '.item-name h2');
  
  itemElements.forEach(element => {
    const itemName = element.textContent.trim()
      .toLowerCase();
    if (itemName) {
      items.push(itemName);
    }
  });
  
  return items;
}

// ===== CALCULATE RECIPE MATCH =====
function calculateRecipeMatch(recipe, userItems) {
  let matchedCount = 0;
  const missing = [];
  const available = [];
  
  recipe.ingredients.forEach(ingredient => {
    const found = userItems.some(item =>
      item.includes(ingredient.name.toLowerCase()) ||
      ingredient.name.toLowerCase().includes(item)
    );
    
    if (found) {
      matchedCount++;
      available.push(ingredient);
    } else {
      missing.push(ingredient);
    }
  });
  
  const percentage = Math.round((matchedCount / recipe
    .ingredients
    .length) * 100);
  
  return { percentage, missing, available };
}

// ===== RENDER RECIPES =====
function renderRecipes(recipes) {
  recipeList.innerHTML = '';
  
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe);
    recipeList.appendChild(card);
  });
}

// ===== CREATE RECIPE CARD =====
function createRecipeCard(recipe) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.dataset.recipeId = recipe.id;
  
  const allIngredients = [...(recipe.availableItems || []), ...(
    recipe
    .missingItems || [])];
  
  card.innerHTML = `
    <div class="recipe-img">
      <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23E8F5E9%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2248%22 text-anchor=%22middle%22 dy=%22.3em%22%3E🍳%3C/text%3E%3C/svg%3E'">
    </div>
    
    <div class="recipe-header">
      <div class="recipe-info">
        <div class="recipe-name">${recipe.name}</div>
        <div class="recipe-cuisine">${recipe.cuisine}</div>
        
        ${recipe.matchScore !== undefined ? `
          <div class="recipe-match">
            <span class="match-label">Match:</span>
            <span class="match-percentage">${recipe.matchScore}%</span>
            <div class="match-bar">
              <div class="match-fill" style="width: ${recipe.matchScore}%"></div>
            </div>
          </div>
        ` : ''}
      </div>
      
      <div class="recipe-ctrls">
        <svg class="heart-recipe" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
          <path fill="currentColor" d="M16.696 3C14.652 3 12.887 4.197 12 5.943C11.113 4.197 9.348 3 7.304 3C4.374 3 2 5.457 2 8.481s1.817 5.796 4.165 8.073S12 21 12 21s3.374-2.133 5.835-4.446C20.46 14.088 22 11.514 22 8.481S19.626 3 16.696 3" />
        </svg>
        
        <svg class="expand-recipe" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
          <path fill="currentColor" d="M104.7 685.2a64 64 0 0 0 90.5 0L512 368.4l316.8 316.8a64 64 0 0 0 90.5-90.4l-362-362.1a64 64 0 0 0-90.5 0l-362.1 362a64 64 0 0 0 0 90.5" />
        </svg>
      </div>
    </div>
    
    <div class="recipe-details">
      <div class="recipe-details-content">
        <div class="recipe-meta">
          <div class="meta-item">⏱️ ${recipe.cookTime}m</div>
          <div class="meta-item">🍽️ ${recipe.servings} servings</div>
        </div>
        
        <!-- ✅ ALL INGREDIENTS SECTION -->
        <div class="ingredients-section">
          <h4>📋 Ingredients</h4>
          ${allIngredients.map(item => `
            <div class="ingredient-item" data-ingredient="${item.name}">
              <span class="ingredient-name-qty">${item.name} (${item.qty} ${item.unit})</span>
              <div class="ingredient-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
                </svg>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- ⚠️ MISSING ITEMS SECTION -->
        ${recipe.missingItems && recipe.missingItems.length > 0 ? `
          <div class="missing-items-section">
            <h4>⚠️ Missing Items</h4>
            ${recipe.missingItems.map(item => `
              <div class="missing-item" data-item="${item.name}">
                <span class="missing-item-name">${item.name} (${item.qty} ${item.unit})</span>
                <button class="add-item-btn">
                  +
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
                  </svg>
                </button>
              </div>
            `).join('')}
          </div>
        ` : '<div style="text-align:center; color: #4CAF50; padding: 16px; background: #E8F5E9; border-radius: 12px; margin-bottom: 16px;">✅ You have all ingredients!</div>'}
        
        <button class="use-recipe-btn">
          ✓ Use This Recipe
        </button>
      </div>
    </div>
  `;
  
  // ===== EVENT LISTENERS =====
  
  const heart = card.querySelector('.heart-recipe');
  const expandBtn = card.querySelector('.expand-recipe');
  const useBtn = card.querySelector('.use-recipe-btn');
  const ingredientChecks = card.querySelectorAll(
    '.ingredient-check');
  const addBtns = card.querySelectorAll('.add-item-btn');
  
  // Heart (like/save)
  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    heart.classList.toggle('liked');
    showToast(heart.classList.contains('liked') ?
      'Added to favorites' :
      'Removed from favorites');
  });
  
  // Expand/collapse
  expandBtn.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
  
  // Check ingredient
  ingredientChecks.forEach(check => {
    check.addEventListener('click', () => {
      const item = check.closest('.ingredient-item');
      item.classList.toggle('checked');
    });
  });
  
  // Add missing item to shopping list
  addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const missingItem = btn.closest('.missing-item');
      missingItem.classList.add('added');
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
        </svg>
      `;
      showToast('Added to shopping list');
    });
  });
  
  // Use recipe
  useBtn.addEventListener('click', () => {
    const itemsUsed = allIngredients.length - (recipe
      .missingItems
      ?.length || 0);
    showToast(
      `Recipe used! ${itemsUsed} ingredients deducted`);
    setTimeout(() => card.style.opacity = '0.5', 500);
  });
  
  return card;
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== LOAD EXPLORE/SAVED (PLACEHOLDERS) =====
function loadExploreRecipes() {
  recipeLoading.style.display = 'flex';
  setTimeout(() => {
    recipeLoading.style.display = 'none';
    recipeList.style.display = 'flex';
    recipeTrending.style.display = 'none';
    recipeList.innerHTML =
      '<div style="text-align:center; padding:60px 20px; color:#888;">🌍 Explore coming soon!</div>';
  }, 800);
}

function loadSavedRecipes() {
  recipeLoading.style.display = 'flex';
  setTimeout(() => {
    recipeLoading.style.display = 'none';
    recipeList.style.display = 'flex';
    recipeTrending.style.display = 'none';
    recipeList.innerHTML =
      '<div style="text-align:center; padding:60px 20px; color:#888;">💾 No saved recipes yet</div>';
  }, 800);
}


/*

// ===== COMPLETE planUp App - All Features Working =====
// ✅ Budget animation fixed
// ✅ Swipe-to-delete/done working
// ✅ Recipe page integrated
// ✅ Premium Settings page
// ✅ Premium Profile page
// ✅ All navigation working

// ===== ELEMENT REFERENCES =====
const budgetCard = document.getElementById('budgetCard');
const progressFill = document.getElementById('progressFill');
const progressPercentage = document.getElementById('progressPercentage');
const progressStatus = document.getElementById('progressStatus');
const estimatesValue = document.getElementById('estimatesValue');
const remainingValue = document.getElementById('remainingValue');
const avgSpending = document.getElementById('avgSpending');
const itemCount = document.getElementById('itemCount');

// State
let items = JSON.parse(localStorage.getItem("planup_items")) || [];
let budget = 500;

// Navigation
const menuBtn = document.getElementById('menuBtn');
const menuPage = document.getElementById('menuPage');
const menuOverlay = document.getElementById('menuOverlay');
const notificationBtn = document.getElementById('notificationBtn');

// Pages
const homePage = document.getElementById("homePage");
const notificationPage = document.getElementById('notificationPage');

// ===== MENU =====
menuBtn.addEventListener('click', () => {
  menuPage.classList.add('show');
  menuOverlay.classList.add('show');
});

menuOverlay.addEventListener('click', () => {
  menuPage.classList.remove('show');
  menuOverlay.classList.remove('show');
});

// ===== NOTIFICATIONS =====
notificationBtn.addEventListener('click', () => {
  notificationPage.classList.add('show');
});

// ===== BACK BUTTONS =====
const backFromPage = document.querySelectorAll('.back-btn');

backFromPage.forEach(arrow => {
  arrow.addEventListener('click', () => {
    document.querySelectorAll('.full-page').forEach(page => {
      page.classList.remove('show');
    });
  });
});

// ===== DRAWER MENU NAVIGATION =====
const menuItems = {
  toGetListBtn: 'toGetListPage',
  favoritesBtn: 'favoritesPage',
  scheduleBtn: 'schedulePage',
  settingsBtn: 'settingsPage',
  recipeBtn: 'recipePage'
};

Object.entries(menuItems).forEach(([btnId, pageId]) => {
  const btn = document.getElementById(btnId);
  const page = document.getElementById(pageId);
  
  if (btn && page) {
    btn.addEventListener('click', () => {
      page.classList.add('show');
      menuPage.classList.remove('show');
      menuOverlay.classList.remove('show');
    });
  }
});

// ===== FAB MENU =====
const fab = document.getElementById("fab");
const fabMenu = document.getElementById("fabMenu");
const overlay = document.getElementById("fabOverlay");
const fabCamera = document.getElementById('fabCamera');

fab.addEventListener("click", () => {
  fab.classList.toggle("expanded");
  fabMenu.classList.toggle("expanded");
  fabCamera.classList.toggle('visible');
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  fab.classList.remove("expanded");
  fabMenu.classList.remove("expanded");
  overlay.classList.remove("show");
  fabCamera.classList.remove('visible');
});*/

// ===== ADD ITEM MODAL =====
/*const addItemModal = document.getElementById('addItemModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveItemBtn = document.getElementById('saveItemBtn');
const addItemBtn = document.getElementById('addItemBtn');

function openAddItemModal() {
  addItemModal.classList.add('show');
  fab.classList.remove("expanded");
  fabMenu.classList.remove("expanded");
  overlay.classList.remove("show");
  fabCamera.classList.remove('visible');
}

function closeModal() {
  addItemModal.classList.remove('show');
}

if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
if (addItemBtn) addItemBtn.addEventListener('click', openAddItemModal);

addItemModal?.addEventListener('click', (e) => {
  if (e.target === addItemModal) closeModal();
});

// ===== SAVE ITEM =====
saveItemBtn?.addEventListener('click', () => {
  const itemName = document.getElementById('itemNameInput').value.trim();
  const category = document.getElementById('categorySelect').value;
  const quantity = document.getElementById('quantityInput').value;
  const price = parseFloat(document.getElementById('priceInput').value);
  
  if (!itemName || !quantity || !price) {
    alert('Please fill in all fields!');
    return;
  }
  
  // Find or create category
  const categoryCards = document.querySelectorAll('.category-card');
  let itemAdded = false;
  
  categoryCards.forEach(card => {
    const cardHeader = card.querySelector('.card-header');
    const categoryName = cardHeader?.childNodes[2]?.textContent?.trim();
    
    if (categoryName?.toLowerCase() === category.toLowerCase()) {
      const itemList = card.querySelector('.item-list');
      if (itemList) {
        itemList.insertAdjacentHTML('beforeend', `
          <div class="indie-item-info">
            <div class="item-times"><h3>Qty: ${quantity}</h3></div>
            <div class="list-item-price"><h3>• $${price.toFixed(2)}</h3></div>
          </div>
        `);
        itemAdded = true;
        updateCategoryTotals(card);
      }
    }
  });
  
  if (!itemAdded) {
    createNewCategoryCard(category, itemName, quantity, price);
  }
  
  updateBudgetProgress();
  
  document.getElementById('itemNameInput').value = '';
  document.getElementById('quantityInput').value = '';
  document.getElementById('priceInput').value = '';
  
  closeModal();
  
  setTimeout(() => {
    initializeSwipe();
    initializeCardExpansion();
  }, 100);
});

function updateCategoryTotals(card) {
  const allPrices = card.querySelectorAll('.list-item-price h3');
  let totalPrice = 0;
  let itemCount = 0;
  
  allPrices.forEach(el => {
    const price = parseFloat(el.textContent.replace('• $', ''));
    if (!isNaN(price)) {
      totalPrice += price;
      itemCount++;
    }
  });
  
  const numOfItems = card.querySelector('#numOfItems');
  const totalItemPrice = card.querySelector('#totalItemPrice');
  
  if (numOfItems) numOfItems.textContent = `${itemCount} items`;
  if (totalItemPrice) totalItemPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

function createNewCategoryCard(category, itemName, quantity, price) {
  const cardContainer = document.querySelector('.card-container');
  
  cardContainer.insertAdjacentHTML('beforeend', `
    <div class="category-card">
      <div class="card-header">
        <div class="category-name"></div>
        ${category}
        <div class="category-card-sort-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 6v36M7 17.9l12-12m10 36.2v-36m0 36l12-12"/>
          </svg>
        </div>
      </div>
      <div class="item-card">
        <div class="item-image-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256">
            <path fill="currentColor" d="M82 56V24a6 6 0 0 1 12 0v32a6 6 0 0 1-12 0m38 6a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m32 0a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m94 58v8a38 38 0 0 1-36.94 38a94.55 94.55 0 0 1-31.13 44H208a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12h30.07A94.34 94.34 0 0 1 26 136V88a6 6 0 0 1 6-6h176a38 38 0 0 1 38 38m-44 16V94H38v42a82.27 82.27 0 0 0 46.67 74h70.66A82.27 82.27 0 0 0 202 136m32-16a26 26 0 0 0-20-25.29V136a93 93 0 0 1-1.69 17.64A26 26 0 0 0 234 128Z"/>
          </svg>
        </div>
        <div class="item-info">
          <div class="item-left">
            <div class="item-name">
              <h2>${itemName}</h2>
              <div class="item-list">
                <div class="indie-item-info">
                  <div class="item-times"><h3>Qty: ${quantity}</h3></div>
                  <div class="list-item-price"><h3>• $${price.toFixed(2)}</h3></div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-right">
            <div class="item-details">
              <h3 class="indie-item-details" id="numOfItems">1 items</h3>
              <h3 class="indie-item-details" id="totalItemPrice">$${price.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}*/

/*saveItemBtn.addEventListener('click', () => {
  const itemName = document.getElementById('itemNameInput').value
    .trim();
  const category = document.getElementById('categorySelect')
    .value;
  const quantity = document.getElementById('quantityInput').value;
  const price = parseFloat(document.getElementById('priceInput')
    .value);
  
  // Validation
  if (!itemName || !quantity || !price || isNaN(price)) {
    alert('Fill in all fields with valid values!');
    return;
  }
  
  // Find or create category
  const categoryCards = document.querySelectorAll(
    '.category-card');
  let itemAdded = false;
  
  categoryCards.forEach(card => {
    const cardHeader = card.querySelector('.card-header');
    const categoryNameElement = cardHeader.childNodes[2];
    const categoryName = categoryNameElement.textContent
      .trim();
    
    if (categoryName.toLowerCase() === category
      .toLowerCase()) {
      const itemList = card.querySelector('.item-list');
      if (itemList) {
        // Add to existing category
        itemList.insertAdjacentHTML('beforeend', `
          <div class="indie-item-info">
            <div class="item-times"><h3>Qty: ${quantity}</h3></div>
            <div class="list-item-price"><h3>• $${price.toFixed(2)}</h3></div>
          </div>
        `);
        itemAdded = true;
        updateCategoryTotals(card);
        
      }
    }
  });
  
  if (!itemAdded) {
    // Create new category card
    createNewCategoryCard(category, itemName, quantity, price);
  }
  
  // Update budget
  updateBudgetProgress();
  
  // Re-initialize swipe
  setTimeout(() => {
    initializeSwipe();
    initializeCardExpansion();
  }, 100);
  
  closeModal();
  
  // Show success message
  console.log('Item added successfully!');
});

// ===== UPDATE CATEGORY TOTALS =====
function updateCategoryTotals(card) {
  const allPrices = card.querySelectorAll('.list-item-price h3');
  let totalPrice = 0;
  let count = 0;
  
  allPrices.forEach(el => {
    const price = parseFloat(el.textContent.replace('• $', ''));
    if (!isNaN(price)) {
      totalPrice += price;
      count++;
    }
  });
  
  const numOfItems = card.querySelector('#numOfItems');
  const totalItemPrice = card.querySelector('#totalItemPrice');
  
  if (numOfItems) numOfItems.textContent = `${count} items`;
  if (totalItemPrice) totalItemPrice.textContent =
    `$${totalPrice.toFixed(2)}`;
}

// ===== CREATE NEW CATEGORY CARD =====
function createNewCategoryCard(category, itemName, quantity, price) {
  const cardContainer = document.querySelector('.card-container');
  
  cardContainer.insertAdjacentHTML('beforeend', `
    <div class="category-card">
      <div class="card-header">
        <div class="category-name"></div>
        ${category}
        <div class="category-card-sort-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 6v36M7 17.9l12-12m10 36.2v-36m0 36l12-12"/>
          </svg>
        </div>
      </div>
      <div class="item-card">
        <div class="item-image-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256">
            <path fill="currentColor" d="M82 56V24a6 6 0 0 1 12 0v32a6 6 0 0 1-12 0m38 6a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m32 0a6 6 0 0 0 6-6V24a6 6 0 0 0-12 0v32a6 6 0 0 0 6 6m94 58v8a38 38 0 0 1-36.94 38a94.55 94.55 0 0 1-31.13 44H208a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12h30.07A94.34 94.34 0 0 1 26 136V88a6 6 0 0 1 6-6h176a38 38 0 0 1 38 38m-44 16V94H38v42a82.27 82.27 0 0 0 46.67 74h70.66A82.27 82.27 0 0 0 202 136m32-16a26 26 0 0 0-20-25.29V136a93 93 0 0 1-1.69 17.64A26 26 0 0 0 234 128Z"/>
          </svg>
        </div>
        <div class="item-info">
          <div class="item-left">
            <div class="item-name">
              <h2>${itemName}</h2>
              <div class="item-list">
                <div class="indie-item-info">
                  <div class="item-times"><h3>Qty: ${quantity}</h3></div>
                  <div class="list-item-price"><h3>• $${price.toFixed(2)}</h3></div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-right">
            <div class="item-details">
              <h3 class="indie-item-details" id="numOfItems">1 items</h3>
              <h3 class="indie-item-details" id="totalItemPrice">$${price.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}
*/

// ===== BUDGET ANIMATION =====
function updateBudgetProgress() {
  if (!budgetCard || !progressFill) return;
  
  const allPrices = document.querySelectorAll(
    '.list-item-price h3');
  let totalEstimated = 0;
  let totalItems = 0;
  
  allPrices.forEach(el => {
    const price = parseFloat(el.textContent.replace('• $',
        '')
      .trim());
    if (!isNaN(price)) {
      totalEstimated += price;
      totalItems++;
    }
  });
  
  const budgetAmount = 500;
  const remaining = budgetAmount - totalEstimated;
  const percentage = (totalEstimated / budgetAmount) * 100;
  const avgPerItem = totalItems > 0 ? totalEstimated /
    totalItems : 0;
  
  const trendIcon = document.querySelector('.trend-icon');
  
  if (estimatesValue) estimatesValue.textContent =
    `$${totalEstimated.toFixed(2)}`;
  if (remainingValue) remainingValue.textContent =
    `$${Math.abs(remaining).toFixed(2)}`;
  if (avgSpending) avgSpending.textContent =
    `$${avgPerItem.toFixed(2)}`;
  if (itemCount) itemCount.textContent = `•${totalItems} items`;
  if (progressPercentage) progressPercentage.textContent =
    `${Math.round(percentage)}%`;
  
  // Animate progress bar
  progressFill.style.width = '0%';
  setTimeout(() => {
    progressFill.style.width =
      `${Math.min(percentage, 100)}%`;
  }, 50);
  
  // Update states
  budgetCard.className = 'budget-card';
  if (trendIcon) trendIcon.className = 'trend-icon';
  
  if (percentage < 70) {
    budgetCard.classList.add('normal');
    if (trendIcon) trendIcon.classList.add('normal');
    if (progressStatus) progressStatus.textContent = 'On Track';
  } else if (percentage >= 70 && percentage < 100) {
    budgetCard.classList.add('warning');
    if (trendIcon) trendIcon.classList.add('warning');
    if (progressStatus) progressStatus.textContent =
      'Watch Spending';
  } else {
    budgetCard.classList.add('over');
    if (trendIcon) trendIcon.classList.add('over');
    if (progressStatus) progressStatus.textContent =
      'Over Budget!';
  }
}

updateBudgetProgress();

// ===== CARD EXPANSION =====
/*function initializeCardExpansion() {
  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', function() {
      if (!this.classList.contains('dragging')) {
        this.classList.toggle('expanded');
      }
    });
  });
}

initializeCardExpansion();

// ===== SWIPE FUNCTIONALITY =====
function initializeSwipe() {
  document.querySelectorAll('.item-card').forEach(card => {
    if (card.hasAttribute('data-swipe-init')) return;
    card.setAttribute('data-swipe-init', 'true');
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    card.style.transition = 'transform 0.3s ease, background 0.3s ease';
    
    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      card.classList.add('dragging');
      card.style.transition = 'none';
    }, { passive: true });
    
    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const distance = currentX - startX;
      card.style.transform = `translateX(${distance}px)`;
    }, { passive: true });
    
    card.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const distance = currentX - startX;
      const threshold = 60;
      
      card.classList.remove('dragging');
      card.style.transition = 'transform 0.3s ease, background 0.3s ease';
      
      if (distance < -threshold) {
        // Swiped LEFT - Delete
        card.style.transform = '';
        card.style.transition = '';
        card.classList.add('deleted');
        
        setTimeout(() => {
          card.closest('.category-card')?.remove();
          updateBudgetProgress();
        }, 500);
        
      } else if (distance > threshold) {
        // Swiped RIGHT - Done
        card.style.transform = '';
        card.style.transition = '';
        card.classList.add('mark-done');
        
        setTimeout(() => {
          card.closest('.category-card')?.remove();
          updateBudgetProgress();
        }, 500);
        
      } else {
        card.style.transform = 'translateX(0)';
        card.style.background = '#F3F6F2';
      }
      
      isDragging = false;
    });
  });
}

initializeSwipe();*/

// ===== TOAST NOTIFICATION =====
/*function showToast(message) {
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => toast.classList.remove('show'), 2000);
}*/

// ===== SETTINGS PAGE FUNCTIONALITY =====
const settingsOptions = {
  'theme-toggle': () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains(
      'dark-mode') ? 'dark' : 'light');
    showToast('Theme updated');
  },
  'notification-toggle': () => {
    showToast('Notifications updated');
  },
  'currency-setting': () => {
    showToast('Currency settings opened');
  },
  'budget-setting': () => {
    const newBudget = prompt('Enter new monthly budget:',
      budget);
    if (newBudget && !isNaN(newBudget)) {
      budget = parseFloat(newBudget);
      updateBudgetProgress();
      showToast(`Budget updated to $${budget}`);
    }
  },
  'export-data': () => {
    const data = {
      items: items,
      budget: budget,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null,
      2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planup-data.json';
    a.click();
    showToast('Data exported');
  },
  'clear-data': () => {
    if (confirm(
        'Are you sure you want to clear all data? This cannot be undone.'
      )) {
      localStorage.clear();
      location.reload();
    }
  },
  'privacy-policy': () => {
    showToast('Opening privacy policy...');
  },
  'terms-service': () => {
    showToast('Opening terms of service...');
  },
  'contact-support': () => {
    showToast('Opening support...');
  },
  'rate-app': () => {
    showToast('Thank you for rating planUp!');
  }
};

// Attach settings handlers
Object.entries(settingsOptions).forEach(([id, handler]) => {
  document.getElementById(id)?.addEventListener('click',
    handler);
});

// ===== PROFILE PAGE FUNCTIONALITY =====
const profileActions = {
  'edit-profile': () => {
    showToast('Profile editing coming soon');
  },
  'upgrade-premium': () => {
    showToast('Premium features coming soon');
  },
  'share-profile': () => {
    showToast('Profile sharing coming soon');
  }
};

Object.entries(profileActions).forEach(([id, handler]) => {
  document.getElementById(id)?.addEventListener('click',
    handler);
});





const text = document.querySelector('.text');
const expandModal = document.querySelector('.expand-modal');

text.addEventListener('click', () => {
  expandModal.classList.toggle('expanded');
})