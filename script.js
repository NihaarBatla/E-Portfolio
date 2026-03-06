/* ════════════════════════════════════════════
   NIHAAR BATLA — ePORTFOLIO
   script.js
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Custom cursor ── */
  const cursor    = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverEls = document.querySelectorAll(
    'a, button, .media-card, .outcome-card, .tag, .tl-entry'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorRing.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorRing.classList.remove('hover');
    });
  });


  /* ── 2. Scroll progress bar ── */
  const scrollBar = document.getElementById('scrollBar');
  function updateScrollBar() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.transform = `scaleX(${scrolled / total})`;
  }
  window.addEventListener('scroll', updateScrollBar, { passive: true });


  /* ── 3. Nav: shrink + scrolled class ── */
  const nav = document.getElementById('nav');
  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ── 4. Hero background text parallax ── */
  const heroBg = document.querySelector('.hero-bg-text');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.2) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.16}px)`;
      }
    }, { passive: true });
  }


  /* ── 5. Scroll-reveal: timeline entries, rfl-blocks, outcome cards ── */
  const revealItems = document.querySelectorAll('.js-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.js-reveal')];
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(el => revealObserver.observe(el));


  /* ── 6. Reflection nav: highlight active block ── */
  const rflBlocks = document.querySelectorAll('.rfl-block[id]');
  const rflLinks  = document.querySelectorAll('.rfl-link');

  const rflObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        rflLinks.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.rfl-link[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  rflBlocks.forEach(b => rflObserver.observe(b));


  /* ── 7. Smooth anchor scroll with offset for fixed nav ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 8. Stat counters (animate numbers on scroll) ── */
  const statNums = document.querySelectorAll('.stat-num');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      // Only animate pure numbers or numbers with suffix like "20+"
      const match = raw.match(/^([\d.]+)(.*)$/);
      if (!match) return;
      const end    = parseFloat(match[1]);
      const suffix = match[2] || '';
      const isFloat = match[1].includes('.');
      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = end * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => countObserver.observe(el));


  /* ── 9. Outcome value counters ── */
  const outcomeVals = document.querySelectorAll('.outcome-val');

  const outcomeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const match = raw.match(/^([\d.]+)(.*)$/);
      if (!match) return;
      const end    = parseFloat(match[1]);
      const suffix = match[2] || '';
      const isFloat = match[1].includes('.');
      const duration = 800;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = end * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      outcomeObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  outcomeVals.forEach(el => outcomeObserver.observe(el));


  /* ── 10. Media card tilt on hover ── */
  document.querySelectorAll('.media-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-3px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 11. Photo frame accent line re-trigger on scroll into view ── */
  const photoWrap = document.querySelector('.photo-wrap');
  if (photoWrap) {
    const photoObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelector('.photo-deco-line')?.classList.add('animate');
          photoObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    photoObs.observe(photoWrap);
  }

});
