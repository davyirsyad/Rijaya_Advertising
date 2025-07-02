// File: /js/RijayaAdv.js (Final dengan Notifikasi Toast)
let cart = [];

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({ duration: 800, once: true, offset: 100 });
  loadProducts();
  updateCartUI();
});

// di /js/RijayaAdv.js
async function loadProducts() {
  const productListContainer = document.getElementById("product-list"); // Nama variabelnya ini
  if (!productListContainer) return;
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error("Gagal memuat data produk.");
    const products = await response.json();
    productListContainer.innerHTML = "";
    products.forEach((product) => {
      const productCardHTML = `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-card-img-container">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="price">Rp ${product.price.toLocaleString("id-ID")}${product.priceUnit || ''}</p>
                    <button class="btn btn-danger w-100" onclick="addToCart('${product._id}', '${product.name.replace(/'/g, "\\'")}', ${product.price})">
                        <i class="bi bi-cart-plus-fill"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
      `;
      // PERBAIKAN DI SINI: gunakan variabel yang benar
      productListContainer.innerHTML += productCardHTML; 
    });
    if (window.AOS) AOS.refresh();
  } catch (error) {
    console.error("Gagal memuat produk:", error);
    productListContainer.innerHTML = `<p class="text-center text-danger col-12">${error.message}</p>`;
  }
}
async function registerUser() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  if (!name || !email || !password)
    return showToast("Mohon isi semua kolom.", "danger");
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registrasi Gagal");
    localStorage.setItem("userInfo", JSON.stringify(data));
    showToast("Registrasi berhasil!", "success");
    setTimeout(() => window.location.reload(), 1500);
  } catch (error) {
    showToast(`Registrasi Gagal: ${error.message}`, "danger");
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  if (!email || !password)
    return showToast("Mohon isi email dan password.", "danger");
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login Gagal");
    localStorage.setItem("userInfo", JSON.stringify(data));
    showToast("Login berhasil!", "success");
    setTimeout(() => window.location.reload(), 1500);
  } catch (error) {
    showToast(`Login Gagal: ${error.message}`, "danger");
  }
}

async function placeOrder() {
  const shippingInfo = {
    fullName: document.getElementById("checkoutName").value,
    email: document.getElementById("checkoutEmail").value,
    phone: document.getElementById("checkoutPhone").value,
    address: document.getElementById("checkoutAddress").value,
  };
  const paymentMethod = document.getElementById("checkoutPayment").value;
  if (!shippingInfo.fullName || !paymentMethod)
    return showToast("Mohon lengkapi semua informasi checkout.", "danger");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || !userInfo.token)
    return showToast("Autentikasi gagal. Silakan login kembali.", "danger");
  const orderData = {
    orderItems: cart,
    shippingInfo,
    paymentMethod,
    totalPrice: cart.reduce((acc, item) => acc + item.price * item.qty, 0),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal membuat pesanan.");
    }
    showToast("Terima kasih! Pesanan Anda telah berhasil dibuat.", "success");
    cart = [];
    updateCartUI();
    bootstrap.Modal.getInstance(
      document.getElementById("checkoutModal")
    ).hide();
  } catch (error) {
    showToast(`Error: ${error.message}`, "danger");
  }
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountBadge = document.querySelector(".cart-count");
  if (!cartItemsContainer || !cartTotalEl || !cartCountBadge) return;
  cartItemsContainer.innerHTML = "";
  let grandTotal = 0;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="text-center">Keranjang Anda kosong.</p>';
  } else {
    cart.forEach((item, index) => {
      const subTotal = item.price * item.qty;
      grandTotal += subTotal;
      const cartItemHTML = `<div class="cart-item"><div class="row align-items-center"><div class="col-md-7"><h6>${
        item.name
      }</h6><small>Rp ${item.price.toLocaleString("id-ID")} x ${
        item.qty
      }</small></div><div class="col-md-5 d-flex justify-content-end align-items-center"><span class="fw-bold me-3">Rp ${subTotal.toLocaleString(
        "id-ID"
      )}</span><button class="btn btn-sm btn-outline-danger" onclick="removeItemFromCart(${index})">&times;</button></div></div></div>`;
      cartItemsContainer.innerHTML += cartItemHTML;
    });
  }
  cartTotalEl.textContent = grandTotal.toLocaleString("id-ID");
  cartCountBadge.textContent = cart.reduce(
    (total, item) => total + item.qty,
    0
  );
}

function addToCart(productId, productName, productPrice) {
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      qty: 1,
    });
  }
  showToast(`'${productName}' ditambahkan ke keranjang!`);
  updateCartUI();
}

function removeItemFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function switchToRegister() {
  bootstrap.Modal.getInstance(document.getElementById("loginModal"))?.hide();
  new bootstrap.Modal(document.getElementById("registerModal")).show();
}

function switchToLogin() {
  bootstrap.Modal.getInstance(document.getElementById("registerModal"))?.hide();
  new bootstrap.Modal(document.getElementById("loginModal")).show();
}

function proceedToCheckout() {
  if (cart.length === 0) return showToast("Keranjang Anda kosong!", "danger");
  bootstrap.Modal.getInstance(document.getElementById("cartModal"))?.hide();
  new bootstrap.Modal(document.getElementById("checkoutModal")).show();
}
