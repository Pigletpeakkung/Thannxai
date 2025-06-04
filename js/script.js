/* ===================================
   THANNXAI - DIGITAL DEPTH PSYCHOLOGY
   Complete JavaScript Functionality
   ================================== */

// ===================================
// GLOBAL VARIABLES & CONFIGURATION
// ===================================

const CONFIG = {
    animationDuration: 600,
    scrollOffset: 100,
    typingSpeed: 100,
    particleCount: 50,
    debounceDelay: 250
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

const utils = {
    // Debounce function for performance
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

    // Throttle function for scroll events
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

    // Check if element is in viewport
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Generate random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
};

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupSmoothScrolling();
    }

    setupScrollEffect() {
        const handleScroll = utils.throttle(() => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        const handleScroll = utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    utils.smoothScrollTo(targetElement, 80);
                    this.closeMobileMenu();
                }
            });
        });
    }
}

// ===================================
// HERO SECTION ANIMATIONS
// ===================================

class HeroAnimations {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.typingElement = document.querySelector('.typing-animation');
        this.particlesContainer = document.querySelector('.consciousness-particles');
        
        this.init();
    }

    init() {
        this.createParticles();
        this.startTypingAnimation();
        this.animateStats();
    }

    createParticles() {
        if (!this.particlesContainer) return;

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'consciousness-particle';
            
            const size = utils.random(2, 8);
            const x = utils.random(0, 100);
            const y = utils.random(0, 100);
            const duration = utils.random(4, 8);
            const delay = utils.random(0, 4);
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;
            
            this.particlesContainer.appendChild(particle);
        }
    }

    startTypingAnimation() {
        if (!this.typingElement) return;

        const text = this.typingElement.textContent;
        this.typingElement.textContent = '';
        this.typingElement.style.borderRight = '2px solid rgba(255,255,255,0.8)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                this.typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, CONFIG.typingSpeed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    this.typingElement.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateNumber = (element, target, duration = 2000) => {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const value = target.textContent;
                    
                    if (value.includes('+')) {
                        const num = parseInt(value.replace('+', ''));
                        animateNumber(target, num);
                        target.textContent = num + '+';
                    } else if (value.includes('%')) {
                        const num = parseInt(value.replace('%', ''));
                        animateNumber(target, num);
                        target.textContent = num + '%';
                    }
                    
                    observer.unobserve(target);
                }
            });
        });

        statNumbers.forEach(stat => observer.observe(stat));
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addScrollAnimationClasses();
    }

    addScrollAnimationClasses() {
        // Add animation classes to elements that should animate on scroll
        const elementsToAnimate = [
            '.section-header',
            '.about-content',
            '.research-area',
            '.project-card',
            '.service-card',
            '.blog-card',
            '.testimonial-card'
        ];

        elementsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add('animate-on-scroll');
                element.style.transitionDelay = `${index * 100}ms`;
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Also observe elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
}

// ===================================
// PROJECT FILTERING
// ===================================

class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        this.init();
    }

    init() {
        this.setupFilterButtons();
    }

    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const categories = card.getAttribute('data-categories');
            
            if (filter === 'all' || (categories && categories.includes(filter))) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ===================================
// FORM HANDLING
// ===================================

class FormHandler {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }

    setupFormValidation() {
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#e53e3e';
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e53e3e;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '#e2e8f0';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupFormSubmission() {
        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const inputs = this.contactForm.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                this.showFormMessage('Please correct the errors above', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.contactForm.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await this.submitForm();
                
                this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                this.contactForm.reset();
            } catch (error) {
                this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }

    async submitForm() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        
        // Replace with actual form submission:
        /*
        const formData = new FormData(this.contactForm);
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Form submission failed');
        }
        
        return response.json();
        */
    }

    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-weight: 500;
            ${type === 'success' 
                ? 'background: #c6f6d5; color: #22543d; border: 1px solid #9ae6b4;'
                : 'background: #fed7d7; color: #c53030; border: 1px solid #feb2b2;'
            }
        `;
        
        this.contactForm.insertBefore(messageElement, this.contactForm.firstChild);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
}

// ===================================
// GALLERY & MODAL FUNCTIONALITY
// ===================================

class GalleryModal {
    constructor() {
        this.galleryImages = document.querySelectorAll('.gallery-img, .project-img, .demo-img');
        this.init();
    }

    init() {
        this.createModal();
        this.setupGalleryClicks();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <img class="modal-image" src="" alt="">
                <div class="modal-caption"></div>
                <div class="modal-navigation">
                    <button class="modal-prev" aria-label="Previous image">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="modal-next" aria-label="Next image">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        this.setupModalEvents();
    }

    setupModalEvents() {
        const closeBtn = this.modal.querySelector('.modal-close');
        const backdrop = this.modal.querySelector('.modal-backdrop');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        backdrop.addEventListener('click', () => this.closeModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.closeModal();
            }
        });
    }

    setupGalleryClicks() {
        this.galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                this.openModal(img, index);
            });
            
            img.style.cursor = 'pointer';
        });
    }

    openModal(img, index) {
        const modalImg = this.modal.querySelector('.modal-image');
        const modalCaption = this.modal.querySelector('.modal-caption');
        
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalCaption.textContent = img.alt || 'Project Image';
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animate in
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
    }

    closeModal() {
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.preloadCriticalImages();
        this.optimizeAnimations();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalImages() {
        const criticalImages = [
            THANNX_IMAGES.hero.background,
            THANNX_IMAGES.profile.main
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            const animations = document.querySelectorAll('.consciousness-mandala, .consciousness-particle');
            animations.forEach(element => {
                if (document.hidden) {
                    element.style.animationPlayState = 'paused';
                } else {
                    element.style.animationPlayState = 'running';
                }
            });
        });
    }
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Add keyboard support for custom interactive elements
        const interactiveElements = document.querySelectorAll('[role="button"]:not(button)');
        
        interactiveElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupARIALabels() {
        // Add ARIA labels to elements that need them
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
            });
        }
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
    }
}

// ===================================
// MAIN INITIALIZATION
// ===================================

class ThannxAIWebsite {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.components.navigation = new NavigationManager();
            this.components.heroAnimations = new HeroAnimations();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.projectFilter = new ProjectFilter();
            this.components.formHandler = new FormHandler();
            this.components.galleryModal = new GalleryModal();
            this.components.performanceOptimizer = new PerformanceOptimizer();
            this.components.accessibilityEnhancer = new AccessibilityEnhancer();
            
            console.log('✅ ThannxAI website initialized successfully!');
            
            // Load images after components are initialized
            this.loadImages();
            
        } catch (error) {
            console.error('❌ Error initializing ThannxAI website:', error);
        }
    }

    loadImages() {
        // This function is called from the HTML script tag
        // Images are loaded via the THANNX_IMAGES configuration
        console.log('🖼️ Images loaded from free sources - no API keys needed!');
    }
}

// ===================================
// INITIALIZE WEBSITE
// ===================================

// Create global instance
window.thannxAI = new ThannxAIWebsite();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThannxAIWebsite;
}
