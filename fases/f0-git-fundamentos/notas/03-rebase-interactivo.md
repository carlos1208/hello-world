# 3 · Rebase interactivo: ordenar antes de entregar

---

## Capa 1 · Empieza aquí

### El problema, en tu mundo

Preparas un informe para dirección. Mientras lo armas tienes hojas sueltas,
tachones, una versión con los números viejos, una nota que dice «revisar
esto». Todo eso es **trabajo legítimo**: así se piensa.

Pero no entregas eso. Antes de mandarlo, juntas lo que va junto, quitas los
borradores, pones títulos que se entienden, ordenas las secciones.

En Git pasa lo mismo, y nadie te lo dice: **la forma en que trabajas no es la
forma en que se entrega.**

### Por qué importa aquí y no es cosmética

Es fácil pensar que un historial ordenado es vanidad. No lo es, y la razón está
en la nota siguiente.

Cuando el pipeline empiece a entregar números malos, vas a usar `bisect`
(nota 4) para encontrar el commit culpable. Bisect te va a dejar parado en un
commit y te va a preguntar, en la práctica, «¿qué pasó aquí?».

- Si ese commit se llama **`arreglo2`** y mezcla tres cambios distintos: el
  diagnóstico no avanzó ni un paso.
- Si se llama **«Simplificar el cálculo del MTTR»** y toca una sola cosa: el
  diagnóstico **está hecho**.

Ordenar el historial no es estética. Es dejar preparada la herramienta forense
que vas a necesitar dentro de tres meses, con el tablero en rojo y prisa.

### La idea en una frase

**Rebase interactivo es la pasada de orden que le das a tu historial antes de
publicarlo:** juntar lo que va junto, quitar borradores, reescribir títulos.

---

## Capa 2 · Cómo funciona

Le pides a Git «vamos a rehacer las últimas N fotos». Git te abre **una lista
de instrucciones**, una línea por foto, y tú la editas. Al guardar y cerrar,
Git rehace las fotos siguiendo tu lista.

Cada línea empieza con un verbo que dice qué hacer con esa foto: déjala,
júntala con la anterior, cámbiale el comentario, elimínala. Y si cambias líneas
de lugar, cambias el orden de las fotos.

Dos detalles que confunden a todo el mundo la primera vez:

1. **La lista va al revés de como estás acostumbrado.** Arriba la foto más
   vieja, abajo la más nueva. Al revés de `git log`. Tiene lógica: Git las va a
   reproducir de arriba hacia abajo, en orden cronológico.
2. **Juntar es siempre «con la de arriba».** Si marcas una foto para fusionar,
   se fusiona con la línea inmediatamente anterior. Por eso, si el borrador
   está lejos de la foto a la que pertenece, **primero hay que moverlo**.

Y recuerda la nota 1: esto no modifica nada. Genera fotos nuevas con números
nuevos y mueve la etiqueta. Las viejas siguen en la bodega, y el reflog
(nota 2) conoce sus números. **Si sale mal, se deshace.**

---

## Capa 3 · Hazlo

```bash
git rebase -i HEAD~5
```
`rebase` = «rehacer»; `-i` = *interactivo*, «déjame editar la lista»;
`HEAD~5` = «las últimas 5 fotos».

Se abre un archivo de texto parecido a este:

```
pick 1b7d902 Calcular el MTTR como mediana
pick f04c6ae Contar alarmas por nodo
pick 7c2e881 wip: probar la mediana
pick 9e3b15d Ordenar el resumen por nodo
pick 4a0db63 arreglo del conteo por nodo
```

Editas los verbos, y mueves líneas si hace falta. Guardas y cierras.

Si Git no sabe cómo combinar dos cambios, se detiene y te lo dice. Resuelves,
haces `git add` del archivo, y sigues con `git rebase --continue`.

**Y el botón de pánico, que conviene aprender antes que el resto:**
```bash
git rebase --abort
```
Vuelve todo al estado inicial, intacto, como si nunca hubieras empezado.

> La plataforma interactiva del módulo tiene este editor con el resultado
> calculándose en vivo mientras cambias verbos y orden. Practica ahí primero.

---

## Capa 4 · El vocabulario

| Verbo | Qué hace |
|---|---|
| `pick` | déjala tal cual |
| `reword` | mismo cambio, comentario nuevo |
| `squash` | fúndela con la anterior, **combinando** ambos comentarios |
| `fixup` | fúndela con la anterior y **descarta** su comentario |
| `drop` | elimínala |
| `break` | detente aquí sin cambiar nada |

| Término | Qué es |
|---|---|
| **rebase** | rehacer una serie de commits sobre otra base |
| **interactivo** (`-i`) | con lista de instrucciones editable |
| **conflicto** | Git no puede combinar dos cambios solo y te pide que decidas |
| **`--continue` / `--abort`** | seguir tras resolver / cancelar todo |
| **`--force-with-lease`** | publicar historial reescrito, **verificando antes** |

**`squash` vs `fixup`:** si el borrador tenía algo que valga la pena conservar
en el comentario, `squash`. Si era `wip` o `arreglo`, `fixup` — que es el caso
normal.

---

## Capa 5 · Nivel profesional

### El flujo real

No se trata de trabajar limpio desde el principio: se trata de **trabajar
rápido y ordenar después**. Commitea seguido y sucio mientras exploras; eso es
correcto. Y cuando encuentres un error en una foto anterior:

```bash
git commit --fixup <número-de-la-foto>          # «esto arregla aquella»
git rebase -i --autosquash <número-de-la-foto>~1
```

`--autosquash` lee esas marcas, coloca cada arreglo junto a la foto que le
corresponde y le pone el verbo solo. Tú revisas y guardas. Es la diferencia
entre ordenar a mano y que la herramienta ordene por ti.

### La regla que no se rompe

**No reescribas historial que otros ya tienen.**

El porqué es la nota 1: el rebase cambia números, y cambiar uno cambia todos
los siguientes. Si eso ya está publicado y alguien lo descargó, su repositorio
queda apuntando a fotos que en tu versión ya no existen.

Frontera práctica:
- **Tu rama de trabajo, antes de fusionarla:** reescribe lo que quieras.
- **`main` o cualquier rama compartida:** nunca.

Y si tienes que republicar tu propia rama ya subida:

```bash
git push --force-with-lease
```

Nunca `--force` a secas. `--force-with-lease` **falla** si alguien subió algo
que tú no has visto, en vez de pisarlo. Es la diferencia entre republicar y
destruir el trabajo de otro.

---

## ✓ Comprobación

1. ¿Por qué la lista de instrucciones va al revés que `git log`? → *capa 2*
2. Tienes un `wip` tres líneas debajo del commit al que pertenece. ¿Basta con
   ponerle `fixup`? → *capa 2*
3. ¿Cuándo `squash` y cuándo `fixup`? → *capa 4*
4. ¿Por qué `--force-with-lease` y no `--force`? → *capa 5*

Siguiente: [`git bisect`](04-bisect.md) — la técnica que sostiene todo esto.
