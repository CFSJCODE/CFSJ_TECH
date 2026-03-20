/**
 * ============================================================================
 * CORE ENGINE (Unified Script)
 * Engenharia de Sistemas, Inovação e Portfólio
 * ============================================================================
 */

// ============================================================================
// 1. BASE DE DADOS (Hardware, Software, Infraestrutura & Midias)
// ============================================================================

const projectsData = {
    // --- SOFTWARE & FORENSE ---
    'winreg-usb-auditor': {
        title: "WinReg USB Auditor",
        fullDesc: `
            <div class='fira-code text-xs mb-4 p-3 bg-black/50 border border-cyan-500/30 rounded'>
                <p class='text-cyan-400 font-bold'># Sistema Forense Automatizado</p>
                <p>Ano: 2026 | Plataforma: Windows | Status: v1.0.0 Stable</p>
            </div>
            <p>Desenvolvido em Python para auditar a hive do Registro do Windows (USBSTOR). A ferramenta elimina a navegação manual, mitigando erros humanos em perícias digitais.</p>
            <h4 class='text-cyan-500 font-bold mt-4 uppercase text-[10px] tracking-widest'>Principais Funcionalidades</h4>
            <ul class='list-disc pl-5 space-y-2 mt-2 text-sm text-gray-400'>
                <li><strong>Auto-Elevação:</strong> Solicita privilégios administrativos via UAC.</li>
                <li><strong>Extração de Metadados:</strong> Vendor ID, Product ID e Serial Number.</li>
                <li><strong>Timestamp Precision:</strong> Converte valores binários de <em>Last Write Time</em>.</li>
            </ul>`,
        images: ['https://raw.githubusercontent.com/Seu_Usuario/WinReg_USB_Auditor/main/screenshot_placeholder.png'],
        github: 'https://github.com/Seu_Usuario/WinReg_USB_Auditor'
    },

    // --- HARDWARE & MANUTENÇÃO ---
    'desktop-maintenance': {
        title: "Montagem E Manutenção Avançada Em Desktops",
        fullDesc: `
            <div class='fira-code text-xs mb-4 p-3 bg-black/50 border border-cyan-500/30 rounded'> 
                <p class='text-cyan-400 font-bold'># Intervenção Nível II - Workstation</p> 
                <p>Foco: Mitigação de Thermal Throttling e Eficiência Energética</p> 
            </div> 
            <p>Processo rigoroso de engenharia de hardware focado na restauração da eficiência térmica e operacional de estações de trabalho desktop.</p> 
            <h4 class='text-cyan-500 font-bold mt-4 uppercase text-[10px] tracking-widest'>Escopo Técnico Das Intervenções</h4> 
            <ul class='list-disc pl-5 space-y-2 mt-2 text-sm text-gray-400'> 
                <li>Montagem de Workstations para trabalho e de desktops para jogos.</li> 
                <li>Desmontagem integral para higienização profunda e mitigação de particulados no circuito.</li> 
                <li>Substituição de compostos térmicos (TIM) degradados por soluções de alta condutividade térmica em processadores e GPUs.</li> 
                <li>Reestruturação de cabeamento (<em>Cable Management</em>) para otimização do fluxo aerodinâmico interno.</li> 
                <li>Limpeza de slots de expansão e contatos com agentes dielétricos para estabilidade de impedância.</li> 
            </ul>`,
        images: [
            'https://i.imgur.com/hGyrwFa.jpg', 'https://i.imgur.com/DBNg3aX.jpg',
            'https://i.imgur.com/1ZHJW49.jpg', 'https://i.imgur.com/2tB0ajB.jpg',
            'https://i.imgur.com/Zm86pzA.jpg', 'https://i.imgur.com/ELYNHd4.jpg',
            'https://i.imgur.com/zD4brvE.jpg', 'https://i.imgur.com/dsH5U9F.jpg',
            'https://i.imgur.com/ZJHZEjF.jpg', 'https://i.imgur.com/CyVd8UA.jpg',
            'https://i.imgur.com/buSfJWx.jpg', 'https://i.imgur.com/xhp58tC.jpg',
            'https://i.imgur.com/tqL28WQ.jpg'
        ]
    },
    'cleaning-before': {
        title: "Estado Inicial: Pré-Intervenção Técnica",
        fullDesc: "<p>Análise de hardware legado evidenciando acumulação crítica de material particulado. O cenário elevava a temperatura de operação, resultando em <em>thermal throttling</em> e instabilidade.</p>",
        images: ['Hardware - Imagem Antes De Limpeza.jpeg']
    },
    'assembly-phase': {
        title: "Montagem de Alta Performance",
        fullDesc: "<p>Integração estratégica da PSU e sistema de arrefecimento. Foco na criação de pressão positiva interna para minimizar a entrada de poeira.</p>",
        images: [
            'Hardware - Fase Inicial De Montagem - Fonte e Fans Auxiliares - Vista Frontal.jpeg',
            'Hardware - Fase Inicial De Montagem - Fonte e Fans Auxiliares.jpeg',
            'Hardware - Fase Inicial De Montagem - Fonte e Fans Auxiliares - Vista Traseira.jpeg'
        ]
    },
    'notebook-maintenance': {
        title: "Manutenção Avançada em Portáteis",
        fullDesc: "<p>Intervenção de nível II: desmontagem complexa, limpeza ultrassônica do exaustor e aplicação de pasta térmica à base de prata.</p>",
        images: ['Notebook (1).jpeg', 'Notebook (2).jpeg', 'Notebook (3).jpeg', 'Notebook (4).jpeg']
    },
    'maintenance-prev': {
        title: "Protocolo de Manutenção Preventiva",
        fullDesc: "<p>Limpeza de contatos com álcool isopropílico e lubrificação de rolamentos. Prática que mitiga falhas intermitentes e estende a vida útil dos circuitos VRM.</p>",
        images: ['Hardware - Manutenção Preventiva em computador.jpeg']
    },

    // --- REDES, INFRAESTRUTURA & MDM ---
    'router-setup': {
        title: "Implantação de Ativos de Rede",
        fullDesc: "<p>Configuração de roteador DIR-3040 com tecnologia MU-MIMO. Inclui segmentação de VLANs e parametrização de QoS para tráfego prioritário.</p>",
        images: ['Cabeamento Estruturado 001 - Roteador Novo DLINK DIR3040.jpeg']
    },
    'mdm-provisioning': {
        title: "Provisionamento Corporativo (MDM)",
        fullDesc: `
            <p>Gestão de dispositivos móveis em massa. Implementação de Kiosk Mode e políticas de segurança remotas para frotas educacionais.</p>
            <h4 class='text-cyan-500 font-bold mt-4 uppercase text-[10px] tracking-widest'>Escopo do Projeto</h4>
            <ul class='list-disc pl-5 space-y-2 mt-2 text-sm text-gray-400'>
                <li>Padronização de Firmwares em frotas de dispositivos móveis.</li>
                <li>Implementação de políticas de segurança e restrições de uso.</li>
                <li>Provisionamento automatizado de software.</li>
            </ul>`,
        images: [
            'https://i.imgur.com/dhIqB0k.jpeg',
            'https://i.imgur.com/I5dBzXe.jpeg',
            'https://i.imgur.com/7Gmky6U.jpeg'
        ]
    },
    'setup-consulting': {
        title: "Consultoria em Estações de Trabalho",
        fullDesc: "<p>Arquitetura de setups com foco em ergonomia e proteção elétrica. Implementação de DPS Classe III e gestão técnica de cabos.</p>",
        images: ['Gerenciamento De Cabos.jpeg', 'Filtro De Linha - DPS.jpeg']
    },
    'events-support': {
        title: "Suporte a Eventos e Infraestrutura",
        fullDesc: "<p>Preparação De Ambientes Para Cursos, Oficinas, Palestras e Congressos De Tecnologia E Suporte A Eventos.</p>",
        images: [
            'https://i.imgur.com/tNfIT8E.jpg',
            'https://i.imgur.com/wAcfLnj.jpg'
        ]
    },
    'tes48v-commissioning': {
        title: "Comissionamento de Gabinetes TES48V",
        fullDesc: `
            <div class='fira-code text-xs mb-4 p-3 bg-black/50 border border-cyan-500/30 rounded'>
                <p class='text-cyan-400 font-bold'># Infraestrutura Educacional - Espaço Maker</p>
                <p>Foco: Cable Management e Mitigação de Riscos Elétricos</p>
            </div>
            <p>Processo de implantação física de gabinetes de recarga TES48V. O escopo de engenharia envolveu o recebimento logístico, alocação nos ambientes de aprendizagem, além da montagem e padronização meticulosa do cabeamento para garantir a segurança elétrica, impedância adequada e eficiência na recarga de frotas inteiras de tablets e notebooks simultaneamente.</p>`,
        images: [
            'https://imgur.com/WLc2plQ.jpg',
            'https://imgur.com/TAaAyxu.jpg'
        ]
    },
    'network-retrofit': {
        title: "Retrofit de Infraestrutura de Rede Corporativa",
        fullDesc: `
            <div class='fira-code text-xs mb-4 p-3 bg-black/50 border border-cyan-500/30 rounded'>
                <p class='text-cyan-400 font-bold'># Cabeamento Estruturado - Camada Física (L1)</p>
                <p>Foco: Refatoração Topológica e Norma TIA/EIA</p>
            </div>
            <p>Intervenção de nível físico (Layer 1 - OSI) em ambiente corporativo. O retrofit incluiu o mapeamento da rede preexistente, substituição e re-conectorização de *patch cords* degradados, e organização do fluxo de cabos.</p>
            <h4 class='text-cyan-500 font-bold mt-4 uppercase text-[10px] tracking-widest'>Escopo Técnico</h4>
            <ul class='list-disc pl-5 space-y-2 mt-2 text-sm text-gray-400'>
                <li>Remoção de "espaguetes de cabos", mitigando falhas por indução eletromagnética e laços de terra.</li>
                <li>Identificação e testes de impedância nos nós da topologia estrela.</li>
                <li>Adequação estética e funcional para facilitar manutenções futuras e escalar novos *endpoints*.</li>
            </ul>`,
        images: [
            'https://i.imgur.com/jdVOYri.jpg',
            'https://i.imgur.com/gYiaZ9D.jpg',
            'https://i.imgur.com/XsNhnXG.jpg',
            'https://i.imgur.com/AROJQHm.jpg',
            'https://i.imgur.com/eFbl6WV.jpg'
        ]
    }
};

// Imagens dedicadas para a galeria de processo de manutenção
const notebookImages = [
    "https://i.imgur.com/yxZQw4K.jpeg",
    "https://i.imgur.com/hxg2iOe.jpeg",
    "https://i.imgur.com/1y10znn.jpeg",
    "https://i.imgur.com/5KSBTMx.jpeg",
    "https://i.imgur.com/4n96td3.jpeg",
    "https://i.imgur.com/9uoIYrd.jpeg",
    "https://i.imgur.com/MQvAtju.jpeg",
    "https://i.imgur.com/xDUp5ho.jpeg"
];

// ============================================================================
// 2. GERENCIAMENTO DE ESTADO (State Management)
// ============================================================================

// Estado Modal de Projetos
let currentModalImages = [];
let currentModalIdx = 0;

// Estado Modal de Galeria Dedicada
let currentGalleryIdx = 0;

// ============================================================================
// 3. MOTOR DO MODAL PRINCIPAL (Portfólio)
// ============================================================================

function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    currentModalImages = data.images;
    currentModalIdx = 0;

    // Atualiza Textos
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-description').innerHTML = data.fullDesc;
    
    // Configuração do botão GitHub
    const githubLinkContainer = document.getElementById('modal-links');
    const btnGithub = document.getElementById('btn-github');
    
    if (data.github && githubLinkContainer && btnGithub) {
        btnGithub.href = data.github;
        githubLinkContainer.classList.remove('hidden');
    } else if (githubLinkContainer) {
        githubLinkContainer.classList.add('hidden');
    }

    // Lógica das Setas de Navegação
    const arrowLeft = document.getElementById('modal-arrow-left');
    const arrowRight = document.getElementById('modal-arrow-right');
    const hasMultiple = currentModalImages.length > 1;
    
    if (arrowLeft) arrowLeft.style.display = hasMultiple ? 'flex' : 'none';
    if (arrowRight) arrowRight.style.display = hasMultiple ? 'flex' : 'none';

    updateModalDisplay();

    // Trava de Scroll e Exibição com transição suave (CSS active class timeout)
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
        modalOverlay.style.display = 'flex';
        // Pequeno timeout para permitir a transição CSS de opacidade (Tailwind transition)
        setTimeout(() => modalOverlay.classList.add('active'), 10);
    }
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        // Aguarda a animação de fade-out antes de ocultar no DOM
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            modalOverlay.style.display = 'none';
        }, 300);
    }
    document.body.style.overflow = '';
}

function updateModalDisplay() {
    const img = document.getElementById('modal-image');
    if (!img || currentModalImages.length === 0) return;
    
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = currentModalImages[currentModalIdx];
        img.style.opacity = '1';
    }, 150);
}

function navigateModalCarousel(direction) {
    if (currentModalImages.length <= 1) return;
    currentModalIdx = (currentModalIdx + direction + currentModalImages.length) % currentModalImages.length;
    updateModalDisplay();
}

// ============================================================================
// 4. MOTOR DA GALERIA DEDICADA (Processo de Manutenção)
// ============================================================================

function openGallery() {
    currentGalleryIdx = 0;
    updateGalleryDisplay();
    
    const modalGallery = document.getElementById('modal-gallery');
    if (modalGallery) modalGallery.classList.remove('hidden');
    
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modalGallery = document.getElementById('modal-gallery');
    if (modalGallery) modalGallery.classList.add('hidden');
    
    document.body.style.overflow = '';
}

function updateGalleryDisplay() {
    const imgDisplay = document.getElementById('main-gallery-img');
    const counter = document.getElementById('gallery-counter');
    
    if (!imgDisplay) return;

    imgDisplay.style.opacity = '0';
    setTimeout(() => {
        imgDisplay.src = notebookImages[currentGalleryIdx];
        if (counter) counter.innerText = `IMAGEM ${currentGalleryIdx + 1} DE ${notebookImages.length}`;
        imgDisplay.style.opacity = '1';
    }, 150);
}

function nextImg() {
    currentGalleryIdx = (currentGalleryIdx + 1) % notebookImages.length;
    updateGalleryDisplay();
}

function prevImg() {
    currentGalleryIdx = (currentGalleryIdx - 1 + notebookImages.length) % notebookImages.length;
    updateGalleryDisplay();
}

// ============================================================================
// 5. INTERFACE DO USUÁRIO & FILTROS (UI/UX)
// ============================================================================

window.filterProjects = function(category) {
    const projects = document.querySelectorAll('.project-item');
    const buttons = document.querySelectorAll('.filter-btn');

    // Atualiza estado visual dos botões
    buttons.forEach(btn => {
        const isActive = btn.dataset.filter === category;
        btn.classList.toggle('active', isActive);
        btn.classList.toggle('bg-cyan-500', isActive);
        btn.classList.toggle('text-black', isActive);
        
        if (!isActive) {
            btn.classList.add('text-gray-400', 'border-gray-700');
            btn.classList.remove('bg-cyan-500', 'text-black');
        }
    });

    // Aplica filtro com transição suave
    projects.forEach(project => {
        const projectCat = project.getAttribute('data-category');
        if (category === 'all' || projectCat === category) {
            project.style.display = 'block';
            if (project.classList.contains('flex')) project.style.display = 'flex';
            setTimeout(() => project.style.opacity = '1', 50);
        } else {
            project.style.opacity = '0';
            setTimeout(() => project.style.display = 'none', 300);
        }
    });
};

// ============================================================================
// 6. RENDERIZAÇÃO GRÁFICA (Three.js - Otimizado)
// ============================================================================

const initBackground = () => {
    // Requer Three.js carregado no HTML
    if (typeof THREE === 'undefined') {
        console.warn('Three.js não detetado. Background interativo desativado.');
        return;
    }

    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geo = new THREE.BufferGeometry();
    const count = 6000;
    const pos = new Float32Array(count * 3);
    
    for(let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * 12;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({ 
        size: 0.015, 
        color: 0x00f2ff, 
        transparent: true, 
        opacity: 0.6 
    });
    
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        points.rotation.y += 0.0012;
        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ============================================================================
// 7. LISTENERS & BOOTSTRAP (Eventos Globais)
// ============================================================================

document.addEventListener('keydown', (e) => {
    const modalGallery = document.getElementById('modal-gallery');
    const modalOverlay = document.getElementById('modal-overlay');

    if (modalGallery && !modalGallery.classList.contains('hidden')) {
        if (e.key === "Escape") closeGallery();
        if (e.key === "ArrowRight") nextImg();
        if (e.key === "ArrowLeft") prevImg();
        return; 
    }

    if (modalOverlay && (!modalOverlay.classList.contains('hidden') || modalOverlay.style.display === 'flex')) {
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight") navigateModalCarousel(1);
        if (e.key === "ArrowLeft") navigateModalCarousel(-1);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initBackground();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { 
            if (e.isIntersecting) {
                e.target.classList.add('is-visible'); 
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    const menuBtn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
});