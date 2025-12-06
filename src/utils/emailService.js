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
 * Genera contenido HTML para la lista de compras
 * @param {Object} groupedIngredients - Ingredientes agrupados
 * @param {string} groupBy - Criterio de agrupación
 * @param {boolean} includePDFLink - Incluir enlace para descargar PDF
 * @param {boolean} includeExcelLink - Incluir enlace para descargar Excel
 * @returns {string} HTML para el email
 */
function generateShoppingListHTML(groupedIngredients, groupBy, includePDFLink = false, includeExcelLink = false) {
  let html = '';

  // Usar estilos inline para mejor compatibilidad con clientes de email
  html += '<div style="font-family: Arial, sans-serif; max-width: 600px;">';
  html += '<h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Lista de Compras - Recetario PAE</h2>';
  html += '<p style="color: #666;">Agrupado por: <strong>' + groupBy + '</strong></p>';

  // Sección de descargas
  if (includePDFLink || includeExcelLink) {
    html += '<div style="background-color: #e7f3ff; border: 1px solid #007bff; border-radius: 5px; padding: 12px; margin: 15px 0;">';
    html += '<p style="margin: 0 0 10px 0; color: #0056b3; font-weight: bold;">📥 Descargar Archivos:</p>';

    if (includePDFLink) {
      html += '<a href="data:application/pdf;base64,{{attachment_pdf}}" download="{{pdf_name}}" style="display: inline-block; background-color: #ff6b35; color: white; padding: 8px 12px; text-decoration: none; border-radius: 3px; margin-right: 8px; margin-bottom: 8px;">📄 Descargar PDF</a>';
    }

    if (includeExcelLink) {
      html += '<a href="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,{{attachment_excel}}" download="{{excel_name}}" style="display: inline-block; background-color: #28a745; color: white; padding: 8px 12px; text-decoration: none; border-radius: 3px; margin-bottom: 8px;">📊 Descargar Excel</a>';
    }

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
export async function sendShoppingListEmail(recipientEmail, groupedIngredients, groupBy, pdfBlob = null, excelBlob = null) {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw new Error('Email inválido');
    }

    // Generar HTML con enlaces de descarga si hay archivos
    const htmlContent = generateShoppingListHTML(groupedIngredients, groupBy, !!pdfBlob, !!excelBlob);

    const templateParams = {
      to_email: recipientEmail,
      from_name: 'Recetario PAE',
      subject: 'Planificacion Semanal - Recetario PAE',
      message_html: htmlContent.trim()
    };

    const pdfFileName = `lista_compras_${new Date().toISOString().split('T')[0]}.pdf`;
    const excelFileName = `planificacion_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Convertir archivos a base64 y agregar al template
    if (pdfBlob) {
      const pdfBase64 = await blobToBase64(pdfBlob);
      templateParams.attachment_pdf = pdfBase64;
      templateParams.pdf_name = pdfFileName;
    }

    if (excelBlob) {
      const excelBase64 = await blobToBase64(excelBlob);
      templateParams.attachment_excel = excelBase64;
      templateParams.excel_name = excelFileName;
    }

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
        ? `Email enviado con enlaces de descarga: ${attachmentInfo.join(' y ')}`
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
