# F4 · Ingesta, streaming y orquestación
**Semanas 20–25 · 60 h**

## Objetivo
De cargas manuales a un sistema que ingiere solo y **se puede reprocesar sin
ensuciar los datos**. Aquí se cierra en código la idempotencia que el diagnóstico
marcó como hueco.

## Ingesta incremental
- [ ] Auto Loader: descubrimiento de archivos, evolución de esquema y modos de rescate
      — *qué hace cuando llega una columna nueva a mitad de la noche*
- [ ] CDC y carga incremental frente a recarga completa
      — *la decisión que define si el pipeline escala o se cae al año*
- [ ] Taller de `dlt` del Data Engineering Zoomcamp · https://github.com/DataTalksClub/data-engineering-zoomcamp

## Structured Streaming
- [ ] El modelo de tabla infinita: por qué streaming y batch comparten la misma API
- [ ] Checkpoints y registro de escritura anticipada: cómo se logra exactamente-una-vez
      — *y por qué borrar un checkpoint es una decisión seria*
- [ ] Marcas de agua y datos que llegan tarde: completitud contra latencia
      — *una alarma de red que llega 3 horas tarde, ¿entra o no en la ventana?*
- [ ] Modos de disparo y de salida — *el modo por lotes disponibles es el que hace barato el streaming*

## Orquestación y calidad
- [ ] Dependencias, reintentos y diseño de un flujo reanudable a mitad
      — *un pipeline que solo funciona corriendo completo no es un pipeline*
- [ ] Expectativas de calidad: frescura, unicidad, rangos, integridad referencial
      — *es control estadístico de proceso aplicado a datos*
- [ ] **Lab** · Pipeline completo idempotente, demostrado corriéndolo dos veces sobre el
      mismo día — *el conteo de filas debe ser idéntico; esa es la prueba, no la intención*
- [ ] **Lab** · Ingesta en streaming de alarmas con marca de agua y late data deliberado
      — documentar qué eventos se descartaron y por qué

## Entregable
Pipeline automatizado con ingesta incremental, una ruta en streaming con marcas de
agua, suite de expectativas de calidad, y la bitácora de una falla con su reproceso limpio.

## Puente con tu perfil
Las expectativas de calidad son límites de control: señal, umbral y acción al salirse
de rango. Tu formación Lean Six Sigma aplica directo, y es un ángulo que muy pocos
ingenieros de datos pueden sustentar en entrevista.
