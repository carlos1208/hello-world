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

## Sesión 5 — Recorrido visible y generador de la traza
- **Fase / semana:** F0 · semana 1
- **Hecho:**
  - **Estructura del recorrido:** cada instrumento se divide en tres tramos
    rotulados — *Paso 1 de 3 · Entender*, *Paso 2 de 3 · Practicar* («Ahora
    practiquemos lo aprendido»), *Paso 3 de 3 · Comprobar*. Cada tramo se marca
    en verde cuando se cierra, así se ve dónde se va sin leer nada.
  - **Comprobación en los cuatro instrumentos,** no solo en el primero: siete
    preguntas en total, cada opción incorrecta devuelve a una capa concreta.
    Un instrumento se cuenta cerrado cuando se practicó **y** se comprobó.
  - **Generador de la traza** (pestaña Entregable): lee `git bisect log`, separa
    los extremos del rango de las pruebas reales, cuenta los `skip`, compara los
    pasos contra log₂(n) y arma el borrador del entregable. La sección 6 —el
    mecanismo— la deja vacía a propósito.
  - Enlaces directos por pestaña: `modulo-1.html#entregable`.
- **Medido:** el lector de trazas probado contra la salida real del laboratorio,
  una traza sin converger, una con `skip` y texto basura. Los cuatro casos dan
  el resultado correcto.
- **Pendiente:** el laboratorio real y la traza. La plataforma ya no tiene
  excusas que ofrecer.

## Sesión 6 — El sitio publicado, y lo que enseñó publicarlo
- **Fase / semana:** F0 · semana 1
- **Hecho:** la plataforma queda publicada en Netlify desde `master`. Cuatro
  PR fusionados (#2 a #4) y tres fallos reales encontrados por el camino:
  - **Escaneo de secretos.** Netlify trata toda variable de entorno como
    secreta y falló el despliegue por `GEMINI_MODELO` — el nombre de un
    modelo, no una clave. El asistente de Netlify diagnosticó mal (culpó a la
    clave de Gemini y mandó a reescribir el historial); el registro decía qué
    variable y en qué línea. **Leer la traza, no el resumen.**
  - **Node 20 contra Node 22.** `@netlify/blobs` exige 22 y `netlify.toml`
    fijaba 20. El despliegue pasaba con avisos: solo habría fallado al
    sincronizar el avance entre dispositivos. Un sistema que corre y entrega
    mal, otra vez.
  - **404 del tutor.** No era de Netlify: era Google. `gemini-2.5-flash-lite`
    está en retirada (apagado el 16 de octubre de 2026) y la API responde 404
    con un modelo que ya no existe. La función dejó de depender de un nombre
    fijo: prueba candidatos vigentes y recuerda el que sirve.
- **Además:** favicon propio, avisos flotantes para que ninguna acción quede
  muda (guardar la clave no daba señal), y movimiento con intención —
  desactivado bajo `prefers-reduced-motion`.
- **Medido:** despliegue en verde, 712 archivos escaneados sin secretos, dos
  funciones publicadas.
- **Pendiente:** verificar el tutor y la sincronización en el sitio real. Y lo
  de siempre, que sigue sin moverse: el laboratorio de bisect y la sección 6
  del entregable.
