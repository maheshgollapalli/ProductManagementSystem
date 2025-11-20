// ---------- Fetch and render products ----------
let productsData = [];
let cartItems = [];

// ---------- Load Cart From localStorage ----------
let savedCart = localStorage.getItem("cartData");
if (savedCart) {
  try {
    cartItems = JSON.parse(savedCart);
  } catch (e) {
    cartItems = [];
  }
}
renderCart(); // Show saved cart on page load

async function showData() {
  try {
    let res = await fetch("http://localhost:8081/products");
    if (!res.ok) throw new Error("Data not found");
    let data = await res.json();
    productsData = data;
    getData(data);
  } catch (error) {
    console.error(error);
  }
}
showData();

function getData(data) {
  let container = document.getElementById("container");
  container.innerHTML = "";

  data.forEach(obj => {
    const rating = obj.rate || (obj.rating && obj.rating.rate) || "N/A";
    const item = document.createElement("div");
    item.className = "product-card";

    item.innerHTML = `
      <h3>${escapeHtml(obj.title)}</h3>
      <center><img src="${escapeHtml(obj.image)}" class="image" alt="${escapeHtml(obj.title)}" /></center>
      <p class="meta">Price: <span class="price">$${Number(obj.price).toFixed(2)}</span></p>
      <p class="meta">Description: ${escapeHtml(truncate(obj.description, 90))}</p>
      <p class="meta">Rating: <span class="rating">${escapeHtml(rating)}</span></p>
      <p class="meta">Stock: ${obj.count ?? (obj.rating && obj.rating.count) ?? "N/A"}</p>
      <button onclick="addCart(${obj.id}, this)">Add to Cart</button>
      <p class="added-msg" style="display:none; color:green; font-weight:600;">Item added to cart!</p>
    `;

    container.appendChild(item);
  });
}

// ---------- Cart open/close ----------
function toggleCart() {
  let cart = document.getElementById("openCart");
  if (cart.classList.contains("active")) {
    cart.classList.remove("active");
    setTimeout(() => (cart.style.display = "none"), 250);
  } else {
    cart.style.display = "block";
    setTimeout(() => cart.classList.add("active"), 10);
  }
}

// ---------- Add to cart ----------
function addCart(id, btn) {
  const prod = productsData.find(p => Number(p.id) === Number(id));
  if (!prod) return alert("Product not found");

  const existing = cartItems.find(i => Number(i.id) === Number(id));
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      id: prod.id,
      title: prod.title,
      price: Number(prod.price) || 0,
      image: prod.image,
      rating: prod.rating?.rate || "N/A",
      qty: 1
    });
  }

  renderCart();
  
  const msg = btn.parentElement.querySelector(".added-msg");
  msg.style.display = "block";
  msg.style.opacity = "1";
  setTimeout(() => (msg.style.opacity = "0"), 1500);
  setTimeout(() => (msg.style.display = "none"), 1800);
}

// ---------- Change quantity ----------
function changeQty(id, delta) {
  const item = cartItems.find(i => Number(i.id) === Number(id));
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) item.qty = 1;
  renderCart();
}

// ---------- Remove item ----------
function removeItem(id) {
  cartItems = cartItems.filter(i => Number(i.id) !== Number(id));
  renderCart();
}

// ---------- Render cart ----------
function renderCart() {
  localStorage.setItem("cartData", JSON.stringify(cartItems)); // SAVE TO LOCALSTORAGE

  const cartBody = document.getElementById("cartBody");
  if (!cartBody) return;

  cartBody.innerHTML = "";

  if (cartItems.length === 0) {
    cartBody.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let grandTotal = 0;

  cartItems.forEach(item => {
    const itemTotal = item.price * item.qty;
    grandTotal += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
      <div class="info">
        <div class="title">${escapeHtml(item.title)}</div>
        <div class="meta">Rating: <span class="rating">${escapeHtml(item.rating)}</span></div>
        <div class="meta">Price: <span class="price">$${Number(item.price).toFixed(2)}</span></div>
        <div class="qty-controls">
          <button onclick="changeQty('${item.id}', -1)">−</button>
          <span class="count">${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
          <button class="remove-btn" style="width:55px;" onclick="removeItem('${item.id}')">Delete</button>
        </div>
      </div>
      <div class="item-right">
        <div class="item-total">$${Number(itemTotal).toFixed(2)}</div>
      </div>
    `;

    cartBody.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total";
  totalDiv.innerHTML = `
      <div>Total</div>
      <div>$${Number(grandTotal).toFixed(2)}</div>
      <button onClick="paymentGateway(${grandTotal})">Buy Now</button>
  `;

  cartBody.appendChild(totalDiv);
}

// ---------PaymentGateway---------
function paymentGateway(amount) {
  let newWindow = window.open("", "_blank", "width=500,height=400");
  payment(newWindow, amount);
  newWindow.alert("The payment window will close after 10 mins.(Please do payment on or before given time)).");
  setTimeout(() => {
    if (newWindow && !newWindow.closed) {
      newWindow.close();
    }
  }, 599999);
}

function payment(win, amount) {
  win.document.write(`
    <p>This window will close after 10 minutes.</p>
    <h2 style="color:green; text-align:center;">Payment Gateway</h2>
    <p style="text-align:center;">Processing amount: $${amount}</p>
    <input type="radio" name="upi" value="phonepe">Phonepe<br>
    <input type="radio" name="upi" value="googlePay">Google Pay<br>
    <input type="radio" name="upi" value="bhim">BHIM<br>
    <input type="radio" name="upi" value="paytm">Paytm<br>
    <button>Pay $${amount}</button>
  `);
}

// ---------- Helpers ----------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

// Welcome button 
function scrollToProducts() {
  const productsSection = document.getElementById("container");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  }
}
