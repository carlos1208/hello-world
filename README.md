# El Puño y la Sombra

Guía de lectura narrativa del universo **Street Fighter** (Capcom), en español.

`index.html` es un sitio de una sola página, sin dependencias, que presenta el mapa
de la saga antes de empezar la narración por capítulos:

- **Las ocho eras** en que se divide la historia interna.
- **Orden de lanzamiento vs. orden de la historia**, con un diagrama que muestra
  las cinco entregas que cambian de posición.
- **Canon, material secundario y no canon**, más la lista de retcones a explicar.
- **Los quince personajes clave**, con su debut y su entrada cronológica real.
- **El índice completo**: 54 capítulos en siete partes ordenadas cronológicamente,
  más tres apéndices.

Los emblemas de los personajes son marcas geométricas originales en SVG creadas
para esta guía; no reproducen arte oficial de Capcom.

Tipografías: Shippori Mincho B1, Zen Kaku Gothic New y Barlow Condensed (Google Fonts).
Tema claro y oscuro con tokens CSS.

## Estructura

- `index.html` — el índice: eras, orden real, canon, personajes, relaciones,
  glosario y el índice de los 54 capítulos.
- `cap-01.html`, `cap-02.html` — capítulos publicados, un artefacto por capítulo.
- `tools/build_chapters.py` — inyecta en todas las páginas de capítulo el
  cromado común (selector de tema, navegación anterior/siguiente y marcar como
  leído). Al añadir un capítulo, se registra en `CHAPTERS` y se ejecuta el
  script; es idempotente.

El progreso de lectura y la preferencia de tema se guardan en `localStorage`,
privados en el navegador de cada lector. No se envía nada a ningún servidor.
