/* ============================================
   CANLIS — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1200);
  });
  // Fallback if load already fired
  setTimeout(() => preloader.classList.add('hidden'), 3000);

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Menu filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      dishCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.classList.add('show');
        } else {
          card.classList.add('hidden');
          card.classList.remove('show');
        }
      });
    });
  });

  // ---- Reveal on scroll ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Reservation form ----
  const reserveForm = document.getElementById('reserveForm');

  reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value;
    const email = document.getElementById('guestEmail').value;

    // Success feedback
    reserveForm.innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem;">
        <div style="font-size:3rem; margin-bottom:1rem;">✦</div>
        <h3 style="font-family:var(--font-display); font-size:1.8rem; font-weight:400; margin-bottom:1rem; color:var(--color-gold);">
          Thank You, ${name}!
        </h3>
        <p style="color:var(--color-text-secondary); font-size:1.05rem; margin-bottom:0.5rem;">
          Your reservation request has been received.
        </p>
        <p style="color:var(--color-text-muted); font-size:0.9rem;">
          A confirmation will be sent to ${email} within 24 hours.
        </p>
      </div>
    `;
  });

  // ---- Set minimum date to today ----
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // ---- Counter animation ----
  const animateCounters = () => {
    document.querySelectorAll('.stat-number, .badge-number, .wine-stat-number, .rating-score').forEach(el => {
      const text = el.textContent;
      // Only animate pure numbers
      const num = parseInt(text.replace(/[^0-9]/g, ''));
      if (isNaN(num) || num === 0) return;
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';

      const suffix = text.replace(/[0-9]/g, '');
      const duration = 2000;
      const start = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(num * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = text; // Restore exact original
      };

      requestAnimationFrame(animate);
    });
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.about-stats, .wine-stats, .reviews-rating, .about-badge').forEach(el => {
    counterObserver.observe(el);
  });

  // ---- Parallax hero background ----
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ---- Gallery lightbox (simple zoom) ----
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(10,10,10,0.95);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; opacity: 0; transition: opacity 0.3s ease;
        backdrop-filter: blur(10px);
      `;

      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.style.cssText = `
        max-width: 90vw; max-height: 90vh; object-fit: contain;
        transform: scale(0.9); transition: transform 0.3s ease;
        box-shadow: 0 20px 80px rgba(0,0,0,0.5);
      `;

      overlay.appendChild(bigImg);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        bigImg.style.transform = 'scale(1)';
      });

      const close = () => {
        overlay.style.opacity = '0';
        bigImg.style.transform = 'scale(0.9)';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
        }, 300);
      };

      overlay.addEventListener('click', close);
      document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', handler);
        }
      });
    });
  });

});
