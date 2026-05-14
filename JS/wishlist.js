document.addEventListener("DOMContentLoaded", function () {

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = localStorage.getItem("currentUser");

  //better login check
  if (isLoggedIn !== "true" || !user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  loadWishlist();
});

// WISHLIST LOAD
function loadWishlist() {

  let user = localStorage.getItem("currentUser");

  let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];
  let container = document.querySelector(".wishlist-container");
  let empty = document.querySelector(".empty");

  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = "";
    if (empty) {
      empty.style.display = "block";
    }
    // empty.style.display = "block";
    return;
  }
    if (empty) {
    empty.style.display = "none";
  }
  // empty.style.display = "none";

  container.innerHTML = "";

  wishlist.forEach((item, index) => {

    let rate = item.rating ? item.rating.rate : 0;
    let count = item.rating ? item.rating.count : 0;

    container.innerHTML += `
      <div class="wishlist-card">
        <img src="${item.image}">
        <h4>${item.title}</h4>
        <p class="rating">⭐ ${rate} (${count} reviews)</p>
        <p class="wishlist-price">$${item.price}</p>

        <div class="wishlist-buttons">
          <button class="wishlist-cart-btn" onclick="addToCart(${index})">
            Add to Cart
          </button>
          <button class="wishlist-remove-btn" onclick="removeWish(${index})">
            Remove
          </button>
        </div>
      </div>
    `;
  });
}

// Add to Cart
function addToCart(index) {

  let user = localStorage.getItem("currentUser");

  let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];
  let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

  let product = wishlist[index];

  if (!product) {
    alert("Product not found!");
    return;
  }

  // duplicate check
  let exists = cart.some(item => item.id === product.id);

  if (!exists) {
    cart.push(product);
  }

  // ALWAYS SAVE CART (important)
  localStorage.setItem(`cart_${user}`, JSON.stringify(cart));

  //remove from wishlist
  wishlist.splice(index, 1);
  localStorage.setItem(`wishlist_${user}`, JSON.stringify(wishlist));

  loadWishlist();
}

// REMOVE FROM WISHLIST
function removeWish(index) {

  let user = localStorage.getItem("currentUser");

  let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

  wishlist.splice(index, 1);

  localStorage.setItem(`wishlist_${user}`, JSON.stringify(wishlist));

  loadWishlist();
}