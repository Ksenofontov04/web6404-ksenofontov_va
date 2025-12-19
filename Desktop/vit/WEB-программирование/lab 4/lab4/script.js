// Класс для формы (ООП в JavaScript)
class FeedbackForm {
    constructor(name, email, phone, planet, message, interests, subscribe) {
        this.name = name;
        this.email = email;
        this.phone = phone || 'Не указан';
        this.planet = planet || 'Не выбрана';
        this.message = message;
        this.interests = interests || [];
        this.subscribe = subscribe || false;
        this.date = new Date();
    }

    // Метод для вывода в консоль
    logToConsole() {
        console.log("=== ФОРМА ОБРАТНОЙ СВЯЗИ ===");
        console.log("Имя: " + this.name);
        console.log("Email: " + this.email);
        console.log("Телефон: " + this.phone);
        console.log("Планета: " + this.planet);
        console.log("Сообщение: " + this.message);
        console.log("Интересы: " + this.interests.join(", "));
        console.log("Подписка: " + (this.subscribe ? "Да" : "Нет"));
        console.log("Дата: " + this.date.toLocaleString());
        console.log("===========================");
    }
}

// Когда страница загрузится
document.addEventListener('DOMContentLoaded', function() {
    // 1. Обработка формы
    const form = document.getElementById('feedbackForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Останавливаем отправку
            
            // Собираем данные
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const planet = document.getElementById('planet').value;
            const message = document.getElementById('message').value;
            
            // Собираем чекбоксы
            const interests = [];
            if (document.getElementById('interest-planets').checked) interests.push('Планеты');
            if (document.getElementById('interest-stars').checked) interests.push('Звёзды');
            if (document.getElementById('interest-galaxies').checked) interests.push('Галактики');
            
            const subscribe = document.getElementById('subscribe').checked;
            
            // Создаём объект класса
            const feedback = new FeedbackForm(name, email, phone, planet, message, interests, subscribe);
            
            // Выводим в консоль
            feedback.logToConsole();
            
            // Показываем сообщение
            alert('Форма отправлена! Проверьте консоль браузера (F12 → Console)');
            
            // Очищаем форму
            form.reset();
        });
    }
    
    // 2. Анимация для таблицы планет
    const tableRows = document.querySelectorAll('table tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            this.style.backgroundColor = '#283593';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 500);
            
            const planetName = this.cells[0].textContent;
            console.log('Выбрана планета: ' + planetName);
        });
    });
    
    // 3. Анимация для картинок в галерее
    const galleryImages = document.querySelectorAll('.gallery img');
    galleryImages.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
        });
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // 4. Приветствие в консоль
    console.log('Сайт "Космос и Астрономия" загружен!');
    console.log('Форма обратной связи готова к работе.');
});