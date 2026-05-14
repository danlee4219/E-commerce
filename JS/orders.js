// LOAD ORDERS
function loadOrders() {

    let user = localStorage.getItem("currentUser");

    //safety check
    if (!user) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    //user-wise orders load
    let orders = JSON.parse(localStorage.getItem(`orders_${user}`)) || [];

    let container = document.getElementById("ordersContainer");

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = "<h3>No orders yet</h3>";
        return;
    }

    let html = "";

    // latest order upar
    orders.slice().reverse().forEach(order => {

        html += `
      <div class="order">
        <h4>Order ID: ${order.id}</h4>
        <p class="date">${order.date}</p>
    `;

        let total = 0;

        order.items.forEach(item => {
            total += item.price;

            html += `
        <div class="item">
          <span>${item.title}</span>
          <span>$${item.price}</span>
        </div>
      `;
        });

        html += `<p><b>Total: $${total.toFixed(2)}</b></p>`;

        html += `</div>`;
    });

    container.innerHTML = html;
}

window.onload = loadOrders;