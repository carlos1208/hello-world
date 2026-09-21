# F5 · Producción: pruebas, despliegue y monitoreo
**Semanas 26–30 · 50 h**

## Objetivo
La fase que separa un proyecto de portafolio de un sistema. Es también el **37%
del examen Professional**: monitoreo, despliegue, seguridad y gobierno. Aunque el
examen que presentas sea el Associate, este contenido sostiene una entrevista seria.

## Pruebas de pipelines
- [ ] Pruebas unitarias de transformaciones con datos de prueba controlados
      — *cómo se prueba una función de PySpark sin levantar un cluster entero*
- [ ] Pruebas de integración y datos de referencia congelados
      — *el equivalente a un patrón de calibración en metrología*
- [ ] **Lab** · Suite que falla cuando alguien rompe el grano de la tabla de hechos
      — conectada a los hooks de pre-commit de la Fase 0

## Despliegue
- [ ] Entornos separados: desarrollo, preproducción y producción con los mismos datos sintéticos
      — *nunca se prueba en producción, tampoco en datos*
- [ ] CI/CD sobre el repositorio: validación automática en cada cambio → `.github/workflows/`
- [ ] Despliegue de trabajos como configuración versionada, no como clics en una interfaz
      — *si el pipeline solo existe en la UI, no existe* → `infra/jobs/`

## Monitoreo y costo
- [ ] Las cinco señales: frescura, volumen, distribución, duración y costo
      — *un dashboard sin las cinco está incompleto*
- [ ] Alertas accionables: cuándo despertar a alguien y cuándo solo registrar
- [ ] Gobierno de gasto: atribución de costo por trabajo y detección de derroche
- [ ] **Lab** · Tablero de salud del pipeline con las cinco señales y alertas configuradas,
      sobre tu propio pipeline, no sobre un ejemplo

## Entregable
Pipeline con pruebas automáticas, despliegue versionado, tablero de salud operativa
con cinco señales, e informe de atribución de costo por trabajo.

## Puente con tu perfil
Monitorear un pipeline es monitorear una planta: señales, umbrales, escalamiento y
postmortem. Vienes de operar un NOC ocho años; aquí el objeto monitoreado cambia,
el método no.
