const API_URL = "https://fakestoreapi.com/products";

let allProducts = [];

// INIT
async function init() {
    await fetchProducts();
    renderFeaturedProducts();
    renderRecommendedProducts();
    renderAllProducts();

}

// FETCH PRODUCTS
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        allProducts = data;
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// FEATURED
function renderFeaturedProducts() {

    const container = document.getElementById("productContainer");
    if (!container) return;

    container.innerHTML = "";

    allProducts.slice(0, 6).forEach(product => {
        container.innerHTML += createProductCard(product);
    });
}

// RECOMMENDED
function renderRecommendedProducts() {

    const container = document.getElementById("recommendedContainer");
    if (!container) return;

    container.innerHTML = "";

    allProducts.slice(8, 20).forEach(product => {
        container.innerHTML += createProductCard(product);
    });
}
// All products
function renderAllProducts() {
    const container = document.getElementById("allProductsContainer");

    if (!container) return;

    container.innerHTML = "";

    allProducts.forEach(p => {
        container.innerHTML += createProductCard(p);
    });
}

// CARD (SAME DESIGN)
function createProductCard(product) {
    let added = isInCart(product.id);

    let liked = false;

    if (typeof isInWishlist === "function") {
        liked = isInWishlist(product.id);
    }

    let inCart = false;

    if (typeof isInCart === "function") {
        inCart = isInCart(product.id);
    }
    return `
    <div class="card">

      <img src="${product.image}" />
      <h3>${product.title}</h3>
       <p class="rating">
             ⭐ ${product.rating.rate} 
             (${product.rating.count} reviews)
         </p>
      <p>$ ${product.price}</p>

      <div class="buttons">
        <button style="background:${inCart ? 'green' : '#ff6a00'};color:white;padding:8px;border:none;border-radius:6px;cursor:pointer" onclick="addToCart(${product.id})">
           ${added ? "Added in Cart" : "Add to Cart"}
        </button>

        <button style="background:${liked ? 'red' : '#ddd'};color:${liked ? 'white' : 'black'};padding:8px;border:none;border-radius:6px;cursor:pointer"
          onclick="addToWishlist(${product.id})">
             ${liked ? "Liked" : "Like"}
        </button>
      </div>

    </div>
  `;
}

// NAVBAR UPDATE
function updateNavbar() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userName = localStorage.getItem("currentUserName");

    const userText = document.querySelector("#userText");
    const authBtn = document.querySelector(".authBtn");

    if (!userText || !authBtn) {
        console.log("Navbar elements not found");
        return;
    }

    if (isLoggedIn === "true") {
        userText.innerHTML = "Hi, " + userName + "&nbsp;";
        authBtn.innerHTML = `<button style="background:#ef4444;color:white;padding:8px 12px;border:none;border-radius:6px;">Logout</button>`;
    } else {
        userText.textContent = "";
        authBtn.innerHTML = `<button style="background:#2563eb;color:white;padding:8px 12px;border:none;border-radius:6px;">Login</button>`;
    }
}

//LOGIN / LOGOUT BUTTON
function handleAuth() {

    let isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentUserName");

        alert("Logged out!");

        location.reload();

    } else {

        // 🔥 dynamic login redirect
        if (window.location.pathname.includes("Pages")) {

            window.location.href = "login.html";

        } else {

            window.location.href = "Pages/login.html";
        }
    }
}

// ADD TO CART
function addToCart(id) {

    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let user = localStorage.getItem("currentUser");

    // LOGIN + USER CHECK
    if (isLoggedIn !== "true" || !user) {
        alert("Please login first!");
        if (window.location.pathname.includes("Pages")) {

            window.location.href = "login.html";

        } else {

            window.location.href = "Pages/login.html";
        }
        return;
    }

    // USER-WISE CART LOAD
    let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

    let product = allProducts.find(p => p.id === id);

    if (!product) {
        alert("Product not found!");
        return;
    }

    let exists = cart.some(item => item.id === id);

    if (exists) {
        alert("Already in cart!");
        return;
    }

    cart.push(product);

    //SAVE USER-WISE CART
    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));

    // alert("Added to cart!");

    location.reload();
}

// add to wishlist
function addToWishlist(id) {

    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let user = localStorage.getItem("currentUser");

    //LOGIN + USER CHECK
    if (isLoggedIn !== "true" || !user) {
        alert("Please login first!");
        if (window.location.pathname.includes("Pages")) {

            window.location.href = "login.html";

        } else {

            window.location.href = "Pages/login.html";
        }
        return;
    }

    //USER-WISE WISHLIST
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

    let product = allProducts.find(p => p.id === id);

    if (!product) {
        alert("Product not found!");
        return;
    }

    let exists = wishlist.some(item => item.id === id);

    if (exists) {
        alert("Already in wishlist!");
        return;
    }

    wishlist.push(product);

    // SAVE USER-WISE
    localStorage.setItem(`wishlist_${user}`, JSON.stringify(wishlist));

    // refresh UI
    location.reload();
}

// added in cart
function isInCart(id) {

    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let user = localStorage.getItem("currentUser");

    //not logged in → always false
    if (isLoggedIn !== "true" || !user) {
        return false;
    }

    //user-wise cart
    let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

    return cart.some(item => item.id === id);
}

// added in wishlist
function isInWishlist(id) {

    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let user = localStorage.getItem("currentUser");

    // not logged in → always false
    if (isLoggedIn !== "true" || !user) {
        return false;
    }

    // user-wise wishlist
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

    return wishlist.some(item => item.id === id);
}

window.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {
        updateNavbar();
    }, 50);

    if (document.querySelector(".category-btn")) {
        setActiveCategory();
    }

    // setActiveCategory();

    let query = localStorage.getItem("searchQuery");
    let category = localStorage.getItem("selectedCategory");

    if (query) {

        init().then(() => {
            filterProducts(query);
            localStorage.removeItem("searchQuery");
        });

    } else if (category) {

        init().then(() => {
            filterByCategory();

            localStorage.removeItem("selectedCategory");
        });

    } else {

        init();
    }
});


// search products 
function filterProducts(searchText) {

    let container = document.getElementById("allProductsContainer");
    if (!container) return;

    // clean input
    searchText = searchText.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");

    let words = searchText.split(" ").filter(w => w.length > 1);

    let scored = allProducts.map(p => {

        let title = p.title.toLowerCase();
        let category = p.category.toLowerCase();

        let score = 0;

        //exact phrase
        if (title.includes(searchText)) score += 5;

        //category match
        if (category.includes(searchText)) score += 4;

        //word match
        words.forEach(word => {
            if (title.includes(word)) score += 2;
            if (category.includes(word)) score += 2;
        });

        return { product: p, score };
    });

    // filter + sort
    let filtered = scored
        .filter(item => item.score >= 2)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);

    container.innerHTML = "";

    //fallback (NO RANDOM JUNK)
    if (filtered.length === 0) {
        container.innerHTML = "<h3>No products found 😢</h3>";
        return;
    }

    //render
    filtered.forEach(product => {
        container.innerHTML += createProductCard(product);
    });
}


let input = document.getElementById("searchInput");

if (input) {
    input.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            let value = this.value.toLowerCase().trim();

            localStorage.setItem("searchQuery", value);

            if (window.location.pathname.includes("Pages")) {

                window.location.href = "product.html";

            } else {

                window.location.href = "Pages/product.html";
            }
        }

    });
}


// voice search
let voiceBtn = document.getElementById("voiceBtn");
let searchInput = document.getElementById("searchInput");

let defaultIcon = voiceBtn.innerHTML;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
}

//VOICE ONLY SEARCH
if (voiceBtn && recognition) {

    voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.innerText = "🎙️ Listening...";
    });

    recognition.onresult = function (event) {

        let transcript = event.results[0][0].transcript.toLowerCase();

        //CLEAN TEXT
        transcript = transcript
            .replace(/[.,!?]/g, "")
            .replace(/\b(show|me|buy|search|for|please|find)\b/g, "") // remove useless words
            .trim();

        console.log("Voice Cleaned:", transcript);

        //input box me show karo
        if (searchInput) {
            searchInput.value = transcript;
        }

        // save query
        localStorage.setItem("searchQuery", transcript);

        //safe redirect (delay fix)
        setTimeout(() => {
            if (window.location.pathname.includes("Pages")) {

                window.location.href = "product.html";

            } else {

                window.location.href = "Pages/product.html";
            }
        }, 200);
    };

    recognition.onend = function () {
        voiceBtn.innerHTML = defaultIcon;
    };

    recognition.onerror = function (event) {
        console.log("Speech error:", event.error);

        switch (event.error) {
            case "not-allowed":
                alert("❌ Mic permission denied. Allow microphone in browser settings.");
                break;

            case "service-not-allowed":
                alert("❌ Speech service blocked. Check Chrome settings.");
                break;

            case "no-speech":
                alert("🎤 No speech detected. Try speaking clearly.");
                break;

            case "network":
                alert("⚠️ Network issue. Voice API not reachable.");
                break;

            default:
                alert("❌ Voice error: " + event.error);
        }

        voiceBtn.innerHTML = defaultIcon;
    };
}

// category buttons
document.querySelectorAll(".category-btn").forEach(btn => {

    btn.addEventListener("click", function () {

        let category = this.getAttribute("data-category");

        localStorage.setItem("selectedCategory", category);

        // dynamic redirect fix
        if (window.location.pathname.includes("Pages")) {

            window.location.href = "product.html";

        } else {

            window.location.href = "Pages/product.html";
        }

    });

});



function filterByCategory() {

    let category = localStorage.getItem("selectedCategory");

    let container = document.getElementById("allProductsContainer");

    if (!container || !category) return;

    category = category.toLowerCase().trim();

    let filtered = allProducts.filter(p => {
        return p.category.toLowerCase().trim() === category;
    });

    console.log("Filtered result:", filtered);

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<h3>No products found 😢</h3>";
        return;
    }

    filtered.forEach(product => {
        container.innerHTML += createProductCard(product);
    });
}

function setActiveCategory() {

    let category = localStorage.getItem("selectedCategory");

    console.log("Active category:", category);

    if (!category) return;

    document.querySelectorAll(".category-btn").forEach(btn => {

        let btnCategory = btn.getAttribute("data-category");

        if (btnCategory === category) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }

    });
}
