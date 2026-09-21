# 2 · `reflog`: Git casi nunca borra

> Saber esto cambia cuánto te arriesgas a experimentar. Un ingeniero que conoce
> el reflog prueba `rebase -i` sin sudar; uno que no, evita la herramienta.

## Qué es

Cada vez que **una referencia se mueve** —`HEAD`, una rama— Git escribe una
línea en un registro local: `.git/logs/HEAD`. Ese registro es el reflog.

Lo crítico: el reflog registra **dónde estuvo `HEAD`**, no qué commits existen.
Cuando un `reset --hard` deja commits sin rama que los apunte, los commits
**siguen en `.git/objects/`**. Lo único que perdiste es el nombre. El reflog
te devuelve el hash, y con el hash recuperas todo.

```bash
git reflog                      # dónde ha estado HEAD, lo más reciente arriba
git reflog show nombre-rama     # dónde ha estado una rama concreta
```

Salida típica:

```
a1b2c3d HEAD@{0}: reset: moving to HEAD~3
9f8e7d6 HEAD@{1}: commit: agregar cálculo de MTTR por nodo
...
```

`HEAD@{1}` es «donde estaba HEAD hace un movimiento». Es una referencia
utilizable en cualquier comando de Git.

## Los tres rescates que vas a necesitar

**1. Deshice commits con `reset --hard` y los quiero de vuelta**

```bash
git reflog                       # localiza el hash previo al reset
git reset --hard 9f8e7d6         # vuelve exactamente ahí
```

**2. Borré una rama sin fusionar**

```bash
git reflog show mi-rama          # el reflog de la rama sobrevive un rato
git branch mi-rama 9f8e7d6       # recrear la rama sobre su último commit
```
Si el reflog de la rama ya no está: `git fsck --lost-found` lista los commits
huérfanos que el recolector aún no eliminó.

**3. El rebase salió mal y quiero el «antes»**

```bash
git reflog                       # busca la entrada "rebase (start)"
git reset --hard HEAD@{5}        # o el hash previo al rebase
```
Atajo: `ORIG_HEAD` guarda el estado anterior a un rebase, merge o reset.
`git reset --hard ORIG_HEAD` deshace el último de esos tres de un golpe.

## Los límites, que también hay que saber

- **Es local y personal.** El reflog no se clona ni se empuja. Si borras el
  repositorio, se fue con él.
- **Caduca.** Por defecto: 90 días para lo alcanzable, 30 para lo inalcanzable.
  `git gc` es lo que finalmente recolecta los objetos huérfanos.
- **Solo cubre movimientos de referencias.** Cambios que nunca llegaron a un
  commit —ni siquiera al index— no están ahí. El reflog salva commits, no
  borradores. Ahí sí `git stash` o nada.

## Lab de 10 minutos

```bash
git log --oneline -5             # apunta el hash de HEAD
echo "cambio" >> archivo.txt && git commit -am "un commit"
git reset --hard HEAD~3          # «pierde» tres commits a propósito
git log --oneline -3             # confirma que ya no están
git reflog                       # ahí siguen
git reset --hard HEAD@{1}        # de vuelta
```

Hazlo una vez. Después de verlo, `rebase -i` deja de dar miedo.

## Autoevaluación

- ¿Por qué el reflog puede recuperar un commit «borrado» pero no un archivo que
  nunca hiciste `add`?
- ¿Qué diferencia hay entre `HEAD@{2}` y `HEAD~2`?
