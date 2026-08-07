import {
  db,
  collection,
  addDoc
} from "./firebase.js";

import {
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// =====================================
// GENERATE ORDER ID
// =====================================

function generateOrderId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const date = new Date();

  return `CP${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${random}`;
}

// =====================================
// DATA LAYANAN (sementara lokal)
// Nanti akan diganti Firebase/API Indosmm
// =====================================

const serviceData = {
  instagram: [
    {
      serviceId: "IG1001",
      category: "Instagram Indonesia",
      name: "Instagram Likes Indonesia",
      description: "High Quality Likes Indonesia",
      price: 8900,
      estimate: "25 menit",
      min: 10,
      max: 50000
    },
    {
      serviceId: "IG1002",
      category: "Instagram Indonesia",
      name: "Instagram Comments Indonesia",
      description: "Random Indonesian Comments",
      price: 14500,
      estimate: "6 menit - 24 jam",
      min: 10,
      max: 10000
    },
    {
      serviceId: "IG1003",
      category: "Instagram Indonesia",
      name: "Instagram Reels Views",
      description: "Real Indonesian Reels Views",
      price: 10000,
      estimate: "0 - 6 jam",
      min: 10,
      max: 200000
    }
  ],

  tiktok: [
    {
      serviceId: "TT2001",
      category: "TikTok Indonesia",
      name: "TikTok Viral Views",
      description: "Fast TikTok Views Indonesia",
      price: 2000,
      estimate: "0 - 6 jam",
      min: 100,
      max: 500000
    },
    {
      serviceId: "TT2002",
      category: "TikTok Indonesia",
      name: "TikTok Likes",
      description: "High Quality TikTok Likes",
      price: 2600,
      estimate: "0 - 12 jam",
      min: 100,
      max: 100000
    },
    {
      serviceId: "TT2003",
      category: "TikTok Indonesia",
      name: "TikTok Share",
      description: "Real TikTok Shares",
      price: 3000,
      estimate: "1 - 24 jam",
      min: 100,
      max: 50000
    }
  ],

  twitter: [
    {
      serviceId: "X3001",
      category: "Twitter Global",
      name: "Tweet Likes",
      description: "Worldwide Tweet Likes",
      price: 11000,
      estimate: "0 - 12 jam",
      min: 10,
      max: 50000
    },
    {
      serviceId: "X3002",
      category: "Twitter Global",
      name: "Tweet Views",
      description: "Worldwide Tweet Views",
      price: 2400,
      estimate: "0 - 6 jam",
      min: 10,
      max: 500000
    },
    {
      serviceId: "X3003",
      category: "Twitter Global",
      name: "Tweet Reposts",
      description: "Worldwide Tweet Reposts",
      price: 31000,
      estimate: "1 - 24 jam",
      min: 10,
      max: 50000
    }
  ],

  youtube: [
    {
      serviceId: "YT4001",
      category: "YouTube Indonesia",
      name: "YouTube Views",
      description: "High Quality YouTube Views",
      price: 18000,
      estimate: "0 - 12 jam",
      min: 10,
      max: 500000
    },
    {
      serviceId: "YT4002",
      category: "YouTube Indonesia",
      name: "YouTube Video Likes",
      description: "Real YouTube Video Likes",
      price: 22000,
      estimate: "1 - 24 jam",
      min: 10,
      max: 50000
    },
    {
      serviceId: "YT4003",
      category: "YouTube Indonesia",
      name: "YouTube Shorts Views",
      description: "Fast YouTube Shorts Views",
      price: 18000,
      estimate: "0 - 6 jam",
      min: 10,
      max: 500000
    }
  ],

  snackvideo: [
    {
      serviceId: "SV5001",
      category: "SnackVideo Indonesia",
      name: "SnackVideo Likes",
      description: "Real SnackVideo Likes",
      price: 8000,
      estimate: "1 - 24 jam",
      min: 10,
      max: 50000
    }
  ],

  whatsapp: [
    {
      serviceId: "WA6001",
      category: "WhatsApp Indonesia",
      name: "WhatsApp Channel Followers",
      description: "Indonesian WhatsApp Channel Followers",
      price: 82000,
      estimate: "1 - 24 jam",
      min: 10,
      max: 50000
    }
  ]
};

// =====================================
// STATE
// =====================================

const ADMIN_FEE = 90;

let selectedPlatform = "";
let selectedService = null;
let currentOrderId = "";

// =====================================
// ELEMENT
// =====================================

const quantity = document.getElementById("quantity");
const priceElement = document.getElementById("price");
const estimateElement = document.getElementById("estimate");
const categorySelect = document.getElementById("category");
const searchInput = document.getElementById("searchService");

// =====================================
// PILIH PLATFORM
// =====================================

function selectPlatform(platform, element) {
  selectedPlatform = platform;
  selectedService = null;

  document.querySelectorAll(".platform-card").forEach(card => {
    card.classList.remove("active");
  });

  element.classList.add("active");

  loadCategories();
}

// =====================================
// LOAD KATEGORI
// =====================================

function loadCategories() {
  categorySelect.innerHTML = "";

  const services = serviceData[selectedPlatform] || [];

  const categories = [...new Set(services.map(s => s.category))];

  if (categories.length === 0) {
    categorySelect.innerHTML = `<option>Kategori tidak tersedia</option>`;
    loadServices([]);
    return;
  }

  categorySelect.innerHTML = `<option value="">Pilih kategori</option>`;

  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  categorySelect.value = categories[0];

  filterServices();
}

// =====================================
// FILTER LAYANAN
// =====================================

function filterServices() {
  const category = categorySelect.value;
  const keyword = searchInput.value.toLowerCase();

  const services = (serviceData[selectedPlatform] || []).filter(service => {
    return service.category === category &&
      service.name.toLowerCase().includes(keyword);
  });

  loadServices(services);
}

// =====================================
// LOAD LAYANAN
// =====================================

function loadServices(services) {
  const container = document.getElementById("serviceContainer");

  container.innerHTML = "";

  if (!services || services.length === 0) {
    container.innerHTML = `
      <div class="service-placeholder">
        Layanan tidak ditemukan
      </div>
    `;
    return;
  }

  services.forEach(service => {
    const card = document.createElement("div");

    card.className = "service-card";

    card.innerHTML = `
      <div class="service-id">${service.serviceId}</div>
      <div class="service-title">${service.name}</div>
      <div class="service-desc">${service.description}</div>
      <div class="service-meta">
        Min ${service.min} • Max ${service.max}
      </div>
    `;

    card.onclick = () => {
      selectService(service, card);
    };

    container.appendChild(card);
  });
}

// =====================================
// PILIH LAYANAN
// =====================================

function selectService(service, element) {
  selectedService = service;

  document.querySelectorAll(".service-card").forEach(card => {
    card.classList.remove("active");
  });

  element.classList.add("active");

  quantity.min = service.min;
  quantity.max = service.max;
  quantity.value = service.min;

  document.getElementById("minOrderValue").innerText = service.min;
  document.getElementById("maxOrderValue").innerText = service.max;

  updatePrice();
}

// =====================================
// UPDATE HARGA
// =====================================

function updatePrice() {
  if (!selectedService) return;

  const qty = parseInt(quantity.value) || 0;

  const total =
    Math.round((qty / 1000) * selectedService.price) + ADMIN_FEE;

  priceElement.innerHTML =
    "Rp " + total.toLocaleString("id-ID");

  estimateElement.innerHTML =
    selectedService.estimate;
}

// =====================================
// EVENT
// =====================================

quantity.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
  updatePrice();
});

categorySelect.addEventListener("change", filterServices);
searchInput.addEventListener("input", filterServices);

// =====================================
// KONFIRMASI
// =====================================

function showConfirmation() {
  if (!selectedPlatform) {
    alert("Pilih platform terlebih dahulu");
    return;
  }

  if (!selectedService) {
    alert("Pilih layanan terlebih dahulu");
    return;
  }

  const target =
    document.getElementById("target").value.trim();

  const customerWhatsapp =
    document.getElementById("customerWhatsapp").value.trim();

  if (!target) {
    alert("Masukkan link target");
    return;
  }

  if (!customerWhatsapp) {
    alert("Masukkan nomor WhatsApp");
    return;
  }

  const qty = parseInt(quantity.value);

  if (isNaN(qty) || qty < selectedService.min) {
    alert("Minimal pemesanan adalah " + selectedService.min);
    return;
  }

  currentOrderId = generateOrderId();

  const total =
    Math.round((qty / 1000) * selectedService.price) + ADMIN_FEE;

  document.getElementById("confirmOrderId").innerText = currentOrderId;
  document.getElementById("confirmStatus").innerText = "🟡 Menunggu Konfirmasi";
  document.getElementById("confirmPlatform").innerText = selectedPlatform.toUpperCase();
  document.getElementById("confirmService").innerText =
    `[${selectedService.serviceId}] ${selectedService.name}`;
  document.getElementById("confirmTarget").innerText = target;
  document.getElementById("confirmQty").innerText = qty;
  document.getElementById("confirmPrice").innerText =
    "Rp " + total.toLocaleString("id-ID");
  document.getElementById("confirmEstimate").innerText =
    selectedService.estimate;

  document.getElementById("orderModal").style.display = "flex";
}

// =====================================
// SIMPAN ORDER
// =====================================

async function sendOrder() {
  const target =
    document.getElementById("target").value.trim();

  const customerWhatsapp =
    document.getElementById("customerWhatsapp").value.trim();

  const qty = parseInt(quantity.value);

  const total =
    Math.round((qty / 1000) * selectedService.price) + ADMIN_FEE;

  const orderId = currentOrderId || generateOrderId();

  try {
    await addDoc(collection(db, "orders"), {
      orderId,
      platform: selectedPlatform,
      category: selectedService.category,
      service: selectedService.name,
      serviceId: selectedService.serviceId,
      description: selectedService.description,
      pricePer1000: selectedService.price,
      target,
      customerWhatsapp,
      qty,
      total,
      estimate: selectedService.estimate,
      min: selectedService.min,
      max: selectedService.max,
      status: "Menunggu Konfirmasi",
      createdAt: serverTimestamp(),
      createdDate: new Date().toLocaleString("id-ID")
    });
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan pesanan ke Firebase");
    return;
  }

  alert(
    `Pesanan berhasil dibuat!

ID Pesanan: ${orderId}

Simpan ID ini untuk cek status pesanan.`
  );

  closeModal();

  document.getElementById("target").value = "";
  document.getElementById("customerWhatsapp").value = "";
  quantity.value = selectedService.min;

  selectedService = null;

  updatePrice();
}

// =====================================
// MODAL
// =====================================

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

function copyOrderId() {
  navigator.clipboard.writeText(currentOrderId);
  alert("ID Pesanan berhasil disalin");
}

// =====================================
// DEFAULT
// =====================================

priceElement.innerHTML = "Rp 0";
estimateElement.innerHTML = "-";

window.selectPlatform = selectPlatform;
window.showConfirmation = showConfirmation;
window.sendOrder = sendOrder;
window.closeModal = closeModal;
window.copyOrderId = copyOrderId;
    
