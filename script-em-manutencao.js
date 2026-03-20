/**
 * @fileoverview Frontend Interface Controller
 * Refatorado para modularidade, otimização de renderização 3D e mitigação de vazamento de memória.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /**
     * Módulo 1: Subsistema de Renderização 3D (Three.js)
     * Otimizado com controle de Pixel Ratio e Linear Interpolation (LERP) para a câmera.
     */
    const initThreeJSBackground = () => {
        const canvas = document.getElementById('background-canvas');
        if (!canvas) return;

        // Configurações paramétricas do sistema de partículas
        const CONFIG = {
            particleCount: 5000,
            spread: 15,
            size: 0.015,
            color: 0x00ffff,
            cameraZ: 5,
            rotationSpeed: 0.05,
            lerpFactor: 0.05
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = CONFIG.cameraZ;

        // Antialias ativado e controle de Pixel Ratio para otimizar desempenho em telas Retina/4K
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Alocação de geometria e posições
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(CONFIG.particleCount * 3);

        for (let i = 0; i < positions.length; i++) {
            positions[i] = (Math.random() - 0.5) * CONFIG.spread;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: CONFIG.size,
            color: CONFIG.color,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        // Vetor de rastreamento cinemático do mouse
        const mouse = new THREE.Vector2();
        
        window.addEventListener('mousemove', (event) => {
            // Normalização das coordenadas para o espaço NDC (Normalized Device Coordinates: -1 a +1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        const clock = new THREE.Clock();

        // Loop principal de renderização
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Cinemática rotacional da malha de partículas
            particleMesh.rotation.y = elapsedTime * CONFIG.rotationSpeed;
            particleMesh.rotation.x = elapsedTime * CONFIG.rotationSpeed;

            // Filtro LERP (Linear Interpolation) para suavização do movimento da câmera
            camera.position.x += (mouse.x * 0.5 - camera.position.x) * CONFIG.lerpFactor;
            camera.position.y += (mouse.y * 0.5 - camera.position.y) * CONFIG.lerpFactor;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        
        animate();

        // Recalibração responsiva do viewport
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    /**
     * Módulo 2: Subsistema de Navegação e Estado da UI
     * Utiliza Optional Chaining (?.) para prevenir exceções de nós inexistentes.
     */
    const initNavigation = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuButton?.addEventListener('click', () => {
            mobileMenu?.classList.toggle('hidden');
        });

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href')?.split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active-link');
            }
        });
    };

    /**
     * Módulo 3: Subsistema de Intersecção (Lazy Animation)
     * Otimizado para remover a observação (unobserve) após o trigger inicial, economizando ciclos de CPU.
     */
    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Otimização: Cessa a observação após a animação ser ativada
                    obs.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    };

    /**
     * Módulo 4: Subsistema Cinemático de UI (Efeito 3D nos Cards)
     */
    const init3DCardsHover = () => {
        document.querySelectorAll('.card-3d-hover').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                
                // Cálculo vetorial da posição relativa do cursor
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Normalização das coordenadas e aplicação do pitch/yaw
                const rotateX = (y / rect.height - 0.5) * -15; 
                const rotateY = (x / rect.width - 0.5) * 15;
                
                card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            });
            
            card.addEventListener('mouseleave', () => {
                // Restauração do vetor de transformação ao estado neutro (Idle)
                card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    };

    // Inicialização da Arquitetura (Boot sequence)
    initThreeJSBackground();
    initNavigation();
    initScrollAnimations();
    init3DCardsHover();
});