// File: /js/admin.js (Final dengan UX Improvements)
document.addEventListener("DOMContentLoaded", () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || !userInfo.isAdmin) {
    showToast("Akses ditolak. Anda harus login sebagai admin.", "danger");
    setTimeout(() => (window.location.href = "index.html"), 2000);
    return;
  }

  const productListBody = document.getElementById("product-list-admin");
  const orderListBody = document.getElementById("order-list-admin");
  const productForm = document.getElementById("product-form");
  const formTitle = document.getElementById("form-title");
  const productIdInput = document.getElementById("product-id");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const totalProductsStat = document.getElementById("total-products-stat");
  const totalOrdersStat = document.getElementById("total-orders-stat");

  const fetchProducts = async () => {
    const loadingRow = document.getElementById("loading-products");
    if (loadingRow) loadingRow.style.display = "table-row";
    productListBody.innerHTML = "";
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error("Gagal memuat produk.");
      const products = await response.json();
      totalProductsStat.textContent = products.length;
      if (products.length === 0) {
        productListBody.innerHTML =
          '<tr><td colspan="4" class="text-center">Belum ada produk.</td></tr>';
        return;
      }
      products.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
    <td><img src="${p.image}" alt="${
          p.name
        }" width="80" style="border-radius: 8px; object-fit: cover; height: 60px;"></td>
    <td>${p.name}</td>
    <td>Rp ${p.price.toLocaleString("id-ID")}</td>
    <td class="action-cell">
        <button class="btn btn-sm btn-primary btn-edit" data-id="${
          p._id
        }">Edit</button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${
          p._id
        }">Hapus</button>
    </td>
`;
        productListBody.appendChild(tr);
      });
    } catch (error) {
      productListBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">${error.message}</td></tr>`;
    } finally {
      if (loadingRow) loadingRow.style.display = "none";
    }
  };

  const fetchOrders = async () => {
    const loadingRow = document.getElementById("loading-orders");
    if (loadingRow) loadingRow.style.display = "table-row";
    orderListBody.innerHTML = "";
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat pesanan.");
      const orders = await response.json();
      totalOrdersStat.textContent = orders.length;
      if (orders.length === 0) {
        orderListBody.innerHTML =
          '<tr><td colspan="6" class="text-center">Belum ada pesanan.</td></tr>';
        return;
      }
      orders.forEach((order) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${order._id}</td><td>${
          order.user ? order.user.name : "N/A"
        }</td><td>${new Date(order.createdAt).toLocaleDateString(
          "id-ID"
        )}</td><td>Rp ${order.totalPrice.toLocaleString("id-ID")}</td><td>${
          order.isPaid
            ? `<span class="badge bg-success">Lunas</span>`
            : `<span class="badge bg-danger">Belum Lunas</span>`
        }</td><td><button class="btn btn-sm btn-info btn-detail" data-id="${
          order._id
        }">Detail</button></td>`;
        orderListBody.appendChild(tr);
      });
    } catch (error) {
      orderListBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${error.message}</td></tr>`;
    } finally {
      if (loadingRow) loadingRow.style.display = "none";
    }
  };

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = productIdInput.value;
    const productData = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      priceUnit: document.getElementById("priceUnit").value,
      image: document.getElementById("image").value,
      description: document.getElementById("description").value,
    };
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_BASE_URL}/api/products/${id}`
      : `${API_BASE_URL}/api/products`;
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal menyimpan produk");
      }
      showToast(
        id ? "Produk berhasil diperbarui!" : "Produk baru berhasil ditambahkan!"
      );
      resetForm();
      fetchProducts();
    } catch (error) {
      showToast(`Error: ${error.message}`, "danger");
    }
  });

  productListBody.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.dataset.id;
    if (target.classList.contains("btn-delete")) {
      if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Gagal menghapus produk");
          }
          showToast("Produk berhasil dihapus!", "success");
          fetchProducts();
        } catch (error) {
          showToast(`Error: ${error.message}`, "danger");
        }
      }
    }
    if (target.classList.contains("btn-edit")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const product = await response.json();
        formTitle.textContent = "Edit Produk";
        productIdInput.value = product._id;
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("priceUnit").value = product.priceUnit;
        document.getElementById("image").value = product.image;
        document.getElementById("description").value = product.description;
        cancelEditBtn.classList.remove("d-none");
        window.scrollTo(0, 0);
      } catch (error) {
        showToast("Gagal mengambil data produk.", "danger");
      }
    }
  });

  orderListBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-detail")) {
      showOrderDetail(e.target.dataset.id);
    }
  });

  async function showOrderDetail(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (!response.ok) throw new Error("Gagal mengambil detail pesanan.");
      const order = await response.json();
      document.getElementById("order-detail-id").textContent = order._id;
      document.getElementById("order-detail-date").textContent = new Date(
        order.createdAt
      ).toLocaleString("id-ID");
      document.getElementById("order-detail-customer-name").textContent =
        order.user.name;
      document.getElementById("order-detail-customer-email").textContent =
        order.user.email;
      document.getElementById(
        "order-detail-shipping"
      ).textContent = `${order.shippingInfo.fullName}, ${order.shippingInfo.phone}, ${order.shippingInfo.address}`;
      const itemsTableBody = document.getElementById("order-detail-items");
      itemsTableBody.innerHTML = "";
      order.orderItems.forEach((item) => {
        itemsTableBody.innerHTML += `<tr><td>${
          item.name
        }</td><td>Rp ${item.price.toLocaleString("id-ID")}</td><td>${
          item.qty
        }</td><td>Rp ${(item.price * item.qty).toLocaleString(
          "id-ID"
        )}</td></tr>`;
      });
      document.getElementById(
        "order-detail-total"
      ).textContent = `Rp ${order.totalPrice.toLocaleString("id-ID")}`;
      new bootstrap.Modal(document.getElementById("orderDetailModal")).show();
    } catch (error) {
      showToast(error.message, "danger");
    }
  }

  const resetForm = () => {
    formTitle.textContent = "Tambah Produk Baru";
    productForm.reset();
    productIdInput.value = "";
    cancelEditBtn.classList.add("d-none");
  };
  cancelEditBtn.addEventListener("click", resetForm);

  fetchProducts();
  fetchOrders();
});
