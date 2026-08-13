# Johana Duque &amp; Consultores S.A.S — Landing page

Sitio de una sola página para una firma de abogados con sede en Barranquilla,
Atlántico (Colombia). Construido en HTML, CSS y JavaScript nativos: sin
frameworks, sin dependencias y sin paso de compilación.

---

## Cómo verlo

Al ser un sitio estático basta con abrir `index.html` en el navegador. Para
probarlo con un servidor local (recomendado, para que las rutas relativas se
comporten igual que en producción):

```bash
npx http-server -p 8080
# o
python3 -m http.server 8080
```

Luego visite <http://localhost:8080>.

## Estructura

```
.
├── index.html              Marcado completo de la página
└── assets/
    ├── css/styles.css      Estilos (tokens, componentes, responsive)
    ├── js/main.js          Interacciones y animaciones
    └── img/                Carpeta para fotografías reales
```

## Secciones

1. **Cabecera** — barra superior con datos de contacto, navegación fija que
   cambia de color sobre el hero, menú lateral en móvil.
2. **Hero** — titular animado y formulario corto de captación.
3. **Cifras** — contadores animados al entrar en pantalla.
4. **La firma** — presentación, ilustración y tres pilares de trabajo.
5. **Áreas de práctica** — ocho tarjetas con detalle de servicios.
6. **Cómo trabajamos** — proceso en cuatro etapas.
7. **Equipo** — perfiles de los abogados.
8. **Testimonios** — carrusel con autoavance, gestos táctiles y navegación.
9. **Preguntas frecuentes** — acordeón accesible.
10. **Contacto** — datos de la oficina y formulario completo con validación.
11. **Pie de página** — mapa del sitio, avisos legales y disclaimer.

## Animaciones

- Revelado progresivo al hacer scroll con `IntersectionObserver` y retardos
  escalonados por elemento (`--d`).
- Entrada del titular por líneas enmascaradas.
- Contadores numéricos con curva `easeOutExpo`.
- Cabecera que se contrae, se oculta al bajar y reaparece al subir.
- Barra de progreso de lectura, marquesina infinita, resaltado de la sección
  activa en el menú y microinteracciones en botones, tarjetas e iconos.

Todo el movimiento respeta `prefers-reduced-motion: reduce`: si el usuario pide
menos animación, el contenido aparece de inmediato y los bucles se detienen.

---

## Antes de publicar: contenido por reemplazar

El sitio se entrega con datos de muestra. **Estos valores deben cambiarse por
información real y verificable antes de ponerlo en producción.** En el HTML cada
bloque está marcado con un comentario `PLACEHOLDER`.

| Dato | Dónde aparece | Valor actual (ficticio) |
|---|---|---|
| Dirección | barra superior, contacto, pie, JSON-LD | Cra. 53 # 79-01, Of. 704 |
| Teléfono fijo | barra superior, contacto, pie, JSON-LD | +57 (605) 000 0000 |
| WhatsApp | botón flotante, contacto, pie | +57 300 000 0000 |
| Correo | contacto, pie, JSON-LD | contacto@johanaduqueconsultores.co |
| NIT | pie de página | 900.000.000-0 |
| Dominio | `canonical`, Open Graph, JSON-LD | johanaduqueconsultores.co |
| Cifras de la firma | sección «Cifras» | 14 años, 820 casos, 24 h |
| Testimonios | sección «Clientes» | 3 testimonios de ejemplo |
| Equipo | sección «Equipo» | 2 perfiles sin nombre + fotos |
| Redes sociales | pie de página | enlaces `#` vacíos |

Dos advertencias importantes:

- **Testimonios.** Publique únicamente reseñas reales y con autorización escrita
  del cliente, cuidando el secreto profesional. Los tres textos incluidos son de
  muestra.
- **Cifras y credenciales.** Los números del contador son ilustrativos.
  Publicar estadísticas de resultados no comprobables puede acarrear problemas
  frente al régimen de publicidad y al estatuto del consumidor.

### Fotografías

Los retratos del equipo y la ilustración de «La firma» son gráficos SVG con el
monograma de la firma, pensados como sustitutos dignos mientras no haya fotos.
Para reemplazarlos, cambie el `<svg>` por una imagen:

```html
<div class="member__photo">
  <img src="assets/img/johana-duque.jpg" alt="Johana Duque, socia fundadora"
       width="600" height="750" loading="lazy">
</div>
```

El contenedor ya recorta a proporción 4:5 con `object-fit: cover`, así que
cualquier foto vertical encaja sin deformarse.

## Conectar los formularios

Los dos formularios validan en el navegador y muestran el estado de envío, pero
**todavía no envían nada a ningún servidor**: el envío está simulado en
`assets/js/main.js` (busque el comentario `NOTA DE INTEGRACIÓN`). Para activarlo,
reemplace el `setTimeout` por la llamada real, por ejemplo con Formspree:

```js
fetch('https://formspree.io/f/SU_ID', {
  method: 'POST',
  headers: { 'Accept': 'application/json' },
  body: new FormData(form)
})
  .then(function (r) {
    if (!r.ok) throw new Error('Error de envío');
    showMsg(msgEl, opts.success || '…', true);
    form.reset();
  })
  .catch(function () {
    showMsg(msgEl, 'No pudimos enviar su mensaje. Escríbanos por WhatsApp.', false);
  });
```

Otras opciones equivalentes: EmailJS, un endpoint propio, Netlify Forms o el CRM
que use la firma.

## Protección de datos

El formulario exige autorización expresa para el tratamiento de datos personales
(Ley 1581 de 2012 y Decreto 1074 de 2015) y el pie enlaza a la política de
privacidad. Esos enlaces apuntan hoy a `#politica`: hay que crear el documento y
apuntarlos al archivo definitivo antes de recibir datos de personas reales.

## Publicación

Cualquier hosting estático sirve. Con GitHub Pages:

1. Repositorio → **Settings → Pages**.
2. En *Source* elija la rama y la carpeta raíz (`/`).
3. El sitio queda publicado en `https://<usuario>.github.io/<repo>/`.

Para un dominio propio, agregue un archivo `CNAME` con el dominio y configure el
DNS del proveedor.

## Compatibilidad

Probado en navegadores basados en Chromium. Usa `IntersectionObserver`,
propiedades personalizadas de CSS, `grid`, `clamp()` y `aspect-ratio`: soportado
por todas las versiones actuales de Chrome, Edge, Firefox y Safari. Sin
JavaScript el contenido sigue siendo legible y navegable; solo se pierden las
animaciones y el carrusel.

## Accesibilidad

- Estructura de encabezados jerárquica y puntos de referencia (`header`, `main`,
  `footer`, `nav` con etiqueta).
- Enlace «Saltar al contenido», foco visible en todos los controles y
  `aria-expanded` en menú y acordeón.
- Mensajes de estado del formulario anunciados con `role="status"`.
- Contraste verificado sobre los fondos oscuros de la paleta.
