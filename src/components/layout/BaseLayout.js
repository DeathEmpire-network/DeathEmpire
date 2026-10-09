// BaseLayout.js - Lógica del layout: tema, navegación móvil, back-to-top
export function initBaseLayout() {
  // Tema - sin flash de contenido sin estilo
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.add(prefersDark ? 'dark' : 'light');

  // Mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeNav() {
    navMenu?.classList.remove('open');
    navOverlay?.classList.remove('visible');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openNav() {
    navMenu?.classList.add('open');
    navOverlay?.classList.add('visible');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    isExpanded ? closeNav() : openNav();
  });

  navOverlay?.addEventListener('click', closeNav);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 820) closeNav();
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  // Back to top
  const backToTop = document.querySelector('.back-to-top');
  const scrollThreshold = 300;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}