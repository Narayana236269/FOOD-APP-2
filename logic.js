// ========================================
// CART.JS - COMPLETE CART FUNCTIONALITY
// ========================================

// Get cart data from localStorage
let cart = JSON.parse(localStorage.getItem("foodieCart")) || {};

// Save cart data into localStorage
function saveCart() {
  localStorage.setItem("foodieCart", JSON.stringify(cart));
}

// Update navbar cart count
function updateCartCount() {
  const countElement = document.getElementById("navCartCount");

  if (countElement) {
    let count = 0;

    for (let item in cart) {
      count += cart[item].quantity;
    }

    countElement.textContent = count;
  }
}

// Add food item to cart
function addToCart(name, price) {
  if (cart[name]) {
    cart[name].quantity++;
  } else {
    cart[name] = {
      price: Number(price),
      quantity: 1,
    };
  }

  saveCart();
  updateCartCount();

  alert(name + " added to cart!");
}

// Attach functionality to Add to Cart buttons
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const name = this.dataset.name;
    const price = Number(this.dataset.price);

    addToCart(name, price);
  });
});

// Increase or decrease item quantity
function changeQuantity(name, amount) {
  if (!cart[name]) return;

  cart[name].quantity += amount;

  if (cart[name].quantity <= 0) {
    delete cart[name];
  }

  saveCart();
  renderCart();
}

// Remove an item from cart
function removeItem(name) {
  delete cart[name];

  saveCart();
  renderCart();
}

// Clear entire cart
function clearCart() {
  cart = {};

  saveCart();
  renderCart();
}

// Display cart items
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const cartSummary = document.getElementById("cartSummary");

  // These elements exist only on cart.html
  if (!cartItems || !emptyCart || !cartSummary) {
    return;
  }

  cartItems.innerHTML = "";

  const names = Object.keys(cart);

  // If cart is empty
  if (names.length === 0) {
    emptyCart.style.display = "block";
    cartSummary.style.display = "none";

    updateCartCount();
    return;
  }

  emptyCart.style.display = "none";
  cartSummary.style.display = "block";

  let subtotal = 0;

  // Display each cart item
  for (let name of names) {
    const item = cart[name];

    const itemTotal = item.price * item.quantity;

    subtotal += itemTotal;

    const div = document.createElement("div");

    div.className = "cart-item";

    const details = document.createElement("div");

    details.innerHTML = `
            <h3>${name}</h3>
            <p>Price: ₹${item.price}</p>
            <p>Item Total: ₹${itemTotal}</p>
        `;

    const controls = document.createElement("div");

    controls.className = "quantity-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.className = "btn btn-secondary";
    decreaseButton.textContent = "-";

    decreaseButton.addEventListener("click", () => {
      changeQuantity(name, -1);
    });

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.className = "btn btn-secondary";
    increaseButton.textContent = "+";

    increaseButton.addEventListener("click", () => {
      changeQuantity(name, 1);
    });

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-danger";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      removeItem(name);
    });

    controls.append(decreaseButton, quantity, increaseButton, removeButton);

    div.append(details, controls);

    cartItems.appendChild(div);
  }

  // Calculate delivery and total
  const delivery = 40;

  const discount = 0;

  const total = subtotal + delivery - discount;

  document.getElementById("subtotal").textContent = "₹" + subtotal;

  document.getElementById("delivery").textContent = "₹" + delivery;

  document.getElementById("discount").textContent = "₹" + discount;

  document.getElementById("total").textContent = "₹" + total;

  updateCartCount();
}

// Clear cart button
const clearButton = document.getElementById("clearCart");

if (clearButton) {
  clearButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  });
}

// Checkout button (demo)
const checkoutButton = document.getElementById("checkoutBtn");

if (checkoutButton) {
  checkoutButton.addEventListener("click", function () {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    alert("Checkout functionality will be added next.");
  });
}

// Initialize cart when page loads
updateCartCount();
renderCart();

