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
