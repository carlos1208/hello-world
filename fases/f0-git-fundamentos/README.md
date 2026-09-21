# F0 · Base: Git profesional y fundamentos
**Semanas 1–3 · 30 h**

## Objetivo
El diagnóstico marcó **Git y línea de comandos en 0/3** y **conceptos de datos
en 1/3**. A nivel profesional esta fase no es «aprender a hacer commit»: es
dominar el historial como herramienta forense, que es lo que usarás cuando un
pipeline empiece a entregar datos malos y haya que encontrar cuándo se rompió.

## Git como herramienta de diagnóstico
- [ ] El modelo de objetos: blob, tree, commit y por qué un commit es inmutable
      — *sin esto, rebase y reset se aprenden de memoria en vez de entenderse*
- [ ] `reflog`: recuperar trabajo que creías perdido — *Git casi nunca borra;
      saberlo cambia cuánto te arriesgas a experimentar*
- [ ] Rebase interactivo: reescribir, fusionar y reordenar commits antes de publicarlos
- [ ] `git bisect`: búsqueda binaria del commit que rompió el pipeline
      — encuentra el culpable entre 200 en ~8 pasos · https://git-scm.com/docs/git-bisect
- [ ] Hooks de pre-commit para validar datos y limpiar salidas de notebooks
- [ ] Modelo de ramas para un proyecto de datos y estrategia de `.gitignore`
      — *datos fuera del repo, siempre*
- [ ] **Lab** · Romper el pipeline a propósito, hacer 15 commits encima y encontrar
      el culpable con `bisect`. *Entregas la traza del bisect, no la respuesta.*

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

## Estado del módulo ya trabajado
El Módulo 1 cubrió las cuatro zonas, los comandos y el pipeline de shell a nivel
Associate. **Falta la capa profesional: `reflog`, rebase interactivo y `bisect`.**
