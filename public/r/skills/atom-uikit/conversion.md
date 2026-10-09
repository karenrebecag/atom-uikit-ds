# Conversión: WhatsApp

Atom no usa formularios. El canal de conversión es WhatsApp: todo CTA de contacto, demo, ventas o soporte
es el componente de botón de WhatsApp enlazando a `wa.me`. <!-- regla: no-forms -->

## El botón

Se escribe con las clases del componente `whatsapp-button`: la variante estática es
`.atom-wa-btn--inline` (la flotante fija no es un CTA de sección). Los bloques ya la traen con su icono y
su `data-atom-button`, que engancha la atribución del SDK: sin él el botón funciona pero el lead no se atribuye.

```html
<a class="atom-wa-btn atom-wa-btn--inline atom-wa-btn--l" href="https://wa.me/<NUMERO>" data-atom-button>
  <span class="atom-wa-btn__inner">
    <span class="atom-wa-btn__icon is--left"><!-- svg --></span>
    <span class="atom-wa-btn__label">Habla con nosotros por WhatsApp</span>
  </span>
  <span class="atom-wa-btn__bg"></span>
</a>
```

## El número

El número sale del brief. Si no lo tienes, pregunta y espera: nunca uses `00000000000`, es el de referencia.
Todos los CTA de la página usan el mismo número confirmado.

## Lo que nunca

- Un `<form>`, un input de correo o nombre, o una interfaz de chat construida a mano.
- Un enlace `href="#"` como CTA.
- Un segundo CTA primario compitiendo en la misma sección: el secundario se omite o va como enlace.

Si el brief prohíbe WhatsApp, dilo en el reporte; no lo sustituyas por un formulario.
