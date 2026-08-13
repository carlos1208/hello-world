# Dependencias vendorizadas

## motion.js

Subconjunto de la librería [Motion](https://motion.dev) **12.43.0**, licencia MIT.

Es la misma librería que en React se conoce como Framer Motion; esta es su API
para JavaScript nativo, así que el proyecto sigue sin necesitar React ni un paso
de compilación en producción.

### Por qué está copiada en el repositorio

Para que el sitio siga siendo autocontenido: no depende de un CDN externo, no
hay una petición a un tercero que pueda caerse o quedar bloqueada, y no se
filtra la IP de los visitantes a otro dominio. Se despliega copiando la carpeta.

### Qué incluye y qué pesa

Solo tres exportaciones: `animate`, `scroll` y `stagger`.

| Variante | Gzip |
|---|---|
| Paquete completo | 46 KB |
| **Subconjunto usado** | **25 KB** |
| Variante `motion/mini` | 10 KB |

Se descartó `motion/mini` a pesar de pesar menos: no soporta resortes reales
—al pedirle `type: "spring"` aplica `ease-out` de 300 ms— ni la propiedad
`scale`. Se comprobó midiendo el transform cuadro a cuadro: la versión completa
sobrepasa el valor destino y oscila; la mini no se movía.

### Cómo regenerarla

```bash
npm install motion@12 esbuild
echo "export { animate, scroll, stagger } from 'motion';" > entry.js
npx esbuild entry.js --bundle --format=esm --minify --outfile=motion.js
```

Después vuelva a poner arriba el comentario con la versión y la licencia.

### Dónde se usa

En `assets/js/motion-enhance.js`, que es una capa **opcional**. El sitio
funciona completo sin ella: si el archivo no carga o el navegador no soporta
módulos ES, quedan las animaciones CSS de `styles.css`. Está verificado
bloqueando la petición del módulo.
