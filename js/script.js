/*
  script.js
  Функционал смены темы, модального окна и слайдера на чистом JavaScript.
  Теперь слайдер циклический и управляется стрелками.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Смена темы (Dark/Light Mode) ---
    const themeSwitchBtn = document.getElementById('theme-switch-btn');
    const body = document.body;
    const THEME_KEY = 'df-theme'; 

    // Функция для применения темы и обновления текста кнопки
    function applyTheme(isLight) {
        if (isLight) {
            body.classList.add('light-theme');
            themeSwitchBtn.textContent = 'Тёмная тема';
        } else {
            body.classList.remove('light-theme');
            themeSwitchBtn.textContent = 'Светлая тема';
        }
    }
    
    // Инициализация текста кнопки на основе темы, которая уже применена инлайн-скриптом
    let isLightMode = body.classList.contains('light-theme');
    // Применяем тему, чтобы обновить текст кнопки.
    // Сохранение/загрузка темы происходит через инлайн-скрипт и обработчик клика.
    applyTheme(isLightMode); 

    // Обработчик клика
    themeSwitchBtn.addEventListener('click', () => {
        isLightMode = !isLightMode;
        applyTheme(isLightMode);
        localStorage.setItem(THEME_KEY, isLightMode ? 'light' : 'dark');
    });


    // --- 2. Модальное окно (Modal) ---
    const modal = document.getElementById('main-modal');
    // Проверяем наличие модала, так как он может отсутствовать на некоторых страницах
    if (modal) {
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeModalBtnX = document.getElementById('close-modal-btn-x');
        const closeModalBtnFooter = document.getElementById('close-modal-btn-footer');

        // Открыть модальное окно
        function openModal() {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Запрет скролла
        }

        // Закрыть модальное окно
        function closeModal() {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Восстановление скролла
        }

        // Обработчики открытия и закрытия
        if (openModalBtn) openModalBtn.addEventListener('click', openModal);
        if (closeModalBtnX) closeModalBtnX.addEventListener('click', closeModal);
        if (closeModalBtnFooter) closeModalBtnFooter.addEventListener('click', closeModal);

        // Закрытие по клику вне окна
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Закрытие по кнопке Esc
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }


    // --- 3. Слайдер (Carousel) - Добавлена цикличность и кнопки ---
    const slidesContainer = document.getElementById('slides-container');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (slidesContainer && dotsContainer) {
        const slides = slidesContainer.querySelectorAll('.slide');
        const totalSlides = slides.length;
        let currentSlide = 0;

        // Создание точек навигации
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot-btn');
            dot.setAttribute('data-slide-index', i);
            dotsContainer.appendChild(dot);
        }

        // Кнопки Prev/Next
        const prevBtn = document.getElementById('prev-slide-btn');
        const nextBtn = document.getElementById('next-slide-btn');
        
        // Функция для обновления состояния слайдера
        function updateSlider() {
            // Вычисляем смещение
            const offset = -currentSlide * 100;
            slidesContainer.style.transform = `translateX(${offset}%)`;

            // Обновляем точки (индикаторы)
            dotsContainer.querySelectorAll('.dot-btn').forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentSlide) {
                    dot.classList.add('active');
                }
            });
        }

        // Функция перехода к определенному слайду
        function goToSlide(index) {
            // Реализация цикличности (по кругу)
            if (index < 0) {
                currentSlide = totalSlides - 1; // Переход с первого на последний
            } else if (index >= totalSlides) {
                currentSlide = 0; // Переход с последнего на первый
            } else {
                currentSlide = index;
            }
            updateSlider();
        }

        // Обработчик кликов по точкам
        dotsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('dot-btn')) {
                const index = parseInt(target.getAttribute('data-slide-index'));
                goToSlide(index);
            }
        });

        // Обработчики кликов по кнопкам Prev/Next
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));


        // Инициализация слайдера при загрузке
        updateSlider();
    }
});