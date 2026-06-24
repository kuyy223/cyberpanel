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

function generateOrderId(){

const random =
Math.floor(
1000 + Math.random() * 9000
);

const date =
new Date();

return `CP${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${random}`;

}

// =====================================
// DATA PLATFORM & LAYANAN
// =====================================

const serviceData = {

instagram:[

{
id:"followers",
name:"👥 Instagram Followers Indonesia",
price:39800,
estimate:"9 jam 53 menit"
},

{
id:"likes",
name:"❤️ Instagram Likes Indonesia",
price:8900,
estimate:"25 menit"
},

{
id:"comments",
name:"💬 Instagram Comments random Indonesia",
price:14500,
estimate:"6 menit - 24 Jam"
},

{
id:"views",
name:"👁 Instagram Reels Views",
price:10000,
estimate:"0 - 6 Jam"
}

],

tiktok:[

{
id:"followers",
name:"👥 TikTok Followers Indonesia",
price:21500,
estimate:"127 jam 35 menit"
//Layanan 6554
},

{
id:"views",
name:"🚀 TikTok Viral Views",
price:11000,
estimate:"0 - 6 Jam"
},

{
id:"likes",
name:"❤️ TikTok Likes",
price:8700,
estimate:"0 - 12 Jam"
},

{
id:"comments",
name:"💬 TikTok Comments",
price:25400,
estimate:"117 jam 30 menit"
}

],

whatsapp:[

{
id:"followers",
name:"📢 WhatsApp Channel Followers",
price:82000,
estimate:"1 - 24 Jam"
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

const quantity =
document.getElementById("quantity");

const priceElement =
document.getElementById("price");

const estimateElement =
document.getElementById("estimate");

// =====================================
// PILIH PLATFORM
// =====================================

function selectPlatform(platform, element){

console.log(
"Platform dipilih:",
platform
);

selectedPlatform = platform;
selectedService = null;

document
.querySelectorAll(".platform-card")
.forEach(card=>{

card.classList.remove("active");

});

element.classList.add("active");

loadServices();

}

// =====================================
// LOAD LAYANAN
// =====================================

function loadServices(){

const container =
document.getElementById(
"serviceContainer"
);

container.innerHTML = "";

const services =
serviceData[selectedPlatform];

if(!services){

container.innerHTML =
`
<div class="service-placeholder">
Platform tidak ditemukan
</div>
`;

return;

}

services.forEach(service=>{

const card =
document.createElement("div");

card.className =
"service-card";

card.innerHTML = `
<div class="service-title">
${service.name}
</div>
`;

card.onclick = ()=>{

selectService(
service,
card
);

};

container.appendChild(card);

});

}

// =====================================
// PILIH LAYANAN
// =====================================

function selectService(
service,
element
){

selectedService =
service;

document
.querySelectorAll(
".service-card"
)
.forEach(card=>{

card.classList.remove(
"active"
);

});

element.classList.add(
"active"
);

updatePrice();

}

// =====================================
// UPDATE HARGA
// =====================================

function updatePrice(){

if(
!selectedService
)
return;

const qty =
parseInt(
quantity.value
) || 0;

const total =
Math.round(
(qty / 1000) * selectedService.price
) + ADMIN_FEE;

priceElement.innerHTML =
"Rp " +
total.toLocaleString(
"id-ID"
);

estimateElement.innerHTML =
selectedService.estimate;

}

// =====================================
// JUMLAH BERUBAH
// =====================================

quantity.addEventListener(
"input",
function(){

this.value =
this.value.replace(/[^0-9]/g,'');

updatePrice();

}
);


// =====================================
// KIRIM PESAN WA
// =====================================


function showConfirmation(){

if(!selectedPlatform){

alert(
"Pilih platform terlebih dahulu"
);

return;

}

if(!selectedService){

alert(
"Pilih layanan terlebih dahulu"
);

return;

}

const target =
document.getElementById(
"target"
).value.trim();

if(!target){

alert(
"Masukkan link target"
);

return;

}

const qty =
parseInt(
document.getElementById(
"quantity"
).value
);

if(
document.getElementById(
"quantity"
).value.includes(".")
){

alert(
"Gunakan angka tanpa titik. Contoh: 1000"
);

return;

}

if(
isNaN(qty) ||
qty < 10
){

alert(
"Minimal pemesanan adalah 10"
);

return;

}

// Hitung Total Harga
const total =
Math.round(
(qty / 1000) * selectedService.price
) + ADMIN_FEE;

// Generate ID Pesanan
currentOrderId =
generateOrderId();


// Isi ID Pesanan
document.getElementById(
"confirmOrderId"
).innerText =
currentOrderId;

// Isi Status
document.getElementById(
"confirmStatus"
).innerText =
"🟡 Menunggu Konfirmasi";

document.getElementById(
"confirmPlatform"
).innerText =
selectedPlatform.toUpperCase();

document.getElementById(
"confirmService"
).innerText =
selectedService.name;

document.getElementById(
"confirmTarget"
).innerText =
target;

document.getElementById(
"confirmQty"
).innerText =
qty;

document.getElementById(
"confirmPrice"
).innerText =
"Rp " +
total.toLocaleString(
"id-ID"
);

document.getElementById(
"confirmEstimate"
).innerText =
selectedService.estimate;

// Tampilkan Popup
document.getElementById(
"orderModal"
).style.display =
"flex";

}

console.log("SEND ORDER JALAN");

async function sendOrder(){

if(!selectedPlatform){

alert("Pilih platform terlebih dahulu");

return;

}

if(!selectedService){

alert("Pilih layanan terlebih dahulu");

return;

}

const target =
document
.getElementById("target")
.value
.trim();

if(!target){

alert("Masukkan link target");

return;

}

const qty =
parseInt(quantity.value);

if(
isNaN(qty) ||
qty < 10
){

alert("Minimal pemesanan adalah 10");

return;

}

const total =
Math.round(
(qty / 1000) * selectedService.price
) + ADMIN_FEE;
  
const orderId =
currentOrderId ||
generateOrderId();

try{

await addDoc(

collection(
db,
"orders"
),

{

orderId,

platform:
selectedPlatform,

service:
selectedService.name,

serviceId:
selectedService.id,

pricePer1000:
selectedService.price,

target,

qty,

total,

estimate:
selectedService.estimate,

status:
"Menunggu Konfirmasi",

createdAt:
serverTimestamp(),

createdDate:
new Date().toLocaleString("id-ID")

}

);

}
catch(error){

console.error(error);

alert(
"Gagal menyimpan pesanan ke Firebase"
);

return;

}

const message =

`Halo Admin 👋

Saya ingin melakukan pemesanan.

━━━━━━━━━━━━━━━

ID Pesanan :
${orderId}

Platform :
${selectedPlatform.toUpperCase()}

Layanan :
${selectedService.name}

Target :
${target}

Jumlah :
${qty}

Estimasi :
${selectedService.estimate}

Total Harga :
Rp ${total.toLocaleString("id-ID")}

Status :
Menunggu Konfirmasi

━━━━━━━━━━━━━━━

Mohon diproses.
Terima kasih 🙏`;

const nomorAdmin =
"6283142808857";

const url =
`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(message)}`;

alert(
`Pesanan berhasil dibuat!

ID Pesanan:
${orderId}

Simpan ID ini untuk cek status pesanan.`
);

closeModal();

window.open(
url,
"_blank"
);

document.getElementById(
"target"
).value = "";

document.getElementById(
"quantity"
).value = "";

selectedService = null;

updatePrice();

}

function closeModal(){

document.getElementById(
"orderModal"
).style.display =
"none";

}

function copyOrderId(){

navigator.clipboard.writeText(
currentOrderId
);

alert(
"ID Pesanan berhasil disalin"
);

}

window.copyOrderId =
copyOrderId;
// =====================================
// DEFAULT
// =====================================

priceElement.innerHTML =
"Rp 0";

estimateElement.innerHTML =
"-";

window.selectPlatform = selectPlatform;
window.showConfirmation = showConfirmation;
window.sendOrder = sendOrder;
window.closeModal = closeModal;