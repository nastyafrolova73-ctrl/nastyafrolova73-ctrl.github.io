// ==================== ДАННЫЕ (ТОВАРЫ) ====================
// У каждого товара теперь есть:
// - mainImage: основное фото (эмодзи или URL)
// - extraImages: массив из 3 дополнительных фото

let products = [
    // ===== МОРЕПРОДУКТЫ ===== 
    { 
    id: 1,  // ВАЖНО: следующий номер!
    name: "Краб камчатский",
    desc: "Свежий охлажденный размер S",
    price: 2000,
    unit: "кг",
    category: "seafood",
    mainImage: "img/krab.jpg",
    extraImages: ["🦐🔥", "🦐🍋", "🦐🧈"]
    },
    { 
    id: 2,  
    name: "Краб камчатский",
    desc: "Свежий охлажденный размер M",
    price: 2500,
    unit: "кг",
    category: "seafood",
    mainImage: "img/krab.jpg",
    extraImages: ["🦐🔥", "🦐🍋", "🦐🧈"]
    },
    { 
    id: 3, 
    name: "Краб камчатский",
    desc: "Свежий охлажденный размер XL",
    price: 3000,
    unit: "кг",
    category: "seafood",
    mainImage: "img/krab.jpg",
    extraImages: ["🦐🔥", "🦐🍋", "🦐🧈"]
    },
    { 
    id: 4,
    name: "Креветка северная",
    desc: "Свежий охлажденный размер S",
    price: 2000,
    unit: "кг",
    category: "seafood",
    mainImage: "img/krab.jpg",
    extraImages: ["🦐🔥", "🦐🍋", "🦐🧈"]
    },
   
    

    // ===== РЫБА =====
    { 
        id: 5, name: "Филе семги",
        desc: "Норвежская, слабосоленая", 
        price: 2100, 
        unit: "кг", 
        category: "fish",
        mainImage: "🐟",
        extraImages: ["🐟🍋", "🐟🧂", "🐟🔥"]
    },

    
    // ===== МЯСО =====
    { 
        id: 6, name: "Мраморная говядина", 
        desc: "Рибай, мраморность 5+", 
        price: 4200, 
        unit: "кг", 
        category: "meat",
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
// ==================== ОФОРМЛЕНИЕ ЗАКАЗА ====================

// Функция для сбора данных заказа
function getOrderData() {
    const name = document.getElementById("userName").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const address = document.getElementById("userAddress").value.trim();

    if (!name || !phone || !address) {
        showMessage("❌ Заполните все поля!");
        return null;
    }
    if (cart.length === 0) {
        showMessage("🛑 Корзина пуста!");
        return null;
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    
    let orderText = "🦞 НОВЫЙ ЗАКАЗ!\n\n";
    orderText += `👤 Имя: ${name}\n`;
    orderText += `📞 Телефон: ${phone}\n`;
    orderText += `🏠 Адрес: ${address}\n`;
    orderText += `📅 Время: ${new Date().toLocaleString()}\n\n`;
    orderText += `📦 Товары:\n`;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        orderText += `${index + 1}. ${item.name} — ${item.quantity} кг × ${item.price} ₽ = ${itemTotal} ₽\n`;
    });
    
    orderText += `\n💰 ИТОГО: ${total} ₽`;

    return { name, phone, address, total, orderText };
}

function submitTelegram() {
    console.log("🟢 Telegram кнопка нажата!");
    
    // ✅ ПРОВЕРКА ПЕРЕД ОТПРАВКОЙ
    if (!checkFormBeforeSubmit()) {
        return;
    }
    
    const data = getOrderData();
    if (!data) return;

    const botToken = "8723417325:AAHlG4832Nypw0xmp2GOLbaZ90WfqB_Hav8";
    const chatId = "-1004379777197"; // ← ЗАМЕНИ НА СВОЙ ID!
    const workerUrl = 'https://more125.nastyafrolova73.workers.dev';
    const url = `${workerUrl}/bot${botToken}/sendMessage`;

    showMessage("⏳ Отправка заказа...");

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: data.orderText,
            parse_mode: 'Markdown'
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.ok) {
            showMessage(`✅ ${data.name}, заказ отправлен в Telegram!`);
            clearCartAndForm();
        } else {
            showMessage(`❌ Ошибка: ${result.description}`);
            console.error('Ошибка Telegram:', result);
        }
    })
    .catch(error => {
        console.error('❌ Ошибка:', error);
        showMessage(`❌ Ошибка отправки! Попробуйте ещё раз.`);
    });
}

// Очистка корзины и формы
function clearCartAndForm() {
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

    // Открытие корзины
    document.getElementById("openCartBtn").onclick = () => {
        renderCartModal();
        cartModal.style.display = "flex";

        // ✅ Просто вызываем проверку один раз при открытии
        checkAllFields();
        
        // ✅ И включаем слежение за полями
        setupValidation();
    };
    
    document.getElementById("closeModalBtn").onclick = () => cartModal.style.display = "none";

    // Открытие админ-панели
    document.getElementById("openAdminBtn").onclick = () => {
        renderAdminPanel();
        adminPanel.style.display = "flex";
    };
    document.getElementById("closeAdminBtn").onclick = () => adminPanel.style.display = "none";

    // Закрытие по клику вне окна
    window.onclick = (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
        if (e.target === adminPanel) adminPanel.style.display = "none";
    };

    document.getElementById("addProductBtn").onclick = addNewProduct;
}

// ==================== ЗАПУСК ====================
function init() {
    loadData();
    renderCatalog();
    setupTabs();
    setupModals();
    setupValidation();
    checkAllFields();     // ← ЭТО ДОЛЖНО БЫТЬ
      // ← ЭТО ДОЛЖНО БЫТЬ (блокирует кнопки с самого начала)
}
// ==================== ВАЛИДАЦИЯ ПОЛЕЙ ЗАКАЗА ====================

function validateField(field) {
    if (!field) return false;
    
    const errorElement = document.getElementById(field.id + 'Error');
    
    // Сбрасываем классы
    field.classList.remove('error', 'success');
    if (errorElement) {
        errorElement.classList.remove('visible');
        errorElement.textContent = '';
    }
    
    let isValid = true;
    let errorText = '';
    
    // ===== ПРОВЕРКА ИМЕНИ =====
    if (field.id === 'userName') {
        const value = field.value.trim();
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
        if (!value) {
            isValid = false;
            errorText = '❌ Введите имя';
        } else if (!nameRegex.test(value)) {
            isValid = false;
            errorText = '❌ Только буквы, пробелы и дефис';
        }
    }
    
    // ===== ПРОВЕРКА ТЕЛЕФОНА (С АВТО-ДОБАВЛЕНИЕМ +7) =====
    if (field.id === 'userPhone') {
        let value = field.value.trim();
        
        // Если поле пустое или только +7 — считаем невалидным
        if (value === '' || value === '+' || value === '+7' || value === '+7 ') {
            field.value = '+7';
            const len = field.value.length;
            field.setSelectionRange(len, len);
            isValid = false;
            errorText = '❌ Введите номер телефона';
        } else {
            // Очищаем от лишних символов
            let cleaned = value.replace(/[^\d+]/g, '');
            
            // Оставляем + только в начале
            if (cleaned.startsWith('+')) {
                cleaned = '+' + cleaned.replace(/\+/g, '');
            } else {
                cleaned = cleaned.replace(/\+/g, '');
            }
            
            // Если номер не начинается с +7, исправляем
            if (!cleaned.startsWith('+7')) {
                if (cleaned.startsWith('8')) {
                    cleaned = '+7' + cleaned.slice(1);
                } else if (cleaned.startsWith('7')) {
                    cleaned = '+7' + cleaned.slice(1);
                } else if (cleaned.startsWith('+')) {
                    // Оставляем как есть
                } else {
                    cleaned = '+7' + cleaned;
                }
            }
            
            // Ограничиваем длину (максимум 12 символов: +7 + 10 цифр)
            const maxLength = 12;
            if (cleaned.length > maxLength) {
                cleaned = cleaned.slice(0, maxLength);
            }
            
            // Обновляем поле, если изменилось
            if (field.value !== cleaned) {
                field.value = cleaned;
                const len = cleaned.length;
                field.setSelectionRange(len, len);
            }
            
            // Проверяем, что после +7 есть 10 цифр
            const digitsAfter7 = cleaned.slice(2).replace(/\D/g, '');
            if (digitsAfter7.length >= 10) {
                isValid = true;
            } else {
                isValid = false;
                errorText = `❌ Нужно ещё ${10 - digitsAfter7.length} цифр`;
            }
        }
    }
    
    // Применяем стили
    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorText;
            errorElement.classList.add('visible');
        }
    } else {
        field.classList.add('success');
    }
    
    return isValid;
}

function checkAllFields() {
    const name = document.getElementById('userName');
    const phone = document.getElementById('userPhone');
    const address = document.getElementById('userAddress');
    
    if (!name || !phone || !address) return false;
    
    const isNameValid = validateField(name);
    const isPhoneValid = validateField(phone);
    const isAddressValid = validateField(address);
    
    const allValid = isNameValid && isPhoneValid && isAddressValid;
    
    const btns = document.querySelectorAll('.submit-order');
    btns.forEach(btn => {
        btn.disabled = !allValid;
        btn.style.opacity = allValid ? '1' : '0.5';
        btn.style.cursor = allValid ? 'pointer' : 'not-allowed';
    });
    
    return allValid;
}

function setupValidation() {
    const fields = ['userName', 'userPhone', 'userAddress'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (!field) return;
        
        field.addEventListener('input', function() {
            // Для адреса — запускаем проверку через DaData
            if (id === 'userAddress') {
                validateAddressWithDadata(this);
            } else {
                // Для имени и телефона — обычная проверка
                checkAllFields();
            }
        });
        
        field.addEventListener('blur', function() {
            if (id === 'userAddress') {
                validateAddressWithDadata(this);
            } else {
                checkAllFields();
            }
        });
    });
}

function checkFormBeforeSubmit() {
    const allValid = checkAllFields();
    if (!allValid) {
        showMessage('❌ Заполните все поля правильно!');
        return false;
    }
    return true;
}
// ==================== ПРОВЕРКА АДРЕСА ЧЕРЕЗ DADATA ====================

// ТВОЙ API-КЛЮЧ (получи на dadata.ru)
const DADATA_API_KEY = 'c27968683b961cb6baa6d0523b20da6ec8b56321'; // ← ЗАМЕНИ НА СВОЙ!

// Проверка адреса через DaData
function checkAddress(address) {
    return new Promise((resolve) => {
        // Если адрес слишком короткий — не проверяем
        if (address.length < 5) {
            resolve({ valid: false, suggestion: 'Введите адрес подробнее' });
            return;
        }
        
        fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Token ' + DADATA_API_KEY
            },
            body: JSON.stringify({
                query: address,
                count: 1,
                restrict_value: true // только точные адреса
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.suggestions && data.suggestions.length > 0) {
                const suggestion = data.suggestions[0];
                // Проверяем, что это реальный адрес (не просто улица)
                const isRealAddress = suggestion.data &&
                    (suggestion.data.street || suggestion.data.house || 
                     suggestion.data.city || suggestion.data.settlement);
                
                if (isRealAddress) {
                    // Предлагаем исправленный адрес
                    const fullAddress = suggestion.value;
                    resolve({
                        valid: true,
                        suggestion: fullAddress,
                        original: address
                    });
                } else {
                    resolve({ valid: false, suggestion: 'Уточните адрес (укажите город и улицу)' });
                }
            } else {
                resolve({ valid: false, suggestion: 'Адрес не найден. Проверьте написание' });
            }
        })
        .catch(error => {
            console.error('Ошибка проверки адреса:', error);
            // Если API не отвечает — пропускаем проверку
            resolve({ valid: true, suggestion: address });
        });
    });
}

// Валидация адреса с проверкой через DaData
let addressCheckTimer = null;

function validateAddressWithDadata(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('userAddressError');
    
    // Сначала проверяем минимальную длину
    if (value.length < 3) {
        field.classList.remove('success', 'error');
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = '❌ Введите адрес (минимум 3 символа)';
            errorElement.classList.add('visible');
        }
        return;
    }
    
    // Если адрес короткий — не проверяем
    if (value.length < 5) {
        field.classList.remove('success', 'error');
        if (errorElement) {
            errorElement.textContent = '⏳ Введите адрес подробнее...';
            errorElement.classList.add('visible');
        }
        return;
    }
    
    // Показываем, что идёт проверка
    field.classList.remove('success', 'error');
    if (errorElement) {
        errorElement.textContent = '⏳ Проверка адреса...';
        errorElement.classList.add('visible');
    }
    
    // Отменяем предыдущий таймер
    if (addressCheckTimer) {
        clearTimeout(addressCheckTimer);
    }
    
    // Ждём 1 секунду после остановки ввода
    addressCheckTimer = setTimeout(() => {
        checkAddress(value)
            .then(result => {
                if (result.valid) {
                    field.classList.remove('error');
                    field.classList.add('success');
                    if (errorElement) {
                        // Если адрес был исправлен — показываем
                        if (result.suggestion !== value) {
                            errorElement.textContent = '✅ ' + result.suggestion;
                            errorElement.style.color = '#22c55e';
                            // Обновляем поле на исправленный адрес
                            field.value = result.suggestion;
                        } else {
                            errorElement.classList.remove('visible');
                        }
                    }
                } else {
                    field.classList.remove('success');
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = '❌ ' + result.suggestion;
                        errorElement.classList.add('visible');
                    }
                }
                
                // Обновляем состояние кнопок
                checkAllFields();
            })
            .catch(() => {
                // Если ошибка API — пропускаем проверку
                field.classList.remove('error');
                field.classList.add('success');
                if (errorElement) {
                    errorElement.classList.remove('visible');
                }
                checkAllFields();
            });
    }, 5000);
}

init();
// ==================== ПИНГ ДЛЯ WORKER ====================
function pingWorker() {
    const workerUrl = 'https://more125.nastyafrolova73.workers.dev';
    
    fetch(workerUrl, {
        method: 'GET',
        cache: 'no-cache'
    })
    .then(response => {
        if (response.ok) {
            console.log('✅ Пинг успешен! Worker отвечает.');
        } else {
            console.warn('⚠️ Worker ответил с ошибкой:', response.status);
        }
    })
    .catch(error => {
        console.warn('⚠️ Worker не отвечает:', error.message);
    });
}

// Пингуем сразу при загрузке страницы
pingWorker();

// И каждые 3 минуты (180000 мс), чтобы Worker не засыпал
setInterval(pingWorker, 180000);
