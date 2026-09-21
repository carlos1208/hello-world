# hooks/ — validación antes del commit

Se construyen en la **Fase 0**. Objetivo: que sea imposible subir por accidente
un notebook con 40 MB de salidas, un archivo de credenciales o un dato crudo.

Se instalan apuntando `core.hooksPath` a esta carpeta.
