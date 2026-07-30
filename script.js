const CLOUD_NAME = 'jhx7umny';
const UPLOAD_PRESET = 'church_uploads';
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY';
const YOUTUBE_CHANNEL_ID = 'UCJj7Z2scFVD5eIXB5k2Rl_A';
const HERO_IMAGE_ID = 'church-hero';
const ABOUT_IMAGE_ID = 'church-about';
const GALLERY_IMAGE_IDS = [];

function cloudinaryUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`;
}

document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.main-nav');
  const navToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');

  function openMenu() {
    nav.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    if (menuClose) menuClose.focus();
  }

  function closeMenu() {
    nav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    navToggle.focus();
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (menuClose) {
      menuClose.addEventListener('click', closeMenu);
    }

    document.querySelectorAll('.nav-list a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          closeMenu();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') &&
          !nav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

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

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');
  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav-list a[href="#${id}"]`);
        if (link) link.classList.toggle('active', entry.isIntersecting);
      });
    }, { threshold: 0.6 });
    sections.forEach(s => observer.observe(s));
  }

  if (CLOUD_NAME !== 'YOUR_CLOUD_NAME') {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.backgroundImage = `linear-gradient(135deg, rgba(128, 0, 32, 0.85) 0%, rgba(74, 21, 128, 0.85) 100%), url(${cloudinaryUrl(HERO_IMAGE_ID)})`;
    }
    const aboutImg = document.getElementById('aboutImage');
    if (aboutImg) {
      aboutImg.src = cloudinaryUrl(ABOUT_IMAGE_ID);
    }
  }

  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid && GALLERY_IMAGE_IDS.length > 0) {
    GALLERY_IMAGE_IDS.forEach((id, i) => {
      const img = document.createElement('img');
      img.src = cloudinaryUrl(id);
      img.alt = 'Church gallery image';
      img.className = 'gallery-item';
      img.loading = 'lazy';
      img.setAttribute('tabindex', '0');
      galleryGrid.appendChild(img);
    });
  } else if (galleryGrid) {
    galleryGrid.innerHTML = '<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:4rem;">Gallery coming soon. Upload images using the media portal.</p>';
  }

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
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', showNext);
  if (btnPrev) btnPrev.addEventListener('click', showPrev);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  function getNextOccurrence(targetDay) {
    const now = new Date();
    const resultDate = new Date();
    const daysToAdd = (targetDay - now.getDay() + 7) % 7 || 7;
    resultDate.setDate(now.getDate() + daysToAdd);
    return resultDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  const upcomingEvents = [
    {
      date: `${getNextOccurrence(4)} \u2022 4:00 PM`,
      title: 'Midweek Prayer & Bible Study',
      desc: 'A focused time of prayer and Bible study for all.'
    },
    {
      date: `${getNextOccurrence(6)} \u2022 3:00 PM`,
      title: 'Youth Fellowship',
      desc: 'Youth worship and teaching. In-person at AGC Lalwet.'},
    {
      date: `${getNextOccurrence(0)} \u2022 10:00 AM`,
      title: 'Sunday Morning Service',
      desc: 'Worship and a message from Pastor Kennedy. In-person at AGC Lalwet. Service streamed on our YouTube channel.'
    }
  ];

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
  }

  (function setupGallerySlideshow() {
    const track = document.querySelector('.slideshow-track');
    const thumbEls = Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));
    const container = document.querySelector('.gallery-slideshow');
    const btnPrev = document.querySelector('.slideshow-prev');
    const btnNext = document.querySelector('.slideshow-next');
    if (!track || thumbEls.length === 0 || !container) return;

    const images = thumbEls.map(t => t.src);
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

    start();

    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    container.addEventListener('focusin', stop);
    container.addEventListener('focusout', start);

    if (btnNext) btnNext.addEventListener('click', () => { stop(); next(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { stop(); prev(); });

    let startX = 0;
    let deltaX = 0;
    container.addEventListener('touchstart', (e) => { stop(); startX = e.touches[0].clientX; }, {passive:true});
    container.addEventListener('touchmove', (e) => { deltaX = e.touches[0].clientX - startX; }, {passive:true});
    container.addEventListener('touchend', () => {
      if (Math.abs(deltaX) > 40) { if (deltaX < 0) next(); else prev(); }
      deltaX = 0; start();
    });
  })();

  if (YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY') {
    fetchYouTubeContent();
  }

  async function fetchYouTubeContent() {
    const baseUrl = 'https://www.googleapis.com/youtube/v3';

    try {
      const [liveRes, uploadsRes] = await Promise.all([
        fetch(`${baseUrl}/search?channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&type=video&eventType=live&key=${YOUTUBE_API_KEY}`),
        fetch(`${baseUrl}/search?channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&type=video&order=date&maxResults=10&key=${YOUTUBE_API_KEY}`)
      ]);

      const liveData = await liveRes.json();
      const uploadsData = await uploadsRes.json();
      const isLive = liveData.items && liveData.items.length > 0;

      if (isLive) {
        const liveVideo = liveData.items[0];
        const liveContainer = document.getElementById('live-now-container');
        const livePlayer = document.getElementById('live-player');
        if (liveContainer && livePlayer) {
          liveContainer.style.display = 'block';
          livePlayer.src = `https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1`;
        }
      }

      const sundayVideos = (uploadsData.items || []).filter(item => {
        const d = new Date(item.snippet.publishedAt);
        return d.getDay() === 0;
      }).slice(0, 2);

      const container = document.getElementById('sunday-services');
      if (container) {
        if (sundayVideos.length === 0) {
          container.innerHTML = '<p class="text-muted">No recent services found. Check back after Sunday.</p>';
        } else {
          container.innerHTML = sundayVideos.map(video => `
            <div class="sermon-card">
              <div class="video-wrapper">
                <iframe src="https://www.youtube.com/embed/${video.id.videoId}" allow="encrypted-media" allowfullscreen loading="lazy"></iframe>
              </div>
              <div class="sermon-info">
                <h3>${video.snippet.title}</h3>
                <p>${new Date(video.snippet.publishedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          `).join('');
        }
      }
    } catch (err) {
      const container = document.getElementById('sunday-services');
      if (container) {
        container.innerHTML = '<p class="text-muted">Unable to load videos at this time.</p>';
      }
    }
  }
});
