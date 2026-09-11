/* =====================================================================
   Willow & Bean Café — menu, search/filter/sort, and order logic
   ===================================================================== */

// const { createElement } = require("react");

// If nobody "signed in" on the login page, send them back there.
if (!sessionStorage.getItem('cafeUser')) location.replace('login.html');

/* ---- Menu data ------------------------------------------------------
   Each item is a plain object. Add, edit or remove objects to change
   the menu — every id must be unique. */
const menu = [
  { id: 1, name: 'Car',   category: 'Car',   price: 100000,  },
  { id: 2, name: 'Flat White',       category: 'Coffee',   price: 13 },
  { id: 3, name: 'Cappuccino',       category: 'Coffee',   price: 13 },
  { id: 4, name: 'Caramel Latte',    category: 'Coffee',   price: 15 },
  { id: 5, name: 'Iced Mocha',       category: 'Coffee',   price: 16 },
  { id: 6, name: 'Cold Brew',        category: 'Coffee',   price: 15 },
  { id: 7, name: 'Earl Grey Tea',    category: 'Tea',      price: 10 },
  { id: 8, name: 'Matcha Latte',     category: 'Tea',      price: 16 },
  { id: 9, name: 'Chamomile Tea',    category: 'Tea',      price: 10 },
  { id: 10, name: 'Butter Croissant', category: 'Pastries', price: 9  },
  { id: 11, name: 'Almond Danish',    category: 'Pastries', price: 12 },
  { id: 12, name: 'Chocolate Muffin', category: 'Pastries', price: 10 },
  { id: 13, name: 'Avocado Toast',    category: 'Brunch',   price: 22 },
  { id: 14, name: 'Big Breakfast',    category: 'Brunch',   price: 28 },
  { id: 15, name: 'Buttermilk Pancakes', category: 'Brunch', price: 24 }
];

// The category currently selected in the filter bar.
let activeCategory = 'All';

// Grab the elements we will work with once, up front.
const grid    = document.querySelector('#menuGrid');
const filters = document.querySelector('#filters');
const search  = document.querySelector('#search');
const sort    = document.querySelector('#sort');

// Helper: format a number as Malaysian Ringgit, e.g. 8 -> "RM8.00".
const money = n => `RM${n.toFixed(2)}`;

/* ---- Order storage (localStorage) -----------------------------------
   The order is stored as an array of item ids. A repeated id simply
   means a larger quantity, e.g. [2, 2, 7] = two flat whites + one tea. */
function getOrder()      { return JSON.parse(localStorage.getItem('cafeOrder') || '[]'); }
function setOrder(order) { localStorage.setItem('cafeOrder', JSON.stringify(order)); updateCartCount(); }
function updateCartCount() { document.querySelector('#cartCount').textContent = getOrder().length; }

/* ---- Render the category filter buttons ----------------------------- */
function renderFilters() {
  filters.innerHTML = '';
  // "All" plus every unique category found in the menu.
  const categories = ['All', ...new Set(menu.map(item => item.category))];
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'filter-btn' + (category === activeCategory ? ' active' : '');
    button.textContent = category;
    button.onclick = () => { activeCategory = category; renderFilters(); renderMenu(); };
    filters.appendChild(button);
  });
}

/* ---- Render the menu grid ------------------------------------------- */
function renderMenu() {
  // 1) Filter by category + search text.
  let list = menu.filter(item =>
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.value.toLowerCase())
  );

  // 2) Sort according to the dropdown.
  if (sort.value === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (sort.value === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sort.value === 'name')       list.sort((a, b) => a.name.localeCompare(b.name));

  // 3) Turn each item into a card. Each photo lives in images/item-<id>.jpg;
  //    loading="lazy" lets the browser defer off-screen images.
  grid.innerHTML = list.map(item => `
    <article class="product-card">
      <div class="product-image">
        <img src="images/item-${item.id}.jpg" alt="${item.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="category">${item.category}</span>
        <div class="product-top">
          <h3>${item.name}</h3>
          <span class="price">${money(item.price)}</span>
        </div>
        <button class="btn btn-primary" data-id="${item.id}">Add to order</button>
      </div>
    </article>`).join('');

  document.querySelector('#resultCount').textContent =
    `${list.length} item${list.length === 1 ? '' : 's'}`;

  // 4) Wire up each "Add to order" button.
  grid.querySelectorAll('button').forEach(button => {
    button.onclick = () => addToOrder(Number(button.dataset.id));
  });
}

/* ---- Add an item and show a short toast ----------------------------- */
function addToOrder(id) {
  const order = getOrder();
  order.push(id);
  setOrder(order);

  const toast = document.querySelector('#toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1400);
}

/* ---- Wire up the page ----------------------------------------------- */
search.addEventListener('input', renderMenu);
sort.addEventListener('change', renderMenu);
document.querySelector('#logout').onclick = () => {
  sessionStorage.removeItem('cafeUser');
  location.href = 'login.html';
};

renderFilters();
renderMenu();
updateCartCount();

let audio = document.createElement('audio')
    audio.src = "./audios/faaah.mp3"
    audio.appendChild(document.querySelector("body"))
async function test() {
  try {
      setInterval(() => {
        
    audio.play()
    console.log(1)
      }, 1200)
  }
  catch (err) {

  }
}

test()