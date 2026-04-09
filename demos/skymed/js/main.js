document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationClass = entry.target.dataset.animation;
                if (animationClass) {
                    entry.target.classList.add(animationClass);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animations to hero elements
    const heroHeading = document.querySelector('.hero-heading');
    const heroText = document.querySelector('.hero-text');
    const heroCtas = document.querySelector('.hero-ctas');
    const specialtiesCard = document.querySelector('.specialties-card');

    setTimeout(() => {
        if (heroHeading) heroHeading.classList.add('hero-fade-up');
    }, 300);
    
    setTimeout(() => {
        if (heroText) heroText.classList.add('hero-reveal');
    }, 600);
    
    setTimeout(() => {
        if (heroCtas) heroCtas.classList.add('hero-fade-up');
    }, 1000);
    
    setTimeout(() => {
        if (specialtiesCard) specialtiesCard.classList.add('hero-scale-fade');
    }, 500);

    // Add animations to specialty items
    const specItemsForAnimation = document.querySelectorAll('.spec-item');
    specItemsForAnimation.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('scale-in');
        }, 1000 + (index * 60));
    });

    // Add animations to info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card) => {
        card.dataset.animation = 'bounce-in';
        observer.observe(card);
    });

    // Add animations to checkup cards
    const checkupCards = document.querySelectorAll('.checkup-card');
    checkupCards.forEach((card) => {
        card.dataset.animation = 'scale-in';
        observer.observe(card);
    });

    // Add animations to insurance logos
    const insuranceLogos = document.querySelectorAll('.insurance-logo');
    insuranceLogos.forEach((logo) => {
        logo.dataset.animation = 'fade-in';
        observer.observe(logo);
    });

    // Add animations to footer sections
    const footerLeft = document.querySelector('.footer-left');
    const footerRight = document.querySelector('.footer-right');
    if (footerLeft) {
        footerLeft.dataset.animation = 'slide-in-left';
        observer.observe(footerLeft);
    }
    if (footerRight) {
        footerRight.dataset.animation = 'slide-in-right';
        observer.observe(footerRight);
    }

    // Add animations to about section
    const aboutImage = document.querySelector('.about-image');
    const aboutContent = document.querySelector('.about-content');
    if (aboutImage) {
        aboutImage.dataset.animation = 'slide-in-left';
        observer.observe(aboutImage);
    }
    if (aboutContent) {
        aboutContent.dataset.animation = 'slide-in-right';
        observer.observe(aboutContent);
    }

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navActions.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navActions.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Add scroll effect to navbar
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        }
        
        lastScroll = currentScroll;
    });

    // ===== POPUP SYSTEM =====
    const TURNO_URL = 'https://blipdoc.com/portal/skymedconsultorios';

    // Estudios info (for popup when clicking a staff card)
    const estudiosInfo = {
        'ginecologia': { icon: 'fa-solid fa-person-dress', title: 'Ginecología', items: ['Pap', 'Colposcopia', 'Colocación y retiro de DIU', 'Colocación y retiro de Chip', 'Biopsia de cuello', 'Cauterización de Pólipos'] },
        'cirugia-plastica': { icon: 'fa-solid fa-hand-holding-medical', title: 'Cirugía Plástica', items: ['Cirugía Estética Corporal y Facial', 'Adecuación de Género', 'Pacientes Trans/NB'] },
        'gastroenterologia': { icon: 'fa-solid fa-microscope', title: 'Gastroenterología', items: ['Endoscopias', 'Test SIBO', 'Test Lactosa', 'Test Helicobacter Pylori'] },
        'dermatologia': { icon: 'fa-solid fa-hand-dots', title: 'Dermatología', items: ['Luz pulsada', 'Mesoterapia', 'Skin Booster', 'Radio Frecuencia', 'Plasma rico en plaquetas', 'Peeling', 'Ultracavitación', 'Dermaplaning', 'Microdermoabrasión', 'Botox', 'Relleno'] },
        'urologia': { icon: 'fa-solid fa-vial', title: 'Urología', items: ['Flujometría', 'Penoscopías', 'Topicación', 'Electro fulguración de verrugas genitales'] },
        'diagnosticos-por-imagenes': { icon: 'fa-solid fa-x-ray', title: 'Diagnósticos por Imágenes', items: ['Ecografías Craneales', 'Ecodoppler', 'Ecografía completa de Abdomen', 'Ecografías Ginecológicas', 'Ecografías Musculoesquelética', 'Punciones guiadas por ecografía'] },
        'nutricion': { icon: 'fa-solid fa-apple-whole', title: 'Nutrición', items: ['Medición Antropométrica'] },
        'cardiologia': { icon: 'fa-solid fa-heart-pulse', title: 'Cardiología', items: ['Electrocardiograma (ECG)', 'Ecocardiograma doppler', 'Holter cardíaco de 24h', 'MAPA (presurometría de 24h)'] },
        'reeducacion-postural-e-infiltraciones': { icon: 'fa-solid fa-person-walking', title: 'Reeducación Postural', items: ['Maniobras de RPG y Vértigo'] },
        'flebologia': { icon: 'fa-solid fa-heart-circle-bolt', title: 'Flebología', items: ['Prácticas Esclerosantes', 'Trans Ilum.'] },
        'neumologia': { icon: 'fa-solid fa-lungs', title: 'Neumología', items: ['Espirometría', 'Oximetría de pulso', 'Filtro viral Bacterial', 'Módulo Poligrafía Respiratoria'] }
    };

    // All staff members (for popup when clicking an estudio card)
    const staffMembers = [
        { name: 'Dra. Bramati, María Laura', specialty: 'cirugia-plastica', specialtyLabel: 'Cirugía Plástica', image: 'images/staff/1.jpeg', insurance: 'Osde 310 en adelante y particular' },
        { name: 'Dr. Jiménez Torrado, Juan Manuel', specialty: 'urologia', specialtyLabel: 'Urología', image: 'images/staff/2.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Peirano, Joaquín', specialty: 'cardiologia', specialtyLabel: 'Cardiología', image: 'images/staff/3.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Colangelo, Héctor', specialty: 'cardiologia', specialtyLabel: 'Cardiología', image: 'images/staff/4.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. De Pina Diaz Pedro, Flavio', specialty: 'flebologia', specialtyLabel: 'Flebología', image: 'images/staff/5.jpeg', insurance: 'Osde y particular' },
        { name: 'Lic. Mombelli, Gabriela', specialty: 'rpg', specialtyLabel: 'RPG', image: 'images/staff/6.jpeg', insurance: 'Sólo particular' },
        { name: 'Dr. Gomez, José Luis', specialty: 'dermatologia', specialtyLabel: 'Dermatología', image: 'images/staff/7.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Gomez, Luciana', specialty: null, specialtyLabel: '', image: 'images/staff/8.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Firman, Elíseo', specialty: 'traumatologia-de-rodilla', specialtyLabel: 'Traumatología de Rodilla', image: 'images/staff/9.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Carrizo, Luis', specialty: 'otorrinolaringologia', specialtyLabel: 'Otorrinolaringología', image: 'images/staff/10.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Giusti, Cristina', specialty: 'otorrinolaringologia', specialtyLabel: 'Otorrinolaringología', image: 'images/staff/11.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Pace, Germán', specialty: 'traumatologia-de-pie', specialtyLabel: 'Traumatología de Pie', image: 'images/staff/12.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Diego, Andrea', specialty: 'clinica-medica', specialtyLabel: 'Clínica Médica', image: 'images/staff/13.jpeg', insurance: 'Osde y particular' },
        { name: 'Lic. Reynals, Lucrecia', specialty: 'psicologia', specialtyLabel: 'Psicología', image: 'images/staff/14.jpeg', insurance: 'Sólo particular' },
        { name: 'Lic. Sierra, Cristina', specialty: 'nutricion', specialtyLabel: 'Nutrición', image: 'images/staff/15.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Fraga, Gustavo', specialty: 'diagnosticos-por-imagenes', specialtyLabel: 'Diagnóstico por Imágenes', image: 'images/staff/16.jpeg', insurance: 'Osde y particular' },
        { name: 'Lic. Schlumpp, Mariana', specialty: 'nutricion', specialtyLabel: 'Nutrición', image: 'images/staff/17.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Bado, Cristina', specialty: 'ginecologia', specialtyLabel: 'Ginecología', image: 'images/staff/18.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Heer, Carolina', specialty: 'ginecologia', specialtyLabel: 'Ginecología', image: 'images/staff/19.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Signorelli, Mariela', specialty: 'gastroenterologia', specialtyLabel: 'Gastroenterología', image: 'images/staff/20.jpeg', insurance: 'Sólo particular' },
        { name: 'Dra. Linares, María Eugenia', specialty: 'gastroenterologia', specialtyLabel: 'Gastroenterología', image: 'images/staff/21.jpeg', insurance: 'Sólo particular' },
        { name: 'Dra. Pulvirenti, Liliana', specialty: 'pediatria', specialtyLabel: 'Pediatría', image: 'images/staff/22.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Bruhn, Arturo', specialty: 'pediatria', specialtyLabel: 'Pediatría', image: 'images/staff/23.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Repetto, Santiago', specialty: 'pediatria', specialtyLabel: 'Pediatría', image: 'images/staff/24.jpeg', insurance: 'Osde a partir 310 y particular' },
        { name: 'Dr. Asmus, Humberto', specialty: 'neurocirugia', specialtyLabel: 'Neurocirugía', image: 'images/staff/25.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Villarreal, Laura', specialty: 'fonoaudiologia', specialtyLabel: 'Fonoaudiología', image: 'images/staff/26.jpeg', insurance: 'Swiss Medical y particular' },
        { name: 'Dra. Moral, Rosario', specialty: 'endocrinologia-y-diabetologia', specialtyLabel: 'Endocrinología y Diabetología', image: 'images/staff/27.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Schaffer, María Cecilia', specialty: 'clinica-medica-y-diabetologia', specialtyLabel: 'Clínica Médica y Diabetología', image: 'images/staff/28.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Garnero, Victoria', specialty: 'endocrinologia', specialtyLabel: 'Endocrinología', image: 'images/staff/29.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Pagliarino, María Sol', specialty: 'dermatologia', specialtyLabel: 'Dermatología', image: 'images/staff/30.jpeg', insurance: 'Osde y particular' },
        { name: 'Lic. Naveyras, María Rosalía', specialty: 'psicologia', specialtyLabel: 'Psicología', image: 'images/staff/31.jpeg', insurance: 'Sólo particular' },
        { name: 'Dr. González Massa, Marcos', specialty: 'proctologia-y-cirugia-general', specialtyLabel: 'Proctología y Cirugía General', image: 'images/staff/32.jpeg', insurance: 'Osde, Swiss Medical y particular' },
        { name: 'Dr. Avellaneda, Nicolás', specialty: 'proctologia', specialtyLabel: 'Proctología', image: 'images/staff/33.jpeg', insurance: 'Osde y particular' },
        { name: 'Dr. Carnero, Lisandro', specialty: 'flebologia-y-cirugia-cardiovascular', specialtyLabel: 'Flebología y Cirugía Cardiovascular', image: 'images/staff/34.jpeg', insurance: 'Sólo particular' },
        { name: 'Dr. Tricarico, Juan Martín', specialty: 'proctologia-y-cirugia-general', specialtyLabel: 'Proctología y Cirugía General', image: 'images/staff/35.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Décima, Tamara', specialty: 'neumonologia', specialtyLabel: 'Neumonología', image: 'images/staff/36.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Arismendi, Lorena', specialty: 'cardiologia', specialtyLabel: 'Cardiología', image: 'images/staff/37.jpeg', insurance: 'Osde y particular' },
        { name: 'Lic. Lorenzo, Andrea', specialty: 'psicologia', specialtyLabel: 'Psicología', image: 'images/staff/38.jpeg', insurance: 'Sólo particular' },
        { name: 'Dra. Kempel, Mariana', specialty: 'clinica-medica', specialtyLabel: 'Clínica Médica', image: 'images/staff/39.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Luna, Analía', specialty: 'oftalmologia', specialtyLabel: 'Oftalmología', image: 'images/staff/40.jpeg', insurance: 'Sólo particular' },
        { name: 'Dra. Raskovsky, Vanesa', specialty: 'neurologia-infantil', specialtyLabel: 'Neurología Infantil', image: 'images/staff/41.jpeg', insurance: 'Sólo particular' },
        { name: 'Dr. Imposti, Félix', specialty: 'traumatologia-de-columna', specialtyLabel: 'Traumatología de Columna', image: 'images/staff/42.jpeg', insurance: 'Osde y particular' },
        { name: 'Dra. Ottonello, Virginia', specialty: 'cardiologia-infantil', specialtyLabel: 'Cardiología Infantil', image: 'images/staff/43.jpeg', insurance: 'Osde y particular' }
    ];

    // Doctor specialty → estudio key mapping
    const specToEstudio = {
        'urologia': 'urologia',
        'cardiologia': 'cardiologia',
        'cardiologia-infantil': 'cardiologia',
        'flebologia': 'flebologia',
        'flebologia-y-cirugia-cardiovascular': 'flebologia',
        'rpg': 'reeducacion-postural-e-infiltraciones',
        'dermatologia': 'dermatologia',
        'cirugia-plastica': 'cirugia-plastica',
        'ginecologia': 'ginecologia',
        'gastroenterologia': 'gastroenterologia',
        'neumonologia': 'neumologia',
        'nutricion': 'nutricion',
        'diagnosticos-por-imagenes': 'diagnosticos-por-imagenes'
    };

    // Estudio key → doctor specialty keys mapping
    const estudioToSpecs = {
        'ginecologia': ['ginecologia'],
        'gastroenterologia': ['gastroenterologia'],
        'dermatologia': ['dermatologia'],
        'urologia': ['urologia'],
        'cardiologia': ['cardiologia', 'cardiologia-infantil'],
        'reeducacion-postural-e-infiltraciones': ['rpg'],
        'flebologia': ['flebologia', 'flebologia-y-cirugia-cardiovascular'],
        'neumologia': ['neumonologia'],
        'diagnosticos-por-imagenes': ['diagnosticos-por-imagenes'],
        'cirugia-plastica': ['cirugia-plastica'],
        'nutricion': ['nutricion']
    };

    function normalizeKey(text) {
        return text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\(.*?\)/g, '')
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Modal setup
    const modal = document.getElementById('skymedModal');
    if (modal) {
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        const modalBody = modal.querySelector('.modal-body');

        function openModal(html) {
            modalBody.innerHTML = html;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });

        // STAFF PAGE: click staff card → show estudio popup
        document.querySelectorAll('.staff-card').forEach(function(card) {
            var specEl = card.querySelector('.staff-card-specialty');
            if (!specEl) return;
            var key = normalizeKey(specEl.textContent);
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                var estudioKey = specToEstudio[key];
                var estudio = estudioKey ? estudiosInfo[estudioKey] : null;
                var html = '';
                if (estudio) {
                    html = '<div class="popup-estudio-detail">' +
                        '<div class="popup-estudio-icon"><i class="' + estudio.icon + '"></i></div>' +
                        '<h2 class="popup-estudio-title">' + estudio.title + '</h2>' +
                        '<ul class="popup-estudio-list">' + estudio.items.map(function(i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
                        '<div class="popup-turno"><a href="' + TURNO_URL + '" class="estudio-turno-btn" target="_blank" rel="noopener"><i class="fa-solid fa-calendar-plus"></i> Sacar Turno</a></div>' +
                        '</div>';
                } else {
                    html = '<div class="popup-estudio-detail">' +
                        '<div class="popup-estudio-icon"><i class="fa-solid fa-user-doctor"></i></div>' +
                        '<h2 class="popup-estudio-title">' + specEl.textContent + '</h2>' +
                        '<p class="popup-no-data">Para consultas sobre esta especialidad, comuníquese con nosotros o solicite un turno.</p>' +
                        '<div class="popup-turno"><a href="' + TURNO_URL + '" class="estudio-turno-btn" target="_blank" rel="noopener"><i class="fa-solid fa-calendar-plus"></i> Sacar Turno</a></div>' +
                        '</div>';
                }
                openModal(html);
            });
        });

        // ESTUDIOS PAGE: click estudio card → show doctors popup
        document.querySelectorAll('.estudio-card').forEach(function(card) {
            var titleEl = card.querySelector('h3');
            if (!titleEl) return;
            var key = normalizeKey(titleEl.textContent);
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                if (e.target.closest('.estudio-turno-btn')) return;
                var matchingSpecs = estudioToSpecs[key] || [];
                var doctors = staffMembers.filter(function(d) { return matchingSpecs.includes(d.specialty); });
                var html = '';
                if (doctors.length) {
                    html = '<h2 class="popup-doctors-title">Profesionales en ' + titleEl.textContent + '</h2>' +
                        '<div class="popup-doctors-grid">' +
                        doctors.map(function(d) {
                            return '<div class="popup-doctor-card">' +
                                '<img src="' + d.image + '" alt="' + d.name + '" class="popup-doctor-img">' +
                                '<h3 class="popup-doctor-name">' + d.name + '</h3>' +
                                (d.specialtyLabel ? '<p class="popup-doctor-spec">' + d.specialtyLabel + '</p>' : '') +
                                '<p class="popup-doctor-insurance"><i class="fa-solid fa-shield-heart"></i> ' + d.insurance + '</p>' +
                                '</div>';
                        }).join('') +
                        '</div>' +
                        '<div class="popup-turno"><a href="' + TURNO_URL + '" class="estudio-turno-btn" target="_blank" rel="noopener"><i class="fa-solid fa-calendar-plus"></i> Sacar Turno</a></div>';
                } else {
                    html = '<div class="popup-estudio-detail">' +
                        '<div class="popup-estudio-icon"><i class="fa-solid fa-user-doctor"></i></div>' +
                        '<h2 class="popup-estudio-title">Profesionales en ' + titleEl.textContent + '</h2>' +
                        '<p class="popup-no-data">Próximamente se incorporarán profesionales para esta especialidad.<br>Para consultas, comuníquese al 02320-409730</p>' +
                        '<div class="popup-turno"><a href="' + TURNO_URL + '" class="estudio-turno-btn" target="_blank" rel="noopener"><i class="fa-solid fa-calendar-plus"></i> Sacar Turno</a></div>' +
                        '</div>';
                }
                openModal(html);
            });
        });
    }

    // ===== LIGHTBOX (Nosotros) =====
    var lightbox = document.getElementById('nosotrosLightbox');
    if (lightbox) {
        var lbImg = document.getElementById('lightboxImg');
        var lbCaption = document.getElementById('lightboxCaption');
        var lbClose = document.getElementById('lightboxClose');
        var lbOverlay = document.getElementById('lightboxOverlay');
        var lbPrev = document.getElementById('lightboxPrev');
        var lbNext = document.getElementById('lightboxNext');
        var lbTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
        var lbCurrent = 0;

        function lbOpen(index) {
            lbCurrent = index;
            var block = lbTriggers[index];
            var img = block.querySelector('img');
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lbCaption.textContent = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function lbClose_fn() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function lbGo(dir) {
            lbCurrent = (lbCurrent + dir + lbTriggers.length) % lbTriggers.length;
            var block = lbTriggers[lbCurrent];
            var img = block.querySelector('img');
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lbCaption.textContent = img.alt;
        }

        lbTriggers.forEach(function(block) {
            block.addEventListener('click', function() {
                lbOpen(parseInt(block.getAttribute('data-lightbox-index'), 10));
            });
        });

        lbClose.addEventListener('click', lbClose_fn);
        lbOverlay.addEventListener('click', lbClose_fn);
        lbPrev.addEventListener('click', function() { lbGo(-1); });
        lbNext.addEventListener('click', function() { lbGo(1); });

        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') lbClose_fn();
            if (e.key === 'ArrowLeft') lbGo(-1);
            if (e.key === 'ArrowRight') lbGo(1);
        });
    }

    // ===== STAFF FILTERS =====
    var filterContainer = document.getElementById('staffFilters');
    if (filterContainer) {
        var toggleBtn = document.getElementById('staffFiltersToggle');
        var filterBtns = filterContainer.querySelectorAll('.staff-filter-btn');
        var groups = document.querySelectorAll('.staff-group');

        // Toggle dropdown on mobile
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                filterContainer.classList.toggle('open');
            });
        }

        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var filter = btn.getAttribute('data-filter');
                groups.forEach(function(group) {
                    if (filter === 'todos' || group.getAttribute('data-category') === filter) {
                        group.classList.remove('hidden');
                    } else {
                        group.classList.add('hidden');
                    }
                });

                // Close dropdown on mobile after selecting
                if (window.innerWidth <= 768) {
                    filterContainer.classList.remove('open');
                }
            });
        });
    }
});
