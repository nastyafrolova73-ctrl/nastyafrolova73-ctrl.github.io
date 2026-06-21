// ==================== ПРОВЕРКА АДРЕСА (БЕЗ API) ====================

// Список крупных городов России (для проверки)
const CITIES = [
    'москва', 'санкт-петербург', 'новосибирск', 'екатеринбург', 'казань',
    'нижний новгород', 'челябинск', 'омск', 'самара', 'ростов-на-дону',
    'уфа', 'красноярск', 'пермь', 'воронеж', 'волгоград', 'краснодар',
    'саратов', 'тюмень', 'тольятти', 'ижевск', 'барнаул', 'ульяновск',
    'иркутск', 'хабаровск', 'ярославль', 'владивосток', 'махачкала',
    'томск', 'оренбург', 'кемерово', 'новокузнецк', 'рязань', 'астрахань',
    'пенза', 'липецк', 'киров', 'чебоксары', 'тула', 'калининград',
    'курск', 'севастополь', 'сочи', 'тверь', 'белгород', 'сургут',
    'владимир', 'чимкент', 'калуга', 'магнитогорск', 'якутск'
];

function validateAddressSimple(field) {
    const value = field.value.trim().toLowerCase();
    const errorElement = document.getElementById('userAddressError');
    
    // Сбрасываем классы
    field.classList.remove('error', 'success', 'loading');
    if (errorElement) {
        errorElement.classList.remove('visible', 'loading');
        errorElement.textContent = '';
    }
    
    // Проверяем минимальную длину
    if (value.length < 3) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = '❌ Введите город и улицу (минимум 3 символа)';
            errorElement.classList.add('visible');
        }
        return false;
    }
    
    // Проверяем, есть ли город в списке
    let hasCity = false;
    let foundCity = '';
    for (const city of CITIES) {
        if (value.includes(city)) {
            hasCity = true;
            foundCity = city;
            break;
        }
    }
    
    // Проверяем, есть ли указание на улицу/дом
    const hasStreet = /ул\.|улица|пр\.|проспект|пер\.|переулок|ш\.|шоссе|бульвар|набережная|аллея|площадь|д\.|дом|кв\.|квартира|строение|корпус/i.test(value);
    
    // Проверяем, есть ли номер дома
    const hasHouse = /\d/.test(value);
    
    // Логика валидации
    if (!hasCity && value.length < 10) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = '❌ Укажите город (например: Москва, ул. Тверская)';
            errorElement.classList.add('visible');
        }
        return false;
    }
    
    if (!hasStreet && !hasHouse) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = '❌ Укажите улицу и номер дома (например: ул. Тверская, д. 1)';
            errorElement.classList.add('visible');
        }
        return false;
    }
    
    // Если всё хорошо
    field.classList.add('success');
    if (errorElement) {
        if (foundCity) {
            errorElement.textContent = '✅ ' + foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
            errorElement.classList.add('visible');
            errorElement.style.color = '#22c55e';
        } else {
            errorElement.classList.remove('visible');
        }
    }
    return true;
}
