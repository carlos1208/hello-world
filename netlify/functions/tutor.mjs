/* /api/tutor — el botón «no lo entendí».
 *
 * Por qué existe esta función y no se llama a Gemini desde el navegador:
 * una clave de API puesta en el JavaScript de la página es PÚBLICA. Cualquiera
 * que abra «ver código fuente» se la lleva y la gasta. Aquí la clave vive en
 * una variable de entorno de Netlify, el navegador nunca la ve, y lo único
 * expuesto es esta puerta, que solo sabe hacer una cosa.
 *
 * Variables de entorno (Netlify → Site configuration → Environment variables):
 *   GEMINI_API_KEY    obligatoria · https://aistudio.google.com/apikey
 *   GEMINI_MODELO     opcional    · por defecto gemini-2.5-flash-lite
 *   CLAVE_PERSONAL    opcional    · si la pones, hay que mandarla en x-clave
 */

const INSTRUCCION = [
  "Eres el mentor técnico de Carlos: analista de datos senior con 8 años en",
  "operación de red (NOC), Lean Six Sigma y Power BI. NO es desarrollador.",
  "Enseñas por capas: 1 y 2 sin una sola palabra técnica sin traducir, 3 son",
  "comandos, 4 vocabulario, 5 internals.",
  "REGLAS: responde en español, máximo 160 palabras. Usa analogías de su mundo",
  "(turnos de NOC, alarmas, tickets, control de calidad, informes), nunca del",
  "mundo del software. Nada de «obviamente», «simplemente» ni «solo tienes que».",
  "No repitas la explicación que te dan: busca otro ángulo. No inventes",
  "comandos ni banderas que no existan. Si la pregunta se sale del tema, dilo",
  "en una línea y vuelve al concepto."
].join(" ");

const TOPES = { contexto: 4000, pregunta: 500, cuerpo: 12000 };

function json(datos, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

export default async (req) => {
  // El cliente pregunta si el tutor existe antes de ofrecer el botón.
  if (req.method === "GET") {
    return json({ ok: Boolean(process.env.GEMINI_API_KEY) });
  }
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: "El tutor no está configurado en este sitio." }, 503);

  const esperada = process.env.CLAVE_PERSONAL;
  if (esperada && req.headers.get("x-clave") !== esperada) {
    return json({ error: "Clave personal incorrecta." }, 401);
  }

  const crudo = await req.text();
  if (crudo.length > TOPES.cuerpo) return json({ error: "Petición demasiado grande." }, 413);

  let d;
  try { d = JSON.parse(crudo); } catch { return json({ error: "JSON inválido." }, 400); }

  const tipo = d.tipo === "no-entendi" ? "no-entendi" : "otro-ejemplo";
  const contexto = String(d.contexto || "").slice(0, TOPES.contexto);
  const pregunta = String(d.pregunta || "").slice(0, TOPES.pregunta);
  if (contexto.length < 40) return json({ error: "Falta el texto de la capa." }, 400);

  let p = `Concepto: ${String(d.concepto || "Git").slice(0, 80)}\n`;
  p += `Capa ${String(d.capa || "?").slice(0, 3)} (${String(d.titulo || "").slice(0, 80)}).\n\n`;
  p += `Lo que acaba de leer:\n"""\n${contexto}\n"""\n\n`;
  p += tipo === "otro-ejemplo"
    ? "Explícale lo mismo con OTRO ejemplo distinto, al nivel de esta capa."
    : "No lo entendió. Detecta cuál es el punto que probablemente se le atravesó y explícale ESE punto solo, más despacio, al nivel de esta capa.";
  if (pregunta) p += `\n\nSu pregunta textual: ${pregunta}`;

  const modelo = process.env.GEMINI_MODELO || "gemini-2.5-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`;

  let r;
  try {
    r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: INSTRUCCION }] },
        contents: [{ role: "user", parts: [{ text: p }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 700 }
      })
    });
  } catch {
    return json({ error: "No se pudo alcanzar el servicio del tutor." }, 502);
  }

  if (r.status === 429) {
    return json({ error: "Se agotó la cuota gratuita del día. Vuelve mañana o lee la nota escrita del módulo." }, 429);
  }
  if (!r.ok) {
    return json({ error: `El servicio del tutor respondió ${r.status}.` }, 502);
  }

  const data = await r.json();
  const partes = data?.candidates?.[0]?.content?.parts || [];
  const texto = partes.map((x) => x.text || "").join("").trim();
  if (!texto) return json({ error: "El tutor no devolvió texto. Intenta otra vez." }, 502);

  return json({ texto });
};

export const config = { path: "/api/tutor" };
