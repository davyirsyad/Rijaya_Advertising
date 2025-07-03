// File: /js/main.js (Final, Lengkap, dan Profesional)

// Variabel global untuk alamat API, dideklarasikan hanya di sini.
const API_BASE_URL = "https://rijaya-api.vercel.app";

/**
 * Fungsi untuk memuat komponen HTML dari file eksternal ke dalam selector.
 * @param {string} selector - Selector CSS untuk elemen placeholder (misal: '#navbar-placeholder').
 * @param {string} url - Path ke file komponen HTML (misal: 'components/navbar.html').
 */
const loadComponent = async (selector, url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Gagal memuat ${url}`);
    const data = await response.text();
    const element = document.querySelector(selector);
    if (element) element.innerHTML = data;
    return element;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fungsi untuk mengubah background navbar saat halaman di-scroll.
 */
const handleNavbarScroll = () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  if (window.scrollY > 50) {
    // Tambahkan class 'scrolled' jika scroll lebih dari 50px
    navbar.classList.add("scrolled");
  } else {
    // Hapus class 'scrolled' jika kembali ke atas
    navbar.classList.remove("scrolled");
  }
};

/**
 * Fungsi untuk menampilkan notifikasi modern (toast) pengganti alert().
 * @param {string} message - Pesan yang ingin ditampilkan.
 * @param {string} type - Jenis notifikasi ('success' atau 'danger').
 */
function showToast(message, type = "success") {
  const toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) return;

  const toastId = "toast-" + Math.random().toString(36).substr(2, 9);
  const toastBg = type === "success" ? "bg-success" : "bg-danger";

  const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${toastBg} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();
  toastElement.addEventListener("hidden.bs.toast", () => toastElement.remove());
}

/**
 * Fungsi untuk memeriksa status login dari localStorage saat halaman dimuat.
 */
function checkLoginStatus() {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.name) {
      updateUIAfterLogin(userInfo);
    }
  } catch (e) {
    localStorage.removeItem("userInfo");
  }
}

/**
 * Fungsi untuk memperbarui tampilan UI navbar setelah user login.
 * @param {object} userInfo - Objek berisi data user.
 */
function updateUIAfterLogin(userInfo) {
  const loginNavItem = document.getElementById("login-nav-item");
  if (!loginNavItem) return;

  const adminLink = userInfo.isAdmin
    ? `<li><a class="dropdown-item" href="admin.html">Admin Dashboard</a></li><li><hr class="dropdown-divider"></li>`
    : "";

  loginNavItem.innerHTML = `
    <div class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-person-fill"></i> ${userInfo.name}
      </a>
      <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="userMenu">
          ${adminLink}
          <li><a class="dropdown-item" href="#" onclick="logoutUser()">Logout</a></li>
      </ul>
    </div>`;
}

/**
 * Fungsi untuk logout, menghapus data dari localStorage dan me-reload halaman.
 */
function logoutUser() {
  localStorage.removeItem("userInfo");
  window.location.href = "index.html";
}

// --- EVENT LISTENER UTAMA ---
// Dijalankan saat seluruh struktur HTML halaman selesai dimuat.
document.addEventListener("DOMContentLoaded", async () => {
  // Muat komponen secara asynchronous
  await loadComponent("#navbar-placeholder", "components/navbar.html");
  await loadComponent("#footer-placeholder", "components/footer.html");

  // Setelah komponen dimuat, jalankan fungsi-fungsi yang bergantung padanya
  checkLoginStatus();

  // Atur event listener untuk scroll
  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll(); // Panggil sekali saat load untuk mengatur state awal navbar
});
