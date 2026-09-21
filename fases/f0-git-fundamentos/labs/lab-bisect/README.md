# Lab · Encontrar el commit que rompió el MTTR

**Tiempo:** 45–60 min · **Prerrequisito:** notas 1 a 4 leídas.

## Antes de empezar, por si hace falta

Tres cosas que el laboratorio usa y que no son parte de Git. Si ya las tienes
claras, sáltate esta sección.

- **Terminal.** La ventana donde escribes comandos en vez de hacer clic. Lo que
  escribes se ejecuta al dar Enter, y la respuesta se imprime debajo.
- **Script.** Un archivo de texto con una lista de comandos guardados para
  ejecutarlos de un tirón. `montar-laboratorio.py` es uno: construye el
  escenario para que tú no tengas que crear 19 commits a mano. **No necesitas
  leerlo ni entender Python** — de hecho, no lo abras hasta terminar, porque
  contiene la respuesta.
- **Código de salida.** El número que un comando deja al terminar para decir
  cómo le fue: `0` es «bien», cualquier otro es «mal». No se muestra en
  pantalla; se consulta con `echo $?`. Es el canal por el que `git bisect run`
  entiende las respuestas de `prueba.sh`, y por eso aparece tanto en esta fase.

## El caso

Lunes por la mañana. El tablero de KPIs de operación marca un **MTTR de 4.11 h**.
El informe de la semana 40 —etiquetado en el repositorio— daba **2.83 h**. El
pipeline corre sin un solo error: no hay alerta, no hay traza, no hay excepción.
Simplemente entrega otro número.

Nadie tocó «eso». Hay 11 commits desde el último informe correcto.

## Montar

**En Windows, todo esto va en Git Bash**, no en PowerShell ni en el símbolo del
sistema. Git Bash viene con Git para Windows: búscalo en el menú de inicio, o
haz clic derecho en la carpeta del repositorio → *Open Git Bash here*.

```bash
python3 fases/f0-git-fundamentos/labs/lab-bisect/montar-laboratorio.py
cd datos/lab-bisect/repo
```

Si `python3` responde «command not found», prueba con `python` o con `py -3`:
en Windows el intérprete se llama distinto según cómo se haya instalado. El
script de prueba ya resuelve eso solo; el que tienes que ajustar es este
primer comando.

Se monta en `datos/lab-bisect/` (ignorado por git). Puedes rehacerlo cuantas
veces quieras; los datos son deterministas, así que el resultado siempre es el
mismo.

Queda montado así, y la distribución **no es casual**:

```
datos/lab-bisect/
├── repo/           el repositorio a bisecar
├── alarmas.csv     datos congelados — FUERA del repo, para que la prueba sea determinista
└── prueba.sh       el script de decisión — FUERA del árbol bisecado, para que sobreviva los checkouts
```

## Hacer

**1. Ve el síntoma y confirma que tu prueba sirve.**

```bash
python3 pipeline.py ../alarmas.csv     # MTTR_HORAS=4.11
../prueba.sh; echo $?                  # 1 → el script detecta el defecto
git checkout informe-semana-40
../prueba.sh; echo $?                  # 0 → y reconoce el estado bueno
git checkout main
```
Una prueba que no distingue los dos extremos conocidos no sirve para bisecar.
Verifícalo **antes**, siempre. Es el paso que la gente se salta.

**2. Bisect automático.**

```bash
git bisect start HEAD informe-semana-40
git bisect run ../prueba.sh
```

En Windows, si responde *permission denied*, llama al intérprete de forma
explícita — `bisect run` acepta un comando con argumentos:

```bash
git bisect run bash ../prueba.sh
```

**3. Antes de `reset`, guarda la traza.** Y cuenta el rango, que hace falta para
comparar tus pasos contra log₂(n): `git rev-list --count informe-semana-40..HEAD`.

```bash
git bisect log > /tmp/traza-bisect.txt
git show --stat <commit-culpable>
git bisect reset
```

**4. Hazlo otra vez a mano.** `git bisect start`, `bad`, `good`, y responde tú
en cada paso. Automático es lo que usarás; manual es lo que te enseña qué está
pasando.

## Lo que vas a encontrar en el camino

- Uno de los commits **ni siquiera ejecuta** (`NameError`). No es «malo»: es **no
  probable**. `prueba.sh` devuelve `125` y bisect lo salta solo. Si lo hubieras
  marcado `bad` a mano, el resultado apuntaría al commit equivocado.
- El commit culpable tiene un mensaje **perfectamente razonable**. Ese es el
  punto: el defecto no llega anunciado como defecto.

## Preguntas a responder en el entregable

1. ¿Cuántas pruebas ejecutó bisect y cuántos commits había en el rango?
   ¿Coincide con log₂(n)?
2. ¿Qué cambia exactamente el commit culpable, y **por qué** ese cambio sube el
   MTTR de 2.83 a 4.11 con estos datos?
3. ¿Por qué el efecto es grande aquí y sería casi invisible en datos sin cola
   larga?
4. ¿Qué habrías necesitado —en la Fase 5— para enterarte el mismo día en lugar
   del lunes siguiente?

La 2 y la 3 son las que importan: localizar el commit es mecánico; explicar el
mecanismo es el trabajo.

## Regla de cierre

**Entregas la traza, no el hash.** Plantilla en
[`../../entregable/traza-bisect.md`](../../entregable/traza-bisect.md), y la
pestaña **Entregable** de la plataforma arma el borrador a partir de tu
`git bisect log`.

> No abras `montar-laboratorio.py` antes de terminar: contiene la respuesta.
