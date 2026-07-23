# AGENTS.md

## Rol de Codex

Actuá como desarrollador frontend encargado de crear una demo comercial de página web estática para un local gastronómico llamado **Cero Café de Origen**.

La tarea es construir una web profesional, responsive y mobile-first usando únicamente HTML, CSS y JavaScript vanilla.

El objetivo no es crear una aplicación compleja, sino una demo visualmente atractiva, clara y funcional para mostrarle al cliente el valor de tener una página web propia.

---

## Contexto del proyecto

El cliente es una cafetería llamada **Cero Café de Origen**, ubicada en Villa Urquiza, Buenos Aires.

Es un all day café con café de especialidad, brunch, pastelería, platos de mediodía, bebidas frías y un espacio cálido para comer en el local o retirar.

El local no cuenta con página web actualmente. La demo busca mostrar cómo podría verse una web profesional que reúna su menú, ubicación, horarios, redes y contacto en un solo lugar.

La página será subida como demo a Netlify.

---

## Datos del cliente

### Nombre del local

Cero Café de Origen

### Rubro

Cafetería / all day café / café de especialidad.

### Diferencial

Pet friendly.

### Dirección

Av. Congreso 5080, Villa Urquiza, Buenos Aires.

### Google Maps

https://www.google.com.ar/maps/place/Cero+Cafe+de+Origen/@-34.5697587,-58.4925334,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb70028f5094d:0x6ccca2a17439a70d!8m2!3d-34.5697631!4d-58.4899585!16s%2Fg%2F11yq37r5c4?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D

### Horarios

Lunes a viernes: 8:00 a 20:00.
Sábados y domingos: 8:30 a 20:30.

### Instagram

https://www.instagram.com/cerocafedeorigen/

### Facebook

No tiene / no usar.

### WhatsApp

+54 9 11 5817-3351

### Teléfono

+54 9 11 5817-3351

### Página web actual

No tiene.

### Tipo de atención

* Comer en el local.
* Retiro.
* Consultas por WhatsApp.
* Pet friendly.

### Medios de contacto

* WhatsApp.
* Instagram.
* Llamada telefónica.

No agregar delivery ni reservas si no están confirmados.

---

## Objetivo de la página

La página debe cumplir estos objetivos:

* Presentar profesionalmente a Cero Café de Origen.
* Mostrar el menú cargado dentro de la web por categorías.
* Mostrar ubicación, horarios y contacto.
* Mostrar el estilo del local mediante imágenes.
* Destacar el concepto de café de especialidad y all day café.
* Generar consultas por WhatsApp.
* Servir como demo comercial para mostrarle al cliente.

---

## Concepto de marca

Usar como concepto principal:

**Un espacio para estar presente.**

La marca busca transmitir una experiencia cálida, luminosa y consciente. El lugar se presenta como un espacio donde el café, la comida y el ambiente ayudan a conectar con el momento presente.

Texto de referencia del branding:

Cero busca crear un espacio familiar donde el café, la comida y el ambiente alcancen una calidad excepcional. Un lugar capaz de cambiar la forma en que las personas se conectan con el tiempo, con el espacio y consigo mismas.

Problema que resuelve: la vida cotidiana se mueve rápido y las personas rara vez tienen tiempo para conectarse consigo mismas.

Solución de Cero: un espacio que ancla a las personas en el momento presente, con café de especialidad, ambiente cálido, confortable y atención amable.

Propósito: estar aquí.

Idea visual: la luz. La cafetería recibe luz natural durante el día, transformando la atmósfera desde la mañana hasta el atardecer.

---

## Descripción recomendada del negocio

Cero Café de Origen es un all day café en Villa Urquiza, pensado como un espacio cálido para disfrutar café de especialidad, brunch, pastelería y platos durante todo el día. Un lugar moderno, pet friendly y cómodo para conectar con el momento presente.

---

## Reglas técnicas

La web debe ser:

* Estática.
* Simple.
* Profesional.
* Responsive.
* Mobile-first.
* Hecha con HTML, CSS y JavaScript vanilla.
* Sin backend.
* Sin base de datos.
* Sin frameworks.
* Sin librerías externas innecesarias.
* Compatible con publicación en Netlify.

Usar archivos separados:

* `index.html`
* `css/styles.css`
* `js/main.js`
* `data/contenido.json`

---

## Estructura esperada del proyecto

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

## Secciones obligatorias de la página

La página debe incluir estas secciones:

1. Header / navegación.
2. Hero principal.
3. Sabores de Cero / destacados visuales.
4. Café, brunch y pastelería.
5. Menú por categorías.
6. Espacio / experiencia del local.
7. Galería.
8. Pet friendly.
9. Ubicación y horarios.
10. Contacto.
11. Footer.

---

## Reglas de diseño

La web debe ser visualmente diferente a las demos anteriores.

Tomar como inspiración general una web moderna de cafetería con:

* Hero grande con imagen de fondo.
* Navegación limpia.
* Botones visibles.
* Cards visuales con fotos.
* Secciones amplias.
* Tipografía elegante.
* Menú organizado por categorías.
* Bloque final de ubicación con imagen de fondo o tarjeta destacada.

Importante: la referencia visual sirve solo para estructura y composición.
No copiar colores, textos, logo, imágenes ni identidad de ninguna web externa.

---

## Paleta de marca

Respetar estrictamente los colores de la marca Cero Café de Origen.

Usar como base:

```css
--color-crema: #E4D8B9;
--color-naranja: #FB732F;
--color-naranja-suave: #FFA940;
--color-lila: #D7C1F1;
--color-negro: #111111;
```

La web debe sentirse:

* Cálida.
* Luminosa.
* Moderna.
* Premium.
* Minimalista.
* Artesanal.

Evitar que la web se vea:

* Oscura.
* Bordó.
* Pesada.
* Genérica.
* Demasiado corporativa.

---

## Uso de colores

### Fondo

Usar crema/beige como fondo principal.

### Botones

Botón principal: naranja fuerte.
Hover: naranja suave.
Botón secundario: fondo transparente o crema, borde oscuro y texto oscuro.

### Textos

Títulos principales en negro o marrón muy oscuro.
Texto normal en tonos oscuros.
Detalles destacados en naranja.

### Acentos

El lila puede usarse solo como acento sutil, no como color principal.

---

## Reglas de contenido

No inventar datos reales no confirmados.

Si falta información, marcarla como pendiente o no mostrarla.

No agregar:

* Facebook.
* Delivery.
* Reservas.
* Pedidos online.
* Catering.
* Cowork.
* Loyalty.
* Eventos.

A menos que el usuario lo confirme después.

El botón principal de WhatsApp debe decir:

**Consultar por WhatsApp**

No usar:

**Hacer pedido**

porque por ahora el WhatsApp está confirmado solo para consultas.

---

## Menú

El menú debe estar cargado dentro de la web por categorías.

No mostrar todo en una sola columna larga.

Dividir el menú en secciones claras. Categorías sugeridas:

* Just Coffee.
* Coffee with Milk.
* Hot Drinks.
* Iced Coffee Drinks.
* Cold Drinks.
* Brunch / Combos.
* Menú Mediodía.
* All Day Food.
* Pastries.
* Summer Drinks.

El diseño del menú debe ser claro, ordenado y fácil de navegar en celular.

Puede usarse un sistema de tabs, filtros o botones por categoría con JavaScript vanilla.

---

## Imágenes

Todavía no están definidos los nombres finales de imágenes.

Cuando exista la carpeta `assets/img`, usar nombres en minúsculas, sin espacios, sin tildes y con guiones.

Ejemplos de nombres esperados:

```txt
logo-cero-cafe.png
hero-terraza-cero.jpg
interior-cero-1.jpg
interior-cero-2.jpg
frente-local-cero.jpg
barista-cafe-1.jpg
brunch-cero-1.jpg
```

No depender de imágenes externas por URL.
Todas las imágenes deben cargarse desde `assets/img/`.

Si alguna imagen falta, dejar un comentario claro o usar una estructura preparada para reemplazarla después.

---

## Accesibilidad y calidad

* Usar etiquetas HTML semánticas.
* Usar textos alternativos en imágenes.
* Mantener buen contraste.
* Evitar textos demasiado pequeños.
* Optimizar para mobile-first.
* El menú debe ser cómodo de leer en celular.
* Los botones deben ser fáciles de tocar.
* Los links externos deben abrir en nueva pestaña cuando corresponda.
* Usar `rel="noopener noreferrer"` en links externos.

---

## Qué no debe hacer Codex

No usar frameworks.

No usar React, Vue, Angular, Bootstrap ni Tailwind.

No crear backend.

No crear base de datos.

No inventar información no confirmada.

No copiar exactamente la web de referencia.

No usar la paleta de color de la web de referencia.

No agregar secciones no confirmadas como delivery, reservas, eventos, catering o cowork.

No usar imágenes externas en producción.

No dejar todo el menú en una sola columna larga.

No romper la estructura mobile-first.

---

## Resultado esperado

Codex debe entregar una demo de página web estática para Cero Café de Origen con:

* Diseño profesional.
* Identidad visual respetando la marca.
* Menú cargado por categorías.
* Botón de WhatsApp funcional.
* Botón de Instagram funcional.
* Botón de Google Maps funcional.
* Ubicación y horarios visibles.
* Galería preparada para imágenes.
* Código limpio y ordenado.
* Archivos separados y fáciles de editar.
* Lista para abrir con Live Server y publicar en Netlify.
