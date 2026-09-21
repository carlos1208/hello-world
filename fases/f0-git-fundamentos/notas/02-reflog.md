# 2 · `reflog`: recuperar lo que creías perdido

---

## Capa 1 · Empieza aquí

### El problema, en tu mundo

Estás depurando el informe. Ejecutas un comando que viste en un tutorial para
«volver atrás», y la pantalla se vacía: tres días de trabajo desaparecieron.
No hay papelera de reciclaje. No hay Ctrl+Z. El estómago se te cae.

Esto le pasa a todo el mundo la primera vez. Y la reacción típica —dejar de
usar las herramientas potentes de Git «por si acaso»— es justo la que te
mantiene en nivel principiante para siempre.

### La idea en una frase

**En Git casi nunca borras: quitas la etiqueta.** La caja sigue en la bodega.

Recuerda la nota 1: las fotos no se modifican ni se eliminan, solo se deja de
apuntarlas. Lo que un comando destructivo se lleva casi siempre es **el
nombre**, no el contenido. Y hay una bitácora que guarda los números de todas
las cajas por las que pasaste.

---

## Capa 2 · Cómo funciona

### La bitácora de turnos

Piensa en la bitácora de un turno de NOC: cada vez que pasa algo, se anota la
hora y qué se hizo. No se anota el estado de la red: se anota **el movimiento**.

Git hace exactamente eso con tu posición. Cada vez que te mueves —haces una
foto, cambias de rama, deshaces algo— escribe una línea en un registro privado
con el número de la foto donde quedaste parado.

Ese registro es el **reflog**, y la distinción clave es esta:

> El reflog no registra qué fotos existen. Registra **dónde estuviste tú**.

Cuando un comando destructivo deja fotos sin etiqueta, esas fotos siguen
archivadas. El reflog conserva sus números. Con el número, recuperas todo.

### Las dos cosas que sí se pierden

Para que la confianza sea informada y no ciega:

- **Lo que nunca guardaste.** Si escribiste código en el editor y nunca
  hiciste una foto, el reflog no lo tiene. El reflog salva fotos, no
  borradores.
- **Lo muy viejo.** El registro caduca: 90 días para lo que sigue etiquetado,
  30 para lo huérfano. Después, un proceso de limpieza de Git recoge la basura
  de verdad.

Y una advertencia importante: **el reflog es tuyo y local.** No se copia a
GitHub, no lo tienen tus compañeros, y si borras la carpeta del proyecto se va
con ella. Es una red de seguridad, no un respaldo.

---

## Capa 3 · Hazlo

Esto se aprende rompiendo algo a propósito, en un repositorio de práctica. Diez
minutos:

```bash
git log --oneline -5
```
Muestra las últimas 5 fotos, una por línea. **Apunta el número de la primera.**

```bash
git reset --hard HEAD~3
```
Traducción: `reset` = «muévete a otra foto»; `--hard` = «y deja los archivos
exactamente como estaban en esa foto»; `HEAD~3` = «tres fotos hacia atrás».
Este es el comando que asusta a la gente.

```bash
git log --oneline -5
```
Las tres últimas fotos ya no aparecen. Aquí es donde normalmente entra el
pánico.

```bash
git reflog
```
Ahí están. Salida típica:

```
a1b2c3d HEAD@{0}: reset: moving to HEAD~3
9f8e7d6 HEAD@{1}: commit: agregar cálculo de MTTR por nodo
```

`HEAD@{1}` significa **«donde estaba parado hace un movimiento»**. Y eso se
puede usar como si fuera el nombre de una foto:

```bash
git reset --hard HEAD@{1}
```

Todo de vuelta. **Hazlo una vez con las manos.** Después de verlo, el resto del
módulo deja de dar miedo, que es exactamente el objetivo.

> La plataforma interactiva tiene este escenario con una terminal funcional:
> puedes practicarlo sin tocar tu repositorio.

---

## Capa 4 · El vocabulario

| Término | Qué es | Lo que ya sabes |
|---|---|---|
| **referencia** (*ref*) | un nombre que apunta a una foto | la etiqueta de la caja |
| **reflog** | el registro de por dónde pasó tu posición | la bitácora de turno |
| **`HEAD@{n}`** | «donde estaba hace n movimientos» | una entrada de la bitácora |
| **`HEAD~n`** | «n fotos hacia atrás en la cadena» | recorrer la cadena de padres |
| **`ORIG_HEAD`** | dónde estabas justo antes del último comando grande | el marcador de «antes de» |
| **objeto huérfano** | foto archivada sin etiqueta que la apunte | la caja sin rótulo |
| **`gc`** (*garbage collection*) | la limpieza que sí borra huérfanos viejos | el descarte definitivo |

**`HEAD@{2}` y `HEAD~2` no son lo mismo y confundirlos es un error caro:**
`HEAD~2` recorre la cadena de fotos hacia atrás (la historia). `HEAD@{2}`
recorre tu bitácora de movimientos (tu sesión de trabajo). Después de un
`reset` desordenado, la historia y tus movimientos ya no coinciden.

---

## Capa 5 · Nivel profesional

Los tres rescates que vas a necesitar, y cuándo usar cada uno:

**1. Deshice fotos con `reset --hard` y las quiero de vuelta**
```bash
git reflog                       # localiza el número previo al reset
git reset --hard 9f8e7d6
```

**2. Borré una rama sin fusionar**
```bash
git reflog show mi-rama          # el reflog de la rama sobrevive un tiempo
git branch mi-rama 9f8e7d6       # recrear la etiqueta sobre su última foto
```
Si el reflog de la rama ya no está: `git fsck --lost-found` lista los objetos
huérfanos que la limpieza todavía no recogió.

**3. El rebase salió mal**
```bash
git reset --hard ORIG_HEAD
```
`ORIG_HEAD` guarda la posición anterior al último `rebase`, `merge` o `reset`.
Es el atajo: deshace el comando grande de un golpe, sin leer el reflog.

**Lo que esto cambia en tu forma de trabajar.** No es un truco de emergencia:
es lo que te permite usar `rebase -i` (nota 3) sin miedo, y eso es la
diferencia entre un historial que se puede diagnosticar y uno que no. Un
ingeniero que conoce el reflog experimenta; uno que no, evita las herramientas
y entrega historiales ilegibles.

---

## ✓ Comprobación

1. ¿Por qué el reflog recupera un commit «borrado» pero no un archivo que nunca
   guardaste? → *capa 2*
2. ¿Qué diferencia hay entre `HEAD@{2}` y `HEAD~2`? → *capa 4*
3. Tu compañero perdió trabajo en su máquina. ¿Le sirve tu reflog? → *capa 2*

Siguiente: [rebase interactivo](03-rebase-interactivo.md).
