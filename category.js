const API_URL = "https://fakestoreapi.com/products";
const CATEGORIES_URL = "https://fakestoreapi.com/products/categories";
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Initialize cart from localStorage if available

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function fetchCategories() {
  try {
    const response = await fetch(CATEGORIES_URL);
    const categories = await response.json();
    renderCategoryFilters(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function renderCategoryFilters(categories) {
  const filtersContainer = document.getElementById("category-filters");
  filtersContainer.innerHTML = "";

  categories.forEach((category) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "category";
    checkbox.value = category;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(category));
    filtersContainer.appendChild(label);
    filtersContainer.appendChild(document.createElement("br"));
  });

  filtersContainer.addEventListener("change", () => {
    const selectedCategories = Array.from(
      document.querySelectorAll(
        "#category-filters input[type=checkbox]:checked"
      )
    ).map((checkbox) => checkbox.value);
    const sortBy = document.getElementById("sort-by").value;
    fetchProducts(selectedCategories, sortBy);
  });
}

async function fetchProducts(selectedCategories = [], sortBy = "default") {
  try {
    const response = await fetch(API_URL);
    let products = await response.json();

    if (selectedCategories.length > 0) {
      products = products.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (sortBy === "low-to-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
      products.sort((a, b) => b.price - a.price);
    }

    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderProducts(products) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <i class="fas fa-heart add-to-cart"></i>
    `;

    productCard.addEventListener("click", (event) => {
      if (event.target.classList.contains("add-to-cart")) {
        event.target.classList.toggle("clicked");
        addToCart(product);
      } else {
        window.location.href = `product-details.html?id=${product.id}`;
      }
    });

    container.appendChild(productCard);
  });

  document.getElementById(
    "product-count"
  ).textContent = `${products.length} Results`;
}

function addToCart(product, quantity = 1) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity: quantity });
  }
  saveCartToLocalStorage();
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>No items in the cart.</p>";
    return;
  }
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h4>${item.title}</h4>
      <p>Quantity: ${item.quantity}</p>
      <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
    `;
    cartContainer.appendChild(cartItem);
  });
}

function toggleCart() {
  const cartModal = document.getElementById("cart-modal");
  cartModal.classList.toggle("visible");
}

function initSortingControls() {
  const sortBySelect = document.getElementById("sort-by");

  sortBySelect.addEventListener("change", () => {
    const selectedCategories = Array.from(
      document.querySelectorAll(
        "#category-filters input[type=checkbox]:checked"
      )
    ).map((checkbox) => checkbox.value);
    fetchProducts(selectedCategories, sortBySelect.value);
  });
}

// Initialize
async function init() {
  await fetchCategories();
  await fetchProducts();
  updateCartCount(); // Update the cart count on load
  renderCart(); // Render the initial cart
  initSortingControls(); // Initialize sorting controls
}

init();
