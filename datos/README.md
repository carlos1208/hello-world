# datos/ — contenido local, nunca versionado

Esta carpeta está en `.gitignore` completa. Lo que se versiona es el **generador**
(`scripts/`), no su salida.

- `crudo/` — datos de origen tal como llegan.
- `sintetico/` — set NOC generado (12 meses, nodos, tipos, tiempos con cola larga).
- `salida/` — resultados locales de ejecuciones.

Si algo de aquí hace falta para reproducir un lab, se regenera; no se sube.
