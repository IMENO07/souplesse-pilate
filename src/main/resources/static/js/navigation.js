/* ── SMOOTH NAVIGATION ──────────────────────────────
    Handles smooth scrolling and active link highlighting
    for navigation anchors.
    ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  setupSmoothScrolling();
  setupActiveNavTracking();
});

/* ── SMOOTH SCROLLING ──────────────────────────────── */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return; // Skip empty anchors
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && mobileMenu.style.display !== 'none') {
        mobileMenu.style.display = 'none';
      }
    });
  });
}

/* ── ACTIVE LINK TRACKING ──────────────────────────── */
function setupActiveNavTracking() {
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    
    // Update nav active state
    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
