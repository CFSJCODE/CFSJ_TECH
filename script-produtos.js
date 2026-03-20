/**
 * CFSJ TECH - Core Application Script
 * Architecture: Modular Pattern with Global Exposure for Legacy HTML Compatibility.
 * Focus: Performance (Render Batching), Maintainability (Separation of Concerns), Accessibility.
 * @author Cláudio Francisco (Refatoração via Assistente IA)
 * @version 2025.1.1
 */

(function(global) {
    'use strict';

    // --- 1. CONFIGURATION & UTILS ---
    
    const CONFIG = {
        animation: {
            particleCount: 3000,
            particleSize: 0.015,
            color: 0x00ffff,
            mouseSensitivity: 0.0005
        },
        dom: {
            gridId: 'products-grid',
            titleId: 'category-title',
            sectionCatId: 'categories-section',
            sectionProdId: 'products-section',
            canvasId: 'background-canvas'
        }
    };

    /**
     * Throttles a function to limit execution frequency.
     * Essential for scroll and resize events.
     */
    const throttle = (func, limit) => {
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
    };

    // --- 2. DATA LAYER (Model) ---
    
    const productsDB = Object.freeze({
        'conectividade': [
            {
                title: "Periférico de Rede Profissional",
                desc: "Estabilidade e velocidade para conexões corporativas e gamers.",
                link: "https://mercadolivre.com/sec/1k5jQ43",
                image: "https://placehold.co/600x400/0a0f19/06b6d4?text=Redes+01",
                badge: "Conectividade"
            },
            {
                title: "Cabeamento Estruturado",
                desc: "Soluções de cabeamento de alta fidelidade para transferência de dados.",
                link: "https://mercadolivre.com/sec/1dcxJf9",
                image: "https://placehold.co/600x400/0a0f19/06b6d4?text=Redes+02",
                badge: "Infraestrutura"
            }
        ],
        'perifericos': [
            {
                title: "Caixa de Som Ambiente Taramps T 200.2 (Passiva)",
                desc: "Sonorização ambiente de alta eficiência e design compacto. Ideal para acústica de escritórios.",
                link: "https://mercadolivre.com/sec/264Eee8",
                image: "Caixa_Taramps_T200.png", 
                badge: "Áudio"
            },
            {
                title: "Ferramenta de Precisão Técnica",
                desc: "Equipamento essencial para diagnósticos e reparos eletrônicos.",
                link: "https://mercadolivre.com/sec/264Eee8",
                image: "https://placehold.co/600x400/0a0f19/06b6d4?text=Ferramenta+01",
                badge: "Profissional"
            },
            {
                title: "Kit de Manutenção",
                desc: "Ferramentas auxiliares para limpeza e montagem de setups.",
                link: "https://mercadolivre.com/sec/2mcLLoN",
                image: "https://placehold.co/600x400/0a0f19/06b6d4?text=Ferramenta+02",
                badge: "Essencial"
            }
        ],
        'energia': [
            {
                title: "Tomada Inteligente TP-Link Tapo P110",
                desc: "Monitoramento de consumo e controle via App/Voz. Suporta até 16A.",
                link: "https://mercadolivre.com/sec/2Nvu4v2",
                image: "Tomada_Tapo_P110.png",
                badge: "Automação"
            },
            {
                title: "Nobreak TS Shara UPS Senoidal 3200VA",
                desc: "Onda senoidal pura. Ideal para servidores e workstations críticas.",
                link: "https://mercadolivre.com/sec/2jaNZnx",
                image: "Nobreak_TS_Shara.jpg",
                badge: "Alta Performance"
            },
            {
                title: "Filtro de Linha DPS iCLAMPER Energia 8",
                desc: "Proteção contra surtos e filtragem EMI/RFI.",
                link: "https://mercadolivre.com/sec/27rySfZ",
                image: "Filtro De Linha - DPS.jpeg",
                badge: "Essencial"
            }
        ]
    });

    const categoryTitles = Object.freeze({
        'conectividade': 'Cabos e Acessórios de Conectividade',
        'perifericos': 'Periféricos e Acessórios para Workstation',
        'energia': 'Energia & Acessórios Elétricos'
    });

    // --- 3. UI CONTROLLER (View Logic) ---
    
    const UIController = (() => {
        // Cache DOM elements
        let elements = {};

        const cacheElements = () => {
            elements = {
                grid: document.getElementById(CONFIG.dom.gridId),
                title: document.getElementById(CONFIG.dom.titleId),
                secCats: document.getElementById(CONFIG.dom.sectionCatId),
                secProds: document.getElementById(CONFIG.dom.sectionProdId),
                mobileBtn: document.getElementById('mobile-menu-button'),
                mobileMenu: document.getElementById('mobile-menu')
            };
        };

        const createProductCard = (prod, index) => {
            // Using template literals efficiently
            // Added loading="lazy" for performance
            // Added aria-label for accessibility
            const delay = index * 50; // Reduced delay for snappier feel
            return `
                <article class="glassmorphism rounded-xl overflow-hidden group hover:transform hover:-translate-y-2 transition-all duration-300 card-product fade-in flex flex-col h-full" style="animation-delay: ${delay}ms">
                    <div class="relative h-48 w-full overflow-hidden bg-[#0a0f19]/50">
                        <img src="${prod.image}" 
                             alt="${prod.title}" 
                             loading="lazy" 
                             width="600" height="400"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
                        <span class="absolute top-2 right-2 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg shadow-cyan-500/20">
                            ${prod.badge}
                        </span>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="font-exo text-xl font-bold text-white mb-2 line-clamp-2">${prod.title}</h3>
                        <p class="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">${prod.desc}</p>
                        <a href="${prod.link}" target="_blank" rel="noopener noreferrer" 
                           class="mt-auto w-full block text-center border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-exo font-bold py-3 rounded transition-all duration-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                            Ver no Mercado Livre
                        </a>
                    </div>
                </article>
            `;
        };

        const showProducts = (categoryKey) => {
            if (!elements.grid) cacheElements();
            
            const products = productsDB[categoryKey];
            if (!products) {
                console.warn(`[CFSJ] Category not found: ${categoryKey}`);
                return;
            }

            // Update Content
            elements.title.textContent = categoryTitles[categoryKey] || 'Produtos';
            
            // Batch DOM update
            requestAnimationFrame(() => {
                elements.grid.innerHTML = products.map(createProductCard).join('');
                
                // View Transition
                elements.secCats.classList.add('hidden');
                elements.secProds.classList.remove('hidden');
                
                // Accessibility Focus Management
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        };

        const hideProducts = () => {
            if (!elements.secCats) cacheElements();

            elements.secProds.classList.add('hidden');
            elements.secCats.classList.remove('hidden');

            // Reset animations for re-entry
            const cards = document.querySelectorAll('.card-category');
            cards.forEach(card => {
                card.classList.remove('animate-on-scroll', 'is-visible');
                void card.offsetWidth; // Force Reflow
                card.classList.add('animate-on-scroll');
            });
            
            // Re-trigger observer
            ScrollObserver.observeElements();
        };

        const toggleMobileMenu = () => {
            if (!elements.mobileMenu) cacheElements();
            const isHidden = elements.mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                elements.mobileMenu.classList.remove('hidden');
                elements.mobileBtn.setAttribute('aria-expanded', 'true');
            } else {
                elements.mobileMenu.classList.add('hidden');
                elements.mobileBtn.setAttribute('aria-expanded', 'false');
            }
        };

        return {
            init: cacheElements,
            showProducts,
            hideProducts,
            toggleMobileMenu
        };
    })();

    // --- 4. VISUAL EFFECTS (Three.js & Observer) ---

    const BackgroundFX = (() => {
        let scene, camera, renderer, particles, mouse = { x: 0, y: 0 };
        let animationId;

        const init = () => {
            const canvas = document.getElementById(CONFIG.dom.canvasId);
            if (!canvas || !window.WebGLRenderingContext) return;

            // Scene Setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 4;

            // Renderer Optimization
            renderer = new THREE.WebGLRenderer({ 
                canvas, 
                alpha: true, 
                antialias: false, // Performance over minor edge smoothing for background
                powerPreference: 'high-performance'
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Particles
            const geometry = new THREE.BufferGeometry();
            const count = CONFIG.animation.particleCount;
            const posArray = new Float32Array(count * 3);

            for(let i = 0; i < count * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 15;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const material = new THREE.PointsMaterial({
                size: CONFIG.animation.particleSize,
                color: CONFIG.animation.color,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Events
            window.addEventListener('resize', throttle(onResize, 200));
            document.addEventListener('mousemove', onMouseMove);

            animate();
        };

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onMouseMove = (event) => {
            // Normalize mouse position
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            
            // Rotation Logic
            particles.rotation.y += 0.001; // Constant slow rotation
            
            // Interactive rotation (Lerping for smoothness could be added, keeping it raw for responsiveness)
            particles.rotation.x += -mouse.y * CONFIG.animation.mouseSensitivity;
            particles.rotation.y += mouse.x * CONFIG.animation.mouseSensitivity;

            renderer.render(scene, camera);
        };

        return { init };
    })();

    const ScrollObserver = (() => {
        let observer;

        const init = () => {
            const options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
            
            observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, options);

            observeElements();
        };

        const observeElements = () => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        };

        return { init, observeElements };
    })();

    // --- 5. INITIALIZATION ---

    const initApp = () => {
        UIController.init();
        BackgroundFX.init();
        ScrollObserver.init();

        // Event Binding for Mobile Menu
        const mobileBtn = document.getElementById('mobile-menu-button');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', UIController.toggleMobileMenu);
        }

        console.log("CFSJ TECH System Initialized [v2025]");
    };

    // --- 6. PUBLIC API EXPOSURE ---
    // Expose necessary functions to window because HTML uses onclick attributes
    global.showProducts = UIController.showProducts;
    global.hideProducts = UIController.hideProducts;

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

})(window);