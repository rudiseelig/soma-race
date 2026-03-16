/* ============================================
   SOMA RACE — Main JavaScript
   GSAP Animations + Interactions
   ============================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Register ScrollTrigger first so nav color switch can use it
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  initCursor();
  initNav();
  initScrollAnimations();
  initMicroElements();
  initBarAnimations();
  initTicker();
  initPageTransitions();
});

/* --- Custom Cursor --- */
function initCursor() {
  const cursor = document.querySelector('.cursor-follower');
  if (!cursor || window.innerWidth < 768) return;

  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  // Hide cursor over nav links and footer
  document.querySelectorAll('nav a, nav button, .nav-links a, footer').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { opacity: 0, duration: 0.15 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { opacity: 1, duration: 0.15 });
    });
  });

  // Grow on hover over other interactive elements
  document.querySelectorAll('a:not(nav a):not(.nav-links a), button:not(nav button), .data-card, .split-panel').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { width: 160, height: 120, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { width: 128, height: 96, duration: 0.3 });
    });
  });
}

/* --- Navigation --- */
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    // On mobile with rotary overlay, skip nav-links toggle
    const rotaryOverlay = document.getElementById('rotary-overlay');
    if (!rotaryOverlay || window.innerWidth > 768) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // Active state based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Create underline overlays outside nav (so they escape mix-blend-mode)
  initNavUnderlines();

  // Detect dark sections and toggle cursor color
  initNavColorSwitch();
}

/* --- Nav underlines (outside blend context) --- */
function initNavUnderlines() {
  const links = document.querySelectorAll('.nav-links a');

  links.forEach(link => {
    const underline = document.createElement('div');
    underline.className = 'nav-underline';
    document.body.appendChild(underline);

    function positionUnderline() {
      const rect = link.getBoundingClientRect();
      underline.style.top = (rect.bottom - 2) + 'px';
      underline.style.left = (rect.left + 10) + 'px';
      underline.style.width = (rect.width - 20) + 'px';
    }

    // Show on hover
    link.addEventListener('mouseenter', () => {
      positionUnderline();
      underline.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
      if (!link.classList.contains('active')) {
        underline.classList.remove('active');
      }
    });

    // Show for active page link
    if (link.classList.contains('active')) {
      // Position after layout settles
      requestAnimationFrame(() => {
        positionUnderline();
        underline.classList.add('active');
      });
      // Reposition on scroll/resize
      window.addEventListener('resize', positionUnderline);
    }
  });
}

/* --- Nav + Cursor color switch on dark sections --- */
function initNavColorSwitch() {
  const cursor = document.querySelector('.cursor-follower');
  if (!cursor) return;

  // Cursor still needs JS toggling (no blend mode on cursor)
  const darkSections = document.querySelectorAll('.section-dark, [data-theme="dark"]');
  if (darkSections.length === 0) return;

  if (typeof ScrollTrigger !== 'undefined') {
    darkSections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top+=60',
        end: 'bottom top+=60',
        onEnter: () => { cursor.classList.add('cursor-on-dark'); },
        onLeave: () => { cursor.classList.remove('cursor-on-dark'); },
        onEnterBack: () => { cursor.classList.add('cursor-on-dark'); },
        onLeaveBack: () => { cursor.classList.remove('cursor-on-dark'); },
      });
    });
  }
}

/* --- Scroll Reveal Animations --- */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Basic reveals
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Left reveals
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Right reveals
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Scale reveals
  gsap.utils.toArray('.reveal-scale').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Staggered children
  gsap.utils.toArray('.stagger-children').forEach(container => {
    const children = container.children;
    gsap.from(children, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Parallax for micro elements
  gsap.utils.toArray('.parallax').forEach(el => {
    const speed = el.dataset.speed || 0.5;
    gsap.to(el, {
      y: () => -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/* --- Floating Micro Elements --- */
function initMicroElements() {
  const containers = document.querySelectorAll('.micro-elements');

  const symbols = ['✦', '◆', '○', '□', '△', '▽', '◇', '⬡', '✕', '⊕', '⊗', '→', '←', '↑', '↓'];
  const texts = ['51.4014° N', '1.3231° W', 'EST. 2026', 'SOMA', 'HUMAN', 'AI', 'RACE', 'DESIGN', 'COMPARE', '001', '002', '003'];

  containers.forEach(container => {
    const count = parseInt(container.dataset.count) || 15;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const isSymbol = Math.random() > 0.5;

      el.className = `micro-el ${isSymbol ? 'symbol' : ''} parallax`;
      el.dataset.speed = (Math.random() * 0.8 + 0.1).toFixed(2);
      el.textContent = isSymbol
        ? symbols[Math.floor(Math.random() * symbols.length)]
        : texts[Math.floor(Math.random() * texts.length)];

      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.transform = `rotate(${Math.random() * 360}deg)`;

      container.appendChild(el);
    }
  });
}

/* --- Animate Bar Charts on Scroll --- */
function initBarAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.bar-fill').forEach(bar => {
    const width = bar.dataset.width || '0%';
    bar.style.width = '0%';

    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(bar, {
          width: width,
          duration: 1.5,
          ease: 'power3.out'
        });
      },
      once: true
    });
  });
}

/* --- Ticker --- */
function initTicker() {
  const tickers = document.querySelectorAll('.ticker-content');
  tickers.forEach(ticker => {
    // Duplicate content for seamless loop
    const content = ticker.innerHTML;
    ticker.innerHTML = content + content;
  });
}

/* --- Page Transitions --- */
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.animation = 'none';
        gsap.to(document.body, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            window.location.href = href;
          }
        });
      });
    }
  });
}

/* --- Hero Animation (call on index page) --- */
function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;
  if (window.innerWidth <= 768) return;

  const tl = gsap.timeline({ delay: 0.3 });

  tl.from('.hero-title', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  })
  .from('.hero-title .vs', {
    opacity: 0,
    scaleX: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4')
  .from('.hero-subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.2')
  .from('.hero-scroll-indicator', {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.1');
}

/* --- Counter Animation --- */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* --- Utility: Create SVG placeholder --- */
function createSVGPlaceholder(text = 'SVG') {
  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;opacity:0.1">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 2"/>
      <text x="100" y="105" text-anchor="middle" font-family="monospace" font-size="8" fill="currentColor">${text}</text>
    </svg>
  `;
}

window.initHeroAnimation = initHeroAnimation;
