# Entregable F0 · Traza de bisect

> Un hash suelto no demuestra método. Esto sí.
> Se llena después del lab; se defiende en inglés (`../resumen-en.md`).
>
> **Atajo:** la pestaña **Entregable** de la plataforma lee tu `git bisect log`
> y rellena las secciones 2, 4 y 5 solas, con los pasos comparados contra
> log₂(n). Deja la 6 vacía a propósito — es la única que no sale de la traza.
> https://claude.ai/artifact/VB9pErnVpXhX4x8B9Brb4z#entregable

## 1. Síntoma

- **Qué se observó:**
- **Valor esperado / valor obtenido:**
- **Cómo se detectó** (tablero, reporte, reclamo de alguien):
- **Cuánto tiempo estuvo mal antes de que alguien lo notara:**

## 2. Rango de búsqueda

| | Referencia | Hash | Por qué se sabe que está así |
|---|---|---|---|
| Último bueno | `informe-semana-40` | | |
| Primero malo | `HEAD` | | |

- **Commits en el rango:**
- **Pasos que predije** (log₂ n):
- **Pruebas que bisect ejecutó realmente:**
- Si no coinciden, por qué:

## 3. Criterio de decisión

El script usado (`prueba.sh`) y **por qué decide así**:

```bash
```

- ¿Qué devuelve ante un commit que no ejecuta, y por qué no es `1`?
- ¿Se verificó contra los dos extremos conocidos antes de bisecar?

## 4. Traza

```
(salida de `git bisect log`)
```

## 5. Commit culpable

- **Hash y mensaje:**
- **Diff:**

```diff
```

## 6. Mecanismo — la parte que importa

Por qué ese cambio produce ese síntoma. No «cambió el cálculo», sino qué
propiedad de **estos datos** hace que el efecto sea de esta magnitud:

## 7. Corrección y prevención

- **Corrección:**
- **Prueba que habría atrapado esto en CI** (se implementa en la Fase 5):
- **Señal que lo habría detectado el mismo día** (Fase 5, cinco señales):
