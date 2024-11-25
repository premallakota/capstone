document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  if (productId) {
    fetchProductDetails(productId);
  }
});

async function fetchProductDetails(productId) {
  try {
    const response = await fetch(`${API_URL}/${productId}`);
    const product = await response.json();
    renderProductDetails(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

function renderProductDetails(product) {
  const container = document.getElementById("product-details");
  container.innerHTML = `
      <div class="product-images">
        <div class="thumbnail-images">
          <img src="${product.image}" alt="${product.title}">
          <img src="${product.image}" alt="${product.title}">
          <img src="${product.image}" alt="${product.title}">
          <img src="${product.image}" alt="${product.title}">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="main-image">
          <img src="${product.image}" alt="${product.title}">
        </div>
      </div>
      <div class="product-info">
        <h1>${product.title}</h1>
        <p class="price">$${product.price}</p>
        <div class="rating">
          <span>⭐⭐⭐⭐⭐</span>
          <span>(175)</span>
        </div>
        <p class="description">${product.description}</p>
        <div class="quantity">
          <label for="quantity">Quantity</label>
          <div class="quantity-controls">
            <button id="decrement">-</button>
            <input type="number" id="quantity" min="1" value="1">
            <button id="increment">+</button>
          </div>
        </div>
        <button class="add-to-cart" data-id="${product.id}">ADD TO CART</button>
        <div class="actions">
          <button class="save">Save</button>
          <button class="share">Share</button>
        </div>
      </div>
    `;

  document.querySelector(".add-to-cart").addEventListener("click", () => {
    const quantity = parseInt(document.getElementById("quantity").value);
    addToCart(product, quantity);
  });

  updateCartCount();
  renderCart();

  // Quantity controls
  const quantityInput = document.getElementById("quantity");
  document.getElementById("increment").addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });
  document.getElementById("decrement").addEventListener("click", () => {
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  });
}
