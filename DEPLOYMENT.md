# Guía de Deployment - Recetario PAE

## Opción 1: Vercel (Recomendado - Más Rápido)

### Pasos:

1. **Crear cuenta en Vercel** (si no tienes):
   - Ve a https://vercel.com
   - Haz click en "Sign Up"
   - Usa tu cuenta de GitHub

2. **Conectar tu repositorio**:
   - En Vercel, haz click en "New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente Vite

3. **Configurar** (opcional, casi automático):
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: (no necesita ninguna)

4. **Deploy**:
   - Click en "Deploy"
   - Tu app estará lista en 1-2 minutos

5. **Tu URL será algo como**:
   - `https://flama-recetario.vercel.app`

---

## Opción 2: Netlify

### Pasos:

1. **Ir a https://netlify.com**
   - Sign up con GitHub

2. **Crear nuevo sitio**:
   - Click en "New Site from Git"
   - Selecciona tu repositorio
   - Selecciona GitHub

3. **Configurar**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy!

4. **URL**: `https://mi-sitio-netlify.netlify.app`

---

## Opción 3: GitHub Pages

### Pasos:

1. **Actualizar `vite.config.js`**:
```javascript
export default {
  base: '/flama-recetario/',  // Tu repo name
  // ... resto del config
}
```

2. **Actualizar `package.json`**:
Agregar a scripts:
```json
"deploy": "npm run build && git add dist && git commit -m 'Deploy' && git push"
```

3. **Actualizar Settings en GitHub**:
   - Repo → Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: /root
   - Salvar

4. **Deploy**:
```bash
npm run deploy
```

5. **URL**: `https://tu-usuario.github.io/flama-recetario/`

---

## Opción 4: Tu Propio Servidor

### Con cualquier servidor web (Apache, Nginx, etc):

1. **Build**:
```bash
npm run build
```

2. **Subir contenido de `dist/` a tu servidor**:
   - Vía FTP
   - SSH
   - Control Panel

3. **Configurar reescritura de URLs** (importante!):
   
   **Nginx**:
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

   **Apache** (.htaccess):
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## Verificación Post-Deployment

- ✅ Abre la URL en navegador
- ✅ Busca una receta
- ✅ Selecciona una receta
- ✅ Calcula ingredientes
- ✅ Agrega a planificador
- ✅ Guarda un plan
- ✅ Exporta PDF
- ✅ Abre DevTools (F12) - no debería haber errores rojos

---

## Actualizar la Aplicación Después de Cambios

### Si usas Vercel/Netlify:
- Solo haz push a GitHub
- Se redeploy automáticamente

### Si usas tu servidor:
```bash
npm run build
# Subir contenido de dist/ a tu servidor
```

---

## Solución de Problemas

**P**: La app carga pero muestra "Cargando recetario..."
**R**: Las recetas no se cargan desde `/data/recetas.json`. Verifica que el archivo esté en `public/data/`

**P**: Las rutas no funcionan al navegar
**R**: Falta reescritura de URLs (revisa configuración de servidor)

**P**: Los datos no se guardan
**R**: LocalStorage podría estar bloqueado. Verifica en DevTools → Application → Storage

**P**: PDF no se descarga
**R**: Problema con jsPDF. Intenta en otro navegador o actualiza la página

---

## Después del Deployment

1. **Compartir URL** con los usuarios del PAE
2. **Bookmark** la página en navegador
3. **Sugerir agregar a homescreen** en móviles (PWA)
4. **Guardar un backup** periódicamente (exportar datos)

---

¡Tu app está lista! 🚀
