
// ===========================
// Sistema de Rutas (Routing) para URLs limpias
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Mapa de configuración: ID de sección -> Ruta URL
    const routeMap = {
        'inicio': '/',
        'propuesta': '/contacto',
        'portafolio': '/portafolio',
        'servicios': '/servicios'
    };

    // Función auxiliar para obtener ID desde ruta
    const getSectionIdFromPath = (path) => {
        // Manejar raíz
        if (path === '/' || path === '') return 'inicio';
        // Buscar ruta exacta
        const entry = Object.entries(routeMap).find(([id, route]) => route === path);
        return entry ? entry[0] : null;
    };

    // 1. Actualizar URL al hacer click en navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // No prevenimos default aquí para dejar que otros scripts (Lenis) manejen el scroll
            // Solo actualizamos la URL
            const href = link.getAttribute('href');
            if (href && href.length > 1) {
                const targetId = href.substring(1);
                if (routeMap[targetId]) {
                    history.pushState({ sectionId: targetId }, '', routeMap[targetId]);
                }
            }
        });
    });

    // 2. Actualizar URL al hacer scroll (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '-45% 0px -45% 0px', // Detectar centro de pantalla
        threshold: 0
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const newPath = routeMap[sectionId];
                
                // Solo actualizar si hay una ruta definida y es diferente a la actual
                if (newPath && window.location.pathname !== newPath) {
                    history.replaceState({ sectionId }, '', newPath);
                }
            }
        });
    }, observerOptions);

    // Observar todas las secciones definidas en el mapa
    Object.keys(routeMap).forEach(id => {
        const section = document.getElementById(id);
        if (section) scrollObserver.observe(section);
    });

    // 3. Manejar carga inicial (Deep Linking)
    const handleInitialRoute = () => {
        const path = window.location.pathname;
        const sectionId = getSectionIdFromPath(path);
        
        if (sectionId && sectionId !== 'inicio') {
            const section = document.getElementById(sectionId);
            if (section) {
                // Esperar un momento a que Lenis se inicialice
                setTimeout(() => {
                    if (window.lenis) {
                        window.lenis.scrollTo(section, { immediate: true });
                    } else {
                        section.scrollIntoView();
                    }
                }, 500);
            }
        }
    };

    // Ejecutar al cargar
    handleInitialRoute();

    // 4. Manejar navegación del navegador (Atrás/Adelante)
    window.addEventListener('popstate', (event) => {
        const sectionId = event.state?.sectionId || getSectionIdFromPath(window.location.pathname);
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                if (window.lenis) {
                    window.lenis.scrollTo(section);
                } else {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
});
