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
        background: radial-gradient(circle, rgba(43, 95, 165, 0.1), transparent);
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
    console.log('🎨 Goky.net - Iniciando...');
    
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
    
    /* ══════════════════════════════════════════════
       ANIMACIONES DE ENTRADA CREATIVAS - GSAP
       ══════════════════════════════════════════════ */

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
            { boxShadow: '0 0 0 rgba(91, 143, 216, 0)' },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                boxShadow: '0 0 40px rgba(91, 143, 216, 0.25), 0 0 80px rgba(107, 76, 154, 0.1)',
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

    // --- Pricing cards: 3D tilt cascade ---
    gsap.utils.toArray('.pricing-card').forEach((card, i) => {
        gsap.set(card, { opacity: 1, clearProps: 'transform' });

        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 120,
            rotateX: 25,
            scale: 0.85,
            transformOrigin: 'center bottom',
            duration: 1,
            delay: i * 0.2,
            ease: 'back.out(1.5)',
            immediateRender: false
        });

        // Header del card
        const header = card.querySelector('.card-header');
        if (header) {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: -20,
                duration: 0.4,
                delay: i * 0.2 + 0.7,
                ease: 'power2.out',
                immediateRender: false
            });
        }

        // Features stagger
        const features = card.querySelectorAll('.card-features li');
        if (features.length) {
            gsap.from(features, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: -30,
                stagger: 0.08,
                duration: 0.4,
                delay: i * 0.2 + 0.8,
                ease: 'power2.out',
                immediateRender: false
            });
        }

        // Precio animación especial
        const priceEl = card.querySelector('.price');
        if (priceEl) {
            gsap.from(priceEl, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0.5,
                duration: 0.5,
                delay: i * 0.2 + 0.5,
                ease: 'back.out(3)',
                immediateRender: false
            });
        }

        // CTA button
        const cta = card.querySelector('.btn-card-cta');
        if (cta) {
            gsap.from(cta, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 20,
                scale: 0.8,
                duration: 0.5,
                delay: i * 0.2 + 0.9,
                ease: 'back.out(2)',
                immediateRender: false
            });
        }
    });

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

    // --- Addon checks: micro-animación de aparición ---
    gsap.utils.toArray('.addon-check').forEach((addon, i) => {
        gsap.from(addon, {
            scrollTrigger: {
                trigger: addon,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 30,
            scale: 0.9,
            duration: 0.4,
            delay: i * 0.05,
            ease: 'power2.out'
        });
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
    
    const words = ['Web Page', 'E-commerce', 'Landing Pages'];
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
            { boxShadow: '0 0 0 rgba(91, 143, 216, 0)' },
            {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                },
                boxShadow: '0 0 30px rgba(91, 143, 216, 0.3), 0 15px 35px rgba(0,0,0,0.2)',
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

function togglePortfolio() {
    const grid = document.getElementById('portfolioGrid');
    const btn = document.getElementById('portfolioToggle');
    const isExpanded = grid.classList.contains('show-all');
    const isEnglish = window.location.pathname.includes('/en/');
    const portfolioSection = document.getElementById('portafolio') || document.getElementById('portfolio');
    
    if (isExpanded) {
        grid.classList.remove('show-all');
        btn.querySelector('span').textContent = isEnglish ? 'See more projects' : 'Ver más proyectos';
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        grid.classList.add('show-all');
        btn.querySelector('span').textContent = isEnglish ? 'See less' : 'Ver menos';
        
        if (typeof gsap !== 'undefined') {
            const hiddenItems = document.querySelectorAll('.portfolio-hidden');
            hiddenItems.forEach((item, index) => {
                const column = index % 3;
                let animProps = { opacity: 0, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'all' };
                
                if (column === 0) {
                    animProps.x = -100;
                    animProps.rotateY = -15;
                } else if (column === 1) {
                    animProps.y = 80;
                    animProps.scale = 0.8;
                } else {
                    animProps.x = 100;
                    animProps.rotateY = 15;
                }
                
                gsap.from(item, {
                    ...animProps,
                    delay: index * 0.1
                });
            });
        }
    }
}

/* ── Pricing Card Add-ons: dynamic price + WhatsApp message ── */
(function() {
    const isEnglish = window.location.pathname.includes('/en/');

    function formatPrice(value) {
        if (isEnglish) {
            return '$' + value.toLocaleString('en-US');
        }
        return '$' + value.toLocaleString('es-AR');
    }

    document.querySelectorAll('.pricing-card').forEach(card => {
        const basePrice = parseInt(card.dataset.basePrice, 10);
        const priceEl = card.querySelector('.price');
        const ctaLink = card.querySelector('.btn-card-cta');
        const planName = card.querySelector('.card-header h3').textContent.trim();
        const originalHref = ctaLink.getAttribute('href');

        card.querySelectorAll('.addon-check input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => {
                const label = cb.closest('.addon-check');
                label.classList.toggle('selected', cb.checked);
                updateCard(card, basePrice, priceEl, ctaLink, planName);
            });
        });
    });

    function updateCard(card, basePrice, priceEl, ctaLink, planName) {
        let total = basePrice;
        const selectedAddons = [];

        card.querySelectorAll('.addon-check input[type="checkbox"]:checked').forEach(cb => {
            const addonPrice = parseInt(cb.closest('.addon-check').dataset.addonPrice, 10);
            total += addonPrice;
            selectedAddons.push(cb.dataset.addonName);
        });

        priceEl.textContent = formatPrice(total);

        let msg;
        if (isEnglish) {
            msg = `Hi, I'm interested in the ${planName} plan`;
            if (selectedAddons.length > 0) {
                msg += ` with: ${selectedAddons.join(', ')}`;
            }
            msg += `. Total: ${formatPrice(total)}`;
        } else {
            msg = `Hola, me interesa el plan ${planName}`;
            if (selectedAddons.length > 0) {
                msg += ` con: ${selectedAddons.join(', ')}`;
            }
            msg += `. Total: ${formatPrice(total)}`;
        }

        ctaLink.href = `https://wa.me/541140688675?text=${encodeURIComponent(msg)}`;
    }
})();

