/**
 * CFSJ TECH - Main Application Script
 * Architecture: Modular Subsystems with Hardware Acceleration & Memory Safety.
 * Focus: GPU Batching, Kinematic Smoothing, Failsafes, DOM Layout Thrashing Prevention.
 * @author Assistente de Engenharia (IA)
 * @version 2026.1.0
 */

(function () {
    'use strict';

    // --- 1. SYSTEM CONFIGURATION & UTILITIES ---

    const CONFIG = Object.freeze({
        selectors: {
            canvas: 'background-canvas',
            mobileBtn: 'mobile-menu-button',
            mobileMenu: 'mobile-menu',
            navLinks: '.nav-link',
            scrollElements: '.animate-on-scroll',
            tiltCards: '.card-3d-hover'
        },
        three: {
            particleCount: 5000,
            particleSize: 0.015,
            color: 0x00ffff,
            cameraZ: 5,
            rotationSpeed: 0.05,
            lerpFactor: 0.05 // Fator de amortecimento cinemático
        },
        tilt: {
            maxRotation: 10, // Graus máximos de rotação (derivado de 0.5 * 20)
            perspective: 1000,
            scale: 1.05
        }
    });

    /**
     * Limita a taxa de disparos de uma função (Hardware Event Throttling)
     */
    const throttle = (func, limit) => {
        let lastRan;
        let lastFunc;
        return function (...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // --- 2. SUBSYSTEM: WEBGL RENDERER (Three.js) ---

    const BackgroundFX = (() => {
        let scene, camera, renderer, particleMesh;
        let clock;
        let mouse = { x: 0, y: 0 };
        let animationId;

        const init = () => {
            const canvas = document.getElementById(CONFIG.selectors.canvas);
            if (!canvas || typeof THREE === 'undefined') {
                console.warn("[System] Motor Three.js ou Canvas não detectados. Subsistema 3D abortado.");
                return;
            }

            // Setup de Cena e Câmera
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = CONFIG.three.cameraZ;

            // Setup de Renderizador (Otimizado para Performance)
            renderer = new THREE.WebGLRenderer({ 
                canvas, 
                alpha: true,
                antialias: false, 
                powerPreference: 'high-performance'
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            buildParticles();

            clock = new THREE.Clock();

            // Event Binding
            window.addEventListener('resize', throttle(onResize, 200), { passive: true });
            document.addEventListener('mousemove', onMouseMove, { passive: true });

            animate();
        };

        const buildParticles = () => {
            const geometry = new THREE.BufferGeometry();
            const count = CONFIG.three.particleCount;
            const posArray = new Float32Array(count * 3);

            for (let i = 0; i < count * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 10;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const material = new THREE.PointsMaterial({
                size: CONFIG.three.particleSize,
                color: CONFIG.three.color,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.8
            });

            particleMesh = new THREE.Points(geometry, material);
            scene.add(particleMesh);
        };

        const onResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotação autônoma do enxame de partículas
            particleMesh.rotation.y = elapsedTime * CONFIG.three.rotationSpeed;
            particleMesh.rotation.x = elapsedTime * CONFIG.three.rotationSpeed;

            // Cinemática da câmera (Interpolação Linear / Lerp)
            camera.position.x += (mouse.x * 0.5 - camera.position.x) * CONFIG.three.lerpFactor;
            camera.position.y += (mouse.y * 0.5 - camera.position.y) * CONFIG.three.lerpFactor;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        return { init };
    })();

    // --- 3. SUBSYSTEM: DOM & UI CONTROLLER ---

    const UIController = (() => {
        const init = () => {
            setupMobileMenu();
            setupActiveLinks();
            setupCardTiltFX();
        };

        const setupMobileMenu = () => {
            const btn = document.getElementById(CONFIG.selectors.mobileBtn);
            const menu = document.getElementById(CONFIG.selectors.mobileMenu);
            
            if (!btn || !menu) return;

            btn.addEventListener('click', () => {
                const isHidden = menu.classList.contains('hidden');
                menu.classList.toggle('hidden');
                btn.setAttribute('aria-expanded', !isHidden);
            });
        };

        const setupActiveLinks = () => {
            const links = document.querySelectorAll(CONFIG.selectors.navLinks);
            if (!links.length) return;

            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            
            links.forEach(link => {
                const linkPath = link.getAttribute('href').split('/').pop();
                if (linkPath === currentPath) {
                    link.classList.add('active-link');
                }
            });
        };

        /**
         * Efeito 3D Hover com sincronização de quadros (rAF) para evitar Layout Thrashing
         */
        const setupCardTiltFX = () => {
            const cards = document.querySelectorAll(CONFIG.selectors.tiltCards);
            
            cards.forEach(card => {
                let isTicking = false;

                card.addEventListener('mousemove', (e) => {
                    if (!isTicking) {
                        window.requestAnimationFrame(() => {
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            
                            // Cálculo vetorial de rotação
                            const rotateX = (y / rect.height - 0.5) * -(CONFIG.tilt.maxRotation * 2); 
                            const rotateY = (x / rect.width - 0.5) * (CONFIG.tilt.maxRotation * 2);
                            
                            card.style.transform = `perspective(${CONFIG.tilt.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${CONFIG.tilt.scale})`;
                            isTicking = false;
                        });
                        isTicking = true;
                    }
                }, { passive: true });
                
                card.addEventListener('mouseleave', () => {
                    // Reset do transform de forma limpa
                    window.requestAnimationFrame(() => {
                        card.style.transform = `perspective(${CONFIG.tilt.perspective}px) rotateX(0) rotateY(0) scale(1)`;
                    });
                }, { passive: true });
            });
        };

        return { init };
    })();

    // --- 4. SUBSYSTEM: INTERSECTION OBSERVER ---

    const ScrollObserver = (() => {
        const init = () => {
            if (!('IntersectionObserver' in window)) return;

            const elements = document.querySelectorAll(CONFIG.selectors.scrollElements);
            if (!elements.length) return;

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target); // Desacopla após a primeira ativação para poupar memória
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(el => observer.observe(el));
        };

        return { init };
    })();

    // --- 5. BOOTSTRAPPER ---

    const boot = () => {
        try {
            UIController.init();
            ScrollObserver.init();
            BackgroundFX.init();
            console.log("[System] CFSJ TECH Core JS Initialized Successfully.");
        } catch (error) {
            console.error("[System Error] Falha na inicialização do fluxo principal:", error);
        }
    };

    // Inicialização segura atrelada ao ciclo de vida do DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();