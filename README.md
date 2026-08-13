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
    ├── css/styles.css          Estilos (tokens, componentes, responsive)
    ├── js/main.js              Interacciones y animaciones base
    ├── js/motion-enhance.js    Capa opcional: scroll ligado y resortes
    ├── js/vendor/motion.js     Librería Motion (MIT) — ver su README
    └── img/                    Fotografías — ver assets/img/README.md
```

## Secciones

1. **Cabecera** — barra superior con datos de contacto, navegación fija que
   cambia de color sobre el hero, menú lateral en móvil.
2. **Hero** — titular animado y fotografía recortada de la socia fundadora
   sobre un halo, con tarjetas flotantes de credibilidad.
3. **Cifras + contacto rápido** — cinco contadores animados y un formulario
   de devolución de llamada.
4. **La firma** — presentación, composición de dos fotografías y tres pilares.
5. **Áreas de práctica** — ocho tarjetas con detalle de servicios.
6. **La oficina** — galería de cinco fotografías con visor ampliable.
7. **Cómo trabajamos** — proceso en cuatro etapas.
8. **Equipo** — perfiles de los abogados con retrato.
9. **Testimonios** — carrusel con autoavance, gestos táctiles y navegación.
10. **Preguntas frecuentes** — acordeón accesible.
11. **Contacto** — datos de la oficina, cómo llegar y formulario con validación.
12. **Pie de página** — mapa del sitio, avisos legales y disclaimer.

En móvil aparece además una barra de acción fija (llamar, WhatsApp, agendar)
apenas el visitante pasa el hero.

## Animaciones

- Revelado progresivo al hacer scroll con `IntersectionObserver` y retardos
  escalonados por elemento (`--d`).
- Entrada del titular por líneas enmascaradas.
- Fotografías que se descubren con una cortina que se levanta mientras la
  imagen se asienta (`data-unveil`).
- Retrato del hero con paralaje suave según el puntero, halo que respira y
  tarjetas flotantes con movimiento desfasado.
- Contadores numéricos con curva `easeOutExpo`.
- Cabecera que se contrae, se oculta al bajar y reaparece al subir.
- Barra de progreso de lectura, marquesina infinita, resaltado de la sección
  activa en el menú y microinteracciones en botones, tarjetas e iconos.

### Capa opcional con Motion

`assets/js/motion-enhance.js` agrega, sobre lo anterior, lo que CSS no puede
hacer de forma portable hoy:

- **Profundidad del hero ligada al scroll.** Resplandores, líneas, texto y
  retrato avanzan a distinta velocidad. Las animaciones dirigidas por scroll de
  CSS aún no están en Safari ni Firefox estables.
- **Barra de progreso sobre la línea de tiempo del scroll**, en vez de
  recalcular el ancho en cada evento.
- **Resortes con física real** en el seguimiento del puntero sobre el retrato y
  en la respuesta al pulsar de la galería y los botones del carrusel.

Usa [Motion](https://motion.dev) —la librería que en React se llama Framer
Motion— en su API para JavaScript nativo, copiada en el repositorio
(25 KB gzip, licencia MIT). Se carga como módulo diferido.

**Es estrictamente opcional.** Verificado bloqueando la petición del módulo: el
sitio sigue funcionando con las animaciones CSS y la barra de progreso vuelve al
cálculo por ancho.

Todo el movimiento respeta `prefers-reduced-motion: reduce`: si el usuario pide
menos animación, el contenido aparece de inmediato, los bucles se detienen y la
capa de Motion no se activa en absoluto.

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
| Cifras de la firma | banda de cifras | 14 años, 820 casos, 640 fallos |
| Fotografías | hero, «La firma», galería, equipo | marcadores SVG |
| Testimonios | sección «Clientes» | 3 testimonios de ejemplo |
| Equipo | sección «Equipo» | 2 perfiles sin nombre + fotos |
| Redes sociales | pie de página | enlaces `#` vacíos |

Dos advertencias importantes:

- **Testimonios.** Publique únicamente reseñas reales y con autorización escrita
  del cliente, cuidando el secreto profesional. Los tres textos incluidos son de
  muestra.
- **Cifras y credenciales.** Los números del contador son ilustrativos. El dato
  de «procesos con fallo favorable» es el más delicado: publicar estadísticas
  de resultados que no pueda respaldar con el registro de sus procesos puede
  acarrear problemas frente al régimen de publicidad y al estatuto del
  consumidor. Si no lleva ese conteo, cambie la métrica por una verificable
  (años de ejercicio, número de clientes, áreas atendidas).

### Fotografías

El sitio tiene once espacios de fotografía ya montados, cada uno con su
proporción fija y un marcador SVG diseñado. Reemplazarlos es cambiar el `src`
de un `<img>`, nada más.

**`assets/img/README.md` contiene la lista completa de tomas**, las medidas de
cada una, cómo debe prepararse el recorte sin fondo del hero y las
autorizaciones de imagen que hacen falta para publicar fotos con clientes.

La foto más importante es la del hero: un recorte vertical **con fondo
transparente** de la socia fundadora, apoyado en el borde inferior del archivo.
Es la pieza que sostiene la composición de halo, aro y tarjetas flotantes.

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
- Visor de la galería con foco atrapado, cierre con `Esc` y navegación por flechas.
- **Contraste medido, no estimado.** Se recorrió la página completa componiendo
  el alfa de cada capa de fondo: todo el texto cumple WCAG AA (4.5:1 normal,
  3:1 grande). Por eso los botones de latón llevan texto tinta y no blanco
  (5.79:1 frente a 3.16:1) y `--brass-dk` es `#806230`.
- Áreas táctiles de 44×44 px como mínimo. Quedan tres excepciones deliberadas:
  los enlaces dentro de un párrafo (excepción expresa de WCAG 2.5.5), los
  puntos del carrusel (26×44, cumplen el mínimo 24×24 de WCAG 2.5.8) y la
  casilla de habeas data, cuyo objetivo real es la etiqueta que la envuelve.
