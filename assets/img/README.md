# Fotografías del sitio

Todos los archivos `.svg` de esta carpeta son **marcadores de posición**. Están
diseñados para que el sitio se vea terminado mientras se consiguen las fotos
reales, pero deben reemplazarse antes de publicar.

## Cómo reemplazar una foto

1. Guarde su fotografía en esta carpeta, por ejemplo `oficina-atencion.jpg`.
2. En `index.html`, busque el nombre del marcador y cambie solo la extensión:

```html
<!-- antes -->
<img src="assets/img/oficina-atencion.svg" alt="…" width="900" height="900" loading="lazy">
<!-- después -->
<img src="assets/img/oficina-atencion.jpg" alt="…" width="1600" height="1600" loading="lazy">
```

3. Actualice `width` y `height` con las medidas reales del archivo. No hace
   falta que coincidan con el recorte final: sirven para que el navegador
   reserve el espacio y la página no dé saltos al cargar.
4. Revise que el `alt` describa la foto real. Es lo que leen las personas con
   lector de pantalla y lo que indexa Google.

Los contenedores ya recortan con `object-fit: cover`, así que la foto encaja
sin deformarse aunque la proporción no sea exacta. Lo que sí importa es que el
motivo principal esté centrado.

## Lista de tomas

| Archivo | Dónde sale | Proporción | Qué debe mostrar |
|---|---|---|---|
| `johana-duque.svg` | Hero, imagen principal | 3:4 vertical | **Recorte sin fondo** de Johana Duque |
| `firma-principal.svg` | Sección «La firma» | 4:5 vertical | Oficina o equipo en contexto |
| `firma-detalle.svg` | Sección «La firma», foto superpuesta | 1:1 | Consulta con un cliente, plano cerrado |
| `oficina-fachada.svg` | Galería, foto grande | 1:1 | Recepción o fachada del edificio |
| `oficina-atencion.svg` | Galería | 1:1 | Abogada atendiendo a un cliente |
| `oficina-equipo.svg` | Galería | 1:1 | Equipo revisando un expediente |
| `oficina-firma.svg` | Galería | 1:1 | Cliente firmando el contrato |
| `oficina-virtual.svg` | Galería | 1:1 | Atención por videollamada |
| `equipo-01.svg` | Equipo | 4:5 vertical | Retrato de Johana Duque |
| `equipo-02.svg` | Equipo | 4:5 vertical | Retrato del abogado del área civil |
| `equipo-03.svg` | Equipo | 4:5 vertical | Retrato del abogado del área penal |

## La foto del hero (la más importante)

Es la primera imagen que ve el visitante y la que sostiene toda la composición:
un halo dorado, un aro y tres tarjetas flotantes alrededor de la figura.

- **Formato:** PNG o WebP **con fondo transparente**. El recorte se hace en
  Photoshop, Canva o con un servicio de eliminación de fondo.
- **Medida:** 1240 × 1640 px, vertical.
- **Encuadre:** de la cabeza a la cintura o a medio muslo, con la figura
  centrada horizontalmente y **apoyada en el borde inferior** del archivo (sin
  espacio en blanco debajo). Así queda «parada» sobre la base del hero.
- **Postura:** de frente o tres cuartos, mirada a cámara. Vestimenta formal.
- **Luz:** iluminación pareja, sin sombras duras en la cara. Si el recorte deja
  bordes con halo blanco, se nota mucho sobre el fondo oscuro; conviene
  revisarlo al 100 % de zoom.

## Recomendaciones para el resto de las tomas

- Fotografíe en horizontal cuando el archivo sea 1:1 y recorte después: da más
  margen para reencuadrar.
- Luz natural de ventana antes que flash directo.
- Evite fotos de banco de imágenes. El valor de esta sección es que se vea la
  oficina real; un cliente distingue una foto genérica de inmediato y el efecto
  es el contrario al buscado.
- Incluya al menos una toma donde se vea a alguien del equipo trabajando, no
  solo espacios vacíos.

## Autorización de imagen

Antes de publicar cualquier fotografía donde aparezcan clientes:

- Obtenga **autorización escrita de uso de imagen** de cada persona
  identificable, indicando que se publicará en el sitio web de la firma.
- Cuide que no se lean documentos, pantallas, carátulas de expedientes ni
  nombres en las fotos. El secreto profesional cubre esa información y una foto
  puede revelarla sin querer.
- Si no cuenta con autorización, use tomas donde los clientes no sean
  identificables: manos sobre documentos, planos generales de espaldas o
  fotografías solo del equipo de la firma.

## Peso de los archivos

Comprima antes de subir (Squoosh, TinyPNG o similar):

- Fotos de galería y sección: menos de 250 KB cada una.
- Foto del hero: menos de 400 KB.
- Formato preferido: WebP, con `.jpg` como alternativa.

Todas las imágenes salvo la del hero ya llevan `loading="lazy"`, así que solo
se descargan cuando el visitante se acerca a ellas.
