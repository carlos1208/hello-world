# Subir la plataforma a internet

Al terminar tendrás una dirección propia —algo como `ruta-cde.netlify.app`— que
abre en la computadora y en el celular, guarda tu avance en los dos, y no
depende de entrar a Claude.

**Costo: cero.** Todo lo que sigue está en niveles gratuitos. En ningún paso se
pide tarjeta.

Tiempo: unos 20 minutos la primera vez.

---

## Antes de empezar: qué es cada cosa

Tres piezas, y conviene saber qué hace cada una antes de tocarlas.

- **Netlify** — el hosting. Toma el contenido de la carpeta `app/` de este
  repositorio y lo publica en una dirección de internet. Cada vez que yo suba un
  cambio, lo vuelve a publicar solo.
- **Funciones** — dos programitas que corren **en el servidor de Netlify**, no
  en tu navegador: uno guarda tu avance, el otro habla con Gemini. Están en
  `netlify/functions/`.
- **Gemini** — el modelo que responde el botón «no entendí». Google regala una
  cuota diaria de llamadas.

**Por qué las funciones y no todo en la página.** La clave de Gemini es como la
contraseña del wifi: si la pones en la página, cualquiera que abra «ver código
fuente» se la lleva y la gasta a tu nombre. Puesta en el servidor, el navegador
nunca la ve. Esto no es opcional; es la razón de que el proyecto tenga funciones.

---

## Paso 1 · Cuenta de Netlify y conectar el repositorio

1. Entra a [netlify.com](https://www.netlify.com/) → **Sign up** → elige
   **GitHub** (así ya queda conectado con tu repositorio).
2. **Add new site** → **Import an existing project** → **GitHub** →
   autoriza → elige `carlos1208/hello-world`.
3. Netlify te muestra la configuración. **No cambies nada**: ya viene escrita en
   el archivo `netlify.toml` del repositorio (publica `app/`, las funciones
   salen de `netlify/functions/`).
4. **Deploy site**.

En un minuto tienes una dirección tipo `algo-random-123.netlify.app`. Para
cambiarla: **Site configuration → Site details → Change site name**.

Con esto la plataforma ya funciona: se ve, se usa, y guarda el avance **en ese
dispositivo**. Faltan las dos piezas que la conectan.

---

## Paso 2 · La clave de Gemini (el botón «no entendí»)

1. Entra a [aistudio.google.com/apikey](https://aistudio.google.com/apikey) con
   tu cuenta de Google.
2. **Create API key** → cópiala. Es una cadena larga; trátala como una
   contraseña: no la pegues en un chat, ni en un archivo del repositorio.
3. En Netlify: **Site configuration → Environment variables → Add a variable**:

   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | la clave que copiaste |
   | `GEMINI_MODELO` | `gemini-2.5-flash-lite` *(opcional)* |

4. **Deploys → Trigger deploy → Deploy site** para que tome las variables.

**Sobre el modelo.** La cuota gratuita de Google es distinta según el modelo y
cambia con el tiempo: los modelos *Flash-Lite* traen cientos de llamadas al día
y los *Flash* grandes muchas menos. `gemini-2.5-flash-lite` es el que deja más
margen. Los límites vigentes están en la
[página oficial de rate limits](https://ai.google.dev/gemini-api/docs/rate-limits);
si un día el tutor responde «se agotó la cuota», ahí se cambia el nombre del
modelo y listo.

**Dos cosas que debes saber y nadie dice:** en el nivel gratuito Google **puede
usar lo que mandes para mejorar sus productos** —aquí solo van párrafos sobre
Git, así que no hay problema, pero conviene saberlo— y la cuota se reinicia a
medianoche del Pacífico.

---

## Paso 3 · Tu clave personal (el avance entre computadora y celular)

El avance se guarda en **Netlify Blobs**, el almacén que ya viene incluido con
el sitio. No hay que crear base de datos ni otra cuenta.

Como el sitio es público, hace falta algo que separe tu casillero del de
cualquiera que abra el enlace. Eso es la **clave personal**: una palabra que tú
inventas y escribes una vez en cada aparato.

1. En Netlify, agrega una variable más:

   | Key | Value |
   |---|---|
   | `CLAVE_PERSONAL` | la palabra que elijas (mínimo 4 caracteres) |

2. Abre el sitio. Abajo del todo aparece una casilla pidiéndola: escríbela y
   **Guardar**.
3. Haz lo mismo en el celular, con **la misma palabra**.

Desde ahí, lo que marques en un aparato aparece en el otro.

> **Qué es y qué no es.** Es un casillero, no una caja fuerte: protege que tu
> avance no se mezcle con el de otro, no protege secretos. No guardes nada
> sensible ahí — no hay motivo para hacerlo.

---

## Paso 4 · Instalarla en el celular

No hace falta tienda de aplicaciones.

- **Android (Chrome):** abre el sitio → menú ⋮ → **Instalar aplicación**.
- **iPhone (Safari):** abre el sitio → botón compartir → **Añadir a inicio**.

Queda como un icono más, abre a pantalla completa y **funciona sin señal**: el
material ya leído queda guardado en el teléfono. Lo único que necesita conexión
es sincronizar el avance y el botón del tutor.

---

## Si algo falla

| Síntoma | Causa casi siempre | Qué hacer |
|---|---|---|
| El botón del tutor no aparece | falta `GEMINI_API_KEY` | agrégala y vuelve a desplegar |
| «Se agotó la cuota gratuita del día» | límite diario de Gemini | espera al día siguiente o cambia `GEMINI_MODELO` |
| «Clave personal incorrecta» | no coincide con `CLAVE_PERSONAL` | revisa mayúsculas y espacios |
| El avance no pasa al celular | clave distinta en cada aparato | escribe la misma en los dos |
| El sitio quedó pausado | se acabaron los créditos del mes gratis | espera al ciclo siguiente (ver abajo) |

**El límite real del plan gratuito de Netlify.** Son créditos mensuales, y
cuando se acaban **el sitio se pausa** hasta el mes siguiente. Para una persona
estudiando, el consumo es mínimo; el riesgo aparecería si el sitio se volviera
público y con tráfico. Si eso llegara a pasar, moverlo a Cloudflare Pages es
cuestión de un rato, porque nada del código depende de Netlify salvo el almacén
del avance.

---

## Lo que NO hay que hacer nunca

- **No pongas la clave de Gemini en ningún archivo del repositorio.** Ni en
  `app/`, ni en un `.env` que subas, ni en un comentario. Va en las variables de
  entorno de Netlify y en ningún otro sitio.
- **Si alguna vez la pegas por error y haces commit, dala por quemada:**
  bórrala en Google AI Studio, crea una nueva. Quitarla del repositorio no
  sirve — queda en el historial, que es justo lo que aprendiste en el Módulo 1.
