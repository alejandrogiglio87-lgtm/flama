# Configuración de Adjuntos en EmailJS

## Problema
Las opciones de adjuntar PDF y Excel al email no funcionaban porque EmailJS no tenía configurado el soporte para attachments.

## Solución Implementada
La aplicación ahora envía los archivos como contenido **base64** a través de parámetros del template:
- `attachment_pdf`: Contenido base64 del archivo PDF
- `pdf_name`: Nombre del archivo PDF
- `attachment_excel`: Contenido base64 del archivo Excel
- `excel_name`: Nombre del archivo Excel

## Pasos para Configurar en EmailJS

### 1. Ve a tu Dashboard de EmailJS
- Accede a https://dashboard.emailjs.com
- Ve a tu servicio "recetas_flama"

### 2. Edita el Template Actual
- Abre el template "template_x23dhwq"
- Necesitas agregar soporte para attachments

### 3. Opción A: Usar EmailJS Premium (Recomendado)
Si tu cuenta tiene soporte para attachments:

1. En la sección de configuración del template, busca la opción de **Attachments**
2. Agregua los siguientes attachments:
   - Tipo: Base64
   - Nombre de variable: `{{attachment_pdf}}`
   - Nombre del archivo: `{{pdf_name}}`

   - Tipo: Base64
   - Nombre de variable: `{{attachment_excel}}`
   - Nombre del archivo: `{{excel_name}}`

### 4. Opción B: Sin Soporte de Attachments Premium
Si tu plan no soporta attachments en EmailJS, puedes:

#### A. Actualizar el plan de EmailJS
- Ir a settings y cambiar a plan que soporte attachments

#### B. Solución Alternativa: Incluir Enlaces de Descarga
Modificar el HTML del email para incluir instrucciones:
```html
<p>Los archivos están disponibles en los siguientes enlaces:</p>
<ul>
  <li><a href="...">Descargar Lista de Compras (PDF)</a></li>
  <li><a href="...">Descargar Planificación (Excel)</a></li>
</ul>
```

### 5. Prueba la Configuración
1. Ve a la app y abre el Planificador
2. Agrega algunas recetas para la semana
3. Haz clic en "Enviar por Email"
4. Selecciona los checkboxes "Adjuntar PDF" y/o "Adjuntar Excel"
5. Ingresa tu email y envía
6. Verifica que recibas los archivos adjuntos

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
