const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');

        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll(`
    .intro-text,
    .split-image,
    .split-inner,
    .text-center-content,
    .value-item,
    .activity-card,
    .full-image-wrapper
`);

animatedElements.forEach(el => {
    observer.observe(el);
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    const fullImageWrappers = document.querySelectorAll('.full-image-wrapper');
    fullImageWrappers.forEach(wrapper => {
        const section = wrapper.closest('.full-image-section');
        const rect = section.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const scrolled = window.pageYOffset;
            const sectionTop = section.offsetTop;
            const offset = scrolled - sectionTop;
            const parallaxSpeed = 0.3;

            wrapper.style.transform = `translate3d(0, ${offset * parallaxSpeed}px, 0)`;
        }
    });

    const parallaxElements = document.querySelectorAll('.img-parallax');
    parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const parallax = (rect.top + scrolled) * 0.3;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transform = `translateY(${parallax - scrolled * 0.3}px)`;
        }
    });
});

const sections = document.querySelectorAll('section[id]');

function activeSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-link[href*=' + sectionId + ']')?.classList.add('active-link');
        } else {
            document.querySelector('.nav-link[href*=' + sectionId + ']')?.classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', activeSection);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const cards = document.querySelectorAll('.feature-card, .valor-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

const createGlowCursor = () => {
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
};

const style = document.createElement('style');
style.textContent = `
    .cursor-glow {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(244, 208, 63, 0.4) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
    }
    
    .active-link {
        color: var(--color-gold) !important;
    }
    
    .active-link::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

console.log('%c Patagonia Nativa', 'color: #f4d03f; font-size: 24px; font-weight: bold;');
console.log('%cFibra sustentable, futuro responsable', 'color: #0f2235; font-size: 14px;');
