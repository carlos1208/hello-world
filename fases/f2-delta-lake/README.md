# F2 · Delta Lake por dentro
**Semanas 7–11 · 50 h**

## Objetivo
Primer salto de nivel. No es «usar Delta»: es **entender el log de transacciones**,
que es lo que separa a quien escribe tablas de quien las opera cuando fallan.

## Plataforma
- [ ] Databricks Free Edition — cuenta y recorrido · https://www.databricks.com/learn/free-edition
- [ ] Databricks Academy — cursos autogestionados gratuitos · https://www.databricks.com/learn/training/home

## Internals de Delta
- [ ] El directorio `_delta_log`: archivos JSON, puntos de control y cómo se reconstruye el estado
      — *vas a abrir esos archivos y leerlos a mano; es la única forma de que deje de ser magia*
- [ ] Control de concurrencia optimista: qué pasa cuando dos trabajos escriben a la vez
- [ ] `OPTIMIZE`, compactación y el problema de los muchos archivos pequeños
- [ ] Z-ordering y clustering líquido: cuándo sirve cada uno y cuándo no sirve ninguno
- [ ] `VACUUM` frente a viaje en el tiempo: costo contra historial recuperable
      — *un VACUUM mal configurado destruye la capacidad de auditar*
- [ ] `MERGE`: SCD tipo 2 en la práctica y su costo de rendimiento

## Laboratorio
- [ ] **Lab** · Generar el set sintético NOC con volumen realista y cola larga
      (12 meses, nodos, tipos, tiempos de resolución con atípicos) → `scripts/`
- [ ] **Lab** · Arquitectura medallion completa: bronce, plata y oro con contratos declarados
- [ ] **Lab** · Provocar un conflicto de escritura concurrente y leer el log para explicarlo
- [ ] **Lab** · Medir una consulta antes y después de `OPTIMIZE` y `Z-ORDER`
      — *archivos leídos y tiempo; números, no impresiones*

## Entregable
Lakehouse de tres capas con diccionario de datos, política de historización por
dimensión, e informe medido del efecto de `OPTIMIZE` y `Z-ORDER`.

## Puente con tu perfil
El modelado dimensional que usas en Power BI es exactamente el de la capa oro.
Aquí lo construyes aguas arriba y además respondes por su rendimiento y su costo.
