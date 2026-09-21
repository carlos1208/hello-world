# 4 · `git bisect`: búsqueda binaria del commit que rompió el pipeline

> La técnica más subestimada de Git. Encuentra el culpable entre 200 commits en
> ~8 pasos. Es la fase *Analyze* de DMAIC, ejecutada sobre un repositorio.

## El problema real

Lunes. El tablero de KPIs muestra un MTTR de 4.2 horas. La semana pasada eran
2.8. Nadie tocó «eso». Hay 60 commits desde el último informe correcto.

Leer 60 diffs es fuerza bruta: 60 revisiones. Probar commit por commit hacia
atrás, igual. **Bisect es búsqueda binaria: log₂(60) ≈ 6 pruebas.** Con 200
commits, 8. Con 1000, 10. La escala es la gracia.

## El método

Bisect necesita tres cosas y nada más:

1. Un commit donde **está mal** (`bad`) — normalmente `HEAD`.
2. Un commit donde **estaba bien** (`good`) — el último informe correcto.
3. Una forma de decidir, para cualquier commit intermedio, si está bien o mal.

El punto 3 es todo el trabajo. Si puedes escribirlo como un script que devuelve
0 (bien) o 1 (mal), bisect corre solo.

## Manual

```bash
git bisect start
git bisect bad                  # HEAD está mal
git bisect good <hash-bueno>    # aquí estaba bien
# Git te deja en el commit de en medio. Pruebas. Y respondes:
git bisect good     # o  git bisect bad
# ... repites ~log2(n) veces
git bisect reset    # vuelve a donde estabas
```

Al terminar, Git imprime `<hash> is the first bad commit` con su diff.

## Automático — el que vas a usar

```bash
git bisect start HEAD <hash-bueno>   # bad y good en una línea
git bisect run ../prueba.sh
```

`bisect run` ejecuta el script en cada paso y lee su **código de salida**:

| Código | Significado |
|---|---|
| `0` | commit bueno |
| `1`–`124`, `126`, `127` | commit malo |
| `125` | **no se puede probar** — sáltalo (no compila, falta un archivo) |
| `≥128` | aborta el bisect |

Aquí se ve por qué la Fase 0 insiste en códigos de salida: bisect es
literalmente un consumidor de códigos de salida.

## Las cuatro trampas

1. **El script de prueba debe vivir FUERA del árbol bisecado.** Bisect hace
   checkout de commits viejos; si el script está dentro del repo, desaparece o
   vuelve a una versión antigua a mitad de la búsqueda. Guárdalo un nivel
   arriba y llámalo por ruta: `git bisect run ../prueba.sh`.
2. **El script debe ser determinista.** Si la prueba depende de datos que
   cambian, bisect converge en cualquier parte. Datos congelados, siempre.
3. **Usa `125` para lo no probable.** Un commit a mitad de refactor que ni
   siquiera arranca no es «malo»: es no probable. Confundirlos mueve el
   resultado al commit equivocado.
4. **`git bisect skip`** hace lo mismo a mano. Si te toca saltar muchos,
   acota el rango con `git bisect start HEAD <bueno> -- ruta/del/pipeline`.

## Lo que entregas

**La traza, no la respuesta.** Un hash suelto no demuestra método. Lo que se
entrega es: rango inicial, número de pasos, script de decisión usado, commit
culpable con su diff, y **por qué ese cambio produce el síntoma**.

## Un detalle que te va a servir

Cuando el defecto no es «se rompió» sino «cambió el comportamiento», la prueba
no es «¿corre?»: es **«¿el número sigue siendo el correcto?»**. Un pipeline que
corre perfecto y entrega mal es el caso común en datos, y también el más caro,
porque nadie recibe una alerta. La prueba de bisect es tu alerta retroactiva.

Y al revés: `git bisect start` acepta `--term-old`/`--term-new` cuando el
cambio no es «bueno→malo» sino «rápido→lento». Bisect sirve para localizar
cualquier cambio de comportamiento, no solo defectos.

## Autoevaluación

- ¿Por qué el script de prueba no puede vivir dentro del repositorio?
- ¿Cuántos pasos toma bisect sobre 500 commits?
- ¿Qué diferencia hay entre responder `bad` y responder `skip`?
