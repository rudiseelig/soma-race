/* ============================================
   RACE TRACK — Hero Animations (GSAP)
   SVG Hero with scroll effects
   ============================================ */

(function () {
  'use strict';

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    animateRaceHero();
    animateTrackLineContinuation();
    animateHeroCars();
  }

  /* --- Main Hero Timeline --- */
  function animateRaceHero() {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // Hero SVG fades in and scales subtly
    tl.fromTo('.hero-svg',
      { opacity: 0, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
    );

    // Scroll indicator
    tl.fromTo('.hero-scroll-indicator',
      { opacity: 0 },
      { opacity: 0.3, duration: 0.5 },
      '-=0.3'
    );

  }

  /* --- Track line continuation through sections --- */
  function animateTrackLineContinuation() {
    const segment = document.querySelector('.track-line-segment');
    if (!segment) return;

    gsap.fromTo(segment,
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.track-line-thread',
          start: 'top 85%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    document.querySelectorAll('.section-with-track').forEach(section => {
      gsap.fromTo(section,
        { '--track-line-opacity': 0 },
        {
          '--track-line-opacity': 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  /* --- Animate Cars Inside Hero SVG --- */
  function animateHeroCars() {
    const svgObject = document.querySelector('.hero-svg');
    if (!svgObject) return;

    function setupCarAnimations(svgDoc) {
      var svgNS = 'http://www.w3.org/2000/svg';

      // Green car (AI) — Group_8
      var greenCar = svgDoc.getElementById('Group_8');
      // White car (Human) — Group_7-2
      var whiteCar = svgDoc.getElementById('Group_7-2');

      // Use native SVG <animateTransform> — works reliably inside <object>
      function addBob(el, dist, dur) {
        if (!el) return;
        var anim = svgDoc.createElementNS(svgNS, 'animateTransform');
        anim.setAttribute('attributeName', 'transform');
        anim.setAttribute('type', 'translate');
        anim.setAttribute('values', '0 0; 0 ' + (-dist) + '; 0 0');
        anim.setAttribute('dur', dur + 's');
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('calcMode', 'spline');
        anim.setAttribute('keySplines', '0.42 0 0.58 1; 0.42 0 0.58 1');
        el.appendChild(anim);
      }

      addBob(greenCar, 15, 3);
      addBob(whiteCar, 12, 3.5);
    }

    // The <object> needs to fully load before we can access its contentDocument
    if (svgObject.contentDocument && svgObject.contentDocument.rootElement) {
      setupCarAnimations(svgObject.contentDocument);
    } else {
      svgObject.addEventListener('load', function () {
        const svgDoc = svgObject.contentDocument;
        if (svgDoc) {
          setupCarAnimations(svgDoc);
        }
      });
    }
  }

  /* --- Init on load --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
