/* ═══════════════════════════════════════════════════════════
   Pixel Marketing Studio — Main JS
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Config & i18n State ─────────────────────────────────
  const WA_NUMBER = '5491173655126';
  const WA_DISPLAY = '+54 9 11 7365-5126';
  var currentLang = 'es';

  function normalizeLang(lang) {
    if (!lang) return 'es';
    var l = String(lang).toLowerCase().trim();
    if (l === 'pr' || l === 'pt' || l.indexOf('pt') === 0) return 'pt';
    if (l === 'en' || l.indexOf('en') === 0) return 'en';
    return 'es';
  }

  function getWaDefaultMessage() {
    if (window.PX_TRANSLATIONS && window.PX_TRANSLATIONS[currentLang] && window.PX_TRANSLATIONS[currentLang]['wa.prefill']) {
      return window.PX_TRANSLATIONS[currentLang]['wa.prefill'];
    }
    return '¡Hola! Quiero información sobre sus servicios.';
  }

  function waLink(msg) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg || getWaDefaultMessage());
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
    if (display) {
      var badgeText = (window.PX_TRANSLATIONS && window.PX_TRANSLATIONS[currentLang] && window.PX_TRANSLATIONS[currentLang]['wa.badge_sub']) || (WA_DISPLAY + ' · respuesta en el día');
      display.textContent = badgeText;
    }
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
        var errText = (window.PX_TRANSLATIONS && window.PX_TRANSLATIONS[currentLang] && window.PX_TRANSLATIONS[currentLang]['contacto.form.name_err']) || 'Escribí tu nombre para que sepamos a quién responder.';
        if (error) error.textContent = errText;
        nombre.focus();
        return;
      }

      var greeting = currentLang === 'en' ? 'Hello! I am ' : (currentLang === 'pt' ? 'Olá! Sou ' : '¡Hola! Soy ');
      var nichePrefix = currentLang === 'en' ? 'Industry: ' : (currentLang === 'pt' ? 'Segmento: ' : 'Rubro: ');

      var parts = [greeting + name];
      if (rubro && rubro.value) parts.push(nichePrefix + rubro.value);
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

  // ── Text Reveals (Cinematic Line-by-Line) ───────────────
  function initTextReveals() {
    var lines = document.querySelectorAll('.reveal-line');
    if (!lines.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lines.forEach(function (l) { l.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var container = target.closest('h1, h2, h3, p, .hero') || target.parentElement;
          var group = container ? Array.prototype.slice.call(container.querySelectorAll('.reveal-line')) : [target];
          var idx = group.indexOf(target);
          var delay = idx > 0 ? idx * 130 : 0;

          setTimeout(function () {
            target.classList.add('is-visible');
          }, delay);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    lines.forEach(function (l) { observer.observe(l); });
  }

  // ── Flow Lines (Scroll Directives) ──────────────────────
  function initFlowLines() {
    var lines = document.querySelectorAll('.flow-line, .flow-line--vertical');
    if (!lines.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lines.forEach(function (l) { l.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

    lines.forEach(function (l) { observer.observe(l); });
  }

  // ── Subtitle Rotator (Morph Blur) ───────────────────────
  var rotatorInterval = null;
  function initTextRotator() {
    var rot = document.getElementById('rotator');
    if (!rot) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function getNiches() {
      if (window.PX_NICHES && window.PX_NICHES[currentLang]) {
        return window.PX_NICHES[currentLang];
      }
      var custom = rot.getAttribute('data-niches');
      if (custom) {
        try { return JSON.parse(custom); } catch (e) {}
      }
      return [
        'Meta Ads para Medicina Estética',
        'Lanzamientos Inmobiliarios en Pozo',
        'Concesionarias y Modelos Premium',
        'Embudos High Ticket & Cierre'
      ];
    }

    var idx = 0;
    if (rotatorInterval) clearInterval(rotatorInterval);
    rotatorInterval = setInterval(function () {
      var niches = getNiches();
      rot.classList.add('blur-out');
      setTimeout(function () {
        idx = (idx + 1) % niches.length;
        rot.textContent = niches[idx];
        rot.classList.remove('blur-out');
        rot.classList.add('blur-in');
        setTimeout(function () {
          rot.classList.remove('blur-in');
        }, 450);
      }, 380);
    }, 3400);
  }

  // ── Interactive Glow Cards (Mouse Spotlight) ───────────
  function initGlowCards() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    var cards = document.querySelectorAll('.glow-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var rafId = null;
      card.addEventListener('mousemove', function (e) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', x + 'px');
          card.style.setProperty('--mouse-y', y + 'px');
        });
      }, { passive: true });
    });
  }

  // ── Language Switcher (i18n) ────────────────────────────
  function applyLanguage(lang) {
    currentLang = normalizeLang(lang);
    document.documentElement.lang = currentLang;
    try { localStorage.setItem('pxLang', currentLang); } catch (e) {}

    // Update active state on all language buttons (desktop & mobile)
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      var btnLang = normalizeLang(btn.getAttribute('data-lang-btn'));
      var isActive = btnLang === currentLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    var dict = (window.PX_TRANSLATIONS && window.PX_TRANSLATIONS[currentLang]) || {};

    // Translate all [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Translate all [data-i18n-placeholder]
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // Update WhatsApp links & badge text
    initWhatsAppLinks();

    // Update rotator text immediately in the new language
    var rot = document.getElementById('rotator');
    if (rot && window.PX_NICHES && window.PX_NICHES[currentLang]) {
      var niches = window.PX_NICHES[currentLang];
      rot.textContent = niches[0];
    }
  }

  function initLanguageSwitcher() {
    var urlParam = null;
    try {
      urlParam = new URLSearchParams(window.location.search).get('lang');
    } catch (e) {}
    var saved = null;
    try {
      saved = localStorage.getItem('pxLang');
    } catch (e) {}

    var initialLang = normalizeLang(urlParam || saved || 'es');

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var targetLang = btn.getAttribute('data-lang-btn');
        applyLanguage(targetLang);
      });
    });

    applyLanguage(initialLang);
  }

  // ── Init ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initSplash();
    initMobileMenu();
    initLanguageSwitcher();
    initWhatsAppLinks();
    initContactForm();
    initScrollAnimations();
    initTextReveals();
    initFlowLines();
    initTextRotator();
    initGlowCards();
  });
})();
