/* El botón «no lo entendí».
 *
 * Manda la capa que estás leyendo y devuelve otra explicación, desde otro
 * ángulo, al nivel de esa capa. Dos caminos según dónde corra la página:
 *
 *   artefacto  claude.use("sample")  -> lo responde Claude
 *   web        /api/tutor            -> lo responde Gemini, con la clave
 *                                       guardada en el servidor, nunca aquí
 *
 * Si no hay ninguno de los dos, la función avisa y no ofrece el botón.
 */
(function (global) {
  "use strict";

  var INSTRUCCION = [
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

  var disponible = null;   // null = todavía no se sabe
  var muestreo = null;

  function prompt(datos) {
    var p = "Concepto: " + datos.concepto + "\nCapa " + datos.capa + " (" + datos.titulo + ").\n\n";
    p += "Lo que acaba de leer:\n\"\"\"\n" + datos.contexto.slice(0, 4000) + "\n\"\"\"\n\n";
    p += datos.tipo === "otro-ejemplo"
      ? "Explícale lo mismo con OTRO ejemplo distinto, al nivel de esta capa."
      : "No lo entendió. Detecta cuál es el punto que probablemente se le atravesó y explícale ESE punto solo, más despacio, al nivel de esta capa.";
    if (datos.pregunta) p += "\n\nSu pregunta textual: " + datos.pregunta.slice(0, 500);
    return p;
  }

  var Tutor = {
    /* ¿se puede ofrecer el botón? */
    listo: function () {
      if (disponible !== null) return Promise.resolve(disponible);
      var enArtefacto = typeof global.claude !== "undefined" && global.claude && typeof global.claude.use === "function";
      if (enArtefacto) {
        return global.claude.use("sample").then(function (s) {
          muestreo = s; disponible = !!s; return disponible;
        }).catch(function () { disponible = false; return false; });
      }
      /* La función responde 200 aunque NO haya clave configurada: lo dice en
         el cuerpo, no en el código de estado. Mirar solo el código haría
         aparecer los botones en un sitio donde el tutor no puede responder. */
      return fetch("/api/tutor?ping=1")
        .then(function (r) {
          if (r.status === 401) { disponible = true; return true; }   // hay tutor, pide clave
          if (!r.ok) { disponible = false; return false; }
          return r.json().then(function (d) { disponible = !!(d && d.ok); return disponible; });
        })
        .catch(function () { disponible = false; return false; });
    },

    /* datos: {concepto, capa, titulo, contexto, tipo, pregunta} */
    preguntar: function (datos, alTexto) {
      if (muestreo) {
        return muestreo(
          [{ role: "user", content: INSTRUCCION + "\n\n" + prompt(datos) }],
          { modelTier: "quick", onText: function (e) { alTexto(e.text); } }
        ).then(function (r) { return r.text; });
      }
      var cab = { "content-type": "application/json" };
      var clave = global.Almacen && global.Almacen.clave && global.Almacen.clave();
      if (clave) cab["x-clave"] = clave;
      return fetch("/api/tutor", { method: "POST", headers: cab, body: JSON.stringify(datos) })
        .then(function (r) {
          return r.json().then(function (d) {
            if (!r.ok) throw new Error(d && d.error ? d.error : "Error " + r.status);
            return d.texto;
          });
        });
    }
  };

  global.Tutor = Tutor;
})(window);
