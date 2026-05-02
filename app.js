/**
 * SHEL-A SIDE – MAIN APP (GODMODE)
 * Mengelola keranjang, render menu, filter, checkout, WhatsApp order.
 * Disimpan terpisah dari HTML agar rapi.
 */

// ==================== CART STATE ====================
let cart = [];

// ==================== HELPER: FORMAT MATA UANG ====================
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
};

// ==================== CART FUNCTIONS ====================
function loadCartFromStorage() {
    const saved = localStorage.getItem('shelAsideCart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}

function saveCartToStorage() {
    localStorage.setItem('shelAsideCart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.qty, 0);
    document.getElementById('cartCount').textContent = count;
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

function updateTotalDisplay() {
    document.getElementById('cartTotal').textContent = formatRupiah(calculateTotal());
}

// Render seluruh item di keranjang
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Belum ada item. Yuk pilih menu favoritmu!</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-img">
                    <img src="${item.image || 'https://picsum.photos/60/60?random=' + item.id}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}${item.sauce ? ' + Saus ' + item.sauce : ''}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" data-action="decrease" data-index="${index}">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-price">${formatRupiah(item.price * item.qty)}</div>
                </div>
                <button class="cart-item-remove" data-action="remove" data-index="${index}">🗑️</button>
            </div>
        `).join('');
    }
    updateCartCount();
    updateTotalDisplay();
    saveCartToStorage();
}

// Tambah item ke cart
function addToCart(id, name, price, image = '', sauce = '') {
    const existingIndex = cart.findIndex(item => item.id === id && item.sauce === sauce);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ id, name, price, qty: 1, image, sauce });
    }
    renderCart();
    // Animasi mini notifikasi (bisa diaktifkan nanti)
    showNotification(`${name} ditambahkan!`);
}

// Hapus item
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

// Update qty
function updateQty(index, delta) {
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty < 1) {
            removeFromCart(index);
        } else {
            renderCart();
        }
    }
}

// Notifikasi kecil (opsional)
function showNotification(message) {
    // Buat elemen notifikasi
    const notif = document.createElement('div');
    notif.className = 'cart-notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// ==================== RENDER MENU ITEMS (DINAMIS) ====================
// Untuk halaman menu lengkap, kita render dari data array
const fullMenu = [
    { id: 4, name: 'Chicken Tenders (3 pcs)', price: 28000, category: 'chicken', image: 'https://picsum.photos/300/300?random=4', badge: 'Pilih Saus' },
    { id: 5, name: 'Siomay Udang (5 pcs)', price: 18000, category: 'dimsum', image: 'https://picsum.photos/300/300?random=5' },
    { id: 6, name: 'Hakau Udang (4 pcs)', price: 22000, category: 'dimsum', image: 'https://picsum.photos/300/300?random=7' },
    { id: 7, name: 'Lumpia Kulit Tahu', price: 15000, category: 'dimsum', image: 'https://picsum.photos/300/300?random=8' },
    { id: 8, name: 'Chicken Popcorn', price: 25000, category: 'chicken', image: 'https://picsum.photos/300/300?random=9', badge: 'Saus Rekomendasi' },
    { id: 9, name: 'Spicy Chicken Wings', price: 30000, category: 'chicken', image: 'https://picsum.photos/300/300?random=10' },
    { id: 10, name: 'Waffle Fries', price: 20000, category: 'sides', image: 'https://picsum.photos/300/300?random=11' },
    { id: 11, name: 'Risol Mayo', price: 16000, category: 'sides', image: 'https://picsum.photos/300/300?random=12' },
    { id: 12, name: 'Es Teh Segar', price: 8000, category: 'drinks', image: 'https://picsum.photos/300/300?random=13' },
    { id: 13, name: 'Lemonade', price: 12000, category: 'drinks', image: 'https://picsum.photos/300/300?random=14' },
    { id: 14, name: 'Saus Keju', price: 5000, category: 'sauce', image: 'https://picsum.photos/300/300?random=15' },
    { id: 15, name: 'Saus Sambal', price: 3000, category: 'sauce', image: 'https://picsum.photos/300/300?random=16' },
];

function renderMenuGrid(category = 'all') {
    const grid = document.getElementById('menuGrid');
    const filtered = category === 'all' ? fullMenu : fullMenu.filter(item => item.category === category);
    grid.innerHTML = filtered.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-img">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                ${item.badge ? `<span class="badge-sauce">${item.badge}</span>` : ''}
            </div>
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>Deskripsi singkat produk ${item.name.toLowerCase()}.</p>
                <div class="item-footer">
                    <span class="price">${formatRupiah(item.price)}</span>
                    <button class="btn-add" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">+ Add</button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-attach event listener untuk tombol add di grid ini
    attachAddToCartListeners();
}

// ==================== EVENT LISTENER: TOMBOL ADD ====================
function attachAddToCartListeners() {
    document.querySelectorAll('.btn-add').forEach(btn => {
        // Hindari double listener
        btn.removeEventListener('click', handleAddClick);
        btn.addEventListener('click', handleAddClick);
    });
}

function handleAddClick(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const image = btn.dataset.image || '';
    addToCart(id, name, price, image);
}

// ==================== CART PANEL & INTERACTIONS ====================
const cartToggle = document.getElementById('cartToggle');
const cartOffcanvas = document.getElementById('cartOffcanvas');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');

function openCart() {
    cartOffcanvas.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCart() {
    cartOffcanvas.classList.remove('open');
    document.body.style.overflow = '';
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Delegasi event untuk tombol dalam cart (qty, remove)
document.getElementById('cartItems').addEventListener('click', (e) => {
    const target = e.target;
    const index = target.dataset.index;
    if (target.dataset.action === 'increase') {
        updateQty(parseInt(index), 1);
    } else if (target.dataset.action === 'decrease') {
        updateQty(parseInt(index), -1);
    } else if (target.dataset.action === 'remove') {
        removeFromCart(parseInt(index));
    }
});

// ==================== TAB FILTER ====================
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.tab-btn.active')?.classList.remove('active');
        btn.classList.add('active');
        const category = btn.dataset.category;
        renderMenuGrid(category);
    });
});

// ==================== CHECKOUT / WHATSAPP ORDER ====================
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang masih kosong, bro!');
        return;
    }
    // Bisa arahkan ke halaman checkout (jika ada backend), sementara kita pakai WA saja
    generateWAOrder();
});

document.getElementById('waOrderBtn').addEventListener('click', generateWAOrder);

function generateWAOrder() {
    if (cart.length === 0) {
        alert('Keranjang kosong, nggak bisa pesan.');
        return;
    }
    const nama = prompt('Nama kamu:') || 'Tanpa Nama';
    const meja = prompt('Nomor meja (untuk dine-in) atau kosongkan untuk takeaway:') || 'Takeaway';
    let pesan = `Halo Shel-A Side! Saya mau pesan:%0A%0A`;
    cart.forEach((item, idx) => {
        pesan += `${idx+1}. ${item.name} x${item.qty} - ${formatRupiah(item.price * item.qty)}%0A`;
    });
    pesan += `%0ATotal: ${formatRupiah(calculateTotal())}%0A`;
    pesan += `Nama: ${nama}%0A`;
    pesan += `Meja/Tipe: ${meja}%0A`;
    pesan += `%0AMohon dikonfirmasi. Terima kasih!`;

    const waNumber = '62812xxxxxx'; // GANTI dengan nomor WhatsApp bisnis lo
    const url = `https://wa.me/${waNumber}?text=${pesan}`;
    window.open(url, '_blank');
    closeCart(); // tutup cart setelah pesan
}

// ==================== MOBILE NAV TOGGLE ====================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // animasi hamburger
    menuToggle.classList.toggle('open');
});

// ==================== INITIALIZATION ====================
function init() {
    loadCartFromStorage();
    renderCart();
    // Render menu awal (semua)
    renderMenuGrid('all');
    // Update cart count awal
    updateCartCount();
    updateTotalDisplay();
    // Tambahkan event add untuk tombol yang ada di signature (hardcode)
    attachAddToCartListeners();
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', init);
