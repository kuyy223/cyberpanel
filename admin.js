import {
db,
auth,

collection,
doc,
updateDoc,
deleteDoc,
onSnapshot,
getDocs,
query,
where,

signInWithEmailAndPassword,
onAuthStateChanged,
signOut
}
from "./firebase.js";

let currentDocId = "";

// =====================================
// LOGIN ADMIN FIREBASE
// =====================================

window.adminLogin =
async function(){

const email =
document.getElementById(
"adminUser"
).value.trim();

const password =
document.getElementById(
"adminPass"
).value.trim();

if(!email || !password){

alert(
"Email dan Password wajib diisi"
);

return;

}

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

alert(
"Login berhasil"
);

}
catch(error){

console.error(error);

alert(
"Email atau Password salah"
);

}

};

// =====================================
// LOAD ORDERS
// =====================================

function loadOrders(){

onSnapshot(

collection(
db,
"orders"
),

(snapshot)=>{

let html = "";

let total = 0;
let pending = 0;
let success = 0;
let failed = 0;

snapshot.forEach(item=>{

total++;

const data =
item.data();

if(
data.status ===
"Success"
){
success++;
}
else if(
data.status ===
"Gagal"
){
failed++;
}
else{
pending++;
}

html += `
<tr>

<td>
${data.orderId}
</td>

<td>
${data.platform}
</td>

<td>
${data.status}
</td>

<td>

<button
class="action-btn btn-process"
onclick="setStatus('${item.id}','Diproses')">

Proses

</button>

<button
class="action-btn btn-success"
onclick="setStatus('${item.id}','Success')">

Success

</button>

<button
class="action-btn btn-delete"
onclick="deleteOrder('${item.id}')">

Delete

</button>

<button
class="action-btn"
onclick="showReceipt('${data.orderId}')">

Struk

</button>

</td>

</tr>
`;

});

document.getElementById(
"ordersTable"
).innerHTML = html;

document.getElementById(
"totalOrders"
).innerText = total;

document.getElementById(
"pendingOrders"
).innerText = pending;

document.getElementById(
"successOrders"
).innerText = success;

document.getElementById(
"failedOrders"
).innerText = failed;

}

);

}

// =====================================
// CARI PESANAN
// =====================================

window.searchOrder =
async function(){

const orderId =
document.getElementById(
"searchOrderId"
).value.trim();

if(!orderId){

alert(
"Masukkan ID Pesanan"
);

return;

}

const q =
query(

collection(
db,
"orders"
),

where(
"orderId",
"==",
orderId
)

);

const snapshot =
await getDocs(q);

const result =
document.getElementById(
"adminResult"
);

if(snapshot.empty){

result.innerHTML =

`
<div class="info-box">

❌ Pesanan tidak ditemukan

</div>
`;

return;

}

snapshot.forEach(item=>{

currentDocId =
item.id;

const data =
item.data();

result.innerHTML = `

<div class="receipt-card">

<div class="receipt-header">

<h2>🔍 Detail Pesanan</h2>

<p>CyberPanel Admin Panel</p>

</div>

<div class="receipt-body">

<div class="receipt-row">
<span class="receipt-label">
ID Pesanan
</span>
<span class="receipt-value">
${data.orderId}
</span>
</div>

<div class="receipt-row">
<span class="receipt-label">
Status
</span>
<span class="receipt-value">
${data.status}
</span>
</div>

<div class="receipt-row">
<span class="receipt-label">
Platform
</span>
<span class="receipt-value">
${data.platform}
</span>
</div>

<div class="receipt-row">
<span class="receipt-label">
Layanan
</span>
<span class="receipt-value">
${data.service}
</span>
</div>

<div class="receipt-row">
<span class="receipt-label">
Target
</span>
<span class="receipt-value">
${data.target}
</span>
</div>

<div class="receipt-row">
<span class="receipt-label">
Jumlah
</span>
<span class="receipt-value">
${data.qty}
</span>
</div>

<div class="receipt-row">
<span class="receipt-label">
Estimasi
</span>
<span class="receipt-value">
${data.estimate || "-"}
</span>
</div>

<div class="receipt-total">

<p>Total Pembayaran</p>

<h3>
Rp ${data.total.toLocaleString("id-ID")}
</h3>

</div>

<div class="receipt-message">

<h3>Manajemen Pesanan</h3>

<p>
Gunakan tombol di bawah untuk memperbarui status pesanan pelanggan.
</p>

</div>

<div class="admin-action-group">

<button
class="btn-process"
onclick="updateStatus('Diproses')">

🔄 Diproses

</button>

<button
class="btn-success"
onclick="updateStatus('Success')">

✅ Success

</button>

<button
class="btn-delete"
onclick="updateStatus('Gagal')">

❌ Gagal

</button>

</div>

</div>

</div>

`;

});

};

// =====================================
// UPDATE STATUS
// =====================================

window.updateStatus =
async function(status){

if(!currentDocId){

alert(
"Pesanan belum dipilih"
);

return;

}

try{

await updateDoc(

doc(
db,
"orders",
currentDocId
),

{
status:status
}

);

alert(
"Status berhasil diubah menjadi " +
status
);

searchOrder();

}
catch(error){

console.error(error);

alert(
"Gagal mengubah status"
);

}

};

window.setStatus =
async function(id,status){

try{

await updateDoc(

doc(
db,
"orders",
id
),

{
status:status
}

);

}
catch(error){

console.error(error);

alert(
"Gagal mengubah status"
);

}

};

window.deleteOrder =
async function(id){

if(
!confirm(
"Hapus pesanan?"
)
)return;

try{

await deleteDoc(

doc(
db,
"orders",
id
)

);

}
catch(error){

console.error(error);

alert(
"Gagal menghapus pesanan"
);

}

};

window.showReceipt =
function(orderId){

window.open(
`receipt.html?orderId=${orderId}`,
"_blank"
);

};

// =====================================
// FIREBASE AUTH SESSION
// =====================================

let ordersLoaded = false;

onAuthStateChanged(
auth,
(user)=>{

if(user){

document.getElementById(
"loginBox"
).style.display =
"none";

document.getElementById(
"adminPanel"
).style.display =
"block";

if(!ordersLoaded){

loadOrders();

ordersLoaded = true;

}

}
else{

document.getElementById(
"loginBox"
).style.display =
"block";

document.getElementById(
"adminPanel"
).style.display =
"none";

ordersLoaded = false;

}

}
);

// =====================================
// LOGOUT
// =====================================

window.adminLogout =
async function(){

try{

await signOut(auth);

alert(
"Logout berhasil"
);

}
catch(error){

console.error(error);

alert(
"Gagal logout"
);

}

};
