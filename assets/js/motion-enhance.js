/* =========================================================
   Johana Duque & Consultores S.A.S — motion-enhance.js
   ---------------------------------------------------------
   Capa OPCIONAL de animación sobre la librería Motion.

   El sitio funciona completo sin este archivo: las animaciones
   base son CSS y viven en styles.css. Aquí solo se agrega lo que
   CSS no puede hacer de forma portable:

     · animación ligada al scroll (CSS Scroll-driven Animations
       todavía no tiene soporte en Safari ni Firefox estables)
     · resortes con física real, en vez de curvas cubic-bezier

   Se carga como módulo diferido. Si falla la descarga o el
   navegador no soporta módulos, no pasa nada: queda el CSS.
   ========================================================= */
import { animate, scroll } from './vendor/motion.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced) {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* -------------------------------------------------------
     1. Profundidad del hero ligada al scroll
     Cada capa avanza a distinta velocidad, así el hero se
     despide con sensación de profundidad en vez de irse plano.
     ------------------------------------------------------- */
  const hero = $('#inicio');
  if (hero) {
    const track = (el, keyframes) => {
      if (!el) return;
      scroll(animate(el, keyframes, { ease: 'linear' }),
             { target: hero, offset: ['start start', 'end start'] });
    };

    track($('.hero__glow--a'), { y: [0, 150] });
    track($('.hero__glow--b'), { y: [0, 90] });
    track($('.hero__lines'),   { y: [0, 60], opacity: [0.85, 0.2] });
    track($('.hero__copy'),    { y: [0, 70], opacity: [1, 0.35] });
    // El retrato se queda atrás a propósito: refuerza que está al frente.
    track($('#stage'),         { y: [0, -34] });
  }

  /* -------------------------------------------------------
     2. Barra de progreso de lectura
     Se pasa a la línea de tiempo del scroll: deja de depender
     de un listener y de recalcular ancho en cada frame.
     ------------------------------------------------------- */
  const bar = $('#scrollBar');
  if (bar) {
    bar.dataset.motion = '1';   // main.js deja de tocar el ancho
    bar.style.width = '100%';
    bar.style.transformOrigin = 'left';
    bar.style.transform = 'scaleX(0)';
    scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));
  }

  /* -------------------------------------------------------
     3. Retrato del hero: seguimiento del puntero con resorte
     Sustituye la transición lineal de main.js. El resorte
     sobrepasa levemente y se asienta: se siente material.
     ------------------------------------------------------- */
  const stage = $('#stage');
  const photo = $('#stagePhoto');
  if (stage && photo && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.dataset.motion = '1';   // main.js cede el control
    photo.style.transition = 'none';

    const settle = { type: 'spring', stiffness: 110, damping: 18, mass: 0.9 };

    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      animate(photo, {
        x: ((e.clientX - r.left) / r.width - 0.5) * 22,
        y: ((e.clientY - r.top) / r.height - 0.5) * 16,
      }, settle);
    });

    stage.addEventListener('mouseleave', () => {
      animate(photo, { x: 0, y: 0 }, { type: 'spring', stiffness: 90, damping: 16 });
    });
  }

  /* -------------------------------------------------------
     4. Respuesta al pulsar
     Solo en elementos que no llevan ya un transform propio en
     CSS: si no, el transform en línea que escribe Motion
     anularía el desplazamiento del hover.
     ------------------------------------------------------- */
  const press = { type: 'spring', stiffness: 700, damping: 30 };
  const release = { type: 'spring', stiffness: 420, damping: 18 };

  $$('.shot, .slider__btn, .mobile-bar a, .lightbox__nav, .lightbox__close')
    .forEach((el) => {
      const down = () => animate(el, { scale: 0.96 }, press);
      const up   = () => animate(el, { scale: 1 }, release);
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointerleave', up);
      el.addEventListener('pointercancel', up);
    });
}
