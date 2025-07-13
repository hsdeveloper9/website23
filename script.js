document.addEventListener('DOMContentLoaded', function () {
    // ============== Preloader ==============
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', function () {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: function () {
                preloader.style.display = 'none';
            }
        });
    });

    // ============== Theme Toggle ==============
    const themeToggle = document.querySelector('.theme-toggle');
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function () {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    // ============== Custom Cursor ==============
    const cursorOuter = document.querySelector('.cursor--outer');
    const cursorInner = document.querySelector('.cursor--inner');
    const cursorText = document.querySelector('.cursor--text');
    const cursorProject = document.querySelector('.cursor--project');

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    let projectX = 0, projectY = 0;
    let isHovering = false, isClicking = false;
    let isHoveringText = false, isHoveringProject = false;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursorInner.style.left = mouseX + 'px';
        cursorInner.style.top = mouseY + 'px';
        cursorOuter.style.left = cursorX + 'px';
        cursorOuter.style.top = cursorY + 'px';
        cursorText.style.left = mouseX + 'px';
        cursorText.style.top = mouseY + 'px';
        cursorProject.style.left = projectX + 'px';
        cursorProject.style.top = projectY + 'px';

        cursorOuter.classList.toggle('cursor--active', isHovering);
        cursorInner.classList.toggle('cursor--click', isClicking);
        cursorOuter.classList.toggle('cursor--hover', isHovering);
        cursorText.classList.toggle('cursor--hover-text', isHoveringText);
        cursorProject.classList.toggle('cursor--hover-project', isHoveringProject);

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mousedown', () => isClicking = true);
    document.addEventListener('mouseup', () => isClicking = false);

    const hoverElements = document.querySelectorAll('a, button, [data-cursor]');
    hoverElements.forEach(el => {
        const cursorType = el.dataset.cursor || '';
        const hoverText = el.dataset.cursorText || '';
        el.addEventListener('mouseenter', function () {
            isHovering = true;
            if (cursorType === 'text') {
                isHoveringText = true;
                cursorText.textContent = hoverText;
            } else if (cursorType === 'project') {
                isHoveringProject = true;
                const rect = el.getBoundingClientRect();
                projectX = rect.left + rect.width / 2;
                projectY = rect.top + rect.height / 2;
            }
        });
        el.addEventListener('mouseleave', function () {
            isHovering = false;
            isHoveringText = false;
            isHoveringProject = false;
        });
        el.addEventListener('mousemove', function () {
            if (cursorType === 'project') {
                const rect = el.getBoundingClientRect();
                projectX = rect.left + rect.width / 2;
                projectY = rect.top + rect.height / 2;
            }
        });
    });

    // ============== Mobile Navigation ==============
    const hamburger = document.querySelector('.nav__hamburger');
    const navMenu = document.querySelector('.nav__menu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============== Smooth Scrolling ==============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============== Header Scroll Effect ==============
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ============== Back to Top Button ==============
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });

    // ============== Project Filtering ==============
    const filterButtons = document.querySelectorAll('.work__filter');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.dataset.filter;

            projectCards.forEach(card => {
                const categories = card.dataset.category.split(',');
                card.style.display = (filterValue === 'all' || categories.includes(filterValue)) ? 'block' : 'none';
            });

            gsap.fromTo(projectCards,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out',
                    onComplete: () => ScrollTrigger.refresh()
                }
            );
        });
    });

    // ============== Form Submission ==============
    const contactForm = document.querySelector('.contact__form');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = {
            name: this.querySelector('#name').value,
            email: this.querySelector('#email').value,
            subject: this.querySelector('#subject').value,
            message: this.querySelector('#message').value
        };
        console.log('Form submitted:', formData);

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `<i class="fas fa-check-circle"></i><span>Thank you! Your message has been sent.</span>`;
        contactForm.appendChild(successMessage);
        this.reset();

        setTimeout(() => successMessage.remove(), 5000);
    });

    // ============== Set Current Year ==============
    document.getElementById('year').textContent = new Date().getFullYear();

    // ============== GSAP Animations ==============
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero__title-line', {
        y: '100%', opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
    });
    gsap.from('.hero__description', { y: 20, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' });
    gsap.from('.hero__buttons', { y: 20, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power2.out' });
    gsap.from('.hero__image-container', { y: 50, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
    gsap.from('.hero__badge', { y: 30, opacity: 0, duration: 0.8, delay: 0.8, stagger: 0.1, ease: 'power2.out' });

    document.querySelectorAll('.section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
            y: 50, opacity: 0, duration: 0.8, ease: 'power2.out'
        });
    });

    document.querySelectorAll('.project-card').forEach((project, index) => {
        gsap.from(project, {
            scrollTrigger: { trigger: project, start: 'top 80%', toggleActions: 'play none none none' },
            y: 50, opacity: 0, duration: 0.6, delay: index * 0.1, ease: 'power2.out'
        });
    });

    document.querySelectorAll('.skill-pill__level').forEach(pill => {
        ScrollTrigger.create({
            trigger: pill, start: 'top 80%',
            onEnter: () => { void pill.offsetWidth; pill.style.width = pill.style.width; }
        });
    });

    // ============== Particles Background ==============
    const canvas = document.getElementById('particles');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = window.innerWidth < 768 ? 30 : 60;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
                this.opacity = Math.random() * 0.2 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = Math.sqrt((particles[a].x - particles[b].x) ** 2 + (particles[a].y - particles[b].y) ** 2);
                    if (distance < 100) {
                        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
                        ctx.globalAlpha = 0.1 - (distance / 1000);
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        initParticles();
        animateParticles();
    }

    // ============== VanillaTilt for Hero Image ==============
    const heroImage = document.querySelector('.hero__image-container');
    if (heroImage) {
        VanillaTilt.init(heroImage, {
            max: 10,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            gyroscope: true
        });
    }

    // ============== Intersection Observer ==============
    const animateOnScroll = (elements, animation) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animation(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => observer.observe(element));
    };

    document.querySelectorAll('.stat-card').forEach(card => {
        animateOnScroll([card], (el) => {
            gsap.from(el, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            });
        });
    });

    // ============== Form Input Label Animation ==============
    document.querySelectorAll('.form__input, .form__textarea').forEach(input => {
        const label = input.nextElementSibling;
        input.addEventListener('focus', () => {
            label.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                label.style.color = getComputedStyle(document.documentElement).getPropertyValue('--color-text-light');
            }
        });
    });

    // ============== Project Card Hover Effects ==============
    document.querySelectorAll('.project-card').forEach(project => {
        const image = project.querySelector('.project-card__image img');
        const overlay = project.querySelector('.project-card__overlay');
        project.addEventListener('mouseenter', function () {
            gsap.to(image, { scale: 1.05, duration: 0.5, ease: 'power2.out' });
            gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        });
        project.addEventListener('mouseleave', function () {
            gsap.to(image, { scale: 1, duration: 0.5, ease: 'power2.out' });
            gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        });
    });

    // ============== Footer Animation ==============
    const footer = document.querySelector('.footer');
    if (footer) {
        animateOnScroll([footer], (el) => {
            gsap.from(el.querySelectorAll('*'), {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        });
    }
});
