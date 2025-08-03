/*

  TemplateMo 595 3d coverflow
  https://templatemo.com/tm-595-3d-coverflow

*/

// JavaScript Document

// Funcionalidad de la carátula 3D (Coverflow)
const items = document.querySelectorAll('.coverflow-item');
const dotsContainer = document.getElementById('dots');
const currentTitle = document.getElementById('current-title');
const currentDescription = document.getElementById('current-description');
const container = document.querySelector('.coverflow-container');
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');

// Índices y estados para la carátula
let currentIndex = 3;
let isAnimating = false;

//--------------------------------------------------------------------------------------------------
// Menú móvil
//--------------------------------------------------------------------------------------------------

// Alternar el menú móvil al hacer clic en el botón de hamburguesa
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainMenu.classList.toggle('active');
});

// Cerrar el menú móvil al hacer clic en un elemento del menú (excepto enlaces externos)
document.querySelectorAll('.menu-item:not(.external)').forEach(item => {
    item.addEventListener('click', (e) => {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    });
});

// Cerrar el menú móvil al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    }
});

//--------------------------------------------------------------------------------------------------
// Datos de las imágenes para los títulos y descripciones
//--------------------------------------------------------------------------------------------------

const imageData = [
    {
        title: "PAGINA MODERNA",
        description: "BUENA CALIDAD DE PAGINA Y BUENA TOMA DE COLORES"
    },
    {
        title: "carteles publicitario",
        description: "MEJOR EXPERIENCIA VISUAL GRAFICA"
    },
    {
        title: "DISEÑO WEB",
        description: "DISEÑO RESPONSIVO Y MODERNO"
    },
    {
        title: "PAGINA WEB",
        description: "DISEÑO LIMPIO Y FUNCIONAL"
    },
    {
        title: "PAGINA WEB",
        description: "PAGINA CON UN DISEÑO LIMPIO Y MODERNO"
    },
    {
        title: "DISEÑO GRAFICO",
        description: "PAGINA CON UN DISEÑO GRAFICO MODERNO"
    },
    {
        title: "DISEÑO DE PAGINAS",
        description: "DISEÑO DE PAGINAS CON UN ENFOQUE MODERNO Y LIMPIO"
    }
];

//--------------------------------------------------------------------------------------------------
// Funcionalidad del Coverflow (Carátula 3D)
//--------------------------------------------------------------------------------------------------

// Crear los puntos de navegación dinámicamente
items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.onclick = () => goToIndex(index);
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');
let autoplayInterval = null;
let isPlaying = true;
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

// Actualiza las propiedades CSS de cada ítem para crear el efecto 3D
function updateCoverflow() {
    if (isAnimating) return;
    isAnimating = true;

    items.forEach((item, index) => {
        let offset = index - currentIndex;

        // Ajusta el offset para un bucle infinito
        if (offset > items.length / 2) {
            offset = offset - items.length;
        } else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }

        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        // Calcula las transformaciones para el efecto 3D
        let translateX = offset * 220;
        let translateZ = -absOffset * 200;
        let rotateY = -sign * Math.min(absOffset * 60, 60);
        let opacity = 1 - (absOffset * 0.2);
        let scale = 1 - (absOffset * 0.1);

        // Oculta los ítems que están muy lejos
        if (absOffset > 3) {
            opacity = 0;
            translateX = sign * 800; // Moverlos fuera de la vista
        }

        // Aplica las transformaciones y opacidad
        item.style.transform = `
            translateX(${translateX}px) 
            translateZ(${translateZ}px) 
            rotateY(${rotateY}deg)
            scale(${scale})
        `;
        item.style.opacity = opacity;
        item.style.zIndex = 100 - absOffset;

        // Marca el ítem activo
        item.classList.toggle('active', index === currentIndex);
    });

    // Actualiza los puntos de navegación
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    // Actualiza el título y la descripción
    const currentData = imageData[currentIndex];
    currentTitle.textContent = currentData.title;
    currentDescription.textContent = currentData.description;
    
    // Reinicia la animación para el texto
    currentTitle.style.animation = 'none';
    currentDescription.style.animation = 'none';
    setTimeout(() => {
        currentTitle.style.animation = 'fadeIn 0.6s forwards';
        currentDescription.style.animation = 'fadeIn 0.6s forwards';
    }, 10);

    // Finaliza la animación después de un breve retraso
    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

// Navega a la siguiente o anterior imagen
function navigate(direction) {
    if (isAnimating) return;
    
    currentIndex = currentIndex + direction;
    
    // Bucle infinito
    if (currentIndex < 0) {
        currentIndex = items.length - 1;
    } else if (currentIndex >= items.length) {
        currentIndex = 0;
    }
    
    updateCoverflow();
}

// Navega a un índice específico
function goToIndex(index) {
    if (isAnimating || index === currentIndex) return;
    currentIndex = index;
    updateCoverflow();
}

//--------------------------------------------------------------------------------------------------
// Control de eventos
//--------------------------------------------------------------------------------------------------

// Navegación con teclado (flechas)
container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
});

// Seleccionar ítem al hacer clic en él
items.forEach((item, index) => {
    item.addEventListener('click', () => goToIndex(index));
});

// Soporte para gestos táctiles (tocar y deslizar)
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
}, { passive: true });

container.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    
    const currentX = e.changedTouches[0].screenX;
    const diff = currentX - touchStartX;
    
    if (Math.abs(diff) > 10) {
        e.preventDefault(); // Previene el desplazamiento de la página al deslizar horizontalmente
    }
}, { passive: false });

container.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
    isSwiping = false;
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 30;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Comprueba si el deslizamiento es horizontal y lo suficientemente grande
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        handleUserInteraction();
        
        if (diffX > 0) {
            navigate(1); // Deslizar hacia la izquierda
        } else {
            navigate(-1); // Deslizar hacia la derecha
        }
    }
}

// Inicializa las imágenes y sus reflejos
items.forEach((item, index) => {
    const img = item.querySelector('img');
    const reflection = item.querySelector('.reflection');
    
    img.onload = function() {
        this.parentElement.classList.remove('image-loading');
        // Configura el fondo del reflejo
        reflection.style.setProperty('--bg-image', `url(${this.src})`);
        reflection.style.backgroundImage = `url(${this.src})`;
        reflection.style.backgroundSize = 'cover';
        reflection.style.backgroundPosition = 'center';
    };
    
    img.onerror = function() {
        this.parentElement.classList.add('image-loading');
    };
});

//--------------------------------------------------------------------------------------------------
// Funcionalidad de Autoplay
//--------------------------------------------------------------------------------------------------

// Inicia la reproducción automática
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCoverflow();
    }, 4000); // Cambia de imagen cada 4 segundos
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

// Detiene la reproducción automática
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

// Alterna entre reproducir y pausar
function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

// Función para detener el autoplay cuando el usuario interactúa
function handleUserInteraction() {
    stopAutoplay();
}

// Añade listeners para detener el autoplay en interacciones manuales
items.forEach((item) => {
    item.addEventListener('click', handleUserInteraction);
});

document.querySelector('.nav-button.prev').addEventListener('click', handleUserInteraction);
document.querySelector('.nav-button.next').addEventListener('click', handleUserInteraction);

dots.forEach((dot) => {
    dot.addEventListener('click', handleUserInteraction);
});

container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        handleUserInteraction();
    }
});

//--------------------------------------------------------------------------------------------------
// Desplazamiento suave y estado del menú
//--------------------------------------------------------------------------------------------------

const sections = document.querySelectorAll('.section');
const menuItems = document.querySelectorAll('.menu-item');
const header = document.getElementById('header');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Actualiza el elemento del menú activo al desplazarse
function updateActiveMenuItem() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            menuItems.forEach(item => {
                if (!item.classList.contains('external')) {
                    item.classList.remove('active');
                }
            });
            if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                menuItems[index].classList.add('active');
            }
        }
    });

    // Cambia el estilo del encabezado al desplazarse
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Muestra/oculta el botón de "volver arriba"
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateActiveMenuItem);

// Desplazamiento suave a la sección
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('href');
        
        // Verifica si es un enlace interno (empieza con #)
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // Los enlaces externos se abren normalmente
    });
});

// El clic en el logo desplaza al inicio de la página
document.querySelector('.logo-container').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Clic en el botón de "volver arriba"
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

//--------------------------------------------------------------------------------------------------
// Manejo del formulario y funciones de inicialización
//--------------------------------------------------------------------------------------------------

// Maneja el envío del formulario
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

// Inicializa todas las funciones
updateCoverflow();
container.focus(); // Permite la navegación con teclado
startAutoplay();
