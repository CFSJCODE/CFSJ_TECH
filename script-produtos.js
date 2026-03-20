/**
 * CFSJ TECH - Core Application Script
 * Architecture: Modern Modular Subsystems with Global Exposure for Legacy HTML.
 * Focus: High-Performance Rendering, Memory Safety, Kinematic Smoothing, Accessibility.
 * @author Cláudio Francisco (Refatorado via Assistente de Engenharia IA)
 * @version 2026.1.0
 */

(function (global) {
    'use strict';

    // --- 1. SYSTEM CONFIGURATION & UTILITIES ---

    const CONFIG = Object.freeze({
        animation: {
            particleCount: 3000,
            particleSize: 0.015,
            baseColor: 0x00ffff,
            mouseSensitivity: 0.0005,
            lerpFactor: 0.05 // Fator de interpolação para suavização física (novo)
        },
        dom: {
            gridId: 'products-grid',
            titleId: 'category-title',
            sectionCatId: 'categories-section',
            sectionProdId: 'products-section',
            canvasId: 'background-canvas',
            mobileBtnId: 'mobile-menu-button',
            mobileMenuId: 'mobile-menu'
        }
    });

    /**
     * Limita a taxa de disparos de uma função (Hardware Event Throttling)
     * @param {Function} func - Função a ser encapsulada
     * @param {number} limit - Tempo limite em milissegundos
     */
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
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

    // --- 2. DATA LAYER (Read-Only Model) ---

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

    // --- 3. UI CONTROLLER (DOM Management & Rendering) ---

    const UIController = (() => {
        let refs = {};

        const init = () => {
            refs = {
                grid: document.getElementById(CONFIG.dom.gridId),
                title: document.getElementById(CONFIG.dom.titleId),
                secCats: document.getElementById(CONFIG.dom.sectionCatId),
                secProds: document.getElementById(CONFIG.dom.sectionProdId),
                mobileBtn: document.getElementById(CONFIG.dom.mobileBtnId),
                mobileMenu: document.getElementById(CONFIG.dom.mobileMenuId),
                navLinks: document.querySelectorAll('.nav-link')
            };

            bindEvents();
            setActiveNavLink();
        };

        const bindEvents = () => {
            if (refs.mobileBtn) {
                refs.mobileBtn.addEventListener('click', toggleMobileMenu);
            }
        };

        const setActiveNavLink = () => {
            if (!refs.navLinks?.length) return;
            
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            
            refs.navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === currentFile;
                link.classList.toggle('text-cyan-400', isActive);
                link.classList.toggle('font-bold', isActive);
                link.classList.toggle('active-link', isActive);
                link.classList.toggle('text-gray-300', !isActive);
            });
        };

        const createProductCard = ({ title, desc, link, image, badge }, index) => {
            const delay = index * 40; // Otimizado para cadência visual mais fluida
            return `
                <article class="glassmorphism rounded-xl overflow-hidden group hover:transform hover:-translate-y-2 transition-all duration-300 card-product fade-in flex flex-col h-full" style="animation-delay: ${delay}ms" aria-label="Produto: ${title}">
                    <div class="relative h-48 w-full overflow-hidden bg-[#0a0f19]/50">
                        <img src="${image}" 
                             alt="Imagem de ${title}" 
                             loading="lazy" 
                             width="600" height="400"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out">
                        <span class="absolute top-2 right-2 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded shadow-lg shadow-cyan-500/20">
                            ${badge}
                        </span>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="font-exo text-xl font-bold text-white mb-2 line-clamp-2">${title}</h3>
                        <p class="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">${desc}</p>
                        <a href="${link}" target="_blank" rel="noopener noreferrer" 
                           class="mt-auto w-full block text-center border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-exo font-bold py-3 rounded transition-all duration-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                           aria-label="Ver detalhes de ${title} no Mercado Livre">
                            Ver no Mercado Livre
                        </a>
                    </div>
                </article>
            `;
        };

        const showProducts = (categoryKey) => {
            const products = productsDB[categoryKey];
            if (!products) {
                console.warn(`[System] Referência de categoria inválida ou inexistente: ${categoryKey}`);
                return;
            }

            // Renderização em Batch via API de Animação do Browser
            requestAnimationFrame(() => {
                if (refs.title) refs.title.textContent = categoryTitles[categoryKey] ?? 'Produtos';
                if (refs.grid) refs.grid.innerHTML = products.map(createProductCard).join('');
                
                refs.secCats?.classList.add('hidden');
                refs.secProds?.classList.remove('hidden');
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        };

        const hideProducts = () => {
            refs.secProds?.classList.add('hidden');
            refs.secCats?.classList.remove('hidden');

            // Force Reflow para reiniciar animações CSS
            document.querySelectorAll('.card-category').forEach(card => {
                card.classList.remove('animate-on-scroll', 'is-visible');
                void card.offsetWidth; 
                card.classList.add('animate-on-scroll');
            });
            
            ScrollObserver.observeElements();
        };

        const toggleMobileMenu = () => {
            if (!refs.mobileMenu || !refs.mobileBtn) return;
            
            const isHidden = refs.mobileMenu.classList.contains('hidden');
            refs.mobileMenu.classList.toggle('hidden', !isHidden);
            refs.mobileBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        };

        return { init, showProducts, hideProducts };
    })();

    // --- 4. HARDWARE-ACCELERATED VISUALS (Three.js Subsystem) ---

    const BackgroundFX = (() => {
        let scene, camera, renderer, particles;
        // Estruturas de controle para suavização cinemática (Lerp)
        let mouse = { x: 0, y: 0 };
        let targetRotation = { x: 0, y: 0 };
        let animationId;

        const init = () => {
            const canvas = document.getElementById(CONFIG.dom.canvasId);
            if (!canvas || !window.WebGLRenderingContext || typeof THREE === 'undefined') return;

            // Setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 4;

            renderer = new THREE.WebGLRenderer({ 
                canvas, 
                alpha: true, 
                antialias: false, 
                powerPreference: 'high-performance'
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Geometry & Particles
            const count = CONFIG.animation.particleCount;
            const posArray = new Float32Array(count * 3);
            for(let i = 0; i < count * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 15;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const material = new THREE.PointsMaterial({
                size: CONFIG.animation.particleSize,
                color: CONFIG.animation.baseColor,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Bind Events
            window.addEventListener('resize', throttle(onResize, 200));
            document.addEventListener('mousemove', onMouseMove, { passive: true });

            animate();
        };

        const onResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onMouseMove = (event) => {
            // Mapeamento normalizado (-1 a 1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            
            // Definição de vetores alvo com base no input do mouse
            targetRotation.x = -mouse.y * CONFIG.animation.mouseSensitivity;
            targetRotation.y = mouse.x * CONFIG.animation.mouseSensitivity;

            // Aplicação de interpolação linear (Lerp) para física suavizada
            particles.rotation.x += (targetRotation.x - particles.rotation.x) * CONFIG.animation.lerpFactor;
            particles.rotation.y += (targetRotation.y - particles.rotation.y) * CONFIG.animation.lerpFactor;
            
            // Rotação autônoma base (idle state)
            particles.rotation.y += 0.001; 

            renderer.render(scene, camera);
        };

        return { init };
    })();

    // --- 5. INTERSECTION OBSERVER SUBSYSTEM ---

    const ScrollObserver = (() => {
        let observer;

        const init = () => {
            if (!('IntersectionObserver' in window)) return; // Failsafe para browsers antigos

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
            if (!observer) return;
            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        };

        return { init, observeElements };
    })();

    // --- 6. CORE INITIALIZATION PIPELINE ---

    const initSystem = () => {
        try {
            UIController.init();
            BackgroundFX.init();
            ScrollObserver.init();
            console.log("[System] CFSJ TECH Core Architecture Initialized [v2026.1.0]");
        } catch (error) {
            console.error("[System Error] Falha na inicialização do Core:", error);
        }
    };

    // --- 7. PUBLIC API EXPOSURE ---
    
    // Exportação explícita para compatibilidade com eventos HTML inline (ex: onclick="showProducts('...')")
    global.showProducts = UIController.showProducts;
    global.hideProducts = UIController.hideProducts;

    // Bootloader
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSystem);
    } else {
        initSystem();
    }

})(window);