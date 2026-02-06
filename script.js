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

  // Upcoming events with dynamic dates
  window.onload = function() {
    // 1. The Helper Function (Calculates the next date)
    function getNextOccurrence(targetDay) {
      const now = new Date();
      const resultDate = new Date();
      // Calculate days until next occurrence
      const daysToAdd = (targetDay - now.getDay() + 7) % 7 || 7; 
      resultDate.setDate(now.getDate() + daysToAdd);
      
      return resultDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }

    // 2. Updated Data (Using the function for the dates)
    const upcomingEvents = [
      {
        date: `${getNextOccurrence(4)} • 4:00 PM`,  // 4 = Thursday
        title: 'Midweek Prayer & Bible Study',
        desc: 'A focused time of prayer and Bible study for all — available via our livestream on YouTube.'
      },
      {
        date: `${getNextOccurrence(6)} • 3:00 PM`,  // 6 = Saturday
        title: 'Youth Fellowship',
        desc: 'Youth worship and teaching. Highlights posted to TikTok and Facebook; select sessions streamed.'
      },
      {
        date: `${getNextOccurrence(0)} • 10:00 AM`, // 0 = Sunday
        title: 'Sunday Morning Service',
        desc: 'Worship and a message from Pastor Kennedy. In-person at AGC Lalwet. Service streamed on our YouTube channel.'
      }
    ];

    // 3. Render the Grid
    const eventsGrid = document.querySelector('.events-grid');
    if (eventsGrid) {
      eventsGrid.innerHTML = upcomingEvents.map(ev => {
        return `
          <article class="event-card">
            <div class="event-date">${ev.date}</div>
            <h4 class="event-title">${ev.title}</h4>
            <p class="event-desc">${ev.desc}</p>
          </article>
        `;
      }).join('\n');
      console.log("Event grid updated with automatic dates!");
    }
  };

  // Livestream platforms
  const platforms = [
    { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/channel/UCJj7Z2scFVD5eIXB5k2Rl_A', color: '#FF0000', desc: 'Watch sermons and live prayer meetings.', svg: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="#FF0000" d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-1-3-.2-7.5-.2-7.5-.2h-.1s-4.5 0-7.5.2c-.4 0-1.4.1-2.1 1C.7 4.5.5 6.2.5 6.2S.2 8 .2 9.8v.4c0 1.8.3 3.6.3 3.6s.2 1.7.8 2.4c.8.9 1.8.9 2.3 1 1.7.1 7.3.2 7.3.2s4.5 0 7.5-.2c.4 0 1.4-.1 2.1-1 .6-.7.8-2.4.8-2.4s.3-1.8.3-3.6v-.4c0-1.8-.3-3.6-.3-3.6z"/><path fill="#fff" d="M9.8 15.6V8.4l6.7 3.6-6.7 3.6z"/></svg>'},
    { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/share/g/1ACSrjV1yt/', color: '#1877F2', desc: 'Live updates and community events.', svg: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#1877F2" d="M22 12a10 10 0 10-11.5 9.9v-7H8.9v-2.9h1.6V9.1c0-1.6 1-2.5 2.4-2.5.7 0 1.4.1 1.4.1v1.6h-.8c-.8 0-1 .5-1 1v1.2h1.7l-.3 2.9h-1.4v7A10 10 0 0022 12z"/></svg>' }
  ];

  const livestreamsGrid = document.querySelector('.livestreams-grid');
  if (livestreamsGrid) {
    livestreamsGrid.innerHTML = platforms.map(p => {
      return `
        <div class="platform-card" data-platform="${p.id}">
          <div class="platform-icon" aria-hidden="true">${p.svg}</div>
          <div class="platform-meta">
            <h4>${p.name}</h4>
            <p>${p.desc}</p>
          </div>
          <div class="platform-actions">
            <a class="btn-join" href="${p.url}" target="_blank" rel="noopener noreferrer">Watch Live</a>
          </div>
        </div>
      `;
    }).join('\n');
  }

  // Modern horizontal slideshow using thumbnails as source
  (function setupGallerySlideshow() {
    const track = document.querySelector('.slideshow-track');
    const thumbEls = Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));
    const container = document.querySelector('.gallery-slideshow');
    const btnPrev = document.querySelector('.slideshow-prev');
    const btnNext = document.querySelector('.slideshow-next');
    if (!track || thumbEls.length === 0 || !container) return;

    const images = thumbEls.map(t => t.src);
    // build slides
    images.forEach(src => {
      const slide = document.createElement('div');
      slide.className = 'slideshow-slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);
    });

    let idx = 0;
    const duration = 4500;
    let timer = null;

    function goTo(i) {
      idx = (i + images.length) % images.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
    }

    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    function start() { if (!timer) timer = setInterval(next, duration); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // start autoplay
    start();

    // pause on hover / focus
    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    container.addEventListener('focusin', stop);
    container.addEventListener('focusout', start);

    if (btnNext) btnNext.addEventListener('click', () => { stop(); next(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { stop(); prev(); });

    // allow swipe on touch devices
    let startX = 0;
    let deltaX = 0;
    container.addEventListener('touchstart', (e) => { stop(); startX = e.touches[0].clientX; }, {passive:true});
    container.addEventListener('touchmove', (e) => { deltaX = e.touches[0].clientX - startX; }, {passive:true});
    container.addEventListener('touchend', () => {
      if (Math.abs(deltaX) > 40) { if (deltaX < 0) next(); else prev(); }
      deltaX = 0; start();
    });
  })();
});
