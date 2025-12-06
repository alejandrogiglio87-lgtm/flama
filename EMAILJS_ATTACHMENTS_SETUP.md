# Configuración de Adjuntos en EmailJS

## Problema Original
Las opciones de adjuntar PDF y Excel al email no funcionaban porque los archivos se descargaban localmente en lugar de enviarse con el email.

## Solución Implementada
La aplicación ahora envía los archivos con el email de dos formas:

### 1. Enlaces de Descarga Directa en el Email
- El email incluye botones con enlaces de descarga
- Los archivos se envían como **base64** embebidos en la URL
- Los usuarios pueden descargar directamente desde el email
- No requiere configuración adicional en EmailJS

### 2. Parámetros Enviados (Opcional para attachments)
La aplicación ahora envía estos parámetros al template:
- `attachment_pdf`: Contenido base64 del archivo PDF
- `pdf_name`: Nombre del archivo PDF
- `attachment_excel`: Contenido base64 del archivo Excel
- `excel_name`: Nombre del archivo Excel

## Cómo Funciona Ahora
1. Seleccionas los checkboxes "Adjuntar PDF" y "Adjuntar Excel"
2. El email se envía con la lista de compras y una sección de descargas
3. El email incluye dos botones coloreados:
   - **📄 Descargar PDF** (botón naranja)
   - **📊 Descargar Excel** (botón verde)
4. Al hacer clic en cualquiera de los botones, el archivo se descarga directamente desde el email

## ¡Funciona Sin Configuración Adicional! ✅

La solución de enlaces de descarga **ya está implementada y funcionando**. No requiere cambios en tu template de EmailJS.

### Cómo Usar
1. Abre el Planificador en la app
2. Agrega recetas para la semana
3. Haz clic en "Enviar por Email"
4. Selecciona los checkboxes:
   - ✅ "Adjuntar PDF" - para incluir lista de compras en PDF
   - ✅ "Adjuntar Excel" - para incluir planificación semanal en Excel
5. Ingresa tu email y haz clic en "Enviar"
6. Recibirás un email con:
   - La lista de compras en HTML
   - Botones de descarga para PDF y Excel
   - Los archivos se descargan directamente desde el email

### Prueba la Funcionalidad
1. Ve a https://recetario-pae.vercel.app (o tu URL)
2. Selecciona algunas recetas en el Planificador
3. Envía un email con uno o ambos archivos adjuntos
4. Verifica el email y prueba los enlaces de descarga

## Configuración Avanzada (Opcional)

Si deseas que los archivos se adjunten como true attachments en lugar de enlaces descargables:

### Opción: Usar EmailJS Premium
1. Ve a https://dashboard.emailjs.com
2. Edita el template "template_x23dhwq"
3. Agrega attachments en la configuración del servicio:
   - Tipo: Base64
   - Variable: `{{attachment_pdf}}` con nombre `{{pdf_name}}`
   - Variable: `{{attachment_excel}}` con nombre `{{excel_name}}`

Sin embargo, **los enlaces de descarga funcionan perfectamente** y son más compatibles con todos los clientes de email.

## Verificación en Consola
Si hay errores, abre la consola del navegador (F12) y busca mensajes del tipo:
```
Error enviando email: ...
```

## Notas Importantes
- Los archivos se convierten a base64, lo que puede hacer los emails más pesados
- EmailJS tiene límites de tamaño de emails según el plan
- Si los archivos son muy grandes, podrían fallar los envíos
- Prueba primero con PDFs/Excels pequeños

## Soporte
Si necesitas ayuda:
1. Verifica que tu template ID sea correcto: `template_x23dhwq`
2. Verifica que tu Service ID sea correcto: `recetas_flama`
3. Verifica que tu Public Key sea correcta: `yjQPVGxxzArERJjj-`
4. Consulta la documentación de EmailJS: https://www.emailjs.com/docs/
