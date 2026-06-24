import {
db,
collection,
getDocs,
query,
where
}
from "./firebase.js";

window.checkOrder =
async function(){

const orderId =
document.getElementById(
"orderId"
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
"result"
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

snapshot.forEach(doc=>{

const data =
doc.data();

let statusColor =
"#ffaa00";

let statusText =
"🟡 Diproses";

if(
data.status === "Success"
){

statusColor =
"#00ff99";

statusText =
"🟢 Success";

}

if(
data.status === "Gagal"
){

statusColor =
"#ff4444";

statusText =
"🔴 Gagal";

}

result.innerHTML = `

<div class="receipt-card">

<div class="receipt-header">

<h2>📦 Status Pesanan</h2>

<p>CyberPanel Digital Services</p>

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
<span
class="receipt-value"
style="color:${statusColor};">

${statusText}

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

<h3>Terima Kasih Atas Kepercayaan Anda</h3>
<p class="receipt-sign">
Hormat kami,<br>
<b class="receipt-sign">CyberPanel Digital Services</b>
</p></div><div class="receipt-warning">⚠ Simpan struk ini sebagai bukti transaksi

</div>

</div>

</div>

`;

});

}