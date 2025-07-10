/**
 * Script Unificado para Interações e Animações da Página
 * * Este script combina várias funcionalidades:
 * 1. Animação de fundo com Three.js (partículas interativas com o mouse).
 * 2. Menu mobile responsivo (toggle).
 * 3. Mudança de estilo do cabeçalho ao rolar a página.
 * 4. Marcação do link de navegação ativo.
 * 5. Animações de elementos ao aparecerem na tela (scroll reveal).
 * 6. Efeito de hover 3D em cards.
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- INICIALIZAÇÃO DAS FUNCIONALIDADES ---

    initThreeJSAnimation();
    initMobileMenu();
    initHeaderScrollEffect();
    initActiveNavLinks();
    initScrollAnimations();
    init3dCardHoverEffect();

    // --- DEFINIÇÃO DAS FUNÇÕES ---

    /**
     * Configura e inicia a animação de fundo com Three.js.
     * Usa um sistema de partículas que reage ao movimento do mouse.
     */
    function initThreeJSAnimation() {
        const canvas = document.getElementById('background-canvas');
        // Aborta se o canvas ou a biblioteca Three.js não existirem
        if (!canvas || typeof THREE === 'undefined') {
            console.warn('Canvas para Three.js ou a biblioteca não foram encontrados.');
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true // Permite fundo transparente
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Criação das partículas
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 5000;
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            color: 0x00ffff, // Cor ciano
            blending: THREE.AdditiveBlending, // Efeito de brilho
            transparent: true,
            opacity: 0.8
        });

        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        camera.position.z = 5;

        // Rastreamento do mouse
        const mouse = new THREE.Vector2();
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        // Loop de animação
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Animação de rotação das partículas
            particleMesh.rotation.y = elapsedTime * 0.05;
            particleMesh.rotation.x = elapsedTime * 0.05;

            // Interação da câmera com o mouse para um efeito de paralaxe
            camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        // Ajuste da janela ao redimensionar
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /**
     * Controla a exibição do menu mobile.
     */
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    /**
     * Altera o padding do cabeçalho com base na posição do scroll.
     */
    function initHeaderScrollEffect() {
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('py-2');
                    header.classList.remove('py-4');
                } else {
                    header.classList.add('py-4');
                    header.classList.remove('py-2');
                }
            });
        }
    }

    /**
     * Adiciona uma classe 'active-link' ao link de navegação da página atual.
     */
    function initActiveNavLinks() {
        const links = document.querySelectorAll('.nav-link');
        if (links.length === 0) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        links.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active-link');
            }
        });
    }

    /**
     * Usa IntersectionObserver para animar elementos quando eles entram na viewport.
     */
    function initScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        if (elementsToAnimate.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Opcional: para de observar depois que a animação acontece
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // A animação começa quando 10% do elemento está visível
        });

        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Aplica um efeito de inclinação 3D aos cards ao passar o mouse.
     */
    function init3dCardHoverEffect() {
        document.querySelectorAll('.card-3d-hover').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const {
                    width,
                    height
                } = rect;
                const rotateX = (y / height - 0.5) * -15; // Rotação sutil no eixo X
                const rotateY = (x / width - 0.5) * 15; // Rotação sutil no eixo Y

                card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                card.style.transition = 'transform 0.1s ease-out';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale(1)';
                card.style.transition = 'transform 0.4s ease-in-out';
            });
        });
    }
});
