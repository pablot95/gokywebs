const navbar = document.querySelector('.navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

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
                value: ['#2563EB', '#3B82F6', '#9CA3AF']
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
                color: '#2563EB',
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

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

const browserMockup = document.querySelector('.browser-mockup');
const codeSnippets = document.querySelectorAll('.code-snippet');

if (browserMockup) {
    browserMockup.addEventListener('mouseenter', () => {
        browserMockup.style.transform = 'scale(1.02) translateY(-5px)';
        browserMockup.style.transition = 'all 0.3s ease';
    });

    browserMockup.addEventListener('mouseleave', () => {
        browserMockup.style.transform = 'scale(1) translateY(0)';
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBottom = document.querySelector('.hero').offsetHeight;
        
        if (scrolled < heroBottom) {
            browserMockup.style.transform = `translateY(${scrolled * 0.15}px)`;
            
            codeSnippets.forEach((snippet, index) => {
                const speed = (index + 1) * 0.3;
                const direction = index % 2 === 0 ? 1 : -1;
                const yPos = scrolled * speed * 0.2 * direction;
                snippet.style.transform = `translateY(${yPos}px)`;
            });
        }
    });
}

const browserUrl = document.querySelector('.browser-url span');
if (browserUrl) {
    const urls = ['youridea.com', 'yourbusiness.com', 'youridea.com', 'yourempire.com'];
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

const textLines = document.querySelectorAll('.text-line');
textLines.forEach((line, index) => {
    line.style.transformOrigin = 'left';
    
    setTimeout(() => {
        line.style.animation = 'none';
        line.style.transform = 'scaleX(0)';
        
        setTimeout(() => {
            line.style.transition = 'transform 0.8s ease';
            line.style.transform = 'scaleX(1)';
            
            setTimeout(() => {
                line.style.transition = '';
                line.style.animation = '';
            }, 800);
        }, 50);
    }, 1000 + (index * 200));
});

const heroVisual = document.querySelector('.hero-visual');

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

emailjs.init("_WA82jXCJEH8sWNSq");
console.log('EmailJS inicializado correctamente');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        console.log('Enviando formulario...');
        
        emailjs.sendForm('service_w15l48a', 'template_u110bgf', '#contactForm')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                console.error('Detalles del error:', error);
                showNotification('Hubo un error al enviar el mensaje. Intenta nuevamente.', 'error');
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'linear-gradient(135deg, #f5576c, #60A5FA)'};
        color: #FFFFFF;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

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
    
    .custom-cursor {
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        display: none;
    }
    
    .cursor-dot {
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #2563EB, #3B82F6);
        border-radius: 50%;
        position: fixed;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    }
    
    .cursor-outline {
        width: 30px;
        height: 30px;
        border: 2px solid #2563EB;
        border-radius: 50%;
        position: fixed;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, border-color 0.3s;
    }
    
    .custom-cursor.hover .cursor-dot {
        width: 50px;
        height: 50px;
        background: rgba(37, 99, 235, 0.3);
    }
    
    .custom-cursor.hover .cursor-outline {
        width: 50px;
        height: 50px;
        border-color: #3B82F6;
    }
    
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
    
    .service-card::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.1), transparent);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        z-index: -1;
    }
    
    .service-card:hover::after {
        width: 300px;
        height: 300px;
    }
    
    .browser-mockup {
        animation: float 4s ease-in-out infinite;
    }
    
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
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    
    requestAnimationFrame(animateCursor);
}

if (window.innerWidth > 768) {
    cursor.style.display = 'block';
    animateCursor();
}

const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, .timeline-item');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

function loadPortfolioVideos() {
    const videos = document.querySelectorAll('.portfolio-video');
    const isMobile = window.innerWidth <= 768;
    
    videos.forEach(video => {
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

window.addEventListener('load', loadPortfolioVideos);

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        loadPortfolioVideos();
    }, 250);
});

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

document.querySelectorAll('.portfolio-video').forEach(video => {
    videoObserver.observe(video);
});

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

document.addEventListener('DOMContentLoaded', () => {
    console.log('ðŸŽ¨ Goky.net - Iniciando...');
    
    document.body.classList.add('loaded');
    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId && targetId !== '#' && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ GSAP OK');
    
    /* ==============================================
       ANIMACIONES DE ENTRADA CREATIVAS - GSAP
       ============================================== */

    // --- Hero: entrada cinematica con stagger ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    heroTl
        .from('.hero-title', {
            opacity: 0,
            y: 80,
            rotateX: 15,
            skewX: -3,
            duration: 1.4,
            transformOrigin: 'left bottom'
        })
        .from('.hero-description', {
            opacity: 0,
            y: 50,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            duration: 1,
        }, '-=0.8')
        .from('.hero-buttons .btn', {
            opacity: 0,
            scale: 0.3,
            rotation: -10,
            stagger: 0.15,
            duration: 0.8,
            ease: 'back.out(2.5)'
        }, '-=0.5');
    
    // --- Section headers: flip 3D + glow al hacer scroll ---
    gsap.utils.toArray('.section-header').forEach((header) => {
        const icon = header.querySelector('.section-icon');
        const title = header.querySelector('.section-title');
        const desc = header.querySelector('.section-description');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 82%',
                toggleActions: 'play none none none'
            }
        });

        tl.from(header, {
            opacity: 0,
            y: 60,
            scale: 0.92,
            borderRadius: '60px',
            duration: 0.9,
            ease: 'power3.out'
        });

        if (icon) {
            tl.from(icon, {
                opacity: 0,
                scale: 0,
                rotation: -180,
                duration: 0.8,
                ease: 'back.out(2)'
            }, '-=0.5');
        }

        if (title) {
            tl.from(title, {
                opacity: 0,
                x: -40,
                skewX: -5,
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.4');
        }

        if (desc) {
            tl.from(desc, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
        }
    });
    
    // --- Service cards: cascade con efectos 3D variados ---
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        const effects = [
            { rotateY: -45, x: -100, scale: 0.7 },    // flip izquierda
            { rotateX: 45, y: 100, scale: 0.7 },       // flip arriba
            { rotateY: 45, x: 100, scale: 0.7 },       // flip derecha
            { rotateX: -45, y: -60, scale: 0.7 },      // flip abajo
            { rotation: -15, scale: 0.5, x: -80 },     // spin izquierda
            { rotation: 15, scale: 0.5, x: 80 }        // spin derecha
        ];
        const effect = effects[i % effects.length];
        
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            ...effect,
            duration: 1,
            delay: i * 0.12,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        });

        // Efecto de brillo en el borde al entrar
        gsap.fromTo(card, 
            { boxShadow: '0 0 0 rgba(37, 99, 235, 0)' },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                boxShadow: '0 0 40px rgba(37, 99, 235, 0.25), 0 0 80px rgba(59, 130, 246, 0.1)',
                duration: 0.5,
                delay: i * 0.12 + 0.8,
                ease: 'power2.out',
                onComplete: function() {
                    gsap.to(card, { boxShadow: 'none', duration: 1, delay: 0.5 });
                }
            }
        );
    });

    // --- Service icons: bounce spin individual ---
    gsap.utils.toArray('.service-icon').forEach((icon, i) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0,
            rotation: -360,
            duration: 0.8,
            delay: i * 0.12 + 0.3,
            ease: 'back.out(3)'
        });
    });

    // --- Service numbers: count-up effect via stagger ---
    gsap.utils.toArray('.service-number').forEach((num, i) => {
        gsap.from(num, {
            scrollTrigger: {
                trigger: num,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 3,
            y: -30,
            duration: 0.6,
            delay: i * 0.12 + 0.5,
            ease: 'power4.out'
        });
    });
    
    // --- Timeline items: wave alternada --- 
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const direction = i % 2 === 0 ? -120 : 120;
        const rotation = i % 2 === 0 ? -8 : 8;
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: direction,
            rotation: rotation,
            scale: 0.85,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        });
    });
    
    // --- Contact form: morph + stagger de campos ---
    const contactFormContainer = document.querySelector('.proposal-form-container');
    if (contactFormContainer) {
        gsap.from(contactFormContainer, {
            scrollTrigger: {
                trigger: contactFormContainer,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.8,
            borderRadius: '80px',
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.proposal-form .form-group', {
            scrollTrigger: {
                trigger: contactFormContainer,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            x: -20,
            stagger: 0.12,
            duration: 0.7,
            delay: 0.4,
            ease: 'back.out(1.5)'
        });

        gsap.from('.proposal-form .btn-primary', {
            scrollTrigger: {
                trigger: contactFormContainer,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0,
            rotation: -10,
            duration: 0.8,
            delay: 1,
            ease: 'elastic.out(1, 0.4)'
        });
    }

    // --- Explainer sections: feature cards cascade ---
    gsap.utils.toArray('.explainer-text').forEach((text) => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -60,
            duration: 0.9,
            ease: 'power3.out'
        });
    });

    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 60,
            y: 20,
            scale: 0.9,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'back.out(1.5)',
            immediateRender: false
        });
    });

    // --- Comparison cards ---
    gsap.utils.toArray('.comparison-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 80,
            scale: 0.85,
            duration: 0.9,
            delay: i * 0.2,
            ease: 'back.out(1.7)',
            immediateRender: false
        });
    });

    const vsEl = document.querySelector('.comparison-vs');
    if (vsEl) {
        gsap.from(vsEl, {
            scrollTrigger: {
                trigger: vsEl,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0,
            rotation: 360,
            duration: 0.8,
            delay: 0.3,
            ease: 'elastic.out(1, 0.4)'
        });
    }

    // --- Footer: reveal cinematográfico ---
    const footerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
    
    footerTl
        .from('.footer', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.footer-brand', {
            opacity: 0,
            x: -60,
            rotation: -5,
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.logo-footer', {
            opacity: 0,
            scale: 0,
            rotation: -180,
            duration: 0.8,
            ease: 'back.out(2)'
        }, '-=0.5')
        .from('.footer-column', {
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 0.6,
            ease: 'back.out(1.5)'
        }, '-=0.4')
        .from('.footer-bottom', {
            opacity: 0,
            scaleX: 0,
            transformOrigin: 'center',
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.2');

    // --- Parallax suave en secciones al hacer scroll ---
    gsap.utils.toArray('section').forEach((section) => {
        const bg = section.querySelector('.section-header');
        if (bg) {
            gsap.fromTo(bg, 
                { y: 30 }, 
                {
                    y: -30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                }
            );
        }
    });

    // --- WhatsApp float: entrada dramática ---
    gsap.from('.whatsapp-float', {
        opacity: 0,
        scale: 0,
        rotation: 720,
        y: 100,
        duration: 1.2,
        delay: 2,
        ease: 'elastic.out(1, 0.4)'
    });
    
    console.log('✅ Animaciones configuradas');
    console.log('📊 Elements:', {
        services: document.querySelectorAll('.service-card').length,
        portfolio: document.querySelectorAll('.portfolio-item').length,
        timeline: document.querySelectorAll('.timeline-item').length
    });
    
    const words = ['Descubrilo acá.', 'Tu web ideal.', 'Vende online.', 'Tu marca en la web.'];
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

(function() {
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

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    const portfolioItems = document.querySelectorAll('.portfolio-item:not(.portfolio-hidden)');
    
    portfolioItems.forEach((item, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        let animationProps = { 
            opacity: 0, 
            duration: 1.2, 
            ease: 'power4.out',
            clearProps: 'all'
        };
        
        // Animaciones variadas por columna
        if (column === 0) {
            animationProps.x = -200;
            animationProps.rotateY = -25;
            animationProps.scale = 0.8;
        } else if (column === 1) {
            animationProps.y = 150;
            animationProps.rotateX = 20;
            animationProps.scale = 0.7;
        } else {
            animationProps.x = 200;
            animationProps.rotateY = 25;
            animationProps.scale = 0.8;
        }
        
        // Delay escalonado por fila
        animationProps.delay = (index % 3) * 0.15;
        
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            ...animationProps
        });

        // Efecto de glow al entrar
        gsap.fromTo(item, 
            { boxShadow: '0 0 0 rgba(37, 99, 235, 0)' },
            {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                },
                boxShadow: '0 0 30px rgba(37, 99, 235, 0.3), 0 15px 35px rgba(0,0,0,0.2)',
                duration: 0.6,
                delay: (index % 3) * 0.15 + 0.8,
                ease: 'power2.out',
                onComplete: function() {
                    gsap.to(item, { 
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
                        duration: 1, 
                        delay: 0.3 
                    });
                }
            }
        );

        // Animación de la info del portfolio
        const info = item.querySelector('.portfolio-info');
        if (info) {
            gsap.from(info, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: (index % 3) * 0.15 + 0.5,
                ease: 'power3.out'
            });
        }
    });
}

const PORTFOLIO_LIMIT = 6;
let currentPortfolioFilter = 'all';
let portfolioExpanded = false;

function killGsap(item) {
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(item);
        gsap.set(item, { clearProps: 'all' });
    }
}

function applyPortfolioFilter(filter) {
    const items = Array.from(document.querySelectorAll('#portfolioGrid .portfolio-item[data-category]'));
    const verMasWrapper = document.getElementById('portfolioMoreWrapper');

    const matching    = items.filter(item => filter === 'all' || item.dataset.category === filter);
    const notMatching = items.filter(item => !(filter === 'all' || item.dataset.category === filter));
    const toShow = portfolioExpanded ? matching : matching.slice(0, PORTFOLIO_LIMIT);
    const toHide = notMatching.concat(portfolioExpanded ? [] : matching.slice(PORTFOLIO_LIMIT));

    // Ocultar items que no corresponden
    toHide.forEach(item => {
        killGsap(item);
        item.classList.remove('filter-show');
        item.classList.add('filter-hidden');
    });

    // Quitar clases de los items a mostrar (necesario para reiniciar la animación CSS)
    toShow.forEach(item => {
        killGsap(item);
        item.classList.remove('filter-show', 'filter-hidden');
    });

    // Forzar reflow una sola vez
    var grid = document.getElementById('portfolioGrid');
    if (grid) void grid.offsetHeight;

    // Agregar filter-show con delay escalonado
    toShow.forEach((item, i) => {
        item.style.animationDelay = (i * 0.04) + 's';
        item.classList.add('filter-show');
    });

    if (verMasWrapper) {
        verMasWrapper.style.display = (!portfolioExpanded && matching.length > PORTFOLIO_LIMIT) ? 'flex' : 'none';
    }
}

function initPortfolioLimit() {
    const items = Array.from(document.querySelectorAll('#portfolioGrid .portfolio-item[data-category]'));
    items.slice(PORTFOLIO_LIMIT).forEach(item => item.classList.add('filter-hidden'));

    const verMasWrapper = document.getElementById('portfolioMoreWrapper');
    if (verMasWrapper && items.length > PORTFOLIO_LIMIT) {
        verMasWrapper.style.display = 'flex';
    }
}

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Mover portfolio justo después del hero
    const heroSection = document.getElementById('inicio');
    const portfolioSection = document.getElementById('portafolio');
    if (heroSection && portfolioSection) {
        heroSection.after(portfolioSection);
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    // Ocultar ítems más allá del límite sin activar animaciones
    initPortfolioLimit();

    // Botón Ver más
    const verMasBtn = document.getElementById('portfolioVerMas');
    if (verMasBtn) {
        verMasBtn.addEventListener('click', () => {
            portfolioExpanded = true;
            applyPortfolioFilter(currentPortfolioFilter);
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPortfolioFilter = btn.dataset.filter;
            portfolioExpanded = false;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyPortfolioFilter(currentPortfolioFilter);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioFilter);
} else {
    initPortfolioFilter();
}

/* -- Boceto form: send via WhatsApp -- */
(function() {
    var bocetoForm = document.getElementById('boceto-form');
    if (bocetoForm) {
        bocetoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('boceto-name').value.trim();
            var business = document.getElementById('boceto-business').value.trim();

            
            var msg = 'Hola! Quiero mi mock-up gratis\n\n';
            msg += 'Nombre: ' + name + '\n';
            msg += 'Negocio: ' + business + '\n';
            
            window.open('https://wa.me/5491125068578?text=' + encodeURIComponent(msg), '_blank');
            bocetoForm.reset();
        });
    }
})();

/* -- GSAP animations for new sections -- */
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Process steps
    gsap.utils.toArray('.process-step').forEach(function(step, i) {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'back.out(1.7)'
        });
    });

    // Process connectors
    gsap.utils.toArray('.process-connector').forEach(function(conn, i) {
        gsap.from(conn, {
            scrollTrigger: {
                trigger: conn,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            scaleX: 0,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.15 + 0.3,
            ease: 'power2.out'
        });
    });

    // Boceto section
    var bocetoText = document.querySelector('.boceto-text');
    if (bocetoText) {
        gsap.from(bocetoText, {
            scrollTrigger: { trigger: '.boceto-section', start: 'top 80%', toggleActions: 'play none none none' },
            opacity: 0, x: -60, duration: 0.9, ease: 'power3.out'
        });
    }

    var bocetoFormEl = document.querySelector('.boceto-form-wrapper');
    if (bocetoFormEl) {
        gsap.from(bocetoFormEl, {
            scrollTrigger: { trigger: '.boceto-section', start: 'top 80%', toggleActions: 'play none none none' },
            opacity: 0, x: 60, scale: 0.95, duration: 0.9, delay: 0.2, ease: 'power3.out'
        });
    }

    // Result cards
    gsap.utils.toArray('.result-card').forEach(function(card, i) {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
            opacity: 0, y: 50, scale: 0.85, rotation: i % 2 === 0 ? -5 : 5,
            duration: 0.8, delay: i * 0.12, ease: 'back.out(1.7)'
        });
    });

    // Boceto float entrance
    gsap.from('.boceto-float', {
        opacity: 0, scale: 0, x: -100,
        duration: 1, delay: 2.5, ease: 'elastic.out(1, 0.4)'
    });
});

/* ═══════════════════════════════════════════════
   NEW PORTFOLIO — Category Carousels + Demo Modal
   ═══════════════════════════════════════════════ */

const PORTFOLIO_DEMOS = {
    comercios: [
        // Tiendas y bazares
        { id: 'BlanqueriaBazar', name: 'Blanquería Bazar' },
        { id: 'PapeleraTriunfo', name: 'Papelera Triunfo', url: 'https://papelera-triunfo.vercel.app' },
        { id: 'HemaImportados', name: 'Hema Importados', url: 'https://hema-importados.vercel.app' },
        { id: 'VidrieraLeoRocha', name: 'Vidriera Leo Rocha', url: 'https://vidriera-leo-rocha.vercel.app' },
        { id: 'SerBotanica', name: 'Ser Botánica', url: 'https://ser-botanica.vercel.app' },
        { id: 'TiendaAzurduy', name: 'Tienda Azurduy', url: 'https://tienda-azurduy.vercel.app' },
        { id: 'MiauMiau', name: 'Miau Miau Pet' },
        // Hogar, muebles, construcción
        { id: 'DormiLupe', name: 'Dormi Lupe', url: 'https://dormi-lupe.vercel.app' },
        { id: 'VerticeHogar', name: 'Vértice Hogar', url: 'https://verticehogar.vercel.app' },
        { id: 'ZepolMuebles', name: 'Zepol Muebles', url: 'https://zepol.vercel.app' },
        { id: 'ArteMetalico', name: 'Arte Metálico' },
        { id: 'mylomuebles', name: 'Mylo Muebles', url: 'https://mylo-muebles.vercel.app' },
        // Belleza / estética (tiendas)
        { id: 'Cuarzoestetica', name: 'Cuarzo Estética', url: 'https://cuarzoestetica.vercel.app' },
        { id: 'EsteticaCursos', name: 'Estética Cursos', url: 'https://estetica-cursos.vercel.app' },
        // Automotriz
        { id: 'FrenosdeDisco', name: 'Frenos de Disco', url: 'https://frenosde-disco.vercel.app' },
        { id: 'Autofull', name: 'Autofull', url: 'https://autofullneumaticos.com.ar' },
        { id: 'RepuestosAutos', name: 'Repuestos Autos', url: 'https://autopartes-del-este.vercel.app' },
        // Hogar
        { id: 'HogarVerde', name: 'Hogar Verde' },
        // Limpieza
        { id: 'ValenClean', name: 'Valen Clean', url: 'https://valenclean.vercel.app' },
        // Deporte / actividades
        { id: 'PeakLifters', name: 'Peak Lifters', url: 'https://peak-lifters.vercel.app' },
        { id: 'Airsoft', name: 'Airsoft', url: 'https://airgrip.vercel.app' },
        { id: 'CeroDescensos', name: 'Cero Descensos', url: 'https://cero-descensos.vercel.app' },
        { id: 'Padel', name: 'Pádel Club', url: 'https://padel-ps.vercel.app' },
        { id: 'VoleyClub', name: 'Vóley Club', url: 'https://vivodeportes.vercel.app' },
        // Cultura
        { id: 'Libros', name: 'Librería' }
    ],
    profesionales: [
        // Salud / consultorios
        { id: 'PiscoPsi', name: 'Pisco Psicología', url: 'https://psico-psi.vercel.app' },
        { id: 'AlderPsicologia', name: 'Alder Psicología', url: 'https://www.psicorodas.com.ar/' },
        { id: 'DrTauil', name: 'Dr. Tauil' },
        { id: 'Skymed', name: 'SkyMed', url: 'https://www.skymedconsultorios.com/' },
        { id: 'SolucionHonorariosMedicos', name: 'Honorarios Médicos', ext: 'png' },
        { id: 'Mecanico', name: 'Mecánico', url: 'https://rivasrys.com.ar' },
        { id: 'Ambulancias', name: 'Ambulancias 24hs', url: 'https://urgencias24hs.com.ar' },
        { id: 'AHCD', name: 'AHCD', url: 'https://ahcd.org.ar/' },
        // Belleza / spa / fitness (servicios)
        { id: 'Barberia', name: 'Barbería' },
        { id: 'Lessence', name: "L'essence Estética", url: 'https://lessence.vercel.app' },
        { id: 'Estetica', name: 'Estética', url: 'https://encantoestetica.com.ar' },
        { id: 'DanzaPole', name: 'Danza Pole' },
        // Legales / consultoría / publicidad
        { id: 'EstudioJuridico', name: 'Estudio Jurídico', url: 'https://mtgestoriaintegral.com.ar' },
        { id: 'RamagliaEstudioJuridico', name: 'Ramaglia Estudio Jurídico' },
        { id: 'ServiciosMigratorios', name: 'Servicios Migratorios' },
        { id: 'GrupoAcot', name: 'Grupo Acot', url: 'https://grupoacot.com/' },
        { id: 'AdrianaTraductoraProfesora', name: 'Adriana Traductora', url: 'https://adriana-traductora.vercel.app' },
        { id: 'Consultora', name: 'Consultora', url: 'https://pgmsconsultora.com.ar' },
        { id: 'InfinityTrading', name: 'Infinity Trading', url: 'https://infinitytrader.com.ar' },
        { id: 'MFCGroup', name: 'MFC Group Publicidad', url: 'https://mf-cgroup.vercel.app' },
        { id: 'Brandaurea', name: 'Brandaurea', url: 'https://amp-solutions.vercel.app' },
        { id: 'DespachanteDos', name: 'Despachante de Aduana', url: 'https://despachante.vercel.app' },
        { id: 'SeguroClick', name: 'Seguro Click', url: 'https://seguro-click.vercel.app' },
        { id: 'SeguridadPrivada', name: 'Seguridad Privada', url: 'https://indumentaria-policial.vercel.app' },
        { id: 'Axiotek', name: 'Axiotek', url: 'https://axiotek.vercel.app' },
        { id: 'Tuproductoronline', name: 'Tu Productor Online', url: 'https://tuproductoronline.vercel.app' },
        { id: 'Estudiorrpp', name: 'Estudio RRPP', url: 'https://estudiorrpp.vercel.app' },
        // Educación / artes
        { id: 'LenguasAdicionales', name: 'Lenguas Adicionales', url: 'https://lenguasadicionales.com.ar' },
        { id: 'ProfeArtes', name: 'Profe Artes', url: 'https://catalinasolaridorda.com.ar' },
        { id: 'ArtesMarciales', name: 'Artes Marciales' },
        // Construcción / oficios
        { id: 'JavierConstrucciones', name: 'Javier Construcciones', url: 'https://javier-construcciones.vercel.app' },
        { id: 'MantenimientoObras', name: 'Mantenimiento de Obras' },
        { id: 'Pintura', name: 'Pintura' },
        { id: 'DiegoTechista', name: 'Diego Techista', url: 'https://techos-zingueria.vercel.app' },
        // Turismo / esoterismo / cultura
        { id: 'Patagonianativa', name: 'Patagonia Nativa', url: 'https://patagonianativa.vercel.app' },
        { id: 'ConcienciaTriskel', name: 'Conciencia Triskel', url: 'https://conciencia-triskel.vercel.app' },
        { id: 'Musica', name: 'Academia de Música' },
        { id: 'MarTarot', name: 'Mar Tarot', url: 'https://tarot-mar.vercel.app' },
        { id: 'Tarot', name: 'Tarot' },
        // Servicios técnicos
        { id: 'Servicioelectro', name: 'Servicio Electro' },
        { id: 'ServiceRefrigeracion', name: 'SMRTEC', url: 'https://smrtec.vercel.app/' },
        { id: 'ClubCarGarage', name: 'Club Car Garage', url: 'https://club-car-garage.vercel.app' },
        { id: 'HidroArca', name: 'Hidro Arca', url: 'https://hidro-arca.vercel.app' },
        { id: 'DeltaPampaFumigaciones', name: 'Delta Pampa Fumigaciones', url: 'https://delta-pampa-fumigaciones.vercel.app' },
        // Comercios reasignados (productos especializados)
        { id: 'Gione15', name: 'Gione 15', url: 'https://gione.vercel.app' }
    ],
    moda: [
        { id: 'SimonataStore', name: 'Simonata Store', url: 'https://simonata.vercel.app' },
        { id: 'Distinta', name: 'Distinta', url: 'https://distinta.vercel.app' },
        { id: 'Dominus', name: 'Dominus Jeans', url: 'https://dominus-chi.vercel.app' },
        { id: 'RopaBears', name: 'Ropa Bears' },
        { id: 'Damassco', name: 'Damassco' },
        { id: 'MaceIntimates', name: 'Mace Intimates' },
        { id: 'Mima', name: 'Mima' },
        { id: 'RopaMirame', name: 'Ropa Mírame' }
    ],
    gastronomia: [
        { id: 'Dulces', name: 'Dulces', ext: 'png' },
        { id: 'NiftyBar', name: 'Nifty Bar', url: 'https://nifty-bar.vercel.app' },
        { id: 'RestoVinoteca', name: 'Resto Vinoteca', url: 'https://resto-vinoteca.vercel.app' },
        { id: 'RossiCakes', name: 'Rossi Cakes' },
        { id: 'Milanesas', name: 'Milanesas' }
    ],
    tecnologia: [
        { id: 'TvDigital', name: 'TV Digital' },
        { id: 'VelariumCelulares', name: 'Velarium Celulares', url: 'https://velarium-celulares.vercel.app' },
        { id: 'ServiceNotebooks', name: 'Service Notebooks', url: 'https://smrtec.vercel.app' },
        { id: 'NexumCelulares', name: 'Nexum Celulares', url: 'https://nexum-celulares.vercel.app' },
        { id: 'ImpresionesJN', name: 'Impresiones JN', url: 'https://impresiones-jn.vercel.app' },
        { id: 'GraficayPloteo', name: 'Gráfica y Ploteo', url: 'https://mattigraff.com.ar' }
    ],
    inmobiliaria: [
        { id: 'NoemiWichandInmo', name: 'Noemi Wichand', url: 'https://noemi-wichand.vercel.app' },
        { id: 'Tasador', name: 'Tasador' },
        { id: 'InmobiliariaForte', name: 'Inmobiliaria Forte', url: 'https://forte-propiedades.vercel.app' },
        { id: 'PalmarInmuebles', name: 'Palmar Inmuebles', url: 'https://palmar-inmuebles.vercel.app' }
    ]
};

function createDemoCard(demo) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'pf-card is-demo';
    card.setAttribute('data-demo-id', demo.id);
    card.setAttribute('data-demo-name', demo.name);
    card.setAttribute('data-demo-ext', demo.ext || 'jpg');
    card.setAttribute('data-demo-url', demo.url || '');
    card.innerHTML = `
        
        <div class="pf-visuals">
            <div class="pf-web"><img src="images/${demo.id.toLowerCase()}_web.${demo.ext||'jpg'}" alt="${demo.name} Web" loading="lazy"></div>
            <div class="pf-celu"><div class="pf-phone"><img src="images/${demo.id.toLowerCase()}_celu.${demo.ext||'jpg'}" alt="${demo.name} Mobile" loading="lazy"></div></div>
        </div>
        <div class="pf-info">
            <h4>${demo.name}</h4>
            <span class="pf-cta">${demo.url ? 'Ver sitio' : 'Ver demo'} <span class="pf-arr">→</span></span>
        </div>
    `;
    return card;
}

function injectDemoCards() {
    Object.entries(PORTFOLIO_DEMOS).forEach(([cat, demos]) => {
        const section = document.querySelector(`.pf-section[data-cat="${cat}"]`);
        if (!section) return;
        const track = section.querySelector('.pf-track');
        if (!track) return;
        demos.forEach(demo => track.appendChild(createDemoCard(demo)));
    });
}

function initPortfolioCarousels() {
    document.querySelectorAll('.pf-section').forEach(section => {
        if (section.dataset.rows === '2') return; // las marquee se manejan aparte
        const track = section.querySelector('.pf-track');
        const prevBtn = section.querySelector('.pf-prev');
        const nextBtn = section.querySelector('.pf-next');
        if (!track || !prevBtn || !nextBtn) return;

        const scrollByAmount = () => {
            const firstCard = track.querySelector('.pf-card');
            if (!firstCard) return 300;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).gap) || 16;
            return cardWidth + gap;
        };

        const updateArrows = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            prevBtn.disabled = track.scrollLeft <= 1;
            nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
        };

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
        });
        track.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);

        // Drag-to-scroll con mouse (igual que swipe en mobile)
        let isDown = false;
        let startX = 0;
        let startScroll = 0;
        let moved = 0;

        let onMouseMove = null;
        let onMouseUp = null;

        track.addEventListener('mousedown', (e) => {
            // Solo botón izquierdo, ignorar si fue sobre un link/botón interactivo dentro de una card
            if (e.button !== 0) return;
            isDown = true;
            moved = 0;
            startX = e.pageX;
            startScroll = track.scrollLeft;
            // No añadir is-dragging todavía: se añade solo tras movimiento real

            onMouseMove = (ev) => {
                if (!isDown) return;
                ev.preventDefault();
                const dx = ev.pageX - startX;
                moved = Math.abs(dx);
                if (moved > 8) track.classList.add('is-dragging');
                track.scrollLeft = startScroll - dx;
            };
            onMouseUp = () => {
                if (!isDown) return;
                isDown = false;
                track.classList.remove('is-dragging');
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
                onMouseMove = null;
                onMouseUp = null;
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });

        // Touch / swipe para mobile
        // Usamos la posición del dedo (NO scrollLeft) para distinguir tap vs swipe.
        // scrollLeft no es confiable porque el scroll inercial de iOS sigue cambiándolo
        // después de que el usuario levanta el dedo, lo que haría que un tap rápido
        // tras un swipe quede bloqueado incorrectamente.
        let touchStartX = 0;
        let touchStartY = 0;
        let touchMoved = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchMoved = 0;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const t = e.changedTouches[0];
            // Solo movimiento HORIZONTAL cuenta como swipe en un carrusel horizontal.
            // Math.max(dx, dy) incluía movimiento vertical (normal en cualquier tap),
            // lo que bloqueaba los clicks aunque el usuario NO estuviera haciendo swipe.
            touchMoved = Math.abs(t.clientX - touchStartX);
            updateArrows();
        }, { passive: true });

        // Cancelar el click siguiente solo si hubo swipe horizontal significativo.
        // En mobile el browser ya suprime clicks después de swipes reales,
        // así que touchMoved solo necesita cubrir el caso de movimiento horizontal
        // deliberado (no el temblor vertical natural de cualquier tap).
        track.addEventListener('click', (e) => {
            if (moved > 8 || touchMoved > 15) {
                e.preventDefault();
                e.stopPropagation();
                moved = 0;
                touchMoved = 0;
            }
        }, true);

        // Hide section if track is empty
        if (!track.children.length) {
            section.classList.add('is-hidden');
        }

        setTimeout(updateArrows, 100);
    });
}

function pfLoadSectionImages(section) {
    section.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
}

function initPfLazyImages() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.pf-section').forEach(pfLoadSectionImages);
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pfLoadSectionImages(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px 0px', threshold: 0 });
    document.querySelectorAll('.pf-section').forEach(section => observer.observe(section));
}

function initPortfolioCatFilter() {
    const cats = document.querySelectorAll('.pf-cat');
    const sections = document.querySelectorAll('.pf-section');
    cats.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.cat;
            cats.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sections.forEach(sec => {
                const hasItems = sec.querySelector('.pf-track')?.children.length > 0;
                const match = (target === 'all' || sec.dataset.cat === target) && hasItems;
                if (match) {
                    sec.classList.remove('is-hidden');
                    sec.style.display = '';
                    pfLoadSectionImages(sec);
                } else {
                    sec.style.display = 'none';
                }
            });
            window.dispatchEvent(new Event('resize'));
        });
    });
}

function initDemoModal() {
    const modal = document.getElementById('demoModal');
    if (!modal) return;
    const titleEl = document.getElementById('demoModalTitle');
    const imgWeb = document.getElementById('demoModalImgWeb');
    const imgCelu = document.getElementById('demoModalImgCelu');
    const visitBtn = document.getElementById('demoModalVisit');

    const open = (id, name, ext = 'jpg', url = '') => {
        titleEl.textContent = name;
        imgWeb.src = `images/${id.toLowerCase()}_web.${ext}`;
        imgWeb.alt = `${name} - Vista Web`;
        imgCelu.src = `images/${id.toLowerCase()}_celu.${ext}`;
        imgCelu.alt = `${name} - Vista Mobile`;
        if (visitBtn) {
            if (url) {
                visitBtn.href = url;
                visitBtn.style.display = '';
            } else {
                visitBtn.style.display = 'none';
            }
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modal.querySelectorAll('.demo-modal-pane').forEach(p => p.scrollTop = 0);
    };

    const close = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    document.addEventListener('click', (e) => {
        const demoCard = e.target.closest('.pf-card.is-demo');
        const clientCard = e.target.closest('.pf-card.is-client');
        if (demoCard) {
            e.preventDefault();
            open(demoCard.dataset.demoId, demoCard.dataset.demoName, demoCard.dataset.demoExt || 'jpg', demoCard.dataset.demoUrl || '');
        } else if (clientCard) {
            e.preventDefault();
            open(clientCard.dataset.imgId, clientCard.dataset.name, clientCard.dataset.imgExt || 'jpg', clientCard.dataset.url || '');
        }
    });

    modal.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
}

/* ─── Double-row Marquee Carousel ─── */
function initMarqueeSection(section) {
    const wrap = section.querySelector('.pf-track-wrap');
    const singleTrack = section.querySelector('.pf-track');
    if (!wrap || !singleTrack) return;

    const cards = Array.from(singleTrack.children);
    if (cards.length === 0) {
        section.classList.add('is-hidden');
        return;
    }

    // Reconstruir el wrap con dos tracks (top y bottom)
    wrap.innerHTML = '';
    const topTrack = document.createElement('div');
    topTrack.className = 'pf-track pf-track-marquee';
    topTrack.dataset.row = 'top';
    const botTrack = document.createElement('div');
    botTrack.className = 'pf-track pf-track-marquee';
    botTrack.dataset.row = 'bottom';
    wrap.appendChild(topTrack);
    wrap.appendChild(botTrack);

    // Distribuir alternadamente
    cards.forEach((card, i) => {
        (i % 2 === 0 ? topTrack : botTrack).appendChild(card);
    });

    // Duplicar contenido para loop infinito sin saltos
    [topTrack, botTrack].forEach(t => {
        const originals = Array.from(t.children);
        originals.forEach(c => t.appendChild(c.cloneNode(true)));
    });

    // Estado por fila
    const rows = [
        { el: topTrack, dir: -1, x: 0, dragging: false, half: 0 }, // top: derecha → izquierda
        { el: botTrack, dir: +1, x: 0, dragging: false, half: 0 }  // bottom: izquierda → derecha
    ];

    const measure = () => {
        rows.forEach(r => {
            r.half = r.el.scrollWidth / 2;
        });
        // El track bottom arranca con offset para que el contenido se vea desplazado
        if (rows[1].x === 0) rows[1].x = -rows[1].half / 2;
    };
    measure();
    window.addEventListener('resize', measure);

    const apply = (r) => {
        // Wrap continuo
        if (r.half > 0) {
            while (r.x <= -r.half) r.x += r.half;
            while (r.x > 0) r.x -= r.half;
        }
        r.el.style.transform = `translate3d(${r.x}px, 0, 0)`;
    };

    const speed = 0.4; // px por frame (~24px/s a 60fps)
    let rafId = null;
    const tick = () => {
        rows.forEach(r => {
            if (!r.dragging) r.x += r.dir * speed;
            apply(r);
        });
        rafId = requestAnimationFrame(tick);
    };
    rows.forEach(apply);
    rafId = requestAnimationFrame(tick);

    // Drag con sync inverso entre filas
    rows.forEach((row, idx) => {
        const other = rows[1 - idx];
        let startPageX = 0, startRowX = 0, startOtherX = 0, moved = 0, isDown = false;
        let onMove = null, onUp = null;

        const begin = (pageX) => {
            isDown = true;
            moved = 0;
            startPageX = pageX;
            startRowX = row.x;
            startOtherX = other.x;
            row.dragging = true;
            other.dragging = true;
            // No añadir is-dragging todavía: se añade solo tras movimiento real
        };
        const move = (pageX) => {
            if (!isDown) return;
            const dx = pageX - startPageX;
            moved = Math.abs(dx);
            if (moved > 8) {
                row.el.classList.add('is-dragging');
                other.el.classList.add('is-dragging');
            }
            row.x = startRowX + dx;
            other.x = startOtherX - dx;
            apply(row); apply(other);
        };
        const end = () => {
            if (!isDown) return;
            isDown = false;
            row.dragging = false;
            other.dragging = false;
            row.el.classList.remove('is-dragging');
            other.el.classList.remove('is-dragging');
            if (onMove) window.removeEventListener('mousemove', onMove);
            if (onUp) window.removeEventListener('mouseup', onUp);
            onMove = null; onUp = null;
        };

        row.el.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            begin(e.pageX);
            onMove = (ev) => move(ev.pageX);
            onUp = () => end();
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        });
        row.el.addEventListener('touchstart', (e) => begin(e.touches[0].pageX), { passive: true });
        row.el.addEventListener('touchmove', (e) => move(e.touches[0].pageX), { passive: true });
        row.el.addEventListener('touchend', end);
        row.el.addEventListener('touchcancel', end);

        // Cancelar click solo si hubo drag REAL (moved > 8 al final del drag)
        row.el.addEventListener('click', (e) => {
            if (moved > 8) {
                e.preventDefault();
                e.stopPropagation();
                moved = 0;
            }
        }, true);
    });
}

function initMarqueeCarousels() {
    document.querySelectorAll('.pf-section[data-rows="2"]').forEach(initMarqueeSection);
}

function initNewPortfolio() {
    injectDemoCards();
    initMarqueeCarousels();
    initPortfolioCarousels();
    initPortfolioCatFilter();
    initDemoModal();
    initPfLazyImages();

    // Evitar que el navegador "agarre" imágenes con drag nativo al hacer click sostenido
    const pfCats = document.getElementById('pfCategories');
    if (pfCats) {
        pfCats.addEventListener('dragstart', e => e.preventDefault());
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewPortfolio);
} else {
    initNewPortfolio();
}
