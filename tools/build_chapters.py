#!/usr/bin/env python3
"""Aplica el cromado común a todas las páginas de capítulo.

Cada capítulo es un artefacto independiente, así que no pueden compartir una
hoja de estilos. Este script inyecta en todos ellos las mismas piezas —selector
de tema, navegación anterior/siguiente y marcar como leído— para que añadir un
capítulo nuevo no obligue a repetir el trabajo a mano. Es idempotente: vuelve a
ejecutarse sobre archivos ya procesados sin duplicar nada.

Uso: python3 tools/build_chapters.py
"""
import io, os, re

HUB = "https://claude.ai/code/artifact/1af58b5a-3e6c-42af-b901-898d600b1623"

# número, archivo, título, URL publicada (None mientras no exista)
CHAPTERS = [
    ("01", "cap-01.html", "El arte que no tenía nombre",
     "https://claude.ai/code/artifact/dd9b06a3-bd8c-4974-8e91-b9e4d22be648"),
    ("02", "cap-02.html", "Dos hermanos y una decisión",
     "https://claude.ai/code/artifact/24c779ba-c17a-454f-a3cd-5ad1ec18dc37"),
    ("03", "cap-03.html", "El dojo de Gouken",
     "https://claude.ai/code/artifact/7b5ed02c-2697-477d-847c-705f66733ca7"),
    ("04", "cap-04.html", "El ascenso de Sagat",
     "https://claude.ai/code/artifact/fe80f362-2ea6-4b4e-bb8b-616a27d11e9b"),
    ("05", "cap-05.html", "El hombre que se amputó el alma",
     "https://claude.ai/code/artifact/374a2cbe-1d79-4c13-affd-646964a0cd47"),
    ("06", "cap-06.html", "El primer torneo",
     "https://claude.ai/code/artifact/42b8bdf3-f70b-41b2-9f6b-44245e7504e5"),
    ("07", None, "Por qué Alpha va aquí", None),
]

CSS = """
/* chrome:css */
.tt{
  flex:none; display:inline-flex; align-items:center; gap:.45rem;
  font-family:var(--f-hud); text-transform:uppercase; letter-spacing:.13em; font-size:.72rem; font-weight:700;
  background:transparent; color:var(--text-2); border:1px solid var(--line); border-radius:999px;
  padding:.26rem .65rem; cursor:pointer; transition:color .2s ease, border-color .2s ease;
}
.tt:hover{color:var(--text); border-color:var(--text-3)}
.tt svg{width:13px; height:13px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round}
.topbar-right{display:flex; align-items:center; gap:.9rem}
.chead-in{align-items:start !important}
.skip{position:absolute; left:-9999px; top:0; background:var(--accent); color:var(--bg); padding:.6rem 1rem; z-index:60}
.skip:focus{left:.5rem; top:.5rem}

.chnav{border-top:1px solid var(--line-soft); padding:2.2rem 0 3.4rem}
.chnav-in{display:grid; gap:1px; background:var(--line-soft); border:1px solid var(--line-soft)}
@media (min-width:720px){ .chnav-in{grid-template-columns:1fr 1fr} }
.chnav a, .chnav span.off{
  background:var(--bg-2); padding:1.1rem 1.3rem; text-decoration:none; display:grid; gap:.25rem;
  transition:background .22s ease;
}
.chnav a:hover{background:color-mix(in srgb, var(--era) 8%, var(--bg-2))}
.chnav .dir{font-family:var(--f-hud); text-transform:uppercase; letter-spacing:.15em; font-size:.72rem; font-weight:700; color:var(--era)}
.chnav .ttl{font-family:var(--f-display); font-weight:800; font-size:1.05rem; color:var(--text)}
.chnav span.off{opacity:.55}
.chnav span.off .dir{color:var(--text-3)}
.chnav .right{text-align:right}

.readbtn{
  display:inline-flex; align-items:center; gap:.6rem; margin-top:1.6rem; cursor:pointer;
  font-family:var(--f-hud); text-transform:uppercase; letter-spacing:.14em; font-size:.8rem; font-weight:700;
  background:transparent; color:var(--text-2); border:1px solid var(--line); padding:.7rem 1.2rem;
  transition:all .2s ease;
}
.readbtn svg{width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:2.6; stroke-linecap:round; stroke-linejoin:round}
.readbtn:hover{border-color:var(--era); color:var(--text)}
.readbtn[aria-pressed="true"]{background:var(--era); border-color:var(--era); color:var(--bg)}
/* /chrome:css */
"""

def block(num, fname, title, url, idx):
    prev = CHAPTERS[idx - 1] if idx > 0 else None
    nxt = CHAPTERS[idx + 1] if idx + 1 < len(CHAPTERS) else None

    def cell(entry, direction, css):
        if entry is None:
            return ''
        n, f, t, u = entry
        label = ('← Capítulo %s' % n) if direction == 'prev' else ('Capítulo %s →' % n)
        if u:
            return ('<a class="%s" href="%s"><span class="dir">%s</span>'
                    '<span class="ttl">%s</span></a>' % (css, u, label, t))
        return ('<span class="off %s"><span class="dir">%s</span>'
                '<span class="ttl">%s · en preparación</span></span>' % (css, label, t))

    left = cell(prev, 'prev', '') or (
        '<a href="%s"><span class="dir">← Volver</span>'
        '<span class="ttl">El Puño y la Sombra</span></a>' % HUB)
    right = cell(nxt, 'next', 'right') or (
        '<a class="right" href="%s"><span class="dir">Índice →</span>'
        '<span class="ttl">El Puño y la Sombra</span></a>' % HUB)

    return """<!--chrome:start-->
<nav class="chnav" aria-label="Navegación entre capítulos">
  <div class="wrap chnav-in">
    %s
    %s
  </div>
</nav>
<script>
(function(){
  var modes=['auto','light','dark'], names={auto:'Auto',light:'Claro',dark:'Oscuro'};
  var btn=document.getElementById('themebtn'), lab=document.getElementById('themelab');
  function read(){try{var t=localStorage.getItem('sf-theme');return (t==='light'||t==='dark')?t:'auto';}catch(e){return 'auto';}}
  function apply(m){
    if(m==='auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme=m;
    if(lab) lab.textContent=names[m];
    try{ m==='auto'?localStorage.removeItem('sf-theme'):localStorage.setItem('sf-theme',m); }catch(e){}
  }
  apply(read());
  if(btn) btn.addEventListener('click',function(){apply(modes[(modes.indexOf(read())+1)%%modes.length]);});

  var mark=document.getElementById('readbtn'); if(!mark) return;
  var KEY='sf-read', NUM='%s';
  function list(){try{var v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[];}catch(e){return [];}}
  function sync(){
    var on=list().indexOf(NUM)!==-1;
    mark.setAttribute('aria-pressed', on?'true':'false');
    mark.querySelector('.readbtn-l').textContent = on ? 'Capítulo leído' : 'Marcar como leído';
  }
  mark.addEventListener('click',function(){
    var l=list(), i=l.indexOf(NUM);
    if(i===-1) l.push(NUM); else l.splice(i,1);
    try{ localStorage.setItem(KEY, JSON.stringify(l)); }catch(e){}
    sync();
  });
  sync();
})();
</script>
<!--chrome:end-->
""" % (left, right, num)


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for idx, (num, fname, title, url) in enumerate(CHAPTERS):
        if not fname:
            continue
        path = os.path.join(root, fname)
        if not os.path.exists(path):
            print('· falta %s, se omite' % fname)
            continue
        s = io.open(path, encoding='utf-8').read()

        s = re.sub(r'<!--chrome:start-->.*?<!--chrome:end-->\n?', '', s, flags=re.S)
        s = re.sub(r'/\* chrome:css \*/.*?/\* /chrome:css \*/\n?', '', s, flags=re.S)
        s = re.sub(r'<!--chrome:theme-->.*?<!--/chrome:theme-->\n?', '', s, flags=re.S)
        s = s.replace('<a class="skip" href="#top">Saltar al contenido</a>\n', '')

        s = s.replace('\n</style>', CSS + '\n</style>', 1)

        # cabecera: botón de tema junto al indicador de capítulo
        s = re.sub(
            r'<span class="progress">([^<]*)</span>',
            lambda m: ('<span class="topbar-right"><span class="progress">%s</span>'
                       '<button class="tt" id="themebtn" type="button" aria-label="Cambiar tema de color">'
                       '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"></circle>'
                       '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4'
                       'M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"></path></svg>'
                       '<span id="themelab">Auto</span></button></span>') % m.group(1),
            s, count=1)

        # script anti-parpadeo, lo primero de la página
        if 'sf-theme-boot' not in s:
            s = s.replace('<div class="topbar">',
                          '<script id="sf-theme-boot">\n'
                          "(function(){try{var t=localStorage.getItem('sf-theme');"
                          "if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();\n"
                          '</script>\n<div class="topbar">', 1)

        # botón de marcar como leído al final del capítulo
        if 'id="readbtn"' not in s:
            s = re.sub(
                r'(<p class="ask">.*?</p>)',
                r'''\1
    <p><button class="readbtn" id="readbtn" type="button" aria-pressed="false">'''
                '''<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5.5 5.5L20 7"></path></svg>'''
                '''<span class="readbtn-l">Marcar como leído</span></button></p>''',
                s, count=1, flags=re.S)

        s = s.replace('<footer class="foot">', block(num, fname, title, url, idx) + '\n<footer class="foot">', 1)
        io.open(path, 'w', encoding='utf-8').write(s)
        print('✓ %s' % fname)


if __name__ == '__main__':
    main()
