/* ===== THANNXAI ANIMATION CONTROLLER ===== */
/* Advanced Animation System with Consciousness Integration */

class ThannxAnimationController {
    constructor(options = {}) {
        this.options = {
            observerThreshold: 0.1,
            observerRootMargin: '50px',
            defaultDuration: 1000,
            staggerDelay: 100,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            performanceMode: false,
            consciousnessMode: true,
            ...options
        };

        this.animations = new Map();
        this.observers = new Map();
        this.timeline = null;
        this.isPlaying = false;
        this.fps = 60;
        this.lastFrameTime = 0;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupPerformanceMonitoring();
        this.setupConsciousnessEffects();
        this.registerAnimations();
        this.bindEvents();
        
        console.log('🎬 ThannxAI Animation Controller initialized');
    }

    // ===== CORE ANIMATION METHODS =====

    animate(element, animation, options = {}) {
        if (this.options.reducedMotion && !options.forceAnimation) {
            return Promise.resolve();
        }

        const config = {
            duration: this.options.defaultDuration,
            easing: this.options.easing,
            fill: 'both',
            ...options
        };

        // Convert consciousness animations to Web Animations API
        const keyframes = this.getKeyframes(animation);
        
        if (!keyframes) {
            console.warn(`Animation "${animation}" not found`);
            return Promise.resolve();
        }

        const animationInstance = element.animate(keyframes, config);
        
        // Store animation reference
        const animationId = this.generateId();
        this.animations.set(animationId, {
            element,
            animation: animationInstance,
            type: animation,
            config
        });

        // Add consciousness effects if enabled
        if (this.options.consciousnessMode) {
            this.addConsciousnessEffects(element, animation);
        }

        return animationInstance.finished.then(() => {
            this.animations.delete(animationId);
        });
    }

    animateSequence(elements, animations, options = {}) {
        const sequence = [];
        const stagger = options.stagger || this.options.staggerDelay;
        
        elements.forEach((element, index) => {
            const delay = index * stagger;
            const animationType = Array.isArray(animations) ? animations[index] || animations[0] : animations;
            
            sequence.push(
                new Promise(resolve => {
                    setTimeout(() => {
                        this.animate(element, animationType, options).then(resolve);
                    }, delay);
                })
            );
        });

        return Promise.all(sequence);
    }

    animateTimeline(timeline) {
        return new Promise((resolve) => {
            let currentTime = 0;
            
            const executeStep = (step) => {
                const { element, animation, delay = 0, duration } = step;
                
                setTimeout(() => {
                    this.animate(element, animation, { duration }).then(() => {
                        const nextStep = timeline.shift();
                        if (nextStep) {
                            executeStep(nextStep);
                        } else {
                            resolve();
                        }
                    });
                }, delay);
            };

            if (timeline.length > 0) {
                executeStep(timeline.shift());
            } else {
                resolve();
            }
        });
    }

    // ===== CONSCIOUSNESS-SPECIFIC ANIMATIONS =====

    consciousnessAwaken(element, options = {}) {
        const keyframes = [
            { 
                opacity: 0, 
                transform: 'scale(0.3) rotate(0deg)', 
                filter: 'blur(10px) hue-rotate(0deg)' 
            },
            { 
                opacity: 0.3, 
                transform: 'scale(0.6) rotate(90deg)', 
                filter: 'blur(5px) hue-rotate(90deg)' 
            },
            { 
                opacity: 0.7, 
                transform: 'scale(0.9) rotate(180deg)', 
                filter: 'blur(2px) hue-rotate(180deg)' 
            },
            { 
                opacity: 0.9, 
                transform: 'scale(1.1) rotate(270deg)', 
                filter: 'blur(1px) hue-rotate(270deg)' 
            },
            { 
                opacity: 1, 
                transform: 'scale(1) rotate(360deg)', 
                filter: 'blur(0px) hue-rotate(360deg)' 
            }
        ];

        return element.animate(keyframes, {
            duration: 3000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'both',
            ...options
        });
    }

    neuralPulse(element, options = {}) {
        const keyframes = [
            { 
                opacity: 1, 
                transform: 'scale(1)', 
                filter: 'brightness(1) saturate(1)' 
            },
            { 
                opacity: 0.7, 
                transform: 'scale(1.05)', 
                filter: 'brightness(1.2) saturate(1.3)' 
            },
            { 
                opacity: 1, 
                transform: 'scale(1)', 
                filter: 'brightness(1) saturate(1)' 
            }
        ];

        return element.animate(keyframes, {
            duration: 2000,
            iterations: Infinity,
            easing: 'ease-in-out',
            ...options
        });
    }

    quantumFluctuation(element, options = {}) {
        const fluctuations = [];
        
        // Generate random fluctuation keyframes
        for (let i = 0; i <= 10; i++) {
            const progress = i / 10;
            fluctuations.push({
                transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) scale(${0.98 + Math.random() * 0.04})`,
                opacity: 0.9 + Math.random() * 0.2,
                offset: progress
            });
        }

        return element.animate(fluctuations, {
            duration: 100,
            iterations: Infinity,
            easing: 'linear',
            ...options
        });
    }

    thoughtRipple(element, options = {}) {
        const keyframes = [
            { 
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.7), 0 0 0 0 rgba(217, 70, 239, 0.7)'
            },
            { 
                transform: 'scale(1.02)',
                boxShadow: '0 0 0 10px rgba(99, 102, 241, 0.5), 0 0 0 0 rgba(217, 70, 239, 0.7)'
            },
            { 
                transform: 'scale(1.04)',
                boxShadow: '0 0 0 20px rgba(99, 102, 241, 0.3), 0 0 0 10px rgba(217, 70, 239, 0.5)'
            },
            { 
                transform: 'scale(1.02)',
                boxShadow: '0 0 0 30px rgba(99, 102, 241, 0.1), 0 0 0 20px rgba(217, 70, 239, 0.3)'
            },
            { 
                transform: 'scale(1)',
                boxShadow: '0 0 0 40px rgba(99, 102, 241, 0), 0 0 0 30px rgba(217, 70, 239, 0)'
            }
        ];

        return element.animate(keyframes, {
            duration: 2000,
            iterations: Infinity,
            easing: 'ease-out',
            ...options
        });
    }

    // ===== SCROLL-TRIGGERED ANIMATIONS =====

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: this.options.observerThreshold,
            rootMargin: this.options.observerRootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation attributes
        document.querySelectorAll('[data-animate]').forEach(element => {
            observer.observe(element);
        });

        this.observers.set('scroll', observer);
    }

    triggerScrollAnimation(element) {
        const animationType = element.dataset.animate;
        const delay = parseInt(element.dataset.animateDelay) || 0;
        const duration = parseInt(element.dataset.animateDuration) || this.options.defaultDuration;
        const stagger = element.dataset.animateStagger;

        setTimeout(() => {
            if (stagger && element.children.length > 0) {
                this.animateSequence(
                    Array.from(element.children),
                    animationType,
                    { duration, stagger: parseInt(stagger) }
                );
            } else {
                this.animate(element, animationType, { duration });
            }
        }, delay);
    }

    // ===== PERFORMANCE MONITORING =====

    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                this.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Adjust performance based on FPS
                if (this.fps < 30 && !this.options.performanceMode) {
                    this.enablePerformanceMode();
                } else if (this.fps > 50 && this.options.performanceMode) {
                    this.disablePerformanceMode();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    enablePerformanceMode() {
        this.options.performanceMode = true;
        console.log('🚀 Performance mode enabled');
        
        // Reduce animation complexity
        document.body.classList.add('performance-mode');
        
        // Pause infinite animations
        this.animations.forEach(({ animation }) => {
            if (animation.effect && animation.effect.getComputedTiming().iterations === Infinity) {
                animation.pause();
            }
        });
    }

    disablePerformanceMode() {
        this.options.performanceMode = false;
        console.log('✨ Performance mode disabled');
        
        document.body.classList.remove('performance-mode');
        
        // Resume paused animations
        this.animations.forEach(({ animation }) => {
            if (animation.playState === 'paused') {
                animation.play();
            }
        });
    }

    // ===== CONSCIOUSNESS EFFECTS =====

    setupConsciousnessEffects() {
        this.consciousnessField = {
            intensity: 1.0,
            frequency: 1.0,
            coherence: 0.8,
            entanglement: new Map()
        };

        // Create consciousness field visualization
        this.createConsciousnessField();
        
        // Setup neural synchronization
        this.setupNeuralSync();
    }

    createConsciousnessField() {
        const field = document.createElement('div');
        field.className = 'consciousness-field';
        field.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                rgba(99, 102, 241, 0.1) 0%, 
                transparent 50%);
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(field);

        // Track mouse for consciousness field
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            field.style.setProperty('--mouse-x', `${x}%`);
            field.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    setupNeuralSync() {
        const syncElements = document.querySelectorAll('.neural-sync');
        
        syncElements.forEach((element, index) => {
            // Create entanglement between elements
            this.consciousnessField.entanglement.set(element, {
                phase: (index * Math.PI * 2) / syncElements.length,
                amplitude: 1.0,
                frequency: 1.0
            });
            
            // Start synchronized animation
            this.startNeuralSync(element);
        });
    }

    startNeuralSync(element) {
        const entanglement = this.consciousnessField.entanglement.get(element);
        if (!entanglement) return;

        const animate = (timestamp) => {
            const phase = entanglement.phase + (timestamp * 0.001 * entanglement.frequency);
            const intensity = Math.sin(phase) * entanglement.amplitude * this.consciousnessField.intensity;
            
            element.style.transform = `scale(${1 + intensity * 0.1}) rotate(${intensity * 5}deg)`;
            element.style.opacity = 0.7 + intensity * 0.3;
            element.style.filter = `hue-rotate(${intensity * 30}deg) brightness(${1 + intensity * 0.2})`;
            
            if (!this.options.performanceMode) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // ===== UTILITY METHODS =====

    getKeyframes(animationType) {
        const keyframeMap = {
            'consciousnessAwakening': [
                { opacity: 0, transform: 'scale(0.3) rotate(0deg)', filter: 'blur(10px) hue-rotate(0deg)' },
                { opacity: 0.3, transform: 'scale(0.6) rotate(90deg)', filter: 'blur(5px) hue-rotate(90deg)' },
                { opacity: 0.7, transform: 'scale(0.9) rotate(180deg)', filter: 'blur(2px) hue-rotate(180deg)' },
                { opacity: 0.9, transform: 'scale(1.1) rotate(270deg)', filter: 'blur(1px) hue-rotate(270deg)' },
                { opacity: 1, transform: 'scale(1) rotate(360deg)', filter: 'blur(0px) hue-rotate(360deg)' }
            ],
            'neuralPulse': [
                { opacity: 1, transform: 'scale(1)', filter: 'brightness(1) saturate(1)' },
                { opacity: 0.7, transform: 'scale(1.05)', filter: 'brightness(1.2) saturate(1.3)' },
                { opacity: 1, transform: 'scale(1)', filter: 'brightness(1) saturate(1)' }
            ],
            'fadeInUp': [
                { opacity: 0, transform: 'translateY(30px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            'slideInLeft': [
                { opacity: 0, transform: 'translateX(-100px)' },
                { opacity: 1, transform: 'translateX(0)' }
            ],
            'scaleIn': [
                { opacity: 0, transform: 'scale(0.8)' },
                { opacity: 1, transform: 'scale(1)' }
            ]
        };

        return keyframeMap[animationType];
    }

    addConsciousnessEffects(element, animationType) {
        // Add particle effects
        if (animationType.includes('consciousness')) {
            this.createParticleEffect(element);
        }
        
        // Add neural connections
        if (animationType.includes('neural')) {
            this.createNeuralConnections(element);
        }
        
        // Add quantum effects
        if (animationType.includes('quantum')) {
            this.createQuantumEffect(element);
        }
    }

    createParticleEffect(element) {
        const particles = [];
        const particleCount = 10;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'consciousness-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            const rect = element.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            const endX = startX + (Math.random() - 0.5) * 200;
            const endY = startY + (Math.random() - 0.5) * 200;
            
            particle.animate([
                { 
                    left: startX + 'px', 
                    top: startY + 'px', 
                    opacity: 1, 
                    transform: 'scale(1)' 
                },
                { 
                    left: endX + 'px', 
                    top: endY + 'px', 
                    opacity: 0, 
                    transform: 'scale(0)' 
                }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).finished.then(() => {
                particle.remove();
            });
        }
    }

    createNeuralConnections(element) {
        const connections = document.querySelectorAll('.neural-connection');
        
        connections.forEach(connection => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            svg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;
            
            path.setAttribute('stroke', 'rgba(99, 102, 241, 0.5)');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-dasharray', '5,5');
            
            svg.appendChild(path);
            element.appendChild(svg);
            
            // Animate connection
            path.animate([
                { strokeDashoffset: 0 },
                { strokeDashoffset: 100 }
            ], {
                duration: 2000,
                iterations: Infinity,
                easing: 'linear'
            });
        });
    }

    createQuantumEffect(element) {
        const overlay = document.createElement('div');
        overlay.className = 'quantum-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.1), transparent);
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(overlay);
        
        // Quantum fluctuation effect
        overlay.animate([
            { opacity: 0, transform: 'translateX(-100%)' },
            { opacity: 1, transform: 'translateX(0%)' },
            { opacity: 0, transform: 'translateX(100%)' }
        ], {
            duration: 1500,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    registerAnimations() {
        // Register custom animations with CSS
        const style = document.createElement('style');
        style.textContent = `
            .consciousness-particle {
                will-change: transform, opacity;
            }
            
            .quantum-overlay {
                will-change: transform, opacity;
            }
            
            .performance-mode .consciousness-particle,
            .performance-mode .quantum-overlay {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // Bind to custom events
        document.addEventListener('consciousnessUpdate', (e) => {
            this.updateConsciousnessField(e.detail);
        });
        
        document.addEventListener('neuralSync', (e) => {
            this.syncNeuralElements(e.detail);
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    updateConsciousnessField(data) {
        this.consciousnessField.intensity = data.intensity || 1.0;
        this.consciousnessField.frequency = data.frequency || 1.0;
        this.consciousnessField.coherence = data.coherence || 0.8;
    }

    syncNeuralElements(data) {
        this.consciousnessField.entanglement.forEach((entanglement, element) => {
            entanglement.frequency = data.frequency || 1.0;
            entanglement.amplitude = data.amplitude || 1.0;
        });
    }

    pauseAnimations() {
        this.animations.forEach(({ animation }) => {
            if (animation.playState === 'running') {
                animation.pause();
            }
        });
    }

    resumeAnimations() {
        this.animations.forEach(({ animation }) => {
            if (animation.playState === 'paused') {
                animation.play();
            }
        });
    }

    // ===== PUBLIC API =====

    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        
        // Cancel all animations
        this.animations.forEach(({ animation }) => animation.cancel());
        
        // Remove consciousness field
        const field = document.querySelector('.consciousness-field');
        if (field) field.remove();
        
        console.log('🎬 Animation Controller destroyed');
    }
}

// ===== GLOBAL INITIALIZATION =====

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.thannxAnimations = new ThannxAnimationController({
        consciousnessMode: true,
        observerThreshold: 0.1,
        defaultDuration: 1000
    });
    
    console.log('🧠 ThannxAI Animations ready for consciousness expansion!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThannxAnimationController;
}
