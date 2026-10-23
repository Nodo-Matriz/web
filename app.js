// Nodo Matriz · interacciones de la página (sin frameworks)
(function () {
  'use strict';

  var CORREO = 'nodo.matriz.agroeco@gmail.com';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function linkSeguro(u) { return /^https:\/\//i.test(String(u || '')) ? u : ''; }

  // ---------- Datos de contacto (var CONTACTO en index.html) ----------
  var contacto = window.CONTACTO || {};
  function mostrar(id, url) {
    var el = document.getElementById(id);
    if (el && linkSeguro(url)) { el.href = url; el.hidden = false; }
  }
  mostrar('btn-whatsapp', contacto.whatsapp);
  mostrar('btn-instagram', contacto.instagram);
  mostrar('btn-experiencia', contacto.experiencia);
  var grupo = document.getElementById('btn-grupo');
  if (grupo && linkSeguro(contacto.whatsapp)) grupo.href = contacto.whatsapp;

  // ---------- Menú ----------
  var menuBtn = $('.menu-btn');
  var menu = $('#menu');
  menuBtn.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    menuBtn.setAttribute('aria-expanded', abierto);
  });
  $$('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('abierto');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Formularios cortos: arman un correo al Nodo ----------
  $$('[data-abrir]').forEach(function (b) {
    b.addEventListener('click', function () { $('#' + b.dataset.abrir).showModal(); });
  });
  $$('dialog.hoja').forEach(function (d) {
    var form = $('form', d);
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.addEventListener('close', function () {
      if (d.returnValue !== 'enviar') return;
      var lineas = [];
      $$('label.campo, fieldset.campo', form).forEach(function (c) {
        var titulo = c.tagName === 'FIELDSET' ? $('legend', c).textContent : $('span', c).textContent;
        var valores = $$('input, textarea', c).filter(function (i) {
          return (i.type !== 'checkbox' && i.type !== 'radio') || i.checked;
        }).map(function (i) {
          return i.type === 'checkbox' || i.type === 'radio' ? i.parentNode.textContent.trim() : i.value.trim();
        }).filter(Boolean);
        if (valores.length) lineas.push(titulo + ': ' + valores.join(', '));
      });
      var asunto = $('h3', d).textContent + ' · nodomatriz.ar';
      location.href = 'mailto:' + CORREO + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(lineas.join('\n'));
      form.reset();
    });
  });

  // ---------- Copiar correo ----------
  $$('[data-copiar]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = $('#' + b.dataset.copiar).textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
        .then(function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1800); })
        .catch(function () { aviso(txt); });
    });
  });

  function aviso(txt) {
    var el = $('.aviso') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'aviso', role: 'status' }));
    el.textContent = txt;
    el.classList.add('visible');
    clearTimeout(aviso.t);
    aviso.t = setTimeout(function () { el.classList.remove('visible'); }, 2600);
  }

  // ---------- Contenido editable desde GitHub (ver README.md) ----------
  function leer(url) {
    return fetch(url + '?v=' + Date.now(), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }

  // Fotos: contenido/fotos.json → [{ "archivo": "galpon.jpg", "texto": "..." }]
  var galeria = document.getElementById('galeria');
  if (galeria) {
    leer('contenido/fotos.json').then(function (fotos) {
      fotos = (Array.isArray(fotos) ? fotos : []).filter(function (f) { return f && f.archivo; });
      if (!fotos.length) throw new Error('sin fotos');
      galeria.innerHTML = fotos.map(function (f, i) {
        var src = /^https:\/\//i.test(f.archivo) ? f.archivo : 'fotos/' + String(f.archivo).replace(/^\/+/, '');
        var alta = i % 5 === 0 || i % 5 === 4 ? ' class="g-alta"' : '';
        return '<img' + alta + ' loading="lazy" src="' + esc(src) + '" alt="' + esc(f.texto || 'Foto del Nodo') + '">';
      }).join('');
    }).catch(function () { document.getElementById('galeria-vacia').hidden = false; });
  }

  // Novedades: contenido/novedades.json → [{ "fecha": "2026-09-30", "titulo": "...", "texto": "..." }]
  var listaNov = document.getElementById('lista-novedades');
  if (listaNov) {
    var MOSTRAR = 3;
    var fechaLinda = function (iso) {
      var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return esc(iso || '');
      var d = new Date(+m[1], +m[2] - 1, +m[3]);
      return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    };
    leer('contenido/novedades.json').then(function (lista) {
      lista = (Array.isArray(lista) ? lista : []).filter(function (n) { return n && n.titulo; });
      lista.sort(function (a, b) { return String(b.fecha || '').localeCompare(String(a.fecha || '')); });
      if (!lista.length) throw new Error('sin novedades');
      var verMas = document.getElementById('ver-mas');
      var pintar = function (n) {
        listaNov.innerHTML = lista.slice(0, n).map(function (x) {
          var parrafos = String(x.texto || '').split(/\n\s*\n/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
          return '<li><time datetime="' + esc(x.fecha) + '">' + fechaLinda(x.fecha) + '</time><h3>' + esc(x.titulo) + '</h3>' + parrafos + '</li>';
        }).join('');
        verMas.hidden = lista.length <= n;
      };
      pintar(MOSTRAR);
      verMas.addEventListener('click', function () { pintar(lista.length); });
    }).catch(function () { document.getElementById('novedades-vacia').hidden = false; });
  }
})();
