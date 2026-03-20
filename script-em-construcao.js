/**
 * CFSJ TECH - Script da Página Em Construção
 * Architecture: Modular Pattern (IIFE)
 * Focus: Performance (Render Batching), Separation of Concerns, Memory Management.
 */

(function() {
    'use strict';

    // =========================================================================
    // 1. MODULE: THREE.JS BACKGROUND FX
    // =========================================================================
    const Background3D = (() => {
        let scene, camera, renderer, particleMesh, clock;
        let target = { x: 0, y: 0 };
        let animationFrameId;

        const init = () => {
            const canvas = document.getElementById('background-canvas');
            
            // Validação rigorosa de dependências
            if (!canvas || typeof THREE === 'undefined') {
                console.warn('[CFSJ] Three.js não carregado ou canvas ausente.');
                return;
            }

            setupScene(canvas);
            createParticles();
            bindEvents();
            
            clock = new THREE.Clock();
            animate();
        };

        const setupScene = (canvas) => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ 
                canvas: canvas, 
                alpha: true,
                antialias: false // Prioriza performance em sistemas de partículas
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        const createParticles = () => {
            const particleCount = 5000;
            const posArray = new Float32Array(particleCount * 3);

            // Distribuição volumétrica em espaço 15x15x15
            for (let i = 0; i < particleCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 15;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.015,
                color: 0x06b6d4, // Tailwind cyan-500 hex
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.7,
                depthWrite: false
            });

            particleMesh = new THREE.Points(geometry, material);
            scene.add(particleMesh);
        };

        const bindEvents = () => {
            window.addEventListener('resize', handleResize, { passive: true });
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        const handleMouseMove = (event) => {
            // Normalização de coordenadas (-1 a +1) e cálculo do alvo parallax
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            target.x = mouseX * 0.5;
            target.y = mouseY * 0.5;
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotação autônoma base
            particleMesh.rotation.y = elapsedTime * 0.05;
            particleMesh.rotation.x = elapsedTime * 0.03;

            // Interpolação Linear (Lerp) para suavização do mouse
            camera.position.x += (target.x - camera.position.x) * 0.02;
            camera.position.y += (target.y - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        return { init };
    })();


    // =========================================================================
    // 2. MODULE: NAVIGATION & UI CONTROLS
    // =========================================================================
    const Navigation = (() => {
        const init = () => {
            setupMobileMenu();
            setActiveLink();
        };

        const setupMobileMenu = () => {
            const btn = document.getElementById('mobile-menu-button');
            const menu = document.getElementById('mobile-menu');
            
            if (!btn || !menu) return;

            btn.addEventListener('click', () => {
                const isHidden = menu.classList.contains('hidden');
                
                if (isHidden) {
                    menu.classList.remove('hidden');
                    btn.setAttribute('aria-expanded', 'true');
                } else {
                    menu.classList.add('hidden');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        };

        const setActiveLink = () => {
            const links = document.querySelectorAll('.nav-link');
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            
            links.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (!linkHref) return;

                const linkPath = linkHref.split('/').pop();
                
                // Validação estrita para roteamento base ou paths específicos
                if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
                    links.forEach(l => l.classList.remove('active-link'));
                    link.classList.add('active-link');
                }
            });
        };

        return { init };
    })();


    // =========================================================================
    // 3. MODULE: INTERACTION ANIMATIONS (SCROLL & HOVER)
    // =========================================================================
    const InteractionAnim = (() => {
        const init = () => {
            setupScrollObserver();
            setup3DHoverCards();
        };

        const setupScrollObserver = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            if (elements.length === 0) return;

            const options = { root: null, rootMargin: '0px', threshold: 0.15 };

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Otimização: para de observar após a primeira animação
                        obs.unobserve(entry.target); 
                    }
                });
            }, options);

            elements.forEach(el => observer.observe(el));
        };

        const setup3DHoverCards = () => {
            const cards = document.querySelectorAll('.card-3d-hover');
            if (cards.length === 0) return;

            cards.forEach(card => {
                let updateRequested = false;

                card.addEventListener('mousemove', (e) => {
                    // Throttling nativo com requestAnimationFrame para evitar Layout Thrashing
                    if (!updateRequested) {
                        updateRequested = true;
                        
                        requestAnimationFrame(() => {
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const { width, height } = rect;
                            
                            const rotateX = (y / height - 0.5) * -15; 
                            const rotateY = (x / width - 0.5) * 15;
                            
                            card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                            updateRequested = false;
                        });
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    requestAnimationFrame(() => {
                        card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale(1)';
                    });
                });
            });
        };

        return { init };
    })();


    // =========================================================================
    // 4. BOOTSTRAP
    // =========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        Background3D.init();
        Navigation.init();
        InteractionAnim.init();
    });

})();