# Johana Duque & Consultores S.A.S — Landing page

Sitio de una sola página para la firma de abogados **Johana Duque & Consultores S.A.S**
(Barranquilla, Atlántico — Colombia).

Hecho con HTML, CSS y JavaScript puros: **sin frameworks, sin build, sin dependencias**.
Se publica subiendo los archivos a cualquier hosting estático (GitHub Pages, Netlify,
Vercel, Hostinger, cPanel…).

```
index.html
assets/
  css/styles.css
  js/main.js
  img/retrato.svg   · emblema de la firma (reemplazable por la foto)
  img/favicon.svg   · ícono del navegador
  img/og-cover.svg  · imagen para compartir en redes
```

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Qué contiene

- Portada con animación de entrada, parallax y contadores.
- Ocho áreas de práctica en tarjetas interactivas.
- Sección de la firma con retrato/emblema y credenciales.
- Proceso de trabajo en cuatro pasos con riel animado.
- Carrusel de testimonios (autoplay, flechas, puntos y gesto táctil).
- Preguntas frecuentes en acordeón.
- Formulario de contacto validado que abre WhatsApp con el mensaje redactado.
- Botón flotante de WhatsApp, menú móvil, barra de progreso de lectura.
- Datos estructurados `LegalService` (schema.org) y etiquetas Open Graph para SEO.
- Respeta `prefers-reduced-motion` y tiene estilos de impresión.

## Antes de publicar: datos por reemplazar

Todo el contenido de ejemplo está marcado con ceros para que sea fácil de encontrar.

| Dato | Dónde |
|---|---|
| Teléfono / WhatsApp `+57 300 000 0000` | `index.html` (nav, contacto, pie, botón flotante) y la constante `WHATSAPP` en `assets/js/main.js` |
| Dirección `Cra. 00 # 00-00, Of. 000` | `index.html` — sección contacto, pie y bloque JSON-LD |
| Correo `contacto@johanaduqueconsultores.com` | `index.html` — contacto, pie y JSON-LD |
| NIT `000.000.000-0` y T.P. `000.000 C.S.J.` | `index.html` — pie y tarjeta de credenciales |
| Dominio en `<link rel="canonical">` | `index.html` — `<head>` |
| Redes sociales (`href="#"`) | `index.html` — pie de página |
| Enlace a la política de tratamiento de datos | `index.html` — casilla de habeas data del formulario |

**Testimonios:** los tres del carrusel son texto de muestra. Deben sustituirse por
testimonios reales con autorización escrita del cliente antes de publicar el sitio.

**Fotografía:** `assets/img/retrato.svg` es un emblema provisional. Para usar la foto
profesional, guárdala como `assets/img/johana-duque.jpg` (vertical, mínimo 640×800 px) y
cambia el `src` de la imagen en la sección *La firma*.

**Cifras de la portada** (14 años, 600 casos, 24 h): ajustar a los datos reales de la
firma en los atributos `data-count` del `index.html`.

## Personalización rápida

Los colores y tipografías están centralizados en las variables CSS del inicio de
`assets/css/styles.css`:

```css
--ink:#0A1420;  --navy:#16293C;  --gold:#C6A15B;  --bone:#F7F4EF;
--ff-display:"Cormorant Garamond", serif;
--ff-sans:"Inter", sans-serif;
```

## Compatibilidad

Chrome, Edge, Firefox y Safari actuales, en escritorio y móvil. Sin JavaScript el
contenido sigue siendo legible y navegable.
