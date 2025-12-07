import emailjs from '@emailjs/browser';

// Cargar credenciales desde environment variables (seguro - no expuesto en código)
// Estas variables deben estar configuradas en:
// - .env.local para desarrollo local
// - Vercel Project Settings → Environment Variables para producción
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Inicializar EmailJS
try {
  if (!EMAILJS_PUBLIC_KEY) {
    console.warn('⚠️ EmailJS no está configurado. Las variables de entorno VITE_EMAILJS_* no están definidas.');
    console.warn('Configure en .env.local o en Vercel Project Settings → Environment Variables');
  } else {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
} catch (error) {
  console.warn('EmailJS initialization error:', error);
}

/**
 * Genera contenido HTML completo para el email con toda la información
 * @param {Object} planificacion - Planificación semanal
 * @param {Array} recetas - Array de todas las recetas
 * @returns {string} HTML para el email
 */
function generateCompleteWeeklyHTML(planificacion, recetas) {
  let html = '';
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const diasDisplay = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Usar estilos inline para mejor compatibilidad con clientes de email
  html += '<div style="font-family: \'Segoe UI\', \'Helvetica Neue\', sans-serif; max-width: 700px; color: #2c3e50;">';

  // Header estético con degradado visual
  html += '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin-bottom: 30px;">';
  html += '<h1 style="font-family: \'Georgia\', serif; color: white; font-size: 32px; margin: 0; font-weight: normal; letter-spacing: 1px;">Planificación Semanal</h1>';
  html += '<p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 8px 0 0 0; font-style: italic;">Recetario PAE</p>';
  html += '</div>';

  html += '<p style="color: #7f8c8d; font-size: 12px; margin: 15px 20px 20px 20px; text-align: center; border-bottom: 1px solid #ecf0f1; padding-bottom: 15px;">📅 ' + new Date().toLocaleDateString('es-AR') + '</p>';

  // SECCIÓN 1: RECETAS POR DÍA
  html += '<div style="margin: 30px 20px 0 20px;">';
  html += '<h2 style="font-family: \'Georgia\', serif; color: #667eea; font-size: 22px; margin: 0 0 20px 0; font-weight: normal; position: relative; padding-bottom: 12px; border-bottom: 2px solid #667eea;">🍳 Recetas por Día</h2>';

  dias.forEach((dia, idx) => {
    const recetasDelDia = planificacion[dia] || [];
    html += '<div style="margin: 18px 0; padding: 15px; background: linear-gradient(to right, #f8f9fa, white); border-left: 4px solid #667eea; border-radius: 0 5px 5px 0;">';
    html += '<p style="margin: 0 0 10px 0; font-weight: 600; color: #667eea; font-size: 15px; letter-spacing: 0.5px;">' + diasDisplay[idx] + '</p>';

    if (recetasDelDia.length === 0) {
      html += '<p style="margin: 0; color: #999; font-size: 13px;">Sin recetas programadas</p>';
    } else {
      recetasDelDia.forEach(r => {
        html += '<p style="margin: 4px 0; font-size: 13px;">🥘 <strong>' + r.nombre + '</strong> <span style="color: #7f8c8d; font-size: 12px;">(' + r.porciones + ' porciones)</span></p>';
      });
    }
    html += '</div>';
  });
  html += '</div>';

  // SECCIÓN 2: INGREDIENTES POR DÍA
  html += '<div style="margin: 30px 20px 0 20px;">';
  html += '<h2 style="font-family: \'Georgia\', serif; color: #667eea; font-size: 22px; margin: 0 0 20px 0; font-weight: normal; position: relative; padding-bottom: 12px; border-bottom: 2px solid #667eea;">🛒 Ingredientes por Día</h2>';

  dias.forEach((dia, idx) => {
    const recetasDelDia = planificacion[dia] || [];
    const ingredientesDelDia = {};

    recetasDelDia.forEach(r => {
      const receta = recetas.find(rec => rec.id === r.recetaId);
      if (receta) {
        receta.ingredientes.forEach(ing => {
          const key = ing.nombre + '|' + ing.unidad;
          if (!ingredientesDelDia[key]) {
            ingredientesDelDia[key] = {
              nombre: ing.nombre,
              cantidad: 0,
              unidad: ing.unidad
            };
          }
          ingredientesDelDia[key].cantidad += ing.cantidad * r.porciones;
        });
      }
    });

    html += '<div style="margin: 16px 0; padding: 12px; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 0 5px 5px 0;">';
    html += '<p style="margin: 0 0 10px 0; font-weight: 600; color: #667eea; font-size: 14px;">📌 ' + diasDisplay[idx] + '</p>';

    if (Object.keys(ingredientesDelDia).length === 0) {
      html += '<p style="margin: 0; color: #999; font-size: 12px;">Sin ingredientes</p>';
    } else {
      html += '<table style="width: 100%; border-collapse: collapse; font-size: 11px;">';
      html += '<tr style="background-color: #667eea; color: white;">';
      html += '<td style="border: none; padding: 8px; font-weight: 600;">Ingrediente</td>';
      html += '<td style="border: none; padding: 8px; text-align: center; font-weight: 600;">Cantidad</td>';
      html += '<td style="border: none; padding: 8px; font-weight: 600;">Unidad</td>';
      html += '</tr>';

      Object.entries(ingredientesDelDia).forEach(([key, ing], idx2) => {
        const bgColor = idx2 % 2 === 0 ? '#f5f6fa' : '#ffffff';
        html += '<tr style="background-color: ' + bgColor + '; border-bottom: 1px solid #e8eaed;">';
        html += '<td style="padding: 8px; color: #2c3e50;">' + ing.nombre + '</td>';
        html += '<td style="padding: 8px; text-align: center; color: #667eea; font-weight: 500;">' + formatNumberEmail(ing.cantidad) + '</td>';
        html += '<td style="padding: 8px; color: #7f8c8d;">' + (ing.unidad || '') + '</td>';
        html += '</tr>';
      });

      html += '</table>';
    }
    html += '</div>';
  });
  html += '</div>';

  // SECCIÓN 3: RESUMEN DE INGREDIENTES PARA LA SEMANA
  html += '<div style="margin: 30px 20px 0 20px;">';
  html += '<h2 style="font-family: \'Georgia\', serif; color: #667eea; font-size: 22px; margin: 0 0 20px 0; font-weight: normal; position: relative; padding-bottom: 12px; border-bottom: 2px solid #667eea;">🛍️ Lista de Compras - Semana Completa</h2>';

  const ingredientesSemanales = {};

  dias.forEach(dia => {
    const recetasDelDia = planificacion[dia] || [];
    recetasDelDia.forEach(r => {
      const receta = recetas.find(rec => rec.id === r.recetaId);
      if (receta) {
        receta.ingredientes.forEach(ing => {
          const key = ing.nombre + '|' + ing.unidad;
          if (!ingredientesSemanales[key]) {
            ingredientesSemanales[key] = {
              nombre: ing.nombre,
              cantidad: 0,
              unidad: ing.unidad
            };
          }
          ingredientesSemanales[key].cantidad += ing.cantidad * r.porciones;
        });
      }
    });
  });

  const ingredientesOrdenados = Object.values(ingredientesSemanales).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  );

  if (ingredientesOrdenados.length === 0) {
    html += '<p style="color: #999;">Sin ingredientes</p>';
  } else {
    html += '<table style="width: 100%; border-collapse: collapse; font-size: 11px;">';
    html += '<tr style="background-color: #667eea; color: white;">';
    html += '<td style="border: none; padding: 8px; font-weight: 600;">Ingrediente</td>';
    html += '<td style="border: none; padding: 8px; text-align: center; font-weight: 600;">Cantidad Total</td>';
    html += '<td style="border: none; padding: 8px; font-weight: 600;">Unidad</td>';
    html += '</tr>';

    ingredientesOrdenados.forEach((ing, idx) => {
      const bgColor = idx % 2 === 0 ? '#f5f6fa' : '#ffffff';
      html += '<tr style="background-color: ' + bgColor + '; border-bottom: 1px solid #e8eaed;">';
      html += '<td style="padding: 8px; color: #2c3e50;">' + ing.nombre + '</td>';
      html += '<td style="padding: 8px; text-align: center; color: #667eea; font-weight: 500;">' + formatNumberEmail(ing.cantidad) + '</td>';
      html += '<td style="padding: 8px; color: #7f8c8d;">' + (ing.unidad || '') + '</td>';
      html += '</tr>';
    });

    html += '</table>';
  }

  html += '</div>';
  html += '<div style="margin: 30px 20px 0 20px;">';
  html += '<hr style="border: none; border-top: 1px solid #ecf0f1; margin: 20px 0 15px 0;">';
  html += '<p style="font-size: 12px; color: #95a5a6; margin: 0; text-align: center;">✨ Generado con Recetario PAE • ' + new Date().toLocaleDateString('es-AR') + '</p>';
  html += '</div></div>';

  return html;
}

/**
 * Genera contenido HTML para la lista de compras (legacy)
 * @param {Object} groupedIngredients - Ingredientes agrupados
 * @param {string} groupBy - Criterio de agrupación
 * @param {boolean} includePDFLink - Incluir información sobre PDF
 * @param {boolean} includeExcelLink - Incluir información sobre Excel
 * @returns {string} HTML para el email
 */
function generateShoppingListHTML(groupedIngredients, groupBy, includePDFLink = false, includeExcelLink = false) {
  let html = '';

  // Usar estilos inline para mejor compatibilidad con clientes de email
  html += '<div style="font-family: Arial, sans-serif; max-width: 600px;">';
  html += '<h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Lista de Compras - Recetario PAE</h2>';
  html += '<p style="color: #666;">Agrupado por: <strong>' + groupBy + '</strong></p>';

  // Sección de información de descargas
  if (includePDFLink || includeExcelLink) {
    html += '<div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 5px; padding: 12px; margin: 15px 0;">';
    html += '<p style="margin: 0 0 8px 0; color: #856404; font-weight: bold;">📥 Archivos Disponibles:</p>';
    html += '<p style="margin: 0; color: #856404; font-size: 13px;">';

    const archivos = [];
    if (includePDFLink) archivos.push('PDF con planificación completa (recetas, ingredientes por día, lista consolidada)');
    if (includeExcelLink) archivos.push('Excel con 3 hojas (planificación, ingredientes por día, lista de compras)');

    html += archivos.map(a => '✓ ' + a).join('<br>');
    html += '</p>';
    html += '<p style="margin: 8px 0 0 0; color: #856404; font-size: 12px;"><strong>Nota:</strong> Descarga los archivos desde la aplicación en el Planificador</p>';
    html += '</div>';
  }

  Object.entries(groupedIngredients).forEach(([group, items]) => {
    html += '<h3 style="color: #0056b3; margin-top: 20px;">' + group + '</h3>';
    html += '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">';
    html += '<thead><tr style="background-color: #e7f3ff;">';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Ingrediente</th>';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cantidad</th>';
    html += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Unidad</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    items.forEach((ing, idx) => {
      const bgColor = idx % 2 === 0 ? '#f9f9f9' : '#ffffff';
      html += '<tr style="background-color: ' + bgColor + ';">';
      html += '<td style="border: 1px solid #ddd; padding: 8px;">' + ing.nombre + '</td>';
      html += '<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">' + formatNumberEmail(ing.cantidad_total) + '</td>';
      html += '<td style="border: 1px solid #ddd; padding: 8px;">' + (ing.unidad || '') + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table>';
  });

  html += '<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">';
  html += '<p style="font-size: 12px; color: #999;">Generado con Recetario PAE • ' + new Date().toLocaleDateString('es-AR') + '</p>';
  html += '</div>';

  return html;
}

/**
 * Formatea número para email
 */
function formatNumberEmail(numero) {
  if (!numero) return '0';
  const num = parseFloat(numero);
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Envía la lista de compras por email
 * @param {string} recipientEmail - Email del destinatario
 * @param {Object} groupedIngredients - Ingredientes agrupados
 * @param {string} groupBy - Criterio de agrupación
 * @param {Blob} pdfBlob - Archivo PDF (opcional)
 * @param {Blob} excelBlob - Archivo Excel (opcional)
 * @returns {Promise}
 */
/**
 * Envía la planificación semanal completa por email
 * @param {string} recipientEmail - Email del destinatario
 * @param {Object} planificacion - Planificación semanal
 * @param {Array} recetas - Array de todas las recetas
 * @returns {Promise}
 */
export async function sendWeeklyPlanEmail(recipientEmail, planificacion, recetas) {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw new Error('Email inválido');
    }

    // Generar HTML completo con toda la información
    const htmlContent = generateCompleteWeeklyHTML(planificacion, recetas);

    const templateParams = {
      to_email: recipientEmail,
      from_name: 'Recetario PAE',
      subject: 'Planificacion Semanal - Recetario PAE',
      message_html: htmlContent.trim()
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      return { success: true, message: 'Email enviado exitosamente' };
    } else {
      throw new Error('Error al enviar el email');
    }
  } catch (error) {
    console.error('Error enviando email:', error);
    return {
      success: false,
      message: error.message || 'Error al enviar el email. Asegúrate de haber configurado EmailJS.',
      error
    };
  }
}

export async function sendShoppingListEmail(recipientEmail, groupedIngredients, groupBy, pdfBlob = null, excelBlob = null) {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw new Error('Email inválido');
    }

    // Generar HTML con información sobre archivos disponibles
    const htmlContent = generateShoppingListHTML(groupedIngredients, groupBy, !!pdfBlob, !!excelBlob);

    const templateParams = {
      to_email: recipientEmail,
      from_name: 'Recetario PAE',
      subject: 'Planificacion Semanal - Recetario PAE',
      message_html: htmlContent.trim()
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      const attachmentInfo = [];
      if (pdfBlob) attachmentInfo.push('PDF');
      if (excelBlob) attachmentInfo.push('Excel');
      const message = attachmentInfo.length > 0
        ? `Email enviado. Los archivos (${attachmentInfo.join(' y ')}) están disponibles en la aplicación`
        : 'Email enviado exitosamente';
      return { success: true, message };
    } else {
      throw new Error('Error al enviar el email');
    }
  } catch (error) {
    console.error('Error enviando email:', error);
    return {
      success: false,
      message: error.message || 'Error al enviar el email. Asegúrate de haber configurado EmailJS.',
      error
    };
  }
}

/**
 * Convierte un Blob a Base64
 */
async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Verifica si EmailJS está configurado
 * @returns {boolean}
 */
export function isEmailJSConfigured() {
  // Retornar true si hay alguna credencial configurada (no es la default)
  return EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && EMAILJS_PUBLIC_KEY.length > 0;
}
