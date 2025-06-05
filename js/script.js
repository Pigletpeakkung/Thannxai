/* ===== THANNXAI MAIN JAVASCRIPT ===== */
/* Advanced Animations, Interactions & Consciousness Effects */

// ===== CORE INITIALIZATION =====
class ThannxAI {
    constructor() {
        this.isLoaded = false;
        this.scrollY = 0;
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.isMobile = window.innerWidth <= 768;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.startAnimations();
        this.setupIntersectionObserver();
        this.initializeParticles();
        this.setupSmoothScrolling();
        this.initializeTypingAnimation();
        this.setupConsciousnessEffects();
        
        // Mark as loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.isLoaded = true;
            this.hideLoader();
        });
    }

    setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Resize events
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Mouse events for consciousness effects
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Touch events for mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    // Utility functions
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
        }
    }

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
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    map(value, start1, stop1, start2, stop2) {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
}

// ===== NAVIGATION SYSTEM =====
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        this.lastScrollY = 0;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupActiveLinks();
    }

    setupNavigation() {
        // Smooth scroll for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                    this.closeMenu();
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Animate menu items
        if (this.isMenuOpen) {
            this.animateMenuItems();
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    animateMenuItems() {
        gsap.fromTo('.nav-link', 
            { 
                opacity: 0, 
                y: 20 
            },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.3, 
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            this.lastScrollY = currentScrollY;
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }
            });
        });
    }

    smoothScrollTo(element) {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: element,
                offsetY: 80
            },
            ease: "power2.inOut"
        });
    }
}

// ===== TYPING ANIMATION SYSTEM =====
class TypingAnimation {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            delayBetweenWords: 2000,
            loop: true,
            cursor: true,
            ...options
        };
        
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;
        
        this.init();
    }

    init() {
        if (this.options.cursor) {
            this.element.style.borderRight = '2px solid';
            this.element.style.animation = 'blink 1s infinite';
        }
        
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isWaiting) {
            setTimeout(() => {
                this.isWaiting = false;
                this.isDeleting = true;
                this.type();
            }, this.options.delayBetweenWords);
            return;
        }
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            }
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentWord.length) {
                this.isWaiting = true;
            }
        }
        
        const speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        setTimeout(() => this.type(), speed);
    }
}

// ===== CONSCIOUSNESS PARTICLES SYSTEM =====
class ConsciousnessParticles {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.setupMouseTracking();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        const particleCount = Math.min(100, Math.floor(this.canvas.width * this.canvas.height / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 200, // Blue to purple range
                connections: []
            });
        }
    }

    setupMouseTracking() {
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update particles
        this.particles.forEach(particle => {
            // Mouse attraction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${0.1 * (1 - distance / 80)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupGSAPScrollTrigger();
        this.setupRevealAnimations();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupMorphingAnimations();
    }

    setupGSAPScrollTrigger() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Refresh ScrollTrigger on resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });
    }

    setupRevealAnimations() {
        // Fade in from bottom
        gsap.utils.toArray('.fade-in-up').forEach(element => {
            gsap.fromTo(element, 
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Slide in from left
        gsap.utils.toArray('.slide-in-left').forEach(element => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    x: -100
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Slide in from right
        gsap.utils.toArray('.slide-in-right').forEach(element => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    x: 100
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Scale in
        gsap.utils.toArray('.scale-in').forEach(element => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Stagger animations
        gsap.utils.toArray('.stagger-children').forEach(container => {
            const children = container.children;
            gsap.fromTo(children,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    setupParallaxEffects() {
        // Background parallax
        gsap.utils.toArray('.parallax-bg').forEach(element => {
            gsap.to(element, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Element parallax
        gsap.utils.toArray('.parallax-element').forEach(element => {
            const speed = element.dataset.speed || 0.5;
            gsap.to(element, {
                y: () => -window.innerHeight * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Rotation parallax
        gsap.utils.toArray('.parallax-rotate').forEach(element => {
            gsap.to(element, {
                rotation: 360,
                ease: "none",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    setupCounterAnimations() {
        gsap.utils.toArray('.counter').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = parseFloat(counter.dataset.duration) || 2;
            
            gsap.fromTo(counter,
                { textContent: 0 },
                {
                    textContent: target,
                    duration: duration,
                    ease: "power2.out",
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    onUpdate: function() {
                        counter.textContent = Math.ceil(this.targets()[0].textContent);
                    }
                }
            );
        });
    }

    setupMorphingAnimations() {
        // Morphing shapes
        gsap.utils.toArray('.morph-shape').forEach(element => {
            gsap.to(element, {
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                duration: 4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        });

        // Floating animations
        gsap.utils.toArray('.float').forEach(element => {
            gsap.to(element, {
                y: -20,
                duration: 2,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        });

        // Pulse animations
        gsap.utils.toArray('.pulse').forEach(element => {
            gsap.to(element, {
                scale: 1.05,
                duration: 1.5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        });
    }
}

// ===== INTERACTIVE ELEMENTS =====
class InteractiveElements {
    constructor() {
        this.init();
    }

    init() {
        this.setupMagneticButtons();
        this.setupTiltEffects();
        this.setupHoverAnimations();
        this.setupRippleEffects();
        this.setupGlitchEffects();
    }

    setupMagneticButtons() {
        gsap.utils.toArray('.btn-magnetic').forEach(button => {
            const magnetic = button;
            const magneticText = magnetic.querySelector('span') || magnetic;
            
            magnetic.addEventListener('mousemove', (e) => {
                const rect = magnetic.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(magnetic, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(magneticText, {
                    x: x * 0.1,
                    y: y * 0.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            magnetic.addEventListener('mouseleave', () => {
                gsap.to(magnetic, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
                
                gsap.to(magneticText, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    setupTiltEffects() {
        gsap.utils.toArray('.tilt-effect').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                gsap.to(element, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }

    setupHoverAnimations() {
        // Gallery items
        gsap.utils.toArray('.gallery-item').forEach(item => {
            const image = item.querySelector('.gallery-image');
            const overlay = item.querySelector('.gallery-overlay');
            const actions = item.querySelectorAll('.gallery-action');
            
            item.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.fromTo(actions, 
                    { y: 20, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.3, 
                        stagger: 0.1,
                        delay: 0.1,
                        ease: "power2.out"
                    }
                );
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    setupRippleEffects() {
        gsap.utils.toArray('.ripple').forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.pointerEvents = 'none';
                
                element.appendChild(ripple);
                
                gsap.to(ripple, {
                    scale: 4,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: () => {
                        ripple.remove();
                    }
                });
            });
        });
    }

    setupGlitchEffects() {
        gsap.utils.toArray('.glitch').forEach(element => {
            element.addEventListener('mouseenter', () => {
                const tl = gsap.timeline();
                
                tl.to(element, {
                    skewX: 2,
                    duration: 0.1,
                    ease: "power2.inOut"
                })
                .to(element, {
                    skewX: -2,
                    duration: 0.1,
                    ease: "power2.inOut"
                })
                .to(element, {
                    skewX: 0,
                    duration: 0.1,
                    ease: "power2.inOut"
                });
            });
        });
    }
}

// ===== CONSCIOUSNESS EFFECTS =====
class ConsciousnessEffects {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupMouseTracking();
        this.setupConsciousnessOrbs();
        this.setupNeuralConnections();
        this.setupQuantumEffects();
        this.setupMindWaves();
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            this.updateConsciousnessField();
        });
    }

    updateConsciousnessField() {
        const orbs = document.querySelectorAll('.consciousness-orb');
        
        orbs.forEach((orb, index) => {
            const rect = orb.getBoundingClientRect();
            const orbX = rect.left + rect.width / 2;
            const orbY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.mouse.x - orbX, 2) + 
                Math.pow(this.mouse.y - orbY, 2)
            );
            
            const maxDistance = 200;
            const influence = Math.max(0, 1 - distance / maxDistance);
            
            gsap.to(orb, {
                scale: 1 + influence * 0.5,
                rotation: influence * 180,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    setupConsciousnessOrbs() {
        const orbContainer = document.querySelector('.consciousness-orbs');
        if (!orbContainer) return;
        
        for (let i = 0; i < 5; i++) {
            const orb = document.createElement('div');
            orb.className = 'consciousness-orb';
            orb.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
                pointer-events: none;
                z-index: 1;
            `;
            
            orbContainer.appendChild(orb);
            
            // Random positioning and animation
            gsap.set(orb, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            });
            
            gsap.to(orb, {
                x: `+=${Math.random() * 200 - 100}`,
                y: `+=${Math.random() * 200 - 100}`,
                duration: Math.random() * 10 + 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }

    setupNeuralConnections() {
        const canvas = document.createElement('canvas');
        canvas.id = 'neural-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const nodes = [];
        
        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create nodes
        for (let i = 0; i < 50; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1
            });
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw nodes
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                
                // Boundary check
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                
                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
                ctx.fill();
                
                // Draw connections
                nodes.forEach(otherNode => {
                    const distance = Math.sqrt(
                        Math.pow(node.x - otherNode.x, 2) + 
                        Math.pow(node.y - otherNode.y, 2)
                    );
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    setupQuantumEffects() {
        // Quantum field fluctuations
        const quantumElements = document.querySelectorAll('.quantum-effect');
        
        quantumElements.forEach(element => {
            const fluctuate = () => {
                gsap.to(element, {
                    opacity: Math.random() * 0.5 + 0.5,
                    scale: Math.random() * 0.2 + 0.9,
                    rotation: Math.random() * 10 - 5,
                    duration: Math.random() * 2 + 1,
                    ease: "sine.inOut",
                    onComplete: fluctuate
                });
            };
            
            fluctuate();
        });
    }

    setupMindWaves() {
        // Create mind wave visualization
        const waveContainer = document.querySelector('.mind-waves');
        if (!waveContainer) return;
        
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'mind-wave';
            wave.style.cssText = `
                position: absolute;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
                top: ${30 + i * 20}%;
                left: 0;
            `;
            
            waveContainer.appendChild(wave);
            
            gsap.fromTo(wave, 
                { x: '-100%' },
                { 
                    x: '100%',
                    duration: 3 + i,
                    repeat: -1,
                    ease: "sine.inOut"
                }
            );
        }
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        this.init();
    }

    init() {
        this.monitor();
        this.setupLazyLoading();
        this.optimizeAnimations();
    }

    monitor() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Adjust quality based on performance
            if (this.fps < 30) {
                this.reduceQuality();
            } else if (this.fps > 50) {
                this.increaseQuality();
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }

    reduceQuality() {
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.style.display = 'none';
            }
        });
        
        // Disable some animations
        document.body.classList.add('reduced-motion');
    }

    increaseQuality() {
        // Restore particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.display = '';
        });
        
        // Enable animations
        document.body.classList.remove('reduced-motion');
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

    optimizeAnimations() {
        // Use will-change property for animated elements
        const animatedElements = document.querySelectorAll('.animate, .parallax, .float, .pulse');
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            
            // Remove will-change after animation
            element.addEventListener('animationend', () => {
                element.style.willChange = 'auto';
            });
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    const app = new ThannxAI();
    const navigation = new NavigationManager();
    const scrollAnimations = new ScrollAnimations();
    const interactiveElements = new InteractiveElements();
    const consciousnessEffects = new ConsciousnessEffects();
    const performanceMonitor = new PerformanceMonitor();
    
    // Initialize typing animation
    const typingElement = document.querySelector('.typing-animation');
    if (typingElement) {
        new TypingAnimation(typingElement, [
            'Consciousness Explorer',
            'AI Researcher',
            'Digital Philosopher',
            'Mind-Tech Pioneer',
            'Future Architect'
        ]);
    }
    
    // Initialize particles
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ConsciousnessParticles(heroSection);
    }
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
    
    console.log('🧠 ThannxAI Website Initialized - Consciousness Activated! 🚀');
});

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Smooth scroll to element
    scrollTo: (element, offset = 0) => {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    },
    
    // Generate random number between min and max
    random: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    
    // Clamp value between min and max
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },
    
    // Linear interpolation
    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },
    
    // Map value from one range to another
    map: (value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
};

// Export for use in other files
window.ThannxAI = {
    utils,
    TypingAnimation,
    ConsciousnessParticles,
    ScrollAnimations,
    InteractiveElements,
    ConsciousnessEffects
};
