/* Almacenamiento del progreso de la ruta.
 *
 * La misma página corre en tres sitios y en los tres tiene que guardar:
 *
 *   artefacto  dentro de Claude  -> claude.use("db"), sincroniza solo
 *   web        Netlify           -> /api/progreso con tu clave personal
 *   local      archivo abierto   -> solo localStorage, este dispositivo
 *
 * En los tres casos localStorage va primero: la página pinta al instante con
 * lo último que vio y la nube llega después. Si la nube falla, no se pierde
 * nada — solo deja de sincronizar entre dispositivos.
 */
(function (global) {
  "use strict";

  var LLAVE_LOCAL = "ruta-cde-progreso";
  var LLAVE_CLAVE = "ruta-cde-clave";
  var RUTA_API = "/api/progreso";
  var ESPERA_GUARDADO = 700;   // ms; agrupa ráfagas de clics en un solo envío

  var estado = { hechos: {}, vistas: {}, checks: {}, predicho: {}, guiado: true };
  var modo = "local";
  var docDB = null;
  var clave = null;
  var temporizador = null;
  var avisos = [];

  function avisar(texto) {
    avisos.forEach(function (f) { try { f(estado, texto, modo); } catch (e) {} });
  }
  /* Funde genérico: cualquier grupo nuevo (checks, predicho, lo que traigan
     los módulos siguientes) se sincroniza sin tocar esta función. Los números
     ganan por el mayor —las capas reveladas no retroceden— y los sí al no. */
  function fundir(entrante) {
    if (!entrante || typeof entrante !== "object") return;
    Object.keys(entrante).forEach(function (grupo) {
      if (grupo === "guiado") {
        if (typeof entrante.guiado === "boolean") estado.guiado = entrante.guiado;
        return;
      }
      if (grupo === "actualizado") return;
      var v = entrante[grupo];
      if (!v || typeof v !== "object") return;
      estado[grupo] = estado[grupo] || {};
      Object.keys(v).forEach(function (id) {
        var actual = estado[grupo][id];
        if (typeof v[id] === "number") estado[grupo][id] = Math.max(actual || 0, v[id]);
        else if (!actual) estado[grupo][id] = v[id];
      });
    });
  }

  function leerLocal() {
    try {
      var crudo = localStorage.getItem(LLAVE_LOCAL);
      if (crudo) fundir(JSON.parse(crudo));
      clave = localStorage.getItem(LLAVE_CLAVE) || null;
    } catch (e) { /* almacenamiento bloqueado: se sigue sin él */ }
  }
  function escribirLocal() {
    try { localStorage.setItem(LLAVE_LOCAL, JSON.stringify(estado)); } catch (e) {}
  }

  /* ---------- nube ---------- */
  function subirWeb() {
    if (!clave) { avisar("Sin clave personal: guardado solo en este dispositivo"); return; }
    fetch(RUTA_API, {
      method: "PUT",
      headers: { "content-type": "application/json", "x-clave": clave },
      body: JSON.stringify(estado)
    }).then(function (r) {
      avisar(r.ok ? "Sincronizado · computadora y celular"
                  : "Guardado aquí; el servidor respondió " + r.status);
    }).catch(function () { avisar("Guardado aquí; sin conexión con el servidor"); });
  }
  function bajarWeb() {
    if (!clave) { avisar("Sin clave personal: guardado solo en este dispositivo"); return; }
    fetch(RUTA_API, { headers: { "x-clave": clave } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d) { fundir(d); escribirLocal(); }
        avisar("Sincronizado · computadora y celular");
      })
      .catch(function () { avisar("Guardado aquí; sin conexión con el servidor"); });
  }

  function subirDB() {
    if (!docDB) return;
    docDB.set(Object.assign({}, estado, { actualizado: new Date().toISOString() }))
      .then(function () { avisar("Sincronizado · en todos tus dispositivos"); })
      .catch(function () { avisar("Guardado aquí; no se pudo sincronizar"); });
  }

  function guardar() {
    escribirLocal();
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      if (modo === "artefacto") subirDB();
      else if (modo === "web") subirWeb();
    }, ESPERA_GUARDADO);
  }

  /* ---------- API pública ---------- */
  var Almacen = {
    iniciar: function (alCambiar) {
      if (alCambiar) avisos.push(alCambiar);
      leerLocal();
      avisar("Guardado en este dispositivo");

      var enArtefacto = typeof global.claude !== "undefined" && global.claude && typeof global.claude.use === "function";
      if (enArtefacto) {
        global.claude.use("db").then(function (db) {
          if (!db) return;
          modo = "artefacto";
          docDB = db.doc("modulo1/progreso");
          docDB.onSnapshot(function (snap) {
            if (snap.exists) { fundir(snap.data() || {}); escribirLocal(); avisar("Sincronizado · en todos tus dispositivos"); }
            else avisar("Listo para sincronizar");
          }, function () { avisar("Guardado aquí; sincronización no disponible"); });
        }).catch(function () {});
        return;
      }

      // ¿hay servidor propio detrás? lo decide el propio servidor, no el navegador
      fetch(RUTA_API + "?ping=1").then(function (r) {
        if (!r.ok && r.status !== 401) throw new Error("sin api");
        modo = "web";
        bajarWeb();
      }).catch(function () { avisar("Guardado en este dispositivo"); });
    },

    leer: function () { return estado; },
    modo: function () { return modo; },

    marcar: function (grupo, id, valor) {
      if (!estado[grupo]) estado[grupo] = {};
      if (valor === undefined) valor = true;
      if (estado[grupo][id] === valor) return;
      estado[grupo][id] = valor;
      guardar();
    },
    poner: function (campo, valor) {
      estado[campo] = valor;
      guardar();
    },
    clave: function (nueva) {
      if (nueva === undefined) return clave;
      clave = nueva || null;
      try {
        if (clave) localStorage.setItem(LLAVE_CLAVE, clave);
        else localStorage.removeItem(LLAVE_CLAVE);
      } catch (e) {}
      if (modo === "web") { bajarWeb(); subirWeb(); }
      return clave;
    }
  };

  global.Almacen = Almacen;
})(window);
