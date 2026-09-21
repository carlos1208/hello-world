# 1 · El modelo de objetos: por qué un commit es inmutable

> Sin esto, `rebase` y `reset` se aprenden de memoria. Con esto, se deducen.

## Git no guarda diferencias. Guarda fotos.

Cada vez que haces commit, Git escribe **objetos** en `.git/objects/`, cada uno
identificado por el SHA-1 de su contenido. Hay tres que importan:

| Objeto | Qué es | Analogía |
|---|---|---|
| **blob** | el contenido de un archivo, sin nombre ni ruta | el archivo desnudo |
| **tree** | una lista de nombres → blobs y otros trees | una carpeta |
| **commit** | un tree + padre(s) + autor + fecha + mensaje | la foto completa, fechada y firmada |

El nombre del archivo no vive en el blob: vive en el tree que lo apunta. Por eso
renombrar un archivo sin cambiar su contenido **no crea un blob nuevo**: crea un
tree nuevo que apunta al mismo blob. De ahí que Git detecte renombres «solo».

## Compruébalo con las manos

```bash
git cat-file -p HEAD              # el commit: tree, parent, author, mensaje
git cat-file -p HEAD^{tree}       # el tree raíz: modo, tipo, hash, nombre
git cat-file -p <hash-de-un-blob> # el contenido del archivo
git cat-file -t <hash>            # qué tipo de objeto es
```

Empieza por `git cat-file -p HEAD` y ve bajando. En tres saltos llegas al
contenido de un archivo. Eso es todo lo que Git es por dentro.

## De ahí sale la inmutabilidad

El hash de un commit se calcula sobre **todo** su contenido: el tree, el padre,
el autor, la fecha y el mensaje. Cambia una coma del mensaje y el hash cambia.
Y como el hash del padre es parte del hijo, cambiar un commit antiguo cambia el
hash de **todos** los que vienen después.

Consecuencias que vas a usar todos los días:

1. **Nada se «edita» en Git.** `commit --amend`, `rebase` y `cherry-pick` no
   modifican commits: **crean commits nuevos** y mueven la rama para apuntar a
   ellos. Los viejos siguen ahí, huérfanos, hasta que el recolector de basura
   pase.
2. **Por eso existe el `reflog`** (nota 2): los commits que «perdiste» siguen en
   la base de objetos; solo perdiste el nombre que los apuntaba.
3. **Por eso reescribir historial publicado es agresivo**: los hashes de tus
   colaboradores ya no existen en tu versión de la historia.
4. **Una rama es un archivo de 41 bytes** con un hash dentro. Míralo:
   `cat .git/refs/heads/main`. Crear una rama es gratis porque literalmente es
   escribir un hash en un archivo.

## El estado, no el historial

Lo que tienes delante son cuatro zonas: **working tree** → **staging area
(index)** → **repositorio local** → **remoto**. El commit congela lo que hay en
el index, no lo que hay en tu editor. Esa distinción es la que hace que
`git add -p` sea una herramienta de composición: decides qué entra en la foto.

## Autoevaluación

Deberías poder responder sin buscar:

- Si `commit --amend` no modifica el commit, ¿dónde quedó el original?
- ¿Por qué mover un archivo de carpeta puede no crear ningún blob nuevo?
- ¿Por qué cambiar el commit número 3 de 20 obliga a reescribir 17 commits?
