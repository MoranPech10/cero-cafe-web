# Cero Café de Origen - Demo Web

Demo de página web estática para **Cero Café de Origen**, una cafetería ubicada en Villa Urquiza, Buenos Aires.

El objetivo del proyecto es presentar una propuesta visual y funcional de página web para el local, mostrando su menú, ubicación, horarios, redes sociales, contacto y estilo de marca.

---

## Objetivo

Crear una demo profesional para mostrarle al cliente cómo podría verse su página web.

La web busca:

* Mejorar la presentación digital del local.
* Reunir la información importante en un solo lugar.
* Mostrar el menú de forma ordenada.
* Facilitar consultas por WhatsApp.
* Mostrar ubicación, horarios e Instagram.
* Transmitir la identidad cálida, luminosa y moderna de la marca.

---

## Tipo de proyecto

Página web estática.

No incluye backend, base de datos ni panel administrador.

---

## Tecnologías usadas

* HTML5.
* CSS3.
* JavaScript vanilla.
* JSON para organizar contenido.
* Estructura lista para publicar en Netlify.

---

## Estructura del proyecto

```txt
cero-cafe-de-origen/
├── AGENTS.md
├── README.md
├── brief.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── data/
│   └── contenido.json
└── assets/
    └── img/
```

---

## Archivos principales

### `index.html`

Contiene la estructura principal de la página.

Incluye las secciones de inicio, destacados, menú, experiencia del local, galería, ubicación, horarios y contacto.

### `css/styles.css`

Contiene todos los estilos visuales del sitio.

Debe respetar la paleta de marca de Cero Café de Origen:

```css
--color-crema: #E4D8B9;
--color-naranja: #FB732F;
--color-naranja-suave: #FFA940;
--color-lila: #D7C1F1;
--color-negro: #111111;
```

### `js/main.js`

Contiene la lógica simple de interacción.

Puede usarse para:

* Menú mobile.
* Tabs o filtros del menú por categorías.
* Animaciones suaves.
* Botones de navegación interna.

### `data/contenido.json`

Contiene la información estructurada del local:

* Datos del negocio.
* Contacto.
* Redes.
* Ubicación.
* Textos principales.
* Categorías del menú.
* Imágenes.
* Pendientes.

### `assets/img/`

Carpeta destinada a las imágenes del proyecto.

Las imágenes deben tener nombres claros, en minúsculas, sin espacios y sin tildes.

Ejemplos:

```txt
logo-cero-cafe.png
hero-terraza-cero.jpg
interior-cero-1.jpg
frente-local-cero.jpg
barista-cafe-1.jpg
brunch-cero-1.jpg
```

---

## Cómo abrir la página

Abrir el archivo `index.html` en el navegador.

Recomendado: usar la extensión **Live Server** en Visual Studio Code.

Pasos:

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Hacer clic derecho sobre `index.html`.
3. Seleccionar `Open with Live Server`.
4. Ver la página en el navegador.

---

## Estado del proyecto

Estado: demo en desarrollo.

La web está pensada como una presentación comercial para mostrar al cliente antes de publicar una versión final.

---

## Pendientes antes de publicar

Antes de publicar una versión definitiva, confirmar:

* Que el cliente apruebe el uso de las imágenes.
* Que el menú y precios estén actualizados.
* Que el número de WhatsApp sea correcto.
* Que los horarios estén actualizados.
* Si el local quiere agregar delivery, reservas o pedidos.
* Si desea usar formulario de contacto o solo WhatsApp.
* Si quiere mantener todos los precios visibles.
* Si desea conectar la página desde Google Maps o Instagram.

---

## Publicación

La demo puede publicarse en Netlify subiendo la carpeta del proyecto o conectando un repositorio.

No requiere configuración de servidor.
