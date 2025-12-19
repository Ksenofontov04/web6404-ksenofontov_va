// ==================== ЛАБОРАТОРНАЯ РАБОТА 5 ====================
// Динамическая валидация + асинхронные запросы

// ===== ЧАСТЬ 1: ВАЛИДАЦИЯ ФОРМЫ =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, запускаем валидацию формы...');
    
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('Форма с id="contactForm" не найдена!');
        return;
    }

    // Элементы формы
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const formStatus = document.getElementById('formStatus');

    // Регулярные выражения
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;

    // Функция показа подсказки
    function showHint(elementId, message, isValid) {
        const hint = document.getElementById(elementId);
        if (hint) {
            hint.textContent = message;
            hint.className = `hint ${isValid ? 'valid' : 'error'}`;
            console.log(`Подсказка: ${message}`);
        }
    }

    // === ВАЛИДАЦИЯ В РЕАЛЬНОМ ВРЕМЕНИ ===
    
    // Имя
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.length < 2) {
                showHint('nameHint', 'Имя должно быть не менее 2 символов', false);
            } else {
                showHint('nameHint', '✓ Корректно', true);
            }
        });
        console.log('Валидация имени подключена');
    }

    // Email
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (!emailRegex.test(this.value)) {
                showHint('emailHint', 'Введите корректный email (example@mail.com)', false);
            } else {
                showHint('emailHint', '✓ Корректный email', true);
            }
        });
        console.log('Валидация email подключена');
    }

    // Телефон с маской
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Маска для телефона
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('7') || value.startsWith('8')) {
                value = '+7' + value.substring(1);
            }
            if (value.length > 2) {
                value = value.substring(0, 2) + ' (' + value.substring(2);
            }
            if (value.length > 7) {
                value = value.substring(0, 7) + ') ' + value.substring(7);
            }
            if (value.length > 12) {
                value = value.substring(0, 12) + '-' + value.substring(12);
            }
            if (value.length > 15) {
                value = value.substring(0, 15) + '-' + value.substring(15);
            }
            this.value = value.substring(0, 18);

            // Валидация
            if (!phoneRegex.test(this.value)) {
                showHint('phoneHint', 'Формат: +7 (XXX) XXX-XX-XX', false);
            } else {
                showHint('phoneHint', '✓ Корректный номер', true);
            }
        });
        console.log('Валидация телефона подключена');
    }

    // Сообщение
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            if (this.value.length < 10) {
                showHint('messageHint', 'Сообщение должно быть не менее 10 символов', false);
            } else {
                showHint('messageHint', '✓ Достаточно длинное сообщение', true);
            }
        });
        console.log('Валидация сообщения подключена');
    }

    // === ОТПРАВКА ФОРМЫ (POST-запрос) ===
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Попытка отправки формы...');

        // Проверка всех полей перед отправкой
        let isValid = true;

        if (nameInput && nameInput.value.length < 2) {
            showHint('nameHint', 'Имя должно быть не менее 2 символов', false);
            isValid = false;
        }

        if (emailInput && !emailRegex.test(emailInput.value)) {
            showHint('emailHint', 'Введите корректный email', false);
            isValid = false;
        }

        if (phoneInput && !phoneRegex.test(phoneInput.value)) {
            showHint('phoneHint', 'Введите корректный телефон', false);
            isValid = false;
        }

        if (messageInput && messageInput.value.length < 10) {
            showHint('messageHint', 'Сообщение слишком короткое', false);
            isValid = false;
        }

        if (!isValid) {
            if (formStatus) {
                formStatus.textContent = 'Пожалуйста, исправьте ошибки в форме.';
                formStatus.className = 'error';
            }
            return;
        }

        // Данные формы
        const formData = {
            name: nameInput ? nameInput.value : '',
            email: emailInput ? emailInput.value : '',
            phone: phoneInput ? phoneInput.value : '',
            message: messageInput ? messageInput.value : '',
            date: new Date().toISOString()
        };

        // Отправка POST-запроса на моковый сервер
        try {
            if (formStatus) {
                formStatus.textContent = 'Отправка...';
                formStatus.className = '';
            }

            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                if (formStatus) {
                    formStatus.textContent = `✅ Форма успешно отправлена! (ID: ${result.id})`;
                    formStatus.className = 'success';
                }
                console.log('Форма отправлена успешно! Ответ сервера:', result);
                
                // Сброс формы
                form.reset();
                
                // Очистить подсказки
                ['nameHint', 'emailHint', 'phoneHint', 'messageHint'].forEach(id => {
                    const hint = document.getElementById(id);
                    if (hint) hint.textContent = '';
                });
            } else {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            if (formStatus) {
                formStatus.textContent = '❌ Ошибка отправки: ' + error.message;
                formStatus.className = 'error';
            }
        }
    });

    // Сброс формы
    form.addEventListener('reset', function() {
        ['nameHint', 'emailHint', 'phoneHint', 'messageHint'].forEach(id => {
            const hint = document.getElementById(id);
            if (hint) hint.textContent = '';
        });
        if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = '';
        }
        console.log('Форма сброшена');
    });

    console.log('Валидация формы настроена!');
});

// ===== ЧАСТЬ 2: АСИНХРОННЫЙ ЗАПРОС ДЛЯ ТАБЛИЦЫ ПЛАНЕТ =====
// (Этот код будет работать в planets.html)

async function fetchPlanets() {
    try {
        console.log('Запрашиваю данные о планетах...');
        const response = await fetch('http://localhost:3000/planets');
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const planets = await response.json();
        console.log('Получены данные о планетах:', planets);
        return planets;
    } catch (error) {
        console.error('Ошибка при получении планет:', error);
        return [];
    }
}

// Функция для периодического обновления
function startPeriodicFetch(intervalMinutes = 5) {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    // Первый запрос сразу
    fetchPlanets();
    
    // Периодические запросы
    setInterval(fetchPlanets, intervalMs);
    console.log(`Периодические запросы настроены: каждые ${intervalMinutes} минут`);
}

// ===== ЧАСТЬ 3: АНИМАЦИИ И ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Анимация строк таблицы
function setupTableAnimations() {
    const tableRows = document.querySelectorAll('.table__row');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            this.classList.add('table__row--highlight');
            setTimeout(() => {
                this.classList.remove('table__row--highlight');
            }, 1500);
        });
    });
}

// Анимация галереи
function setupGalleryAnimations() {
    const galleryImages = document.querySelectorAll('.gallery__image');
    galleryImages.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1) rotate(1deg)';
        });
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });
}

// Инициализация всех функций
document.addEventListener('DOMContentLoaded', function() {
    setupTableAnimations();
    setupGalleryAnimations();
    
    // Запуск периодических запросов (если мы на странице планет)
    if (window.location.pathname.includes('planets.html')) {
        startPeriodicFetch(1); // Для теста - каждую минуту (по заданию - 5 минут)
    }
    
    console.log('Все функции лабы 5 инициализированы!');
});