import emailjs from '@emailjs/browser';

// Inicializar EmailJS (necesitas obtener una PUBLIC KEY gratuita en emailjs.com)
// Para desarrollo, puedes usar una clave pública de prueba
const EMAILJS_SERVICE_ID = 'recetas_flama';
const EMAILJS_TEMPLATE_ID = 'template_x23dhwq';
const EMAILJS_PUBLIC_KEY = 'yjQPVGxxzArERJjj-';

// Inicializar EmailJS
try {
  emailjs.init(EMAILJS_PUBLIC_KEY);
} catch (error) {
  console.warn('EmailJS no está configurado. Configure EMAILJS_PUBLIC_KEY en emailService.js');
}

/**
 * Genera contenido HTML completo para el email con toda la información
 * @param {Object} planificacion - Planificación semanal
 * @param {Array} recetas - Array de todas las recetas
 * @param {boolean} includePDFLink - Incluir información sobre PDF
 * @param {boolean} includeExcelLink - Incluir información sobre Excel
 * @returns {string} HTML para el email
 */
function generateCompleteWeeklyHTML(planificacion, recetas, includePDFLink = false, includeExcelLink = false) {
  let html = '';
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const diasDisplay = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Usar estilos inline para mejor compatibilidad con clientes de email
  html += '<div style="font-family: Arial, sans-serif; max-width: 700px; color: #333;">';
  html += '<h2 style="color: #007bff; border-bottom: 3px solid #007bff; padding-bottom: 10px; margin-bottom: 5px;">Planificación Semanal - Recetario PAE</h2>';
  html += '<p style="color: #666; font-size: 12px; margin: 0 0 15px 0;">Generado: ' + new Date().toLocaleDateString('es-AR') + '</p>';

  // Sección de información de descargas
  if (includePDFLink || includeExcelLink) {
    html += '<div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 5px; padding: 12px; margin: 15px 0;">';
    html += '<p style="margin: 0 0 8px 0; color: #856404; font-weight: bold;">📥 Más Información Disponible:</p>';
    html += '<p style="margin: 0; color: #856404; font-size: 12px;">';

    const archivos = [];
    if (includePDFLink) archivos.push('PDF (planificación, ingredientes, listas)');
    if (includeExcelLink) archivos.push('Excel (3 hojas con todos los detalles)');

    html += archivos.map(a => '✓ ' + a).join('<br>');
    html += '</p>';
    html += '</div>';
  }

  // SECCIÓN 1: RECETAS POR DÍA
  html += '<h3 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 8px; margin-top: 20px;">1. RECETAS POR DÍA</h3>';

  dias.forEach((dia, idx) => {
    const recetasDelDia = planificacion[dia] || [];
    html += '<div style="margin: 12px 0; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #007bff;">';
    html += '<p style="margin: 0 0 8px 0; font-weight: bold; color: #0056b3;">' + diasDisplay[idx] + '</p>';

    if (recetasDelDia.length === 0) {
      html += '<p style="margin: 0; color: #999; font-size: 13px;">Sin recetas programadas</p>';
    } else {
      recetasDelDia.forEach(r => {
        html += '<p style="margin: 4px 0; font-size: 13px;">• <strong>' + r.nombre + '</strong> (' + r.porciones + ' porciones)</p>';
      });
    }
    html += '</div>';
  });

  // SECCIÓN 2: INGREDIENTES POR DÍA
  html += '<h3 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 8px; margin-top: 20px;">2. INGREDIENTES POR DÍA</h3>';

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

    html += '<div style="margin: 12px 0;">';
    html += '<p style="margin: 0 0 8px 0; font-weight: bold; color: #0056b3;">' + diasDisplay[idx] + '</p>';

    if (Object.keys(ingredientesDelDia).length === 0) {
      html += '<p style="margin: 0; color: #999; font-size: 12px;">Sin ingredientes</p>';
    } else {
      html += '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">';
      html += '<tr style="background-color: #e7f3ff;">';
      html += '<td style="border: 1px solid #ddd; padding: 6px;">Ingrediente</td>';
      html += '<td style="border: 1px solid #ddd; padding: 6px; text-align: center;">Cantidad</td>';
      html += '<td style="border: 1px solid #ddd; padding: 6px;">Unidad</td>';
      html += '</tr>';

      Object.entries(ingredientesDelDia).forEach(([key, ing], idx2) => {
        const bgColor = idx2 % 2 === 0 ? '#f9f9f9' : '#ffffff';
        html += '<tr style="background-color: ' + bgColor + ';">';
        html += '<td style="border: 1px solid #ddd; padding: 6px;">' + ing.nombre + '</td>';
        html += '<td style="border: 1px solid #ddd; padding: 6px; text-align: center;">' + formatNumberEmail(ing.cantidad) + '</td>';
        html += '<td style="border: 1px solid #ddd; padding: 6px;">' + (ing.unidad || '') + '</td>';
        html += '</tr>';
      });

      html += '</table>';
    }
    html += '</div>';
  });

  // SECCIÓN 3: RESUMEN DE INGREDIENTES PARA LA SEMANA
  html += '<h3 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 8px; margin-top: 20px;">3. LISTA DE COMPRAS - SEMANA COMPLETA</h3>';

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
    html += '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">';
    html += '<tr style="background-color: #e7f3ff;">';
    html += '<td style="border: 1px solid #ddd; padding: 6px;">Ingrediente</td>';
    html += '<td style="border: 1px solid #ddd; padding: 6px; text-align: center;">Cantidad Total</td>';
    html += '<td style="border: 1px solid #ddd; padding: 6px;">Unidad</td>';
    html += '</tr>';

    ingredientesOrdenados.forEach((ing, idx) => {
      const bgColor = idx % 2 === 0 ? '#f9f9f9' : '#ffffff';
      html += '<tr style="background-color: ' + bgColor + ';">';
      html += '<td style="border: 1px solid #ddd; padding: 6px;">' + ing.nombre + '</td>';
      html += '<td style="border: 1px solid #ddd; padding: 6px; text-align: center;">' + formatNumberEmail(ing.cantidad) + '</td>';
      html += '<td style="border: 1px solid #ddd; padding: 6px;">' + (ing.unidad || '') + '</td>';
      html += '</tr>';
    });

    html += '</table>';
  }

  html += '<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0 10px 0;">';
  html += '<p style="font-size: 11px; color: #999; margin: 0;">Generado con Recetario PAE • ' + new Date().toLocaleDateString('es-AR') + '</p>';
  html += '</div>';

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
    html += '<p style="margin: 8px 0 0 0; color: #856404; font-size: 12px;"><strong>Nota:</strong> Descarga los archivos desde la aplicación (botones PDF y Excel en el Planificador)</p>';
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
 * @param {Blob} pdfBlob - Archivo PDF (opcional)
 * @param {Blob} excelBlob - Archivo Excel (opcional)
 * @returns {Promise}
 */
export async function sendWeeklyPlanEmail(recipientEmail, planificacion, recetas, pdfBlob = null, excelBlob = null) {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw new Error('Email inválido');
    }

    // Generar HTML completo con toda la información
    const htmlContent = generateCompleteWeeklyHTML(planificacion, recetas, !!pdfBlob, !!excelBlob);

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
