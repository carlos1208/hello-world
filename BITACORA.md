# Bitácora

Una entrada por sesión. Se escribe **al cerrar**, no al abrir.
Formato: dónde estoy · qué hice · qué medí · qué sigue.

---

## Sesión 0 — Montaje del terreno
- **Fase / semana:** F0 · pre-semana 1
- **Hecho:** repositorio inicializado con `CLAUDE.md`, estructura de fases,
  `.gitignore` con datos excluidos y plantilla de ADR.
- **Medido:** nada todavía.
- **Pendiente para la siguiente sesión:** decidir si se completa la capa
  profesional del Módulo 1 (`reflog`, rebase interactivo, `bisect`) antes de
  pasar al Módulo 2 (OLTP/OLAP, Parquet por dentro, idempotencia).
  *Recomendación del mentor: completarlo ahora.*

## Sesión 1 — Módulo 1, capa profesional
- **Fase / semana:** F0 · semana 1
- **Hecho:** completada la capa profesional del Módulo 1.
  - `notas/01..04` — modelo de objetos, `reflog`, rebase interactivo, `bisect`,
    cada una con autoevaluación.
  - `labs/lab-bisect/montar-laboratorio.py` — genera un repositorio desechable
    de 19 commits con un defecto silencioso sembrado (el MTTR pasa de mediana a
    promedio), datos congelados y `prueba.sh` fuera del árbol bisecado.
  - `entregable/traza-bisect.md` — plantilla de la traza.
  - **Plataforma interactiva:** https://claude.ai/artifact/VB9pErnVpXhX4x8B9Brb4z
    (explorador de objetos, terminal de reflog, editor de rebase, simulador de
    bisect con el caso del commit no probable).
- **Medido:** el laboratorio converge en 4 pruebas sobre 11 commits de rango y
  señala «Simplificar el cálculo del MTTR». MTTR correcto 2.83 h, defectuoso
  4.11 h.
- **Pendiente para la siguiente sesión:** hacer el lab en el repositorio real,
  llenar `traza-bisect.md` y escribir `resumen-en.md`. Después, Módulo 2:
  OLTP/OLAP, Parquet por dentro, idempotencia.

## Sesión 2 — Ajuste de método: aprendizaje guiado por capas
- **Fase / semana:** F0 · semana 1
- **Hecho:** el material asumía fluidez de desarrollador. Se corrigió antes de
  avanzar al Módulo 2.
  - `CLAUDE.md` §2 — método de seis capas (empieza aquí → cómo funciona → hazlo
    → vocabulario → nivel profesional → comprobación) y las ocho reglas que lo
    sostienen. Aplica a notas, labs, plataformas y conversación.
  - Las cuatro notas del Módulo 1, reescritas por capas. Cada comprobación
    indica a qué capa volver si se falla, no «relee todo».
  - `labs/lab-bisect/README.md` — capa base: qué es una terminal, un script y
    un código de salida.
  - Plataforma: cada instrumento se abre capa por capa, con control de ritmo
    («capa por capa» / «ver todo»).
- **Medido:** nada nuevo; el laboratorio sigue convergiendo en 4 pruebas.
- **Pendiente para la siguiente sesión:** leer las capas 1 a 3 de las cuatro
  notas, hacer el lab real y llenar `traza-bisect.md`. Después, Módulo 2.

## Sesión 3 — Glosario a un clic
- **Fase / semana:** F0 · semana 1
- **Hecho:**
  - `plataforma/glosario.js` — 45 términos con definición corta (la del tooltip)
    y completa (la del modal), cada una en lenguaje llano y con su puente a la
    ruta. Se publica como archivo de apoyo del artefacto, así que los módulos
    siguientes lo reutilizan en vez de duplicarlo.
  - La plataforma subraya los términos **automáticamente**: recorre el texto,
    marca la primera aparición de cada término por bloque y le pone tooltip
    (cursor) y modal (clic o toque). Funciona también con teclado.
  - `CLAUDE.md` §2 regla 9: ninguna palabra técnica sin definición a un clic.
- **Pendiente para la siguiente sesión:** sin cambios — leer las capas 1 a 3,
  hacer el lab real y llenar `traza-bisect.md`.

## Sesión 4 — La plataforma sale de Claude
- **Fase / semana:** F0 · semana 1
- **Hecho:** la plataforma pasa de ser solo un artefacto a un sitio propio, sin
  dejar de funcionar como artefacto.
  - `app/` — el sitio entero. La misma página corre en los tres sitios y en los
    tres guarda: `almacenamiento.js` detecta si está dentro de Claude (db), en
    el sitio propio (`/api/progreso`) o en un archivo suelto (solo local).
  - `netlify/functions/tutor.mjs` — el botón «no entendí», contra Gemini.
    **La clave vive en variables de entorno, nunca en la página:** una clave de
    API en el JavaScript del navegador es pública.
  - `netlify/functions/progreso.mjs` — avance sincronizado en Netlify Blobs,
    indexado por la huella SHA-256 de una clave personal. Funde en vez de pisar,
    así dos dispositivos no se borran el avance.
  - PWA: instalable en el celular y funciona sin señal.
  - `docs/despliegue.md` — los cuatro pasos manuales, explicados por capas.
- **Pendiente:** los pasos manuales son suyos (cuenta de Netlify, clave de
  Gemini, clave personal). Y sigue pendiente el lab real y `traza-bisect.md`.
