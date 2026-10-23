# Web pública del Nodo Matriz · nodomatriz.ar

Sitio informativo del Nodo. El sistema de la edición (formularios, guía,
galpón) vive en otro repositorio (`Sistema`) y se sirve en
`webapp.nodomatriz.ar`.

## Cómo actualizar el contenido (desde github.com, sin instalar nada)

### Novedades
Abrir `contenido/novedades.json` → ícono del lápiz → agregar un bloque **arriba**
de los demás, con la misma forma, y separado del siguiente por una coma:

```json
  {
    "fecha": "2026-10-14",
    "titulo": "Título corto",
    "texto": "Primer párrafo.\n\nSegundo párrafo."
  },
```

- La fecha va como `AAAA-MM-DD`. La página las ordena sola, la más nueva primero.
- `\n\n` separa párrafos. Las comillas dentro del texto van como `\"`.
- Guardar con **Commit changes**. En 1 o 2 minutos se ve en la web.
- Si la web deja de mostrar las novedades, casi siempre es una coma de más o de
  menos: revisar el último cambio.

### Fotos de la galería
1. Entrar a la carpeta `fotos` → **Add file → Upload files** → subir las fotos
   (JPG, idealmente de menos de 500 KB cada una; con el celular, "tamaño
   mediano" alcanza). Nombres sin espacios: `galpon-armado.jpg`.
2. Abrir `contenido/fotos.json` y listarlas, en el orden en que se ven:

```json
[
  { "archivo": "galpon-armado.jpg", "texto": "Armado de cajones en el galpón" },
  { "archivo": "feria-junio.jpg", "texto": "Productorxs de la red" }
]
```

La 1.ª, 5.ª, 6.ª, 10.ª… salen más altas en la grilla: conviene que sean fotos verticales.
Antes de publicar fotos con personas, pedirles permiso.

### WhatsApp, Instagram y «Contanos tu experiencia»
En `index.html`, buscar `var CONTACTO` (casi al final) y pegar los links entre
las comillas. Si quedan vacíos, los botones no aparecen. El link de WhatsApp
también lo usa el botón **Unirme al grupo** de la sección Sumate.

### Formularios «Quiero dar una mano» y «Contarles qué produzco»
No guardan nada en la web: al tocar **Enviar** abren el correo de la persona
con un mail ya armado para `nodo.matriz.agroeco@gmail.com`.

## Archivos
- `index.html`: la página (textos y secciones).
- `estilos.css`: el diseño («Cuaderno de huerta»).
- `tokens.css`: colores, tipografías y medidas. Son los mismos nombres `--c-*`
  que usa el formulario de pedidos, para que las dos piezas se vean iguales.
- `app.js`: menú, formularios cortos, novedades y fotos.
- `assets/`: logos y favicon.
- `fotos/`: fotos de la página y de la galería.
- `contenido/`: `novedades.json` y `fotos.json`.
- `404.html`: si alguien entra con un link viejo del sistema
  (`nodomatriz.ar/forms/...`), lo reenvía a `webapp.nodomatriz.ar`.
- `CNAME`: lo crea GitHub solo al configurar el dominio (`nodomatriz.ar`). No borrarlo.
