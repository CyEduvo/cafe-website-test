/* =====================================================================
   Willow & Bean Café — order summary with quantity controls
   ===================================================================== */

// Guard: must be "signed in" to reach this page.
if (!sessionStorage.getItem('cafeUser')) location.replace('login.html');

// The menu is repeated here so this page can look up names and prices.
const menu = [
  { id: 1, name: 'House Espresso',   price: 8  },
  { id: 2, name: 'Flat White',       price: 13 },
  { id: 3, name: 'Cappuccino',       price: 13 },
  { id: 4, name: 'Caramel Latte',    price: 15 },
  { id: 5, name: 'Iced Mocha',       price: 16 },
  { id: 6, name: 'Cold Brew',        price: 15 },
  { id: 7, name: 'Earl Grey Tea',    price: 10 },
  { id: 8, name: 'Matcha Latte',     price: 16 },
  { id: 9, name: 'Chamomile Tea',    price: 10 },
  { id: 10, name: 'Butter Croissant', price: 9  },
  { id: 11, name: 'Almond Danish',    price: 12 },
  { id: 12, name: 'Chocolate Muffin', price: 10 },
  { id: 13, name: 'Avocado Toast',    price: 22 },
  { id: 14, name: 'Big Breakfast',    price: 28 },
  { id: 15, name: 'Buttermilk Pancakes', price: 24 }
];

const money = n => `RM${n.toFixed(2)}`;
const list = document.querySelector('#summaryList');

/* ---- Order storage --------------------------------------------------
   Stored as an array of ids; a repeated id means a bigger quantity. */
function getOrder()      { return JSON.parse(localStorage.getItem('cafeOrder') || '[]'); }
function setOrder(order) { localStorage.setItem('cafeOrder', JSON.stringify(order)); render(); }

// Add one more of an item.
function addOne(id) { const order = getOrder(); order.push(id); setOrder(order); }
// Remove a single unit (the first matching id).
function removeOne(id) { const order = getOrder(); const i = order.indexOf(id); if (i > -1) order.splice(i, 1); setOrder(order); }
// Remove every unit of an item.
function removeAll(id) { setOrder(getOrder().filter(x => x !== id)); }

/* ---- Draw the summary ----------------------------------------------- */
function render() {
  const order = getOrder();

  // Group the flat id list into { item, qty } lines, keeping first-seen order.
  const lines = [];
  order.forEach(id => {
    const line = lines.find(l => l.item.id === id);
    if (line) {
      line.qty++;
    } else {
      const item = menu.find(m => m.id === id);
      if (item) lines.push({ item, qty: 1 });
    }
  });

  document.querySelector('#cartCount').textContent = order.length;
  const submit = document.querySelector('#checkoutForm button');

  if (!lines.length) {
    list.innerHTML =
      '<div class="empty">Your order is empty.<br><a href="index.html#menu">Back to the menu</a></div>';
    submit.disabled = true;
  } else {
    submit.disabled = false;
    list.innerHTML = lines.map(({ item, qty }) => `
      <div class="summary-item">
        <div class="summary-info">
          <span>${item.name}</span>
          <small>${money(item.price)} each</small>
        </div>
        <div class="summary-controls">
          <div class="qty-controls">
            <button type="button" class="qty-btn" data-action="minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${qty}</span>
            <button type="button" class="qty-btn" data-action="plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <strong>${money(item.price * qty)}</strong>
          <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove item">Remove</button>
        </div>
      </div>`).join('');
  }

  const total = lines.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  document.querySelector('#summaryTotal').textContent = money(total);
}

/* ---- One click handler for every +, −, and Remove button ------------ */
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === 'plus')   addOne(id);
  if (button.dataset.action === 'minus')  removeOne(id);
  if (button.dataset.action === 'remove') removeAll(id);
});

/* ---- Submit: show the success modal and clear the order ------------- */
document.querySelector('#checkoutForm').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#successModal').classList.add('open');
  localStorage.removeItem('cafeOrder');
});
document.querySelector('#doneButton').onclick = () => localStorage.removeItem('cafeOrder');

render();
