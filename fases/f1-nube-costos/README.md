# F1 · Fundamentos de nube y costos reales
**Semanas 4–6 · 30 h**

## Objetivo
Entender qué se alquila, cómo se aísla y cuánto cuesta. Se estudia el contenido
de AZ-900 completo, pero **no se paga ese examen**: el presupuesto va al de Databricks.

## Cursos
- [ ] Microsoft Learn — *Introduction to Cloud Infrastructure* · https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/
- [ ] Microsoft Learn — arquitectura, servicios, gestión y gobierno de Azure (rutas 2 y 3 de AZ-900) · https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900

## Profundidad
- [ ] Identidad y acceso: principales de servicio, identidades administradas, menor privilegio
      — *cómo se autentica un pipeline sin que nadie guarde una contraseña en el código*
- [ ] Almacenamiento: niveles de acceso, redundancia, ciclo de vida y **costo de salida**
      — *el egress es la línea que arruina presupuestos; hay que saber calcularla*
- [ ] Redes: puntos de conexión privados y por qué un lakehouse no debería estar expuesto a internet
- [ ] Facturación por unidad de cómputo y qué significa realmente «serverless»
      — *dos clusters idénticos pueden costar el triple según cómo se configuren*

## Laboratorio
- [ ] **Lab** · Cuenta Azure de capa gratuita, almacenamiento y **alerta de gasto en USD 1** (no negociable)
- [ ] **Lab** · Subir el set NOC con particionado por año/mes
- [ ] **Lab** · Estimar el costo mensual del pipeline en tres escenarios de volumen,
      con supuestos escritos aparte y defendibles

## Entregable
Arquitectura documentada con modelo de identidad, y estimación de costo mensual
en tres escenarios, con los supuestos separados de los cálculos. → `docs/costos/`

## Puente con tu perfil
Es la fase que más rápido se vuelve facturable en Nexora. Una PyME no compra
«un lakehouse»: compra saber cuánto le costará al mes y por qué.
