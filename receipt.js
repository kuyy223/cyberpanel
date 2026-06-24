import {
db,
collection,
getDocs,
query,
where
}
from "./firebase.js";

const params =
new URLSearchParams(
window.location.search
);

const orderId =
params.get("orderId");

async function loadReceipt(){

const q = query(
collection(db,"orders"),
where("orderId","==",orderId)
);

const snapshot =
await getDocs(q);

const content =
document.getElementById(
"receiptContent"
);

if(snapshot.empty){

content.innerHTML =
"Pesanan tidak ditemukan";

return;

}

snapshot.forEach(item=>{

const data = item.data();

content.innerHTML = `

<div class="receipt-card"><div class="receipt-header"><h2>🧾 Struk Pesanan</h2><p>CyberPanel Digital Services</p></div><div class="receipt-body"><div class="receipt-row">
<span class="receipt-label">
ID Pesanan
</span>
<span class="receipt-value">
${data.orderId}
</span>
</div><div class="receipt-row">
<span class="receipt-label">
Status
</span>
<span class="receipt-value">
${data.status}
</span>
</div><div class="receipt-row">
<span class="receipt-label">
Platform
</span>
<span class="receipt-value">
${data.platform}
</span>
</div><div class="receipt-row">
<span class="receipt-label">
Layanan
</span>
<span class="receipt-value">
${data.service}
</span>
</div><div class="receipt-row">
<span class="receipt-label">
Target
</span>
<span class="receipt-value">
${data.target}
</span>
</div><div class="receipt-row">
<span class="receipt-label">
Jumlah
</span>
<span class="receipt-value">
${data.qty}
</span>
</div><div class="receipt-row">
<span class="receipt-label">
Estimasi
</span>
<span class="receipt-value">
${data.estimate}
</span>
</div><div class="receipt-total"><p>Total Pembayaran</p><h3>
Rp ${data.total.toLocaleString("id-ID")}
</h3></div><div class="receipt-message"><h3>
Terima Kasih Atas Kepercayaan Anda
</h3><p>
Terima kasih telah mempercayakan kebutuhan layanan digital Anda kepada CyberPanel.
Pesanan Anda telah tercatat dalam sistem kami dan akan diproses sesuai standar layanan yang berlaku.
</p><p>
Kami berkomitmen untuk memberikan layanan yang cepat, aman, profesional, dan transparan demi menjaga kualitas serta kepuasan setiap pelanggan.
</p><p>
Mohon simpan ID Pesanan dan struk ini sebagai bukti transaksi resmi dan untuk memudahkan proses pengecekan status pesanan di kemudian hari.
</p><p class="receipt-sign">
Hormat kami,<br>
<b>CyberPanel Digital Services</b>
</p></div><div class="receipt-warning">⚠ Simpan struk ini sebagai bukti transaksi

</div></div></div>`;

});

}

loadReceipt();