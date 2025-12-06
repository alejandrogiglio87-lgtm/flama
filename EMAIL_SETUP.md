# Configuración de EmailJS para Enviar Lista de Compras

La aplicación incluye funcionalidad de envío de lista de compras por email usando **EmailJS**. Para activar esta feature:

## Pasos para Configurar:

### 1. Crear Cuenta en EmailJS
1. Ir a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crear una cuenta gratuita
3. Confirmar email

### 2. Configurar el Servicio de Email
1. En el dashboard, ir a **"Email Services"**
2. Hacer clic en **"Add Service"**
3. Seleccionar un proveedor (Gmail, Outlook, etc.)
4. Seguir las instrucciones para conectar tu cuenta de email
5. Copiar el **Service ID** (ejemplo: `service_abc123`)

### 3. Crear una Plantilla de Email
1. Ir a **"Email Templates"**
2. Hacer clic en **"Create New Template"**
3. Configurar la plantilla con estos campos:
   - **Template Name**: `template_recetario`
   - **Subject**: `{{subject}}`
   - **Content**:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
     {{{message_html}}}
   </body>
   </html>
   ```
4. Guardar la plantilla y copiar el **Template ID** (ejemplo: `template_xyz789`)

### 4. Obtener Public Key
1. Ir a **"Account"** → **"API Keys"**
2. Copiar tu **Public Key**

### 5. Actualizar el Código
Editar el archivo `src/utils/emailService.js` y reemplazar:

```javascript
const EMAILJS_SERVICE_ID = 'service_recetario';      // Tu Service ID aquí
const EMAILJS_TEMPLATE_ID = 'template_recetario';    // Tu Template ID aquí
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';        // Tu Public Key aquí
```

### Ejemplo:
```javascript
const EMAILJS_SERVICE_ID = 'service_abc123xyz';
const EMAILJS_TEMPLATE_ID = 'template_xyz789abc';
const EMAILJS_PUBLIC_KEY = 'dK2pL9nM0qR1sT2uV3w4xY5z';
```

## Prueba
1. Guardar los cambios
2. Recargar la aplicación en el navegador
3. Ir a la pestaña "Lista de Compras"
4. El botón "Enviar por Email" debería aparecer
5. Hacer clic y enviar a un email de prueba

## Notas
- EmailJS ofrece **200 emails gratuitos por mes**
- No se almacena información sensible en el cliente
- Los emails se envían directamente desde EmailJS
- La configuración es segura (solo usa Public Key, no Private Key)

## Troubleshooting
Si el botón "Enviar por Email" no aparece:
1. Verificar que `EMAILJS_PUBLIC_KEY` no sea `'YOUR_PUBLIC_KEY'`
2. Verificar que los Service ID y Template ID sean correctos
3. Abrir la consola del navegador (F12) y buscar errores

## Cambiar de Proveedor de Email
Si deseas usar un servicio diferente:
1. Ir a **Email Services** en EmailJS
2. Agregar un nuevo servicio
3. Actualizar el `EMAILJS_SERVICE_ID` en `emailService.js`
