/**
 * Core System Initialization & UI Controllers
 * Arquitetura modularizada para separação de renderização 3D e manipulação de DOM.
 */

// ==========================================
// MÓDULO 1: Renderizador 3D (Three.js)
// ==========================================
class WebGLBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return; // Aborta silenciosamente se o canvas não existir

        this.initEnvironment();
        this.createParticles();
        this.bindEvents();
        this.startLoop();
    }

    initEnvironment() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Otimização para telas retina

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
    }

    createParticles() {
        const particleCount = 5000;
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.015,
            color: 0x00ffff,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        this.particleMesh = new THREE.Points(geometry, material);
        this.scene.add(this.particleMesh);
    }

    bindEvents() {
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseMove(event) {
        // Normalização das coordenadas do mouse (-1 a +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    startLoop() {
        // Uso de arrow function para preservar o contexto do 'this'
        const animate = () => {
            requestAnimationFrame(animate);
            this.render();
        };
        animate();
    }

    render() {
        const elapsedTime = this.clock.getElapsedTime();

        // Rotação autônoma do campo de partículas
        this.particleMesh.rotation.y = elapsedTime * 0.05;
        this.particleMesh.rotation.x = elapsedTime * 0.05;

        // Interpolação suave (Lerp) para a posição da câmera baseada no mouse
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// ==========================================
// MÓDULO 2: Controladores de Interface (DOM)
// ==========================================
const UIManager = {
    initMobileMenu() {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        
        if (button && menu) {
            button.addEventListener('click', () => menu.classList.toggle('hidden'));
        }
    },

    initNavigation() {
        const links = document.querySelectorAll('.nav-link');
        if (!links.length) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        links.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active-link');
            }
        });
    },

    initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Opcional: observer.unobserve(entry.target) para animar apenas uma vez
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    },

    initCard3DEffects() {
        const cards = document.querySelectorAll('.card-3d-hover');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Cálculo de cinemática inversa simples para inclinação do card
                const rotateX = (y / rect.height - 0.5) * -15; 
                const rotateY = (x / rect.width - 0.5) * 15;
                
                card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
};

// ==========================================
// MÓDULO 3: Bootloader do Sistema
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o subsistema gráfico (se o canvas existir)
    new WebGLBackground('background-canvas');

    // 2. Inicializa os subsistemas de interface de usuário
    UIManager.initMobileMenu();
    UIManager.initNavigation();
    UIManager.initScrollAnimations();
    UIManager.initCard3DEffects();
});