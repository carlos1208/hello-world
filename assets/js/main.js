/* =========================================================
   Johana Duque & Consultores S.A.S — interacciones
   Sin dependencias. Todo se degrada con prefers-reduced-motion.
   ========================================================= */
(function () {
  'use strict';

  /* Número de WhatsApp de la firma (formato internacional, sin + ni espacios) */
  var WHATSAPP = '573000000000';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1. Header: fondo al hacer scroll + ocultar al bajar
     --------------------------------------------------------- */
  var nav = $('[data-nav]');
  var bar = $('[data-progress]');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;

    if (nav) {
      nav.classList.toggle('is-stuck', y > 40);
      var goingDown = y > lastY && y > 420;
      if (!document.body.classList.contains('is-locked')) {
        nav.classList.toggle('is-hidden', goingDown);
      }
    }

    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    parallax(y);
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---------------------------------------------------------
     2. Parallax suave en el hero
     --------------------------------------------------------- */
  var layers = $$('[data-parallax]');
  function parallax(y) {
    if (reduced || y > window.innerHeight * 1.2) return;
    layers.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      el.style.transform = 'translate3d(0,' + (y * speed).toFixed(2) + 'px,0)';
    });
  }

  /* ---------------------------------------------------------
     3. Menú móvil
     --------------------------------------------------------- */
  var burger = $('[data-burger]');
  var drawer = $('[data-drawer]');

  function setDrawer(open) {
    if (!drawer || !burger) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('is-locked', open);
    if (open) {
      drawer.hidden = false;
      window.requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    } else {
      drawer.classList.remove('is-open');
      window.setTimeout(function () { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, 400);
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (drawer) {
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setDrawer(false);
  });

  /* ---------------------------------------------------------
     4. Reveal al entrar en pantalla
     --------------------------------------------------------- */
  var revealables = $$('[data-reveal]');
  revealables.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d + 'ms');
  });

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------------------------------------------------------
     5. Contadores animados
     --------------------------------------------------------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduced) { el.textContent = target + suffix; return; }

    var duration = 1500;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if (counters.length && !reduced) {
    /* El HTML trae el valor final (para SEO y para quien no tenga JS);
       aquí lo llevamos a cero justo antes de animar. */
    counters.forEach(function (el) { el.textContent = '0' + (el.getAttribute('data-suffix') || ''); });
  }
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(countUp);
    } else {
      var countObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          countObs.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObs.observe(el); });
    }
  }

  /* ---------------------------------------------------------
     6. Riel del proceso
     --------------------------------------------------------- */
  var rail = $('[data-rail]');
  if (rail && 'IntersectionObserver' in window) {
    var railObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        rail.style.width = '100%';
        railObs.disconnect();
      });
    }, { threshold: 0.35 });
    railObs.observe(rail.parentElement);
  } else if (rail) {
    rail.style.width = '100%';
  }

  /* ---------------------------------------------------------
     7. Tilt 3D sutil (retrato y sello)
     --------------------------------------------------------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    $$('[data-tilt]').forEach(function (el) {
      var frame = null;
      el.addEventListener('mousemove', function (e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          var r = el.getBoundingClientRect();
          var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
          var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
          el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
          frame = null;
        });
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------
     8. Acordeón de preguntas frecuentes
     --------------------------------------------------------- */
  $$('[data-acc]').forEach(function (acc) {
    var items = $$('.acc__item', acc);

    items.forEach(function (item) {
      var head  = $('.acc__head', item);
      var panel = $('.acc__panel', item);
      if (!head || !panel) return;

      head.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          $('.acc__head', other).setAttribute('aria-expanded', 'false');
          $('.acc__panel', other).style.height = '0px';
        });

        item.classList.toggle('is-open', !isOpen);
        head.setAttribute('aria-expanded', String(!isOpen));
        panel.style.height = isOpen ? '0px' : panel.scrollHeight + 'px';
      });
    });

    window.addEventListener('resize', function () {
      items.forEach(function (item) {
        if (!item.classList.contains('is-open')) return;
        var panel = $('.acc__panel', item);
        panel.style.height = panel.scrollHeight + 'px';
      });
    });
  });

  /* ---------------------------------------------------------
     9. Carrusel de testimonios
     --------------------------------------------------------- */
  $$('[data-slider]').forEach(function (slider) {
    var track  = $('[data-track]', slider);
    var slides = $$('li', track);
    var dotsEl = $('[data-dots]', slider);
    var index  = 0;
    var timer  = null;

    if (slides.length < 2) return;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sdot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Testimonio ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsEl.appendChild(b);
      return b;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-selected', String(n === index));
      });
      slides.forEach(function (s, n) { s.setAttribute('aria-hidden', String(n !== index)); });
    }

    function restart() {
      if (reduced) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () { go(index + 1); }, 7000);
    }

    $('[data-next]', slider).addEventListener('click', function () { go(index + 1); restart(); });
    $('[data-prev]', slider).addEventListener('click', function () { go(index - 1); restart(); });

    slider.addEventListener('mouseenter', function () { window.clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    /* Deslizar con el dedo */
    var startX = 0;
    var moved = false;
    slider.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; moved = false;
      window.clearInterval(timer);
    }, { passive: true });
    slider.addEventListener('touchmove', function () { moved = true; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (!moved) { restart(); return; }
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      restart();
    });

    go(0);
    restart();
  });

  /* ---------------------------------------------------------
     10. Formulario → WhatsApp
     --------------------------------------------------------- */
  var form = $('[data-form]');
  if (form) {
    var status = $('[data-status]', form);

    function fail(field, msg) {
      var wrap = field.closest('.field') || field.closest('.check');
      if (!wrap) return;
      wrap.classList.add('has-error');
      var err = $('[data-err]', wrap);
      if (err) err.textContent = msg;
    }

    function clear(field) {
      var wrap = field.closest('.field') || field.closest('.check');
      if (wrap) wrap.classList.remove('has-error');
    }

    $$('input, select, textarea', form).forEach(function (f) {
      f.addEventListener('input', function () { clear(f); });
      f.addEventListener('change', function () { clear(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre   = form.nombre;
      var telefono = form.telefono;
      var email    = form.email;
      var area     = form.area;
      var mensaje  = form.mensaje;
      var habeas   = form.habeas;
      var ok = true;

      if (nombre.value.trim().length < 3) { fail(nombre, 'Escribe tu nombre completo.'); ok = false; }

      var digits = telefono.value.replace(/\D/g, '');
      if (digits.length < 7) { fail(telefono, 'Ingresa un número de contacto válido.'); ok = false; }

      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        fail(email, 'Revisa el formato del correo.'); ok = false;
      }

      if (!area.value) { fail(area, 'Selecciona el área de tu caso.'); ok = false; }
      if (mensaje.value.trim().length < 12) { fail(mensaje, 'Cuéntanos un poco más sobre tu situación.'); ok = false; }

      if (!habeas.checked) {
        habeas.closest('.check').classList.add('has-error'); ok = false;
      }

      if (!ok) {
        status.textContent = 'Revisa los campos marcados para continuar.';
        status.classList.remove('is-ok');
        var firstError = $('.has-error input, .has-error select, .has-error textarea', form);
        if (firstError) firstError.focus();
        return;
      }

      var texto =
        'Hola, quisiera agendar una consulta con Johana Duque & Consultores S.A.S.\n\n' +
        'Nombre: ' + nombre.value.trim() + '\n' +
        'Teléfono: ' + telefono.value.trim() + '\n' +
        (email.value.trim() ? 'Correo: ' + email.value.trim() + '\n' : '') +
        'Área: ' + area.value + '\n\n' +
        'Caso: ' + mensaje.value.trim();

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');

      status.textContent = 'Abrimos WhatsApp con tu mensaje listo para enviar. ¡Gracias!';
      status.classList.add('is-ok');
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     11. Detalles finales
     --------------------------------------------------------- */
  var year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  onScroll();
})();
