/* ═══════════════════════════════════════════════════════════
   Pixel Marketing Studio — Main JS
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────
  const WA_NUMBER = '5491173655126';
  const WA_MESSAGE = '¡Hola! Quiero información sobre sus servicios.';
  const WA_DISPLAY = '+54 9 11 7365-5126';

  function waLink(msg) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg || WA_MESSAGE);
  }

  // ── Splash ──────────────────────────────────────────────
  function initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;
    setTimeout(function () { splash.classList.add('fade-out'); }, 1700);
    setTimeout(function () { splash.remove(); }, 2350);
  }

  // ── Mobile Menu ─────────────────────────────────────────
  function initMobileMenu() {
    const burger = document.querySelector('.nav__burger');
    const menu = document.querySelector('.nav__mobile-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── WhatsApp Links ──────────────────────────────────────
  function initWhatsAppLinks() {
    document.querySelectorAll('[data-wa-link]').forEach(function (el) {
      el.href = waLink();
    });
    var display = document.querySelector('[data-wa-display]');
    if (display) display.textContent = WA_DISPLAY + ' · respuesta en el día';
  }

  // ── Contact Form → WhatsApp ─────────────────────────────
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var submitBtn = document.getElementById('contactSubmit');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('fieldNombre');
      var rubro = document.getElementById('fieldRubro');
      var mensaje = document.getElementById('fieldMensaje');

      var parts = ['¡Hola! Soy ' + (nombre && nombre.value ? nombre.value : '…')];
      if (rubro && rubro.value) parts.push('Rubro: ' + rubro.value);
      if (mensaje && mensaje.value) parts.push(mensaje.value);

      window.open(waLink(parts.join('. ')), '_blank');
    });
  }

  // ── Scroll Animations ──────────────────────────────────
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ── Init ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initSplash();
    initMobileMenu();
    initWhatsAppLinks();
    initContactForm();
    initScrollAnimations();
  });
})();
