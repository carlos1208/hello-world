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
 *   GEMINI_MODELO     opcional    · fuerza un modelo concreto
 *   CLAVE_PERSONAL    opcional    · si la pones, hay que mandarla en x-clave
 *
 * Sobre el modelo: Google retira modelos con cierta frecuencia y la API
 * responde 404 cuando el nombre ya no existe. Por eso aquí NO hay un nombre
 * fijo: se prueban varios candidatos en orden y el primero que responde se
 * recuerda mientras la función siga caliente. Si un día fallan todos, el
 * mensaje lo dice y basta con poner GEMINI_MODELO con un nombre vigente de
 * https://ai.google.dev/gemini-api/docs/models
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

// En orden de preferencia: los «lite» traen la cuota gratuita más holgada.
const CANDIDATOS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-2.5-flash-lite"
];
let modeloQueSirve = null;   // se recuerda entre invocaciones en caliente

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

  const cuerpo = JSON.stringify({
    systemInstruction: { parts: [{ text: INSTRUCCION }] },
    contents: [{ role: "user", parts: [{ text: p }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: 700 }
  });

  const forzado = process.env.GEMINI_MODELO;
  const aProbar = forzado ? [forzado] : (modeloQueSirve ? [modeloQueSirve, ...CANDIDATOS] : CANDIDATOS);

  let r = null, ultimo404 = null;
  for (const modelo of aProbar) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`;
    try {
      r = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: cuerpo
      });
    } catch {
      return json({ error: "No se pudo alcanzar el servicio del tutor." }, 502);
    }
    // 404 = ese modelo ya no existe. Con los demás no tiene sentido insistir.
    if (r.status === 404) { ultimo404 = modelo; r = null; continue; }
    modeloQueSirve = modelo;
    break;
  }

  if (!r) {
    return json({
      error: forzado
        ? `El modelo «${forzado}» no existe o ya fue retirado. Cambia GEMINI_MODELO por uno vigente de ai.google.dev/gemini-api/docs/models.`
        : `Ninguno de los modelos conocidos respondió (el último probado fue «${ultimo404}»). Google los retira cada cierto tiempo: pon GEMINI_MODELO con un nombre vigente.`
    }, 502);
  }

  if (r.status === 429) {
    return json({ error: "Se agotó la cuota gratuita del día. Vuelve mañana o lee la nota escrita del módulo." }, 429);
  }
  if (r.status === 400 || r.status === 403) {
    return json({ error: "Google rechazó la clave de API. Revisa GEMINI_API_KEY en las variables de entorno." }, 502);
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
