/* ============================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   ============================================ */

'use strict';

// Global Variables
let isLoading = true;
let currentSection = 'home';
let typingInterval;
let particlesAnimation;
let scrollProgress = 0;

// Configuration
const CONFIG = {
    typing: {
        titles: [
            'AI Research Engineer',
            'Machine Learning Specialist',
            'Full-Stack Developer',
            'Deep Learning Expert',
            'Data Science Engineer',
            'AI Solutions Architect'
        ],
        speed: 100,
        deleteSpeed: 50,
        pauseTime: 2000
    },
    animations: {
        observerOptions: {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        },
        countUpDuration: 2000,
        skillBarDuration: 1500
    },
    particles: {
        count: 50,
        speed: 0.5,
        size: { min: 1, max: 3 },
        opacity: { min: 0.1, max: 0.5 }
    }
};

// Utility Functions
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Get element with error handling
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    // Get elements with error handling
    getElements(selector) {
        return document.querySelectorAll(selector);
    },

    // Smooth scroll to element
    smoothScroll(target) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            const navbar = document.querySelector('.navbar');
            const navHeight = navbar ? navbar.offsetHeight : 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20;

            console.log('Smooth scroll to:', target, 'Element:', element, 'Offset:', offsetPosition); // Debug

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            console.warn('Smooth scroll target not found:', target);
        }
    },

    // Generate random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Linear interpolation
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold &&
            rect.left <= windowWidth * (1 - threshold) &&
            rect.right >= windowWidth * threshold
        );
    }
};

// Loading Screen Management
class LoadingScreen {
    constructor() {
        this.loadingScreen = utils.getElement('#loading-screen');
        this.init();
    }

    init() {
        this.animateLetters();
        this.simulateLoading();
    }

    animateLetters() {
        const letters = utils.getElements('.loading-letter');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${index * 0.1}s`;
        });
    }

    simulateLoading() {
        // Simulate loading time
        setTimeout(() => {
            this.hide();
        }, 2500);
    }

    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                isLoading = false;
                document.body.style.overflow = 'auto';
                this.triggerPageAnimations();
            }, 500);
        }
    }

    triggerPageAnimations() {
        // Initialize all page components after loading
        new TypingAnimation();
        new ParticleSystem();
        new ScrollAnimations();
        new StatsCounter();
    }
}

// Navigation Management
class Navigation {
    constructor() {
        this.navbar = utils.getElement('.navbar');
        this.navMenu = utils.getElement('#nav-menu');
        this.hamburger = utils.getElement('#hamburger');
        this.navLinks = utils.getElements('.nav-link');
        this.themeToggle = utils.getElement('#theme-toggle');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActiveLink();
    }

    bindEvents() {
        // Hamburger menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Also handle direct clicks on nav link text/icons
        const navLinkElements = utils.getElements('.nav-link span, .nav-link i');
        navLinkElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const parentLink = element.closest('.nav-link');
                if (parentLink) {
                    this.handleNavClick({ 
                        preventDefault: () => {}, 
                        currentTarget: parentLink 
                    });
                }
            });
        });

        // Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Scroll events
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateNavbarOnScroll();
            this.setActiveLink();
        }, 16));

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        
        console.log('Navigation clicked:', targetId); // Debug log
        
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            console.log('Target element found:', targetElement); // Debug log
            
            if (targetElement) {
                utils.smoothScroll(targetId);
                this.closeMobileMenu();
            } else {
                console.warn(`Target element not found: ${targetId}`);
            }
        }
    }

    updateNavbarOnScroll() {
        const scrolled = window.pageYOffset > 50;
        if (this.navbar) {
            this.navbar.classList.toggle('scrolled', scrolled);
        }
    }

    setActiveLink() {
        const sections = utils.getElements('section[id]');
        const navHeight = this.navbar ? this.navbar.offsetHeight : 80;
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            
            // Check if section is in view (accounting for navbar height)
            if (sectionTop <= navHeight + 100 && sectionBottom >= navHeight + 100) {
                currentSectionId = section.id;
            }
        });

        // If no section is clearly in view, find the closest one
        if (!currentSectionId && sections.length > 0) {
            let closestSection = null;
            let closestDistance = Infinity;
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top - navHeight);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = section;
                }
            });
            
            if (closestSection) {
                currentSectionId = closestSection.id;
            }
        }

        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        currentSection = currentSectionId;
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// Progress Bar
class ProgressBar {
    constructor() {
        this.progressBar = utils.getElement('#progressBar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateProgress();
        }, 16));
    }

    updateProgress() {
        if (!this.progressBar) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        
        scrollProgress = (scrollTop / documentHeight) * 100;
        this.progressBar.style.width = `${scrollProgress}%`;
    }
}

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = utils.getElement('.custom-cursor');
        this.cursorDot = utils.getElement('.cursor-dot');
        this.cursorOutline = utils.getElement('.cursor-outline');
        
        this.mousePosition = { x: 0, y: 0 };
        this.cursorPosition = { x: 0, y: 0 };
        this.outlinePosition = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        if (!this.cursor || window.innerWidth <= 768) return;

        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });

        // Hover effects for interactive elements
        const interactiveElements = utils.getElements('a, button, .btn, .project-card, .skill-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.expand());
            el.addEventListener('mouseleave', () => this.contract());
        });
    }

    animate() {
        // Smooth cursor movement
        this.cursorPosition.x = utils.lerp(this.cursorPosition.x, this.mousePosition.x, 0.2);
        this.cursorPosition.y = utils.lerp(this.cursorPosition.y, this.mousePosition.y, 0.2);
        
        this.outlinePosition.x = utils.lerp(this.outlinePosition.x, this.mousePosition.x, 0.1);
        this.outlinePosition.y = utils.lerp(this.outlinePosition.y, this.mousePosition.y, 0.1);

        if (this.cursorDot) {
            this.cursorDot.style.transform = `translate(${this.cursorPosition.x}px, ${this.cursorPosition.y}px)`;
        }
        
        if (this.cursorOutline) {
            this.cursorOutline.style.transform = `translate(${this.outlinePosition.x}px, ${this.outlinePosition.y}px)`;
        }

        requestAnimationFrame(() => this.animate());
    }

    expand() {
        if (this.cursorOutline) {
            this.cursorOutline.style.transform += ' scale(1.5)';
        }
    }

    contract() {
        if (this.cursorOutline) {
            this.cursorOutline.style.transform = this.cursorOutline.style.transform.replace(' scale(1.5)', '');
        }
    }
}

// Typing Animation
class TypingAnimation {
    constructor() {
        this.element = utils.getElement('#typing-text');
        this.titles = CONFIG.typing.titles;
        this.currentTitleIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.init();
    }

    init() {
        if (!this.element) return;
        this.type();
    }

    type() {
        const currentTitle = this.titles[this.currentTitleIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentTitle.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentTitle.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? CONFIG.typing.deleteSpeed : CONFIG.typing.speed;

        if (!this.isDeleting && this.currentCharIndex === currentTitle.length) {
            typeSpeed = CONFIG.typing.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titles.length;
            typeSpeed = 500;
        }

        typingInterval = setTimeout(() => this.type(), typeSpeed);
    }

    destroy() {
        if (typingInterval) {
            clearTimeout(typingInterval);
        }
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }

    createCanvas() {
        const container = utils.getElement('#particles');
        if (!container) return null;

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);
        
        return canvas;
    }

    init() {
        if (!this.canvas) return;

        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        window.addEventListener('resize', utils.debounce(() => this.resize(), 250));
        
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < CONFIG.particles.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.particles.speed,
                vy: (Math.random() - 0.5) * CONFIG.particles.speed,
                size: utils.random(CONFIG.particles.size.min, CONFIG.particles.size.max),
                opacity: utils.random(CONFIG.particles.opacity.min, CONFIG.particles.opacity.max),
                baseOpacity: utils.random(CONFIG.particles.opacity.min, CONFIG.particles.opacity.max)
            });
        }
    }

    animate() {
        if (!this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.opacity = particle.baseOpacity * (1 + (100 - distance) / 100);
            } else {
                particle.opacity = particle.baseOpacity;
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(135, 206, 235, ${particle.opacity})`;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(135, 206, 235, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });

        particlesAnimation = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (particlesAnimation) {
            cancelAnimationFrame(particlesAnimation);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

// Stats Counter Animation
class StatsCounter {
    constructor() {
        this.counters = utils.getElements('[data-count]');
        this.animated = new Set();
        this.init();
    }

    init() {
        this.createObserver();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, CONFIG.animations.observerOptions);

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = CONFIG.animations.countUpDuration;
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out cubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * easedProgress);
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = utils.getElements('[data-animate]');
        this.skillBars = utils.getElements('.skill-progress');
        this.animated = new Set();
        this.init();
    }

    init() {
        this.createObserver();
        this.animateSkillBars();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, CONFIG.animations.observerOptions);

        // Observe all sections and cards
        const observeElements = utils.getElements('.timeline-card, .project-card, .skill-category, .certificate-card, .stat-card');
        observeElements.forEach(el => observer.observe(el));
    }

    animateSkillBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 200);
                    this.animated.add(entry.target);
                }
            });
        }, CONFIG.animations.observerOptions);

        this.skillBars.forEach(bar => observer.observe(bar));
    }
}

// Project Filter
class ProjectFilter {
    constructor() {
        this.filterButtons = utils.getElements('.filter-btn');
        this.projectCards = utils.getElements('.project-card');
        this.activeFilter = 'all';
        
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.setActiveFilter(filter);
                this.filterProjects(filter);
            });
        });
        
        // Make project cards clickable (whole card links to GitHub)
        this.projectCards.forEach(card => {
            const githubLink = card.querySelector('.project-link[href*="github"]');
            if (githubLink) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    // Don't trigger if clicking on an actual link or button
                    if (e.target.closest('a') || e.target.closest('button')) {
                        return;
                    }
                    window.open(githubLink.href, '_blank');
                });
            }
        });
    }

    setActiveFilter(filter) {
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });
        this.activeFilter = filter;
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const cardCategories = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || cardCategories.includes(filter);
            
            if (shouldShow) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = 'block';
                }, 10);
            } else {
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = utils.getElement('#contactForm');
        this.submitButton = utils.getElement('.form-submit');
        this.statusElement = utils.getElement('#form-status');
        
        this.init();
    }

    init() {
        if (!this.form) return;
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    async handleSubmit() {	
        if (!this.validateForm()) return;

        this.setLoading(true);
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateSubmission();
            this.showStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
            this.form.reset();
        } catch (error) {
            this.showStatus('error', 'Failed to send message. Please try again or contact me directly.');
        } finally {
            this.setLoading(false);
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearError(field);

        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        } else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        } else if (fieldName === 'name' && value && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters';
            isValid = false;
        } else if (fieldName === 'message' && value && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters';
            isValid = false;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.querySelector(`#${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.classList.add('error');
    }

    clearError(field) {
        const errorElement = document.querySelector(`#${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('error');
    }

    setLoading(loading) {
        if (this.submitButton) {
            this.submitButton.classList.toggle('loading', loading);
            this.submitButton.disabled = loading;
        }
    }

    showStatus(type, message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `form-status ${type}`;
            
            setTimeout(() => {
                this.statusElement.className = 'form-status';
            }, 5000);
        }
    }

    async simulateSubmission() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = utils.getElement('#backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;
        
        this.bindEvents();
        this.updateVisibility();
    }

    bindEvents() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', utils.throttle(() => {
            this.updateVisibility();
        }, 100));
    }

    updateVisibility() {
        const shouldShow = window.pageYOffset > 300;
        this.button.classList.toggle('visible', shouldShow);
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );
        
        this.init();
    }

    init() {
        // Observe elements for animation
        const animateElements = utils.getElements(`
            .hero-content,
            .about-text,
            .timeline-item,
            .project-card,
            .skill-category,
            .education-item,
            .certificate-card,
            .contact-info,
            .contact-form
        `);

        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Keyboard Navigation
class KeyboardNavigation {
    constructor() {
        this.currentFocusIndex = 0;
        this.focusableElements = [];
        this.init();
    }

    init() {
        this.updateFocusableElements();
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // Update focusable elements when DOM changes
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    updateFocusableElements() {
        const selector = `
            a[href],
            button:not([disabled]),
            input:not([disabled]),
            select:not([disabled]),
            textarea:not([disabled]),
            [tabindex]:not([tabindex="-1"])
        `;
        
        this.focusableElements = Array.from(document.querySelectorAll(selector))
            .filter(el => {
                return el.offsetParent !== null && 
                       !el.hasAttribute('hidden') && 
                       el.getAttribute('tabindex') !== '-1';
            });
    }

    handleKeydown(e) {
        switch (e.key) {
            case 'Tab':
                // Let browser handle tab navigation
                break;
            case 'Escape':
                this.handleEscape();
                break;
            case 'Enter':
                if (e.target.classList.contains('nav-link')) {
                    e.preventDefault();
                    e.target.click();
                }
                break;
        }
    }

    handleEscape() {
        // Close mobile menu if open
        const navMenu = utils.getElement('#nav-menu');
        const hamburger = utils.getElement('#hamburger');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        if ('performance' in window) {
            this.measureLoadTime();
            this.monitorFPS();
        }
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            
            console.log('Performance Metrics:', this.metrics);
        });
    }

    monitorFPS() {
        let frames = 0;
        let startTime = performance.now();
        
        const countFrames = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= startTime + 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - startTime));
                frames = 0;
                startTime = currentTime;
                
                // Log FPS if it's too low
                if (this.metrics.fps < 30) {
                    console.warn('Low FPS detected:', this.metrics.fps);
                }
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }
}

// Main Application Class
class PortfolioApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            // Initialize core components first
            this.components.navigation = new Navigation();
            this.components.progressBar = new ProgressBar();
            this.components.customCursor = new CustomCursor();
            this.components.loadingScreen = new LoadingScreen();
            
            // Initialize other components after loading
            setTimeout(() => {
                this.components.projectFilter = new ProjectFilter();
                this.components.contactForm = new ContactForm();
                this.components.backToTop = new BackToTop();
                this.components.animationObserver = new AnimationObserver();
                this.components.keyboardNavigation = new KeyboardNavigation();
                
                // Initialize performance monitoring in development
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    this.components.performanceMonitor = new PerformanceMonitor();
                }
            }, 100);

            // Initialize theme
            this.components.navigation.initTheme();
            
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio app:', error);
        }
    }

    // Cleanup method for SPA navigation
    destroy() {
        Object.values(this.components).forEach(component => {
            if (component.destroy && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
    }
}

// Error Handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// Initialize the application
const app = new PortfolioApp();

// Expose app globally for debugging
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.portfolioApp = app;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, utils };
}
