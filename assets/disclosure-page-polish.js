(() => {
  if (document.documentElement.dataset.dpPolish === 'ready') return;
  document.documentElement.dataset.dpPolish = 'ready';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('dp-polish-ready');

  if (!prefersReduced) {
    const glow = document.createElement('div');
    glow.className = 'dp-cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let raf = 0;
    window.addEventListener('pointermove', (event) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--dp-mx', `${event.clientX}px`);
        document.documentElement.style.setProperty('--dp-my', `${event.clientY}px`);
        raf = 0;
      });
    }, { passive: true });
  }

  const revealTargets = document.querySelectorAll([
    'main > section',
    '.container > .policy-block',
    '.container > .faq',
    '.section',
    '.card',
    '.step',
    '.faq',
    '.faq-card',
    '.step-card',
    '.role-card',
    '.protocol-card',
    '.timeline-card',
    '.brief-card',
    '.wide-card',
    '.level',
    '.arch-item',
    '.stat-box',
    '.intel-card',
    '.archive-card',
    '.file-card',
    '.priority-card',
    '.article-card'
  ].join(','));

  revealTargets.forEach((el) => el.classList.add('dp-reveal'));

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('dp-inview'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('dp-inview');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((el) => observer.observe(el));
})();
