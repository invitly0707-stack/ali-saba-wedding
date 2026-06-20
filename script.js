(function () {
  'use strict';

  /* ── 1. HERO FADE-INS ─────────────────────────────────── */
  function initHeroFadeIns() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('visible');
      }, delay + 300);
    });
  }

  /* ── 2. SCROLL REVEAL ─────────────────────────────────── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-card');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el    = entry.target;
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => {
              el.classList.add('visible');
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ── 3. NAVBAR SCROLL STATE ───────────────────────────── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastY = 0;

    function update() {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 60);
      lastY = y;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── 4. MOBILE NAV TOGGLE ─────────────────────────────── */
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links  = document.querySelector('.nav-links');

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });

    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
      });
    });
  }

  /* ── 5. SMOOTH SCROLL ─────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── 6. HERO PARALLAX ─────────────────────────────────── */
  function initParallax() {
    const hero = document.getElementById('hero');
    const content = hero.querySelector('.hero-content');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        content.style.transform = `translateY(${y * 0.25}px)`;
        hero.style.opacity = 1 - (y / window.innerHeight) * 0.6;
      }
    }, { passive: true });
  }

  /* ── 7. RSVP NOTIFY BUTTON ────────────────────────────── */
  function initRsvpNotify() {
    const btn   = document.querySelector('.notify-btn');
    const input = document.querySelector('.notify-input');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const email = input.value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        shakeInput(input);
        return;
      }
      if (!emailRe.test(email)) {
        shakeInput(input);
        input.placeholder = 'Please enter a valid email';
        return;
      }

      btn.textContent = '✓ Noted!';
      btn.style.background = 'linear-gradient(135deg, #0C5C3E, #1A8F5F)';
      btn.disabled = true;
      input.value  = '';
      input.placeholder = 'Your email address';
    });

    function shakeInput(el) {
      el.style.borderColor = '#9B1A28';
      el.style.boxShadow   = '0 0 0 3px rgba(155,26,40,0.15)';
      el.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(6px)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(4px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 380, easing: 'ease-in-out' }
      );
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
      }, 1500);
    }
  }

  /* ── 8. GOLDEN PARTICLE SYSTEM ────────────────────────── */
  function initParticles() {
    const canvas  = document.getElementById('particle-canvas');
    const ctx     = canvas.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { canvas.style.display = 'none'; return; }

    let W, H, particles;
    const PARTICLE_COUNT = window.innerWidth < 680 ? 40 : 70;

    /* Soft gold colors that pop on light background */
    const COLORS = [
      'rgba(179,143,55,VAL)',
      'rgba(212,175,55,VAL)',
      'rgba(140,109,32,VAL)',
    ];

    class Particle {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x    = Math.random() * W;
        this.y    = initial ? Math.random() * H : H + 10;
        this.r    = Math.random() * 2 + 0.5;
        this.vy   = -(Math.random() * 0.5 + 0.2);
        this.vx   = (Math.random() - 0.5) * 0.25;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 120;
        const c   = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.colorFn = (a) => c.replace('VAL', a);
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.shape = Math.random() < 0.1 ? 'star' : 'circle';
      }

      update() {
        this.x    += this.vx;
        this.y    += this.vy;
        this.life++;
        this.twinkle += this.twinkleSpeed;
        if (this.life > this.maxLife || this.y < -10) this.reset();
      }

      draw(ctx) {
        const progress = this.life / this.maxLife;
        const alpha    = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
            ? (1 - progress) / 0.2
            : 1;
        const twinkledAlpha = alpha * (0.4 + 0.6 * Math.sin(this.twinkle));
        const color = this.colorFn(twinkledAlpha.toFixed(3));

        ctx.save();
        ctx.fillStyle   = color;

        if (this.shape === 'star') {
          drawStar(ctx, this.x, this.y, this.r * 1.8, this.twinkle);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function drawStar(ctx, x, y, r, rot) {
      const spikes = 4;
      const inner  = r * 0.4;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const angle  = rot + (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? r : inner;
        if (i === 0) ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
        else          ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => { p.update(); p.draw(ctx); });
      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize, { passive: true });
    init();
    loop();
  }

  /* ── 9. ACTIVE NAV HIGHLIGHT ──────────────────────────── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => {
              a.classList.toggle(
                'nav-active',
                a.getAttribute('href') === '#' + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s));

    const style = document.createElement('style');
    style.textContent = `
      .nav-links a.nav-active { color: #B38F37; }
      .nav-links a.nav-active::after { width: 100%; }
    `;
    document.head.appendChild(style);
  }

  /* ── INIT ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroFadeIns();
    initScrollReveal();
    initNavbar();
    initMobileNav();
    initSmoothScroll();
    initParallax();
    initRsvpNotify();
    initParticles();
    initActiveNav();
  });
})();