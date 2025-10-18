document.addEventListener('DOMContentLoaded', function() {

    // 1. LÓGICA DO MENU MOBILE
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksList = document.querySelector('.nav-links');
    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => navLinksList.classList.toggle('open'));
        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinksList.classList.remove('open'));
        });
    }

    // 2. INICIALIZAÇÃO DO CARROSSEL DE EXPERIÊNCIAS
    new Swiper('.experiences-carousel', {
        loop: true,
        grabCursor: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 320: { slidesPerView: 1, spaceBetween: 20 }, 768: { slidesPerView: 2, spaceBetween: 30 }, 1024: { slidesPerView: 3, spaceBetween: 30 } }
    });

    // 3. LÓGICA PARA AS ABAS DE PROJETOS
    const tabsContainer = document.querySelector('.project-tabs');
    const projectCards = document.querySelectorAll('.project-card');
    if (tabsContainer && projectCards.length > 0) {
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                tabsContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const category = e.target.dataset.category;

                projectCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    const shouldShow = category === 'todos' || cardCategory === category;

                    // A lógica de mostrar/esconder foi simplificada para ser mais robusta
                    if (shouldShow) {
                        card.classList.remove('hidden');
                        card.style.position = ''; // Reseta para o padrão do CSS
                        card.style.zIndex = '';
                    } else {
                        card.classList.add('hidden');
                        // O CSS agora lida com a animação e o posicionamento
                    }
                });
            }
        });
    }

    // 4. OBSERVERS PARA ANIMAÇÕES E SCROLLSPY
    const sections = document.querySelectorAll('section[id], header[id]');
    const verticalNavLinks = document.querySelectorAll('.vertical-nav a.nav-link');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.matches('.progress')) {
                    entry.target.style.width = entry.target.dataset.percent + '%';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                verticalNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    document.querySelectorAll('h2, .about-container, .download-cv-btn, .skill, .project-card, .swiper-slide, .contact-links').forEach(el => {
        el.classList.add('fade-in');
        animationObserver.observe(el);
    });
    document.querySelectorAll('.progress').forEach(bar => animationObserver.observe(bar));
    sections.forEach(section => sectionObserver.observe(section));

    // 5. TRANSIÇÃO SUAVE DE PÁGINA
    const mainContent = document.querySelector('main');
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                if (mainContent) mainContent.classList.add('page-transition-out');
                setTimeout(() => {
                    const targetElement = document.querySelector(href);
                    if (targetElement) targetElement.scrollIntoView();
                    if (mainContent) mainContent.classList.remove('page-transition-out');
                }, 400);
            }
        });
    });

    // 6. LÓGICA DINÂMICA DO MODAL
    const detailsModal = document.getElementById('details-modal');
    if (detailsModal) {
        const modalTitle = document.getElementById('modal-title');
        const modalImage = document.getElementById('modal-image');
        const modalDetailsContent = document.getElementById('modal-details-content');
        const closeModalBtn = detailsModal.querySelector('.close-modal-btn');

        const openModal = (cardData) => {
            modalTitle.textContent = cardData.title || '';
            if (cardData.image) {
                modalImage.src = cardData.image;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }
            modalDetailsContent.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const title = cardData[`section${i}Title`];
                const content = cardData[`section${i}Content`];
                if (title && content) {
                    const sectionDiv = document.createElement('div');
                    sectionDiv.className = 'modal-section';
                    sectionDiv.innerHTML = `<h3>${title}</h3><div>${content}</div>`;
                    modalDetailsContent.appendChild(sectionDiv);
                }
            }
            detailsModal.classList.add('visible');
            document.body.classList.add('no-scroll');
        };

        const closeModal = () => {
            detailsModal.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.details-btn')) {
                // CORREÇÃO: O seletor agora inclui a nova classe .project-card
                const card = e.target.closest('.project-card, .experience-card');
                if (card) openModal(card.dataset);
            }
        });

        closeModalBtn.addEventListener('click', closeModal);
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) closeModal();
        });
    }
});