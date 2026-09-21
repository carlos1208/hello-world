# 3 · Rebase interactivo: la diferencia entre un historial que se lee y uno que se sufre

## Por qué importa en un proyecto de datos

Cuando el pipeline entrega números malos, alguien —tú— va a recorrer el
historial buscando dónde cambió el comportamiento. Ese recorrido es
*radicalmente* distinto según cómo estén los commits:

- **Historial sufrido:** `wip`, `arreglo`, `arreglo2`, `ya casi`, `ahora sí`.
  20 commits, ninguno describe un cambio de comportamiento completo. `bisect`
  te deja en «ahora sí» y no sabes qué pasó ahí.
- **Historial que se lee:** cada commit es un cambio coherente, con mensaje que
  explica el porqué. `bisect` te deja en «usar mediana en lugar de promedio
  para MTTR» y **el diagnóstico está hecho**.

`rebase -i` es lo que convierte lo primero en lo segundo, antes de publicar.

## El comando

```bash
git rebase -i HEAD~8        # los últimos 8 commits
git rebase -i <hash>        # todo lo posterior a ese commit (él no entra)
```

Git abre un archivo de tareas, **en orden cronológico** (el más viejo arriba —
al revés que `git log`). Editas los verbos de la izquierda:

| Verbo | Qué hace |
|---|---|
| `pick` | déjalo tal cual |
| `reword` | mismo cambio, mensaje nuevo |
| `edit` | detente aquí para modificar el contenido del commit |
| `squash` | fusiona con el anterior, **combinando** los dos mensajes |
| `fixup` | fusiona con el anterior y **descarta** este mensaje |
| `drop` | elimínalo |
| `break` | pausa aquí sin modificar nada |

Reordenar commits = reordenar las líneas. Guardas, cierras, y Git reproduce los
commits uno por uno. Si hay conflicto, se detiene: lo resuelves, `git add`, y
`git rebase --continue`. Si se complica: `git rebase --abort` y vuelves al
estado inicial, intacto.

## El flujo que vas a usar de verdad

Trabajas con commits pequeños y sucios mientras exploras (bien: commitear
seguido es lo correcto), y **antes de publicar** los ordenas:

```bash
git commit --fixup <hash>      # marca este commit como arreglo de aquel
git rebase -i --autosquash <hash>~1   # los coloca y los marca solos
```

`--autosquash` lee los prefijos `fixup!` / `squash!` y arma el archivo de tareas
por ti. Es la forma de trabajo limpia: arreglas donde corresponde, no encima.

## La regla que no se rompe

**No reescribas historial que otros ya tienen.** El rebase cambia hashes (nota
1: el hash depende del padre, así que reescribir uno reescribe todos los
siguientes). Si eso ya está en el remoto y alguien lo tiene, le rompes el
repositorio.

Límite práctico: tu rama de trabajo, antes del merge — reescribe lo que
quieras. `main`, o una rama compartida — nunca.

Y si de todos modos tienes que forzar tu propia rama:

```bash
git push --force-with-lease     # falla si alguien empujó algo que no has visto
```
Nunca `--force` a secas. `--force-with-lease` es el que verifica antes de pisar.

## Lab de 20 minutos

1. Haz 5 commits, dos de ellos basura (`wip`, `arreglo`).
2. `git rebase -i HEAD~5`: fusiona la basura con su commit real usando `fixup`,
   reescribe un mensaje con `reword`, y mueve un commit de lugar.
3. `git log --oneline` — el historial debe leerse como una lista de decisiones.
4. `git reflog` — comprueba que el historial anterior sigue ahí.

El paso 4 es el importante: rebase es seguro porque el reflog existe.

## Autoevaluación

- ¿Por qué el archivo de tareas va en orden inverso a `git log`?
- ¿Cuándo usas `fixup` y cuándo `squash`?
- ¿Por qué `--force-with-lease` y no `--force`?
