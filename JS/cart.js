//Check login
document.addEventListener("DOMContentLoaded", function () {

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = localStorage.getItem("currentUser");

  if (isLoggedIn !== "true" || !user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  loadCart();
});


//LOAD CART
function loadCart() {

  let user = localStorage.getItem("currentUser");

  //safety check
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // user-wise cart load
  const cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

  const container = document.querySelector(".cart-items");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<h3>Your cart is empty</h3>";
    return;
  }

  let total = 0;
  container.innerHTML = "";

  cart.forEach((item, index) => {

    total += item.price;

    let rate = item.rating ? item.rating.rate : 0;
    let count = item.rating ? item.rating.count : 0;

    container.innerHTML += `
      <div class="cart-card">
        <img src="${item.image}">
        <div class="cart-info">
          <h4>${item.title}</h4>
          <p class="rating">⭐ ${rate} (${count} reviews)</p>
          <p>$${item.price}</p>
        </div>
        <div class="cart-actions">
          <button onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  document.querySelector(".summary p").innerText = "Total: $" + total;
}


// REMOVE ITEM
function removeItem(index) {

  let user = localStorage.getItem("currentUser");

  // safety
  if (!user) {
    alert("Please login first!");
    return;
  }

  let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

  cart.splice(index, 1);

  localStorage.setItem(`cart_${user}`, JSON.stringify(cart));

  //UI refresh
  loadCart();
}

// checkout function
function goToOrder() {

  let isLoggedIn = localStorage.getItem("isLoggedIn");
  let user = localStorage.getItem("currentUser");

  //login + user check
  if (isLoggedIn !== "true" || !user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // user-wise cart
  let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  //redirect
  window.location.href = "checkout.html";
}



