/* /api/progreso — el avance, sincronizado entre computadora y celular.
 *
 * Guarda un único documento JSON por clave personal en Netlify Blobs, que es
 * el almacén que ya viene con el sitio: no hay base de datos que administrar
 * ni otra cuenta que crear.
 *
 * La clave personal no se guarda: se guarda su huella (SHA-256). Si alguien
 * llegara a ver los nombres de los archivos, no obtiene la clave.
 *
 * Variables de entorno:
 *   CLAVE_PERSONAL   opcional · si la pones, solo esa clave puede leer y escribir
 */
import { getStore } from "@netlify/blobs";

const TOPE_CUERPO = 200000;   // 200 KB: el progreso son unos pocos KB

function json(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

async function huella(texto) {
  const bytes = new TextEncoder().encode("ruta-cde:" + texto);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default async (req) => {
  const url = new URL(req.url);
  const clave = req.headers.get("x-clave") || "";

  // El cliente pregunta si hay servidor detrás antes de intentar sincronizar.
  if (req.method === "GET" && url.searchParams.get("ping") === "1") {
    return json({ ok: true });
  }
  if (!clave || clave.length < 4) return json({ error: "Falta la clave personal." }, 401);

  const esperada = process.env.CLAVE_PERSONAL;
  if (esperada && clave !== esperada) return json({ error: "Clave personal incorrecta." }, 401);

  let almacen;
  try {
    almacen = getStore({ name: "progreso", consistency: "strong" });
  } catch {
    return json({ error: "El almacén no está disponible en este sitio." }, 503);
  }
  const id = await huella(clave);

  if (req.method === "GET") {
    const guardado = await almacen.get(id, { type: "json" });
    return json(guardado || { hechos: {}, vistas: {}, guiado: true });
  }

  if (req.method === "PUT" || req.method === "POST") {
    const crudo = await req.text();
    if (crudo.length > TOPE_CUERPO) return json({ error: "Demasiado grande." }, 413);
    let entrante;
    try { entrante = JSON.parse(crudo); } catch { return json({ error: "JSON inválido." }, 400); }

    // Se funde con lo que ya había: dos dispositivos nunca se pisan el avance.
    const previo = (await almacen.get(id, { type: "json" })) || {};
    const fundido = {
      hechos: { ...(previo.hechos || {}), ...(entrante.hechos || {}) },
      vistas: { ...(previo.vistas || {}) },
      guiado: typeof entrante.guiado === "boolean" ? entrante.guiado : previo.guiado !== false,
      actualizado: new Date().toISOString()
    };
    for (const [k, v] of Object.entries(entrante.vistas || {})) {
      fundido.vistas[k] = Math.max(fundido.vistas[k] || 1, v || 1);
    }
    await almacen.setJSON(id, fundido);
    return json(fundido);
  }

  return json({ error: "Método no permitido" }, 405);
};

export const config = { path: "/api/progreso" };
