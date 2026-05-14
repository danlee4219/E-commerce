// LOAD ORDER DATA
function loadOrder() {

  let user = localStorage.getItem("currentUser");

  // safety check
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // user-wise cart
  let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

  let container = document.querySelector(".checkout-summary-box");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<h3>No items in cart</h3>";
    return;
  }

  let html = "<h3>Order Summary</h3>";
  let total = 0;

  cart.forEach(item => {
    total += item.price;

    html += `
    <div class="checkout-item" style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:12px 0;
      border-bottom:1px solid #eee;
      gap:10px;
    ">
      <span style="flex:1;">${item.title}</span>
      <span style="font-weight:bold;">$${item.price}</span>
    </div>
  `;
  });

  html += `<hr>`;
  html += `<p class="checkout-total">Total: $${total.toFixed(2)}</p>`;
  html += `<button class="place-btn" onclick="placeOrder()">Place Order</button>`;

  container.innerHTML = html;
}

window.onload = loadOrder;

// ORDER PLACE
function placeOrder() {

  //login + user check
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  let user = localStorage.getItem("currentUser");

  if (isLoggedIn !== "true" || !user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  //form validation
  let inputs = document.querySelectorAll(".checkout-form-box input, .checkout-form-box textarea");

  let isValid = true;

  inputs.forEach(input => {
    if (input.value.trim() === "") {
      input.style.border = "1px solid red";
      isValid = false;
    } else {
      input.style.border = "1px solid #ccc";
    }
  });

  if (!isValid) {
    alert("Please fill all details!");
    return;
  }

  //  USER-WISE CART LOAD
  let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  // USER-WISE ORDER LOAD
  let orders = JSON.parse(localStorage.getItem(`orders_${user}`)) || [];

  let newOrder = {
    id: Date.now(),
    items: cart,
    date: new Date().toLocaleString()
  };

  orders.push(newOrder);

  // SAVE USER-SPECIFIC ORDER
  localStorage.setItem(`orders_${user}`, JSON.stringify(orders));

  // clear USER cart
  localStorage.removeItem(`cart_${user}`);

  //success
  alert("Order placed successfully!");

  //SUCCESS UI
  document.body.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial;">
      <div style="background:#fff;padding:30px;border-radius:10px;text-align:center;">
        <h2 style="color:green;">✅ Order Placed!</h2>
        <p>Thank you for shopping 🎉</p>
        <button onclick="window.location.href='../index.html'" 
style="
  padding:12px 20px;
  background:#ff6a00;
  color:white;
  border:none;
  border-radius:6px;
  cursor:pointer;
  font-size:14px;
  transition:0.3s;
"
onmouseover="this.style.background='#e65c00'; this.style.transform='scale(1.05)'"
onmouseout="this.style.background='#ff6a00'; this.style.transform='scale(1)'"
>
  Continue Shopping
</button>
      </div>
    </div>
  `;
}
