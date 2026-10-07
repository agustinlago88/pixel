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
  // Shown only when <head> added .show-splash (first visit of the session).
  // CSS fades it out by itself; JS just removes the node afterwards.
  function initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;
    if (!document.documentElement.classList.contains('show-splash')) {
      splash.remove();
      return;
    }
    setTimeout(function () { splash.remove(); }, 2350);
  }

  // ── Mobile Menu ─────────────────────────────────────────
  function initMobileMenu() {
    const burger = document.querySelector('.nav__burger');
    const menu = document.querySelector('.nav__mobile-menu');
    if (!burger || !menu) return;

    const nav = document.querySelector('.nav');

    function setNavHeight() {
      if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    }

    function setOpen(open) {
      burger.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        setNavHeight();
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    }

    burger.addEventListener('click', function () {
      setOpen(!menu.classList.contains('open'));
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    // Close on Escape and return focus to the burger
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setOpen(false);
        burger.focus();
      }
    });

    // Close if the viewport grows past the mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && menu.classList.contains('open')) setOpen(false);
    });

    setNavHeight();
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

    var nombre = document.getElementById('fieldNombre');
    var rubro = document.getElementById('fieldRubro');
    var mensaje = document.getElementById('fieldMensaje');
    var error = document.getElementById('nombreError');

    function clearError() {
      if (!nombre) return;
      nombre.removeAttribute('aria-invalid');
      if (error) error.textContent = '';
    }
    if (nombre) nombre.addEventListener('input', clearError);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nombre ? nombre.value.trim() : '';
      if (nombre && !name) {
        nombre.setAttribute('aria-invalid', 'true');
        if (error) error.textContent = 'Escribí tu nombre para que sepamos a quién responder.';
        nombre.focus();
        return;
      }

      var parts = ['¡Hola! Soy ' + name];
      if (rubro && rubro.value) parts.push('Rubro: ' + rubro.value);
      if (mensaje && mensaje.value.trim()) parts.push(mensaje.value.trim());

      window.open(waLink(parts.join('. ')), '_blank', 'noopener');
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
