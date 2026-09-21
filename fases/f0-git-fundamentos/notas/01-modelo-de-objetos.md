# 1 · Cómo guarda Git tu trabajo

> Lee de arriba hacia abajo y para donde quieras. Cada capa se sostiene sola.
> Capas 1–3: ya puedes trabajar. Capas 4–5: el nivel que pide la ruta.

---

## Capa 1 · Empieza aquí

### El problema, en tu mundo

Llevas un informe de disponibilidad. Cada semana lo modificas. Al mes alguien
pregunta: «¿en qué momento cambió el criterio de cálculo?». Abres la carpeta y
encuentras esto:

```
informe.xlsx
informe_v2.xlsx
informe_final.xlsx
informe_final_BUENO.xlsx
informe_final_BUENO (1).xlsx
```

No sabes cuál es cuál, ni qué cambió entre uno y otro, ni por qué. Ese es
exactamente el problema que Git resuelve, y lo resuelve de una forma muy
específica que conviene entender bien desde el principio.

### La idea en una frase

**Git es una cámara, no un corrector.** Cada vez que le dices «guarda», no
anota los cambios encima de lo anterior: **toma una foto completa** de todos
tus archivos, la archiva, y le pone un número de serie.

Nada se corrige nunca. Solo se archivan fotos nuevas.

Esa distinción —foto nueva en lugar de corrección encima— es la que explica
casi todo lo que Git hace raro. Guárdala.

---

## Capa 2 · Cómo funciona

### El número de serie sale de la foto

El número que Git le pone a cada foto **no es un consecutivo**. No es foto 1,
foto 2, foto 3. Es un número calculado **a partir del contenido de la foto
misma**: los archivos, quién la tomó, cuándo, y el comentario que escribiste.

Consecuencia directa: **si cambias cualquier cosa, por mínima que sea, el
número cambia.** Una coma en el comentario y ya es otro número, otra foto
distinta. No hay forma de modificar una foto y que conserve su número. No es
una regla que alguien decidió: es aritmética.

### Las fotos están encadenadas

Además, cada foto lleva escrito **el número de la foto anterior**. Como una
cadena de custodia: la foto de hoy dice «vengo después de la foto 4c7b8e1».

Y aquí está la consecuencia que vas a usar toda la vida. Si el número de cada
foto depende de su contenido, y su contenido incluye el número de la anterior,
entonces **cambiar una foto vieja cambia el número de todas las que vienen
después**. Todas. En cascada.

Por eso, en Git, «corregir algo de la semana pasada» nunca es corregir: es
volver a generar toda la historia desde ese punto.

### Y las fotos viejas no desaparecen

Cuando Git «reemplaza» una foto, en realidad archiva la nueva y deja de
apuntar a la vieja. **La vieja sigue en el archivo**, solo que ya nadie la
señala. Esto es lo que hace posible el `reflog` (nota 2), y es la razón por la
que en Git se puede experimentar sin miedo.

---

## Capa 3 · Hazlo

Tres comandos. Ejecútalos en cualquier repositorio con historia y mira la
salida antes de seguir leyendo.

```bash
git cat-file -p HEAD
```
`cat-file` significa «muéstrame el contenido de un objeto archivado». `-p` es
«en formato legible». `HEAD` es una palabra especial que significa **«la foto
en la que estoy parado ahora mismo»**.

Vas a ver algo así:

```
tree 9d3f1a2
parent 4c7b8e1
author Carlos Villanueva <...> 1758412800 -0500

Calcular el MTTR como mediana de la duración
```

Cuatro cosas: el `tree` (la lista de archivos de esa foto), el `parent` (la
foto anterior — la cadena), quién y cuándo, y tu comentario.

```bash
git cat-file -p 9d3f1a2        # usa el número de tree que te salió a ti
```
Ahora ves la lista de archivos de esa foto, cada uno con **su propio número**.

```bash
git cat-file -p 2e0f77c        # el número de uno de esos archivos
```
Y ahí está el contenido del archivo.

**Tres saltos desde donde estás hasta el contenido de un archivo. Eso es todo
lo que Git es por dentro.** No hay una cuarta cosa escondida.

> La plataforma interactiva del módulo tiene este recorrido con clics, si
> prefieres verlo antes de escribirlo.

---

## Capa 4 · El vocabulario

Ahora los nombres reales. Cada uno va pegado a algo que ya entendiste:

| Término | Qué es | Lo que ya sabes |
|---|---|---|
| **commit** | la foto completa, con fecha, autor y comentario | «la foto» |
| **hash** | el número de serie calculado del contenido | «el número de serie» |
| **blob** | el contenido de un archivo, sin nombre ni ruta | el archivo desnudo |
| **tree** | la lista que le pone nombre a los blobs | la carpeta |
| **parent** | el commit anterior en la cadena | «la foto anterior» |
| **HEAD** | dónde estás parado ahora | «la foto actual» |
| **rama** (*branch*) | un nombre que apunta a una foto | una etiqueta pegada a una caja |
| **objeto** | cualquiera de las tres cosas archivadas | blob, tree o commit |

Dos que conviene ver con las manos:

- **Una rama es un archivo de 41 bytes.** Literalmente: `cat .git/refs/heads/main`
  te muestra un número dentro. Crear una rama es gratis porque es escribir un
  número en un archivo. Por eso en Git se ramifica sin pensarlo dos veces.
- **El nombre del archivo vive en el tree, no en el blob.** Por eso renombrar
  un archivo sin cambiar su contenido no crea un blob nuevo: crea un tree nuevo
  que apunta al mismo blob. De ahí que Git «detecte» renombres solo.

### Las cuatro zonas

Una cosa más de vocabulario, que ya viste en la primera pasada del módulo:

**working tree** (lo que ves en tu editor) → **staging area** o *index* (lo que
seleccionaste para la próxima foto) → **repositorio local** (las fotos
archivadas en tu máquina) → **remoto** (las fotos en GitHub).

Lo importante: **la foto congela lo que está en el staging area, no lo que está
en tu editor.** Por eso `git add` es un paso separado y no un trámite: es donde
decides qué entra en la foto.

---

## Capa 5 · Nivel profesional

Lo que sale de todo lo anterior, y que es lo que separa a quien usa Git de
quien lo entiende:

1. **`commit --amend`, `rebase` y `cherry-pick` no modifican nada.** Crean
   commits nuevos y mueven la rama para que apunte a ellos. El original queda
   huérfano —sin rama que lo señale— pero sigue existiendo.
2. **Por eso el `reflog` puede rescatarte** (nota 2): los objetos están ahí, lo
   que perdiste fue el nombre que los apuntaba.
3. **Por eso reescribir historial publicado es agresivo:** los números que
   tienen tus colaboradores dejan de existir en tu versión de la historia.
   Sus repositorios quedan desalineados.
4. **Por eso reescribir el commit 3 de 20 reescribe 17 commits.** No es que
   Git sea aparatoso: es la consecuencia aritmética de que el número del padre
   entre en el cálculo del número del hijo.
5. **Git es un almacén de objetos direccionado por contenido.** Ese es el
   nombre técnico de todo lo anterior, y es el mismo principio que usan Delta
   Lake, Docker y los sistemas de archivos modernos. Lo vas a reconocer otra
   vez en la Fase 2.

---

## ✓ Comprobación

Sin buscar. Si fallas una, la capa que te devuelve está indicada al lado.

1. Si `commit --amend` no modifica el commit, ¿dónde quedó el original? → *capa 5*
2. ¿Por qué mover un archivo de carpeta puede no crear ningún blob nuevo? → *capa 4*
3. ¿Por qué cambiar el commit 3 de 20 obliga a reescribir 17? → *capa 2*
4. ¿Qué congela un commit: lo que está en tu editor o lo que hiciste `add`? → *capa 4*

Siguiente: [`reflog`](02-reflog.md) — cómo recuperar lo que creías perdido.
