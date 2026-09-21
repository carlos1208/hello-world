# F0 · Base: Git profesional y fundamentos
**Semanas 1–3 · 30 h**

## Objetivo
El diagnóstico marcó **Git y línea de comandos en 0/3** y **conceptos de datos
en 1/3**. A nivel profesional esta fase no es «aprender a hacer commit»: es
dominar el historial como herramienta forense, que es lo que usarás cuando un
pipeline empiece a entregar datos malos y haya que encontrar cuándo se rompió.

## Git como herramienta de diagnóstico
**Material escrito: [`notas/`](notas/00-indice.md) · Plataforma interactiva: ver abajo.**

- [ ] [El modelo de objetos](notas/01-modelo-de-objetos.md): blob, tree, commit y por qué
      un commit es inmutable — *sin esto, rebase y reset se aprenden de memoria*
- [ ] [`reflog`](notas/02-reflog.md): recuperar trabajo que creías perdido — *Git casi
      nunca borra; saberlo cambia cuánto te arriesgas a experimentar*
- [ ] [Rebase interactivo](notas/03-rebase-interactivo.md): reescribir, fusionar y
      reordenar commits antes de publicarlos
- [ ] [`git bisect`](notas/04-bisect.md): búsqueda binaria del commit que rompió el
      pipeline — el culpable entre 200 en ~8 pasos · https://git-scm.com/docs/git-bisect
- [ ] Hooks de pre-commit para validar datos y limpiar salidas de notebooks
- [ ] Modelo de ramas para un proyecto de datos y estrategia de `.gitignore`
      — *datos fuera del repo, siempre*
- [ ] **[Lab · Encontrar el commit que rompió el MTTR](labs/lab-bisect/)** — un pipeline
      que corre sin errores y entrega un número equivocado; 11 commits de rango.
      *Entregas [la traza](entregable/traza-bisect.md), no el hash.*

## Shell para ingeniería de datos
- [ ] MIT Missing Semester — Shell Tools y Version Control · https://missing.csail.mit.edu/2020/
- [ ] Tuberías, redirección, códigos de salida y encadenamiento condicional
      — *un pipeline que no verifica códigos de salida falla en silencio*
- [ ] **Lab** · Pareto de alarmas y perfilado de un archivo grande sin cargarlo en memoria

## Conceptos de datos y refuerzo dirigido
- [ ] OLTP frente a OLAP: normalización, índices, y por qué la analítica mata una
      base transaccional — *punto fallado; sostiene las fases 2, 3 y 4 completas*
- [ ] Parquet por dentro: grupos de filas, estadísticas por columna, predicate pushdown
- [ ] Idempotencia y semántica de entrega: al-menos-una-vez, a-lo-más-una-vez, exactamente-una-vez
- [ ] SQL: leer un plan de ejecución, no solo escribir la consulta
- [ ] Kimball: grano, esquema estrella, SCD tipo 2 · https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/

## Entregable
Repositorio con historial limpio, hooks de validación activos, y la traza
documentada de un `bisect` que localiza un commit defectuoso introducido a propósito.

## Puente con tu perfil
Git a este nivel es análisis de causa raíz sobre código. `bisect` es literalmente
una búsqueda binaria para aislar la causa de un defecto: el mismo razonamiento de
la fase *Analyze* de DMAIC, aplicado a un repositorio.

## Estado del módulo
El Módulo 1 cubrió primero las cuatro zonas, los comandos y el pipeline de shell
(nivel Associate). **La capa profesional ya está completa:** modelo de objetos,
`reflog`, rebase interactivo y `bisect`, con laboratorio ejecutable y entregable.

- **Material escrito:** [`notas/`](notas/00-indice.md) — cuatro notas, cada una
  con su autoevaluación.
- **Laboratorio:** [`labs/lab-bisect/`](labs/lab-bisect/) — `montar-laboratorio.py`
  construye un repositorio desechable con el defecto sembrado.
- **Plataforma interactiva:** simulador de bisect paso a paso, rescates de
  `reflog` y editor de rebase interactivo. Enlace en [`../../BITACORA.md`](../../BITACORA.md).

Pendiente de la fase: hooks de pre-commit, modelo de ramas, el bloque de shell y
el de conceptos de datos (Módulo 2).
