# F3 · Spark: de la API a los internals
**Semanas 12–19 · 80 h**

## Objetivo
La fase más larga y la que define si tu perfil es de *usuario* de Spark o de
*ingeniero* de Spark. **El objetivo no es escribir transformaciones: es explicar
por qué una es lenta y arreglarla.**

## Cursos base
- [ ] Databricks Academy — curso oficial gratuito de repaso del DE Associate (catálogo DB005a) · https://www.databricks.com/blog/getting-databricks-certified-now-easier-free-overview-courses
- [ ] Documentación oficial de Spark en Databricks — DataFrames y SQL

## Motor de ejecución
- [ ] Catalyst: del plan lógico sin resolver al plan físico, paso a paso
      — *leer `explain("formatted")` hasta que tenga sentido completo*
- [ ] Ejecución adaptativa (AQE): qué decide en tiempo de ejecución y qué no puede arreglar
- [ ] Estrategias de join: broadcast, sort-merge y shuffle hash — cuándo elige cada una
      y cómo forzarla cuando el optimizador se equivoca por estadísticas malas
- [ ] Shuffle: qué se escribe a disco, por qué es caro y cómo reducirlo
      — *el 90% de los trabajos lentos se explican aquí*
- [ ] Sesgo de partición: detectarlo en el Spark UI y corregirlo (salting, repartición, hints)
- [ ] Derrame a disco y presión de memoria: leer las métricas de tarea
- [ ] Dimensionamiento de particiones y configuración de cluster

## Laboratorio
- [ ] **Lab** · Leer el Spark UI de un trabajo real: etapas, tareas, línea de tiempo,
      métricas de shuffle — *el laboratorio más importante de la ruta*
- [ ] **Lab** · Forzar los tres tipos de join sobre los mismos datos y medir la diferencia
- [ ] **Lab** · Diagnosticar y corregir el sesgo severo de `NODO-03`, con el plan físico de ambos
- [ ] **Lectura de contexto** · Hadoop: HDFS, MapReduce, YARN y por qué Spark lo desplazó
      — *una sola lectura; es contexto de entrevista, no una habilidad a desarrollar*

## Entregable
Informe de optimización de un trabajo real: plan físico antes y después, hipótesis
del cuello de botella, corrección aplicada y mejora medida en segundos y en costo.

## Puente con tu perfil
Ocho años de operación NOC te dan algo que no se estudia: sabes qué anomalía es un
problema real de red y cuál es ruido del sistema de tickets. Spark es la herramienta;
el criterio de qué buscar ya lo tienes.
