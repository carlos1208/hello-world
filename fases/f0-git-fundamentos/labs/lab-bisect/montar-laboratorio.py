#!/usr/bin/env python3
"""
Monta el laboratorio de `git bisect` de la Fase 0.

Construye, en una carpeta desechable, un repositorio con un pipeline de KPIs de
operación NOC y un historial de commits en el que **uno** cambia en silencio el
cálculo del MTTR. El pipeline sigue corriendo sin errores: solo entrega un
número equivocado. Ese es el caso caro en datos, porque nadie recibe una alerta.

Uso:
    python3 montar-laboratorio.py [destino]

Destino por defecto: datos/lab-bisect/ (ignorado por git; se puede rehacer
cuantas veces quieras).

Lo que deja montado:
    <destino>/repo/         el repositorio a bisecar
    <destino>/alarmas.csv   datos congelados, FUERA del repo (determinismo)
    <destino>/prueba.sh     el script de decisión, FUERA del árbol bisecado

No leas el código de abajo antes de hacer el laboratorio: contiene la respuesta.
"""
import csv
import math
import random
import shutil
import statistics
import subprocess
import sys
from pathlib import Path

SEMILLA = 20260921
N_ALARMAS = 4000
NODOS = [f"NODO-{i:02d}" for i in range(1, 13)]
TIPOS = ["enlace_caido", "potencia_optica", "temperatura", "bgp_flap",
         "disco_lleno", "energia_respaldo"]


# --------------------------------------------------------------------------
# 1. Datos congelados
# --------------------------------------------------------------------------
def generar_alarmas(destino: Path) -> float:
    """Escribe el CSV y devuelve el MTTR correcto (mediana, en horas)."""
    rnd = random.Random(SEMILLA)
    filas = []
    for i in range(1, N_ALARMAS + 1):
        nodo = rnd.choices(NODOS, weights=[1] * 2 + [6] + [1] * 9)[0]  # NODO-03 sesgado
        tipo = rnd.choice(TIPOS)
        mes = rnd.randint(1, 12)
        dia = rnd.randint(1, 28)
        hora = rnd.randint(0, 23)
        inicio = f"2026-{mes:02d}-{dia:02d} {hora:02d}:{rnd.randint(0,59):02d}"
        if rnd.random() < 0.04:                       # alarma aún abierta
            filas.append({"id": i, "nodo": nodo, "tipo": tipo,
                          "inicio": inicio, "fin": "", "minutos": ""})
            continue
        minutos = round(rnd.lognormvariate(math.log(170), 0.88), 1)  # cola larga
        filas.append({"id": i, "nodo": nodo, "tipo": tipo, "inicio": inicio,
                      "fin": "cerrada", "minutos": minutos})

    with (destino / "alarmas.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["id", "nodo", "tipo", "inicio", "fin", "minutos"])
        w.writeheader()
        w.writerows(filas)

    cerradas = [float(f["minutos"]) for f in filas if f["fin"]]
    return statistics.median(cerradas) / 60


# --------------------------------------------------------------------------
# 2. El pipeline, compuesto a partir del estado de cada commit
# --------------------------------------------------------------------------
def render(est: dict) -> str:
    L = ['#!/usr/bin/env python3', '"""Pipeline de KPIs de operación NOC."""',
         "import csv", "import statistics", "import sys", ""]
    if est.get("constantes"):
        L += ["UMBRAL_CRITICA_MIN = 240", ""]
    if est.get("fn_lectura"):
        L += ["def leer(ruta):",
              '    with open(ruta, newline="", encoding="utf-8") as f:',
              "        return list(csv.DictReader(f))", ""]
    L += ["def main(ruta):"]
    if est.get("fn_lectura"):
        L += ["    filas = leer(ruta)"]
    else:
        L += ['    with open(ruta, newline="", encoding="utf-8") as f:',
              "        filas = list(csv.DictReader(f))"]
    L += ['    print(f"ALARMAS={len(filas)}")']

    if est.get("cerradas"):
        L += ['    cerradas = [f for f in filas if f["fin"]]',
              '    print(f"CERRADAS={len(cerradas)}")']
    if est.get("duracion"):
        L += ['    duraciones = [float(f["minutos"]) for f in cerradas]']
    if est.get("mttr"):
        calc = ("statistics.median(duraciones)" if est["mttr"] == "mediana"
                else "sum(duraciones) / len(duraciones)")
        L += [f"    mttr = {calc} / 60"]
        fmt = ':.2f' if est.get("redondeo") else ''
        L += [f'    print(f"MTTR_HORAS={{mttr{fmt}}}")']
    if est.get("por_nodo"):
        L += ["    por_nodo = {}",
              "    for f in cerradas:",
              '        por_nodo[f["nodo"]] = por_nodo.get(f["nodo"], 0) + 1']
        nombre = "resumen_nodos" if est.get("roto") else "por_nodo"
        it = f"sorted({nombre}.items())" if est.get("orden") else f"{nombre}.items()"
        L += [f"    for nodo, n in {it}:",
              '        print(f"NODO {nodo}: {n}")']
    if est.get("por_tipo"):
        L += ["    tipos = {}",
              "    for f in cerradas:",
              '        tipos[f["tipo"]] = tipos.get(f["tipo"], 0) + 1',
              '    print(f"TIPOS_DISTINTOS={len(tipos)}")']
    if est.get("criticas"):
        umbral = "UMBRAL_CRITICA_MIN" if est.get("constantes") else "240"
        L += [f"    criticas = [d for d in duraciones if d > {umbral}]",
              '    print(f"PCT_CRITICAS={100 * len(criticas) / len(duraciones):.1f}")']
    if est.get("disponibilidad"):
        L += ["    caida_min = sum(duraciones)",
              "    print(f\"DISPONIBILIDAD_PCT={100 * (1 - caida_min / (525600 * len(set(f['nodo'] for f in cerradas)))):.3f}\")"]
    L += ["", "", 'if __name__ == "__main__":', "    main(sys.argv[1])", ""]
    return "\n".join(L)


# El historial. Cada paso: (mensaje de commit, cambios de estado, texto de README)
PASOS = [
    ("Leer el CSV de alarmas y contar registros", {}, None),
    ("Descartar las alarmas sin cierre", {"cerradas": True}, None),
    ("Calcular la duración de cada alarma cerrada", {"duracion": True}, None),
    ("Calcular el MTTR como mediana de la duración", {"mttr": "mediana"}, None),
    ("Contar alarmas por nodo", {"por_nodo": True}, None),
    ("Documentar el criterio de MTTR", None,
     "# Pipeline KPIs NOC\n\nMTTR = **mediana** de la duración de las alarmas cerradas.\n"
     "Mediana y no promedio: la cola de tiempos de resolución es larga y el\n"
     "promedio la sigue.\n"),
    ("Redondear la salida del MTTR a dos decimales", {"redondeo": True}, None),
    ("Separar la lectura del CSV en una función", {"fn_lectura": True}, None),  # ← etiqueta
    ("Agregar el conteo de tipos de alarma", {"por_tipo": True}, None),
    ("Ordenar el resumen por nodo", {"orden": True}, None),
    ("Anotar el alcance del resumen", None,
     "# Pipeline KPIs NOC\n\nMTTR = **mediana** de la duración de las alarmas cerradas.\n"
     "Mediana y no promedio: la cola de tiempos de resolución es larga y el\n"
     "promedio la sigue.\n\nEl resumen cubre los 12 meses del archivo de entrada.\n"),
    ("Simplificar el cálculo del MTTR", {"mttr": "promedio"}, None),   # ← el culpable
    ("Agregar el porcentaje de alarmas críticas", {"criticas": True}, None),
    ("Renombrar el resumen por nodo", {"roto": True}, None),           # ← no ejecuta
    ("Corregir el nombre del resumen por nodo", {"roto": False}, None),
    ("Mover el umbral de criticidad a una constante", {"constantes": True}, None),
    ("Agregar la disponibilidad por zona", {"disponibilidad": True}, None),
    ("Aclarar el umbral de criticidad en el README", None,
     "# Pipeline KPIs NOC\n\nMTTR = **mediana** de la duración de las alarmas cerradas.\n"
     "Mediana y no promedio: la cola de tiempos de resolución es larga y el\n"
     "promedio la sigue.\n\nEl resumen cubre los 12 meses del archivo de entrada.\n"
     "Se considera crítica una alarma de más de 240 minutos.\n"),
    ("Agregar nota de uso al README", None,
     "# Pipeline KPIs NOC\n\nMTTR = **mediana** de la duración de las alarmas cerradas.\n"
     "Mediana y no promedio: la cola de tiempos de resolución es larga y el\n"
     "promedio la sigue.\n\nEl resumen cubre los 12 meses del archivo de entrada.\n"
     "Se considera crítica una alarma de más de 240 minutos.\n\n"
     "Uso: `python3 pipeline.py <ruta-del-csv>`\n"),
]
ETIQUETA_BUENA = 8  # paso (1-indexado) que se etiqueta como último informe correcto


def git(repo: Path, *args: str) -> None:
    subprocess.run(["git", *args], cwd=repo, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def construir_repo(repo: Path) -> None:
    repo.mkdir(parents=True)
    git(repo, "init", "-q", "-b", "main")
    git(repo, "config", "user.name", "Laboratorio NOC")
    git(repo, "config", "user.email", "lab@ejemplo.local")
    git(repo, "config", "commit.gpgsign", "false")

    estado: dict = {}
    for i, (mensaje, cambios, readme) in enumerate(PASOS, start=1):
        if cambios is not None:
            estado.update(cambios)
            (repo / "pipeline.py").write_text(render(estado), encoding="utf-8")
        if readme:
            (repo / "README.md").write_text(readme, encoding="utf-8")
        git(repo, "add", "-A")
        git(repo, "commit", "-q", "-m", mensaje)
        if i == ETIQUETA_BUENA:
            git(repo, "tag", "informe-semana-40")


PRUEBA = """#!/usr/bin/env bash
# Decide si el commit que está en el árbol entrega el MTTR correcto.
#
# Vive FUERA del repositorio a propósito: bisect hace checkout de commits
# viejos, y un script dentro del árbol desaparecería a mitad de la búsqueda.
#
# Códigos de salida, que es lo único que `git bisect run` mira:
#     0   commit bueno
#     1   commit malo
#   125   no se puede probar (sáltalo)
set -u
RAIZ="$(cd "$(dirname "$0")" && pwd)"
ESPERADO=%(esperado).2f

SALIDA="$(python3 "$RAIZ/repo/pipeline.py" "$RAIZ/alarmas.csv" 2>/dev/null)" || exit 125
VALOR="$(printf '%%s\\n' "$SALIDA" | sed -n 's/^MTTR_HORAS=//p')"
[ -n "$VALOR" ] || exit 125

python3 - "$VALOR" "$ESPERADO" <<'PY'
import sys
obtenido, esperado = float(sys.argv[1]), float(sys.argv[2])
sys.exit(0 if abs(obtenido - esperado) < 0.01 else 1)
PY
"""


def main() -> int:
    destino = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("datos/lab-bisect")
    destino = destino.resolve()
    if destino.exists():
        resp = input(f"{destino} ya existe. ¿Rehacer? [s/N] ").strip().lower()
        if resp != "s":
            print("Sin cambios.")
            return 1
        shutil.rmtree(destino)
    destino.mkdir(parents=True)

    mttr_correcto = generar_alarmas(destino)
    construir_repo(destino / "repo")
    prueba = destino / "prueba.sh"
    prueba.write_text(PRUEBA % {"esperado": mttr_correcto}, encoding="utf-8")
    prueba.chmod(0o755)

    n = len(PASOS) - ETIQUETA_BUENA
    print(f"""
Laboratorio montado en {destino}

    repo/          {len(PASOS)} commits; {n} después de la etiqueta informe-semana-40
    alarmas.csv    {N_ALARMAS} alarmas, 12 meses, congeladas
    prueba.sh      script de decisión (fuera del árbol bisecado)

El tablero marca un MTTR alrededor de 4.2 h. El último informe correcto —la
etiqueta informe-semana-40— daba {mttr_correcto:.2f} h. Nadie tocó "eso".

Empieza aquí:

    cd {destino}/repo
    python3 pipeline.py ../alarmas.csv      # ve el síntoma
    ../prueba.sh; echo $?                   # 1 = malo. Confirma que la prueba sirve
    git bisect start HEAD informe-semana-40
    git bisect run ../prueba.sh

Con {n} commits en el rango, esto debería tomarte ~{math.ceil(math.log2(n))} pasos.
Cuando termines: git bisect reset

Entregas la traza, no el hash.
""")
    return 0


if __name__ == "__main__":
    sys.exit(main())
