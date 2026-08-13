/* =========================================================
   Johana Duque & Consultores S.A.S — main.js
   Interacciones: navegación, animaciones de entrada, contadores,
   acordeón, testimonios y validación de formularios.
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1. Header: fondo al hacer scroll + ocultar al bajar
     --------------------------------------------------------- */
  var header = $('#header');
  var bar    = $('#scrollBar');
  var toTop  = $('#toTop');
  var lastY  = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;

    header.classList.toggle('is-stuck', y > 40);

    // Se oculta al bajar (fuera del hero) y reaparece al subir.
    if (y > 480 && y > lastY + 6) {
      header.classList.add('is-hidden');
    } else if (y < lastY - 6) {
      header.classList.remove('is-hidden');
    }

    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('is-on', y > 700);

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     2. Menú móvil
     --------------------------------------------------------- */
  var burger = $('#burger');
  var menu   = $('#menu');
  var backdrop = null;

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('is-locked', open);

    if (open) {
      $$('.menu__a', menu).forEach(function (a, i) {
        a.style.setProperty('--md', (0.08 + i * 0.05).toFixed(2) + 's');
      });
      backdrop = document.createElement('div');
      backdrop.className = 'menu-backdrop';
      document.body.appendChild(backdrop);
      requestAnimationFrame(function () { backdrop.classList.add('is-on'); });
      backdrop.addEventListener('click', function () { setMenu(false); });
    } else if (backdrop) {
      var b = backdrop;
      backdrop = null;
      b.classList.remove('is-on');
      setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 400);
    }
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        if (menu.classList.contains('is-open')) setMenu(false);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---------------------------------------------------------
     3. Revelado progresivo al hacer scroll
     --------------------------------------------------------- */
  var revealables = $$('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     4. Contadores de cifras
     --------------------------------------------------------- */
  var counters = $$('.count');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-to'), 10) || 0;
    if (reduced) { el.textContent = String(target); return; }

    var dur = 1600;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased).toLocaleString('es-CO');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------------------------------------------------------
     5. Acordeón de preguntas frecuentes
     --------------------------------------------------------- */
  $$('.acc').forEach(function (item) {
    var head = $('.acc__head', item);
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Comportamiento tipo acordeón: solo uno abierto a la vez.
      $$('.acc').forEach(function (other) {
        other.classList.remove('is-open');
        $('.acc__head', other).setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------------------------------------------------
     6. Carrusel de testimonios
     --------------------------------------------------------- */
  (function slider() {
    var track = $('#sliderTrack');
    if (!track) return;

    var slides = $$('.quote', track);
    var dotsBox = $('#sliderDots');
    var viewport = $('#sliderViewport');
    var index = 0;
    var timer = null;
    var DELAY = 7000;

    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(b);
    });
    var dots = $$('button', dotsBox);

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === index); });
      slides.forEach(function (s, n) { s.setAttribute('aria-hidden', String(n !== index)); });
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function start() { if (!reduced && slides.length > 1) timer = setInterval(next, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    $('#nextQ').addEventListener('click', function () { next(); restart(); });
    $('#prevQ').addEventListener('click', function () { prev(); restart(); });

    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    viewport.addEventListener('focusin', stop);

    // Gesto táctil
    var x0 = null;
    viewport.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
      x0 = null;
      start();
    });

    // Pausa cuando la pestaña no está visible
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : restart();
    });

    go(0);
    start();
  })();

  /* ---------------------------------------------------------
     7. Formularios: validación y estados
     --------------------------------------------------------- */
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  // Acepta formatos colombianos: 3001234567, 605 000 0000, +57 300 123 4567
  var RE_TEL   = /^[+()\d\s.-]{7,20}$/;

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, msg) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.add('has-error');
    var slot = $('.field__err', f);
    if (slot) slot.textContent = msg;
  }

  function clearError(input) {
    var f = fieldOf(input);
    if (!f) return;
    f.classList.remove('has-error');
    var slot = $('.field__err', f);
    if (slot) slot.textContent = '';
  }

  function validate(input) {
    var v = (input.value || '').trim();
    var type = input.type;

    if (input.hasAttribute('required') && !v) {
      setError(input, 'Este campo es obligatorio.');
      return false;
    }
    if (type === 'email' && v && !RE_EMAIL.test(v)) {
      setError(input, 'Ingrese un correo válido.');
      return false;
    }
    if (type === 'tel' && v && !RE_TEL.test(v)) {
      setError(input, 'Ingrese un número de contacto válido.');
      return false;
    }
    if (input.tagName === 'TEXTAREA' && v && v.length < 15) {
      setError(input, 'Cuéntenos un poco más (mínimo 15 caracteres).');
      return false;
    }
    clearError(input);
    return true;
  }

  function showMsg(el, text, ok) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove('is-ok', 'is-err');
    el.classList.add('is-on', ok ? 'is-ok' : 'is-err');
  }

  function wireForm(form, msgEl, opts) {
    if (!form) return;
    opts = opts || {};
    var inputs = $$('input, select, textarea', form).filter(function (i) { return i.type !== 'checkbox'; });

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value.trim()) validate(input); });
      input.addEventListener('input', function () { if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) validate(input); });
      input.addEventListener('change', function () { if (input.tagName === 'SELECT') validate(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;
      inputs.forEach(function (input) { if (!validate(input)) ok = false; });

      // Autorización de tratamiento de datos
      var check = $('input[type="checkbox"][required]', form);
      var checkErr = $('#habErr');
      if (check) {
        if (!check.checked) {
          ok = false;
          if (checkErr) {
            checkErr.textContent = 'Debe autorizar el tratamiento de sus datos para continuar.';
            checkErr.classList.add('is-on');
          }
        } else if (checkErr) {
          checkErr.textContent = '';
          checkErr.classList.remove('is-on');
        }
      }

      if (!ok) {
        showMsg(msgEl, 'Revise los campos marcados antes de enviar.', false);
        var firstBad = $('.field.has-error input, .field.has-error select, .field.has-error textarea', form);
        if (firstBad) firstBad.focus();
        return;
      }

      // NOTA DE INTEGRACIÓN: aquí debe conectarse el envío real
      // (Formspree, EmailJS, un endpoint propio o el CRM de la firma).
      // Mientras tanto se simula la respuesta para no perder el mensaje del usuario.
      var btn = $('button[type="submit"]', form);
      if (btn) {
        btn.classList.add('is-loading');
        var label = $('.btn__label', btn);
        var original = label ? label.textContent : btn.textContent;
        if (label) label.textContent = 'Enviando…';
      }

      setTimeout(function () {
        if (btn) {
          btn.classList.remove('is-loading');
          var lb = $('.btn__label', btn);
          if (lb) lb.textContent = original;
        }
        showMsg(msgEl, opts.success || 'Gracias. Hemos recibido su mensaje y lo contactaremos dentro de las próximas 24 horas hábiles.', true);
        form.reset();
        $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
      }, 900);
    });
  }

  wireForm($('#miniForm'), $('#miniMsg'), {
    success: 'Solicitud recibida. Lo contactaremos muy pronto.'
  });
  wireForm($('#mainForm'), $('#mainMsg'));

  /* ---------------------------------------------------------
     8. Enlace activo según la sección visible
     --------------------------------------------------------- */
  var links = $$('.menu__a');
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ---------------------------------------------------------
     9. Detalles finales
     --------------------------------------------------------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Duplica la marquesina si el ancho no alcanza para el bucle continuo.
  var track = $('.marquee__track');
  if (track && track.scrollWidth < window.innerWidth * 2) {
    track.innerHTML += track.innerHTML;
  }
})();
