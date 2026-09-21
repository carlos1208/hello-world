# 4 · `git bisect`: encontrar el commit culpable

> La técnica más rentable de todo el módulo, y la que casi nadie usa.

---

## Capa 1 · Empieza aquí

### El problema, en tu mundo

Lunes por la mañana. El tablero de KPIs marca un MTTR de **4.11 horas**. El
informe de la semana pasada daba **2.83**. Nadie tocó «eso». El proceso corre
sin un solo error: no hay alarma, no hay excepción, no hay traza. Simplemente
entrega otro número.

Hay 60 commits desde el último informe correcto.

Este es el caso más caro de ingeniería de datos, y conviene entender por qué:
**un proceso que falla te avisa; uno que entrega mal, no.** Puede llevar
semanas entregando mal mientras alguien toma decisiones con esos números.

### La idea en una frase

Es el juego de adivinar un número del 1 al 100 preguntando «¿es mayor o
menor?». Con preguntas al azar tardas decenas de intentos. Partiendo siempre
por la mitad, **siete preguntas bastan**.

`git bisect` juega ese juego sobre tu historial: parte el rango a la mitad,
descarta media historia por pregunta, y te deja en el commit culpable.

### Los números, que son la razón de todo

| Commits a revisar | Uno por uno | Partiendo a la mitad |
|---|---|---|
| 60 | 60 | **6** |
| 200 | 200 | **8** |
| 1000 | 1000 | **10** |

De 200 revisiones a 8. Ese es el retorno de aprender esto, y es la misma
matemática de la fase *Analyze* de DMAIC: aislar la causa dividiendo el espacio
de búsqueda, no recorriéndolo.

---

## Capa 2 · Cómo funciona

Bisect necesita **tres cosas** y ninguna más:

1. **Un punto donde está mal.** Normalmente, hoy.
2. **Un punto donde estaba bien.** El último informe correcto.
3. **Una forma de decidir, para cualquier punto intermedio, si está bien o
   mal.**

Los puntos 1 y 2 los tienes: son fechas que conoces. **El punto 3 es todo el
trabajo**, y es donde está la enseñanza real de este módulo.

### La pregunta que hay que saber formular

«¿Está mal?» parece obvio hasta que lo intentas. Aquí el proceso **no falla**:
corre perfecto y entrega 4.11 en vez de 2.83. Así que la pregunta no es
«¿arranca?» ni «¿da error?». Es:

> **¿El número que entrega sigue siendo el correcto?**

Definir eso con precisión —qué número, con qué datos, con cuánta tolerancia—
es la mitad del diagnóstico. Y si consigues escribirlo de forma que la
respuesta sea automática, bisect recorre la historia solo, sin ti.

---

## Capa 3 · Hazlo

### Primero, a mano, para ver el mecanismo

```bash
git bisect start
git bisect bad                  # donde estoy ahora, está mal
git bisect good <número-bueno>  # aquí estaba bien
```

Git te deja parado en el commit de la mitad. Pruebas lo que tengas que probar
y respondes una de dos:

```bash
git bisect good     # aquí todavía estaba bien
git bisect bad      # aquí ya estaba mal
```

Repites. Cada respuesta borra la mitad del rango. En 6 o 7 vueltas Git imprime:

```
<número> is the first bad commit
```

Y al terminar, siempre:

```bash
git bisect reset    # vuelve a donde estabas
```

### Después, automático, que es lo que vas a usar

Si la decisión cabe en un archivo de instrucciones que se pueda ejecutar
—un **script**—, bisect corre solo:

```bash
git bisect start HEAD <número-bueno>
git bisect run ../prueba.sh
```

> **¿Qué es un script?** Un archivo de texto con una lista de comandos, como
> los que escribes en la terminal, guardados para ejecutarlos de un tirón. No
> es «programar»: es anotar lo que ya harías a mano.

> **¿Qué es un código de salida?** Cuando un comando termina, deja un número
> que dice cómo le fue. `0` significa «bien»; cualquier otro, «mal». Nunca lo
> ves porque la terminal no lo muestra, pero está ahí: `echo $?` lo imprime.
> Es el canal por el que los programas se avisan entre sí que algo salió mal.

---

## Capa 4 · El vocabulario

| Término | Qué es |
|---|---|
| **bisect** | partir en dos; aquí, búsqueda binaria sobre el historial |
| **`good` / `bad`** | las dos respuestas: aquí estaba bien / aquí ya estaba mal |
| **`skip`** | «este no se puede probar», distinto de «está mal» |
| **`bisect run`** | modo automático: un script responde por ti |
| **`bisect reset`** | terminar y volver a donde estabas |

### Los códigos de salida que lee `bisect run`

| Código | Significado |
|---|---|
| `0` | commit bueno |
| `1`–`124`, `126`, `127` | commit malo |
| **`125`** | **no se puede probar** — sáltalo |
| `≥128` | aborta el bisect |

**El `125` es el que separa un bisect correcto de uno que converge en el commit
equivocado**, y merece su propia explicación. Un commit a mitad de un cambio
grande puede no arrancar siquiera. Ese commit **no es malo**: es *no probable*.
Si lo marcas `bad`, le estás diciendo a Git «el defecto ya existía aquí», y la
búsqueda se va hacia atrás por una razón falsa. El resultado será un commit
vecino, y el diagnóstico completo se construye sobre él.

Esto es exactamente lo mismo que en tu mundo: una medición que no se pudo tomar
no es una medición fuera de rango. Registrarla como fuera de rango contamina el
análisis.

---

## Capa 5 · Nivel profesional

### Las cuatro trampas

1. **El script de decisión debe vivir FUERA del repositorio que bisecas.**
   Bisect va cambiando el contenido de la carpeta a versiones viejas; si el
   script está dentro, desaparece o vuelve a una versión antigua a mitad de la
   búsqueda. Se guarda un nivel arriba: `git bisect run ../prueba.sh`.
2. **Los datos de prueba deben estar congelados.** Si la prueba corre sobre
   datos que cambian, la respuesta cambia sin que el código cambie, y bisect
   converge en cualquier parte. Mismo archivo, mismos números, siempre.
3. **`125` para lo no probable** (capa 4). Es la trampa que más resultados
   falsos produce.
4. **Acota por ruta cuando haya mucho ruido:**
   `git bisect start HEAD <bueno> -- ruta/del/pipeline` ignora los commits que
   no tocaron esa carpeta.

### Bisect no es solo para defectos

`git bisect start --term-old rapido --term-new lento` cambia las etiquetas.
Sirve para localizar **cualquier cambio de comportamiento**: cuándo se volvió
lento, cuándo empezó a costar el doble, cuándo cambió el conteo de filas. Es
una herramienta de localización, no de depuración.

### Lo que se entrega

**La traza, no el hash.** Un número suelto no demuestra método. El entregable
es: rango inicial, pasos contra log₂(n), criterio de decisión usado, commit
culpable con su cambio, y **por qué ese cambio produce ese síntoma sobre estos
datos**.

Esa última parte es el trabajo de verdad. En el laboratorio de este módulo, el
commit culpable cambia la mediana por el promedio. Localizarlo es mecánico.
Explicar que el efecto es de 1.3 horas **porque la distribución de tiempos de
resolución tiene cola larga** —y que en datos simétricos habría pasado
inadvertido— es lo que se sustenta en una entrevista.

---

## ✓ Comprobación

1. ¿Por qué el script de prueba no puede vivir dentro del repositorio? → *capa 5*
2. ¿Cuántos pasos toma bisect sobre 500 commits? → *capa 1*
3. Diferencia entre responder `bad` y `skip`, y qué pasa si los confundes → *capa 4*
4. ¿Por qué la pregunta aquí no es «¿da error?»? → *capa 2*

Ahora sí: el [laboratorio](../labs/lab-bisect/), con un repositorio real.
