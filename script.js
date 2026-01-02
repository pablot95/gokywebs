// ===========================
// Variables y Estado
// ===========================
const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ===========================
// Configuración de Particles.js
// ===========================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#2B5FA5', '#6B4C9A', '#A8A8A8']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.3,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 2,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 100,
                color: '#2B5FA5',
                opacity: 0.5,
                width: 2
            },
            move: {
                enable: true,
                speed: 3,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 100,
                    line_linked: {
                        opacity: 0.8
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// ===========================
// Navegación con scroll
// ===========================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Añadir sombra al navbar cuando se hace scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===========================
// Menú móvil
// ===========================
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===========================
// Smooth Scroll para enlaces con Lenis
// ===========================
// Se inicializa dentro de DOMContentLoaded después de crear lenis

// ===========================
// Animación de entrada para elementos (usando AOS y GSAP)
// ===========================
// Las animaciones de service cards, portfolio y timeline se manejan con GSAP en DOMContentLoaded

// ===========================
// Animación del Browser Mockup
// ===========================
const browserMockup = document.querySelector('.browser-mockup');
const codeSnippets = document.querySelectorAll('.code-snippet');

if (browserMockup) {
    // Efecto de hover en el mockup
    browserMockup.addEventListener('mouseenter', () => {
        browserMockup.style.transform = 'scale(1.02) translateY(-5px)';
        browserMockup.style.transition = 'all 0.3s ease';
    });

    browserMockup.addEventListener('mouseleave', () => {
        browserMockup.style.transform = 'scale(1) translateY(0)';
    });

    // Efecto parallax suave con scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBottom = document.querySelector('.hero').offsetHeight;
        
        if (scrolled < heroBottom) {
            // Mover el mockup suavemente
            browserMockup.style.transform = `translateY(${scrolled * 0.15}px)`;
            
            // Mover los code snippets en direcciones diferentes
            codeSnippets.forEach((snippet, index) => {
                const speed = (index + 1) * 0.3;
                const direction = index % 2 === 0 ? 1 : -1;
                const yPos = scrolled * speed * 0.2 * direction;
                snippet.style.transform = `translateY(${yPos}px)`;
            });
        }
    });
}

// Animar la URL del navegador
const browserUrl = document.querySelector('.browser-url span');
if (browserUrl) {
    const urls = ['tuproyecto.com', 'tunegocio.com', 'tuidea.com', 'tuempresa.com'];
    let currentIndex = 0;
    
    setInterval(() => {
        browserUrl.style.opacity = '0';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % urls.length;
            browserUrl.textContent = urls[currentIndex];
            browserUrl.style.opacity = '1';
        }, 300);
    }, 4000);
}

// Efecto de "typing" en las líneas de texto del mockup
const textLines = document.querySelectorAll('.text-line');
textLines.forEach((line, index) => {
    line.style.transformOrigin = 'left';
    
    // Animación inicial de crecimiento
    setTimeout(() => {
        line.style.animation = 'none';
        line.style.transform = 'scaleX(0)';
        
        setTimeout(() => {
            line.style.transition = 'transform 0.8s ease';
            line.style.transform = 'scaleX(1)';
            
            // Después de la animación inicial, volver a la animación de loop
            setTimeout(() => {
                line.style.transition = '';
                line.style.animation = '';
            }, 800);
        }, 50);
    }, 1000 + (index * 200));
});

// ===========================
// Efecto parallax en hero
// ===========================
const heroVisual = document.querySelector('.hero-visual');

// ===========================
// Animación de contadores (opcional)
// ===========================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===========================
// Inicializar EmailJS
// ===========================
    emailjs.init("_WA82jXCJEH8sWNSq");
    console.log('EmailJS inicializado correctamente');

// ===========================
// Formulario de contacto con EmailJS
// ===========================
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Deshabilitar botón y cambiar texto
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        console.log('Enviando formulario...');
        
        // Enviar email usando EmailJS
        emailjs.sendForm('service_w15l48a', 'template_u110bgf', '#contactForm')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Mostrar mensaje de éxito
                showNotification('¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
                // Resetear formulario
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                console.error('Detalles del error:', error);
                showNotification('Hubo un error al enviar el mensaje. Intenta nuevamente.', 'error');
            })
            .finally(function() {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}

// ===========================
// Sistema de notificaciones
// ===========================
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación con colores del logo
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #2B5FA5, #6B4C9A)' : 'linear-gradient(135deg, #f5576c, #8B6FBC)'};
        color: #FFFFFF;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(43, 95, 165, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Eliminar después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Añadir animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    /* Estilos del cursor personalizado */
    .custom-cursor {
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        display: none;
    }
    
    .cursor-dot {
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #2B5FA5, #6B4C9A);
        border-radius: 50%;
        position: fixed;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    }
    
    .cursor-outline {
        width: 30px;
        height: 30px;
        border: 2px solid #2B5FA5;
        border-radius: 50%;
        position: fixed;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, border-color 0.3s;
    }
    
    .custom-cursor.hover .cursor-dot {
        width: 50px;
        height: 50px;
        background: rgba(43, 95, 165, 0.3);
    }
    
    .custom-cursor.hover .cursor-outline {
        width: 50px;
        height: 50px;
        border-color: #6B4C9A;
    }
    
    /* Efecto de brillo en los botones */
    .btn-primary::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
    }
    
    .btn-primary:hover::after {
        left: 100%;
    }
    
    /* Animación de las formas flotantes mejorada */
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
    
    .floating-shapes .shape-blob {
        animation: float 6s ease-in-out infinite;
    }
    
    .floating-shapes .shape-blob:nth-child(2) {
        animation-delay: 2s;
        animation-duration: 8s;
    }
    
    .floating-shapes .shape-blob:nth-child(3) {
        animation-delay: 4s;
        animation-duration: 7s;
    }
    
    /* Efecto de resplandor en hover de tarjetas */
    .service-card::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(43, 95, 165, 0.1), transparent);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        z-index: -1;
    }
    
    .service-card:hover::after {
        width: 300px;
        height: 300px;
    }
    
    /* Mejora de la animación del mockup */
    .browser-mockup {
        animation: float 4s ease-in-out infinite;
    }
    
    /* Efecto de partículas en botones */
    @keyframes particleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-30px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Efecto de cursor personalizado (opcional)
// ===========================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
document.body.appendChild(cursor);

const cursorDot = cursor.querySelector('.cursor-dot');
const cursorOutline = cursor.querySelector('.cursor-outline');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Dot sigue el cursor directamente
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    
    // Outline sigue más lento para crear efecto de retraso
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    
    requestAnimationFrame(animateCursor);
}

// Activar cursor personalizado solo en desktop
if (window.innerWidth > 768) {
    cursor.style.display = 'block';
    animateCursor();
}

// Expandir cursor en hover sobre elementos interactivos
const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, .timeline-item');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// ===========================
// Gestión de Videos del Portafolio
// ===========================
function loadPortfolioVideos() {
    const videos = document.querySelectorAll('.portfolio-video');
    const isMobile = window.innerWidth <= 768;
    
    videos.forEach(video => {
        // Obtener el video correcto según el dispositivo
        const webSource = video.querySelector('source[media]');
        const mobileSource = video.querySelectorAll('source')[1];
        
        if (webSource && mobileSource) {
            if (isMobile) {
                video.src = mobileSource.src;
            } else {
                video.src = webSource.src;
            }
            video.load();
        }
    });
}

// Cargar videos al inicio
window.addEventListener('load', loadPortfolioVideos);

// Recargar videos al cambiar tamaño de ventana
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        loadPortfolioVideos();
    }, 250);
});

// Intersection Observer para reproducir videos solo cuando son visibles
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play();
        } else {
            video.pause();
        }
    });
}, {
    threshold: 0.5
});

// Observar todos los videos
document.querySelectorAll('.portfolio-video').forEach(video => {
    videoObserver.observe(video);
});

// ===========================
// Efecto magnético en elementos
// ===========================
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.3;
        const moveY = y * 0.3;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
    });
});

// ===========================
// Performance: Lazy loading para imágenes
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===========================
// Inicialización con GSAP
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Goky.net - Iniciando...');
    
    // Añadir clase loaded
    document.body.classList.add('loaded');
    
    // Inicializar Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis = lenis;
    console.log('✅ Lenis OK');
    
    // Smooth scroll para todos los enlaces con hash
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId && targetId !== '#' && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    lenis.scrollTo(targetSection, {
                        offset: -80,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            }
        });
    });
    
    // GSAP
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    console.log('✅ GSAP OK');
    
    // Animaciones hero
    gsap.from('.hero-title', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-description', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-buttons', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    // Service cards
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 80,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Portfolio carousel sections
    gsap.utils.toArray('.portfolio-category-section').forEach((section, i) => {
        gsap.from(section.querySelector('.category-title'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from(section.querySelector('.carousel-container'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.95,
            duration: 1,
            delay: 0.5,
            ease: 'power3.out'
        });
    });
    
    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const direction = i % 2 === 0 ? -80 : 80;
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: direction,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Contact form
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    console.log('✅ Animaciones configuradas');
    console.log('📊 Elements:', {
        services: document.querySelectorAll('.service-card').length,
        portfolio: document.querySelectorAll('.portfolio-item').length,
        timeline: document.querySelectorAll('.timeline-item').length
    });
    
    // Efecto de escritura en el hero
    const words = ['experiencias digitales', 'sitios web modernos', 'interfaces increíbles'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector('.typing-effect');
    
    if (typingElement) {
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeEffect, typeSpeed);
        }
        
        typeEffect();
    }
});

// ===========================
// Prevenir comportamiento por defecto en desarrollo
// ===========================
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ===================================
// Protección contra inspección y copia
// ===================================

// Deshabilitar click derecho
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Deshabilitar selección de texto
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});


// Deshabilitar atajos de teclado para inspeccionar
document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+I (Inspeccionar)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+J (Consola)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+C (Selector de elementos)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+U (Ver código fuente)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+S (Guardar página)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
    }
});

// Deshabilitar arrastrar imágenes
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});  

// ===========================
// Carousel Calesita Portfolio
// ===========================
const carousels = {
    landing: {
        currentIndex: 0,
        items: [],
        activated: false
    },
    ecommerce: {
        currentIndex: 0,
        items: [],
        activated: false
    }
};

function initCarousel(carouselId) {
    const carousel = document.getElementById(`carousel-${carouselId}`);
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-item');
    carousels[carouselId].items = Array.from(items);
    
    // Inicializar videos
    items.forEach((item, index) => {
        const video = item.querySelector('.carousel-video');
        const link = item.querySelector('a');
        
        if (video) {
            loadCarouselVideo(video);
        }
        
        // Click en el enlace para traer video al frente o navegar
        if (link) {
            link.addEventListener('click', (e) => {
                if (!item.classList.contains('active')) {
                    // Si el video no está activo, prevenir navegación y traerlo al frente
                    e.preventDefault();
                    e.stopPropagation();
                    carousels[carouselId].currentIndex = index;
                    updateCarousel(carouselId);
                }
                // Si está activo, dejar que el enlace navegue normalmente
            });
        }
    });
    
    // Agregar funcionalidad de swipe/deslizar
    addSwipeToCarousel(carousel, carouselId);
    
    updateCarousel(carouselId, false);
}

// Función para agregar funcionalidad de swipe
function addSwipeToCarousel(carouselElement, carouselId) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;
    
    const track = carouselElement.querySelector('.carousel-track');
    if (!track) return;
    
    const handleStart = (e) => {
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        isDragging = true;
        isHorizontalSwipe = false;
    };
    
    const handleMove = (e) => {
        if (!isDragging) return;
        
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Determinar dirección del swipe solo una vez
        if (!isHorizontalSwipe && (diffX > 10 || diffY > 10)) {
            isHorizontalSwipe = diffX > diffY;
        }
        
        // Solo prevenir scroll si el movimiento es horizontal
        if (isHorizontalSwipe && diffX > 10) {
            e.preventDefault();
        }
    };
    
    const handleEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        if (!isHorizontalSwipe) return;
        
        const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Solo cambiar slide si el movimiento horizontal es significativo
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe izquierda - siguiente
                nextSlide(carouselId);
            } else {
                // Swipe derecha - anterior
                prevSlide(carouselId);
            }
        }
    };
    
    // Touch events
    track.addEventListener('touchstart', handleStart, { passive: true });
    track.addEventListener('touchmove', handleMove, { passive: false });
    track.addEventListener('touchend', handleEnd, { passive: true });
    
    // Mouse events para desktop
    track.addEventListener('mousedown', handleStart);
    track.addEventListener('mousemove', handleMove);
    track.addEventListener('mouseup', handleEnd);
    track.addEventListener('mouseleave', () => {
        isDragging = false;
        isHorizontalSwipe = false;
    });
}

function updateCarousel(carouselId, shouldPlay = true) {
    const carousel = carousels[carouselId];
    const items = carousel.items;
    const currentIndex = carousel.currentIndex;
    const totalItems = items.length;
    
    items.forEach((item, index) => {
        item.classList.remove('active', 'prev', 'next', 'hidden');
        
        const video = item.querySelector('.carousel-video');
        
        if (index === currentIndex) {
            item.classList.add('active');
            if (video && shouldPlay && carousel.activated) {
                const delay = carouselId === 'landing' ? 1000 : 1500;
                setTimeout(() => {
                    video.play();
                }, delay);
            }
        } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
            item.classList.add('prev');
            if (video) video.pause();
        } else if (index === (currentIndex + 1) % totalItems) {
            item.classList.add('next');
            if (video) video.pause();
        } else {
            item.classList.add('hidden');
            if (video) video.pause();
        }
    });
}

function nextSlide(carouselId) {
    const carousel = carousels[carouselId];
    carousel.currentIndex = (carousel.currentIndex + 1) % carousel.items.length;
    updateCarousel(carouselId);
}

function prevSlide(carouselId) {
    const carousel = carousels[carouselId];
    carousel.currentIndex = (carousel.currentIndex - 1 + carousel.items.length) % carousel.items.length;
    updateCarousel(carouselId);
}

function loadCarouselVideo(video) {
    const sources = video.querySelectorAll('source');
    
    if (sources.length > 0) {
        // Usar el primer source independientemente del tamaño de pantalla
        video.src = sources[0].src;
        video.load();
    }
}

// Inicializar carruseles cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCarousel('landing');
        initCarousel('ecommerce');
        setupCarouselTriggers();
    });
} else {
    initCarousel('landing');
    initCarousel('ecommerce');
    setupCarouselTriggers();
}

// Configurar triggers de scroll para activar carousels
function setupCarouselTriggers() {
    // Activar carousel de Landing cuando entre en viewport
    ScrollTrigger.create({
        trigger: '#carousel-landing',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            carousels.landing.activated = true;
            updateCarousel('landing', true);
        }
    });
    
    // Activar carousel de Ecommerce cuando entre en viewport
    ScrollTrigger.create({
        trigger: '#carousel-ecommerce',
        start: 'top 70%',
        once: true,
        onEnter: () => {
            carousels.ecommerce.activated = true;
            updateCarousel('ecommerce', true);
        }
    });
}


// ===========================
// EmailJS Configuration
// ===========================
(function() {
    // Inicializar EmailJS
    emailjs.init("_WA82jXCJEH8sWNSq");
})();

const contactFormElement = document.getElementById('contact-form');
if (contactFormElement) {
    contactFormElement.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Enviando...';
        btn.disabled = true;

        // Credenciales de EmailJS
        const serviceID = 'service_lc45de1';
        const templateID = 'template_z91e8x9';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.innerText = '¡Enviado!';
                alert('¡Mensaje enviado con éxito!');
                this.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }, (err) => {
                btn.innerText = originalText;
                btn.disabled = false;
                console.error('Error al enviar:', err);
                alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
            });
    });
}
