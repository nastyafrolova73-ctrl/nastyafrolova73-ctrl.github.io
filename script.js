// ==================== ДАННЫЕ (ТОВАРЫ) ====================
// У каждого товара теперь есть:
// - mainImage: основное фото (эмодзи или URL)
// - extraImages: массив из 3 дополнительных фото

let products = [
    // ===== МОРЕПРОДУКТЫ ===== 
    { 
    id: 1,  // ВАЖНО: следующий номер!
    name: "Краб размер S",
    desc: "Описание",
    price: 2000,
    unit: "кг",
    category: "seafood",
    mainImage: "img/krab.jpg",
    extraImages: ["🦐🔥", "🦐🍋", "🦐🧈"]
    },
   
    

    // ===== РЫБА =====
    { 
        id: 2, name: "Филе семги", desc: "Норвежская, слабосоленая", 
        price: 2100, unit: "кг", category: "fish",
        mainImage: "🐟",
        extraImages: ["🐟🍋", "🐟🧂", "🐟🔥"]
    },

    
    // ===== МЯСО =====
    { 
        id: 3, name: "Мраморная говядина", desc: "Рибай, мраморность 5+", 
        price: 4200, unit: "кг", category: "meat",
        mainImage: "🥩",
        extraImages: ["🥩🔥", "🥩🧂", "🥩🍷"]
    },

];

let nextId = 21;
let cart = [];

// ==================== РАБОТА С ХРАНИЛИЩЕМ ====================
function loadData() {
    const savedProducts = localStorage.getItem("seafood_products");
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        nextId = Math.max(...products.map(p => p.id), 0) + 1;
    }
    const savedCart = localStorage.getItem("seafood_cart");
    if (savedCart) cart = JSON.parse(savedCart);
    updateCartCounter();
}

function saveProducts() {
    localStorage.setItem("seafood_products", JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem("seafood_cart", JSON.stringify(cart));
    updateCartCounter();
}

function updateCartCounter() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").innerText = total;
}

function showMessage(text) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ==================== КОРЗИНА ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    saveCart();
    showMessage(`✅ ${product.name} добавлен в корзину!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartModal();
}

function renderCartModal() {
    const container = document.getElementById("cartItemsList");
    const totalContainer = document.getElementById("cartTotal");

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">🛒 Корзина пуста</div>';
        totalContainer.innerHTML = "";
        return;
    }

    let html = "";
    let totalSum = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;
        html += `
            <div class="cart-item">
                <div>
                    <strong>${escapeHtml(item.name)}</strong><br>
                    ${item.quantity} кг × ${item.price.toLocaleString()} ₽
                </div>
                <div><strong>${itemTotal.toLocaleString()} ₽</strong></div>
                <button class="remove-item" data-id="${item.id}">❌</button>
            </div>
        `;
    });
    container.innerHTML = html;
    totalContainer.innerHTML = `💰 Итого: ${totalSum.toLocaleString()} ₽`;

    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

function submitOrder() {
    const name = document.getElementById("userName").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const address = document.getElementById("userAddress").value.trim();

    if (!name || !phone || !address) {
        showMessage("❌ Заполните все поля!");
        return;
    }
    if (cart.length === 0) {
        showMessage("🛑 Корзина пуста!");
        return;
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    console.log("НОВЫЙ ЗАКАЗ:", { name, phone, address, cart, total });
    showMessage(`🎉 ${name}, заказ принят! Сумма: ${total.toLocaleString()} ₽`);
    
    cart = [];
    saveCart();
    renderCartModal();
    document.getElementById("cartModal").style.display = "none";
    document.getElementById("userName").value = "";
    document.getElementById("userPhone").value = "";
    document.getElementById("userAddress").value = "";
}

// ==================== ОТРИСОВКА КАТАЛОГА С ГАЛЕРЕЕЙ ====================

function renderCatalog() {
    document.getElementById("seafoodGrid").innerHTML = "";
    document.getElementById("fishGrid").innerHTML = "";
    document.getElementById("meatGrid").innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        // Функция проверки: является ли строка ссылкой на фото
        function isImageUrl(str) {
            if (!str) return false;
            // Проверяем, начинается ли с http, https, images/, /images, img/
            return str.startsWith('http') || 
                   str.startsWith('images/') || 
                   str.startsWith('/images/') ||
                   str.startsWith('img/');
        }
        
        // СОЗДАЁМ ОСНОВНОЕ ФОТО
        let mainImageHtml = '';
        if (isImageUrl(product.mainImage)) {
            // Это ссылка на фото — показываем <img>
            mainImageHtml = `<img src="${product.mainImage}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            // Это эмодзи — показываем как текст
            mainImageHtml = product.mainImage;
        }
        
        // СОЗДАЁМ ДОПОЛНИТЕЛЬНЫЕ ФОТО
        let extraImagesHtml = '';
        if (product.extraImages && product.extraImages.length > 0) {
            extraImagesHtml = product.extraImages.map((img, idx) => {
                if (isImageUrl(img)) {
                    return `<div class="extra-thumb" data-img="${img}" data-index="${idx}">
                                <img src="${img}" alt="фото ${idx+1}" style="width:100%; height:100%; object-fit:cover;">
                            </div>`;
                } else {
                    return `<div class="extra-thumb" data-img="${img}" data-index="${idx}">${img}</div>`;
                }
            }).join('');
        }
        
        const hasExtra = product.extraImages && product.extraImages.length > 0;
        
        card.innerHTML = `
            <div class="product-gallery">
                <div class="main-image" data-main-img="${product.mainImage}">
                    ${mainImageHtml}
                </div>
                ${hasExtra ? `<div class="image-badge">📸 +${product.extraImages.length} фото</div>` : ''}
                ${hasExtra ? `<div class="extra-images">${extraImagesHtml}</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-desc">${product.desc}</div>
                <div class="product-price">${product.price.toLocaleString()} ₽ / ${product.unit}</div>
                <button class="add-to-cart" data-id="${product.id}">➕ В корзину</button>
            </div>
        `;
        
        document.getElementById(`${product.category}Grid`).appendChild(card);
        
        // НАСТРОЙКА ПЕРЕКЛЮЧЕНИЯ ФОТО (клик по миниатюре)
        if (hasExtra) {
            const mainImageDiv = card.querySelector('.main-image');
            const extraThumbs = card.querySelectorAll('.extra-thumb');
            
            extraThumbs.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const newImageSrc = thumb.getAttribute('data-img');
                    const currentImageHtml = mainImageDiv.innerHTML;
                    
                    // Меняем местами
                    if (thumb.querySelector('img')) {
                        thumb.innerHTML = currentImageHtml;
                        thumb.setAttribute('data-img', currentImageHtml);
                    } else {
                        thumb.innerHTML = currentImageHtml;
                        thumb.setAttribute('data-img', currentImageHtml);
                    }
                    
                    // Обновляем основное фото
                    if (isImageUrl(newImageSrc)) {
                        mainImageDiv.innerHTML = `<img src="${newImageSrc}" alt="фото" style="width:100%; height:100%; object-fit:cover;">`;
                    } else {
                        mainImageDiv.innerHTML = newImageSrc;
                    }
                    mainImageDiv.setAttribute('data-main-img', newImageSrc);
                    
                    // Анимация
                    mainImageDiv.classList.add('main-image-change');
                    setTimeout(() => mainImageDiv.classList.remove('main-image-change'), 300);
                });
            });
        }
    });

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
    });
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
    });
}

// ==================== НАСТРОЙКА ВКЛАДОК ====================
function setupTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.getElementById(`tab-${tab}`).classList.add("active");
        });
    });
}

// ==================== НАСТРОЙКА МОДАЛЬНЫХ ОКОН ====================
function setupModals() {
    const cartModal = document.getElementById("cartModal");
    const adminPanel = document.getElementById("adminPanel");

    document.getElementById("openCartBtn").onclick = () => {
        renderCartModal();
        cartModal.style.display = "flex";
    };
    document.getElementById("closeModalBtn").onclick = () => cartModal.style.display = "none";

    document.getElementById("openAdminBtn").onclick = () => {
        renderAdminPanel();
        adminPanel.style.display = "flex";
    };
    document.getElementById("closeAdminBtn").onclick = () => adminPanel.style.display = "none";

    window.onclick = (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
        if (e.target === adminPanel) adminPanel.style.display = "none";
    };

    document.getElementById("submitOrderBtn").onclick = submitOrder;
    document.getElementById("addProductBtn").onclick = addNewProduct;
}

// ==================== ЗАПУСК ====================
function init() {
    loadData();
    renderCatalog();
    setupTabs();
    setupModals();
}

init();
