document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const nav = document.querySelector('nav');
  const navToggle = document.querySelector('.nav-toggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('nav ul li a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
  // Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { history.replaceState(null, '', `#${targetId}`); } catch (err) {}
      }
    });
  });

  // Scroll-spy: highlight nav links when section is in view
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`nav ul li a[href="#${id}"]`);
        if (link) link.classList.toggle('active', entry.isIntersecting);
      });
    }, { threshold: 0.6 });
    sections.forEach(s => observer.observe(s));
  }

  // Gallery / Lightbox
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const btnClose = document.querySelector('.lightbox-close');
  const btnNext = document.querySelector('.lightbox-next');
  const btnPrev = document.querySelector('.lightbox-prev');
  let currentIndex = -1;

  function openLightbox(index) {
    const img = galleryItems[index];
    if (!img) return;
    currentIndex = index;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus close for keyboard users
    if (btnClose) btnClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
    currentIndex = -1;
  }

  function showNext() {
    if (currentIndex < 0) return;
    const next = (currentIndex + 1) % galleryItems.length;
    openLightbox(next);
  }

  function showPrev() {
    if (currentIndex < 0) return;
    const prev = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(prev);
  }

  galleryItems.forEach((el, i) => {
    el.addEventListener('click', () => openLightbox(i));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
        e.preventDefault();
        openLightbox(i);
      }
    });
    el.setAttribute('tabindex', '0');
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', showNext);
  if (btnPrev) btnPrev.addEventListener('click', showPrev);

  // Close on background click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});
