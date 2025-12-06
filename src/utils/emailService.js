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
 * @returns {string} HTML para el email
 */
function generateShoppingListHTML(groupedIngredients, groupBy) {
  let html = '';

  // Usar estilos inline para mejor compatibilidad con clientes de email
  html += '<div style="font-family: Arial, sans-serif; max-width: 600px;">';
  html += '<h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Lista de Compras - Recetario PAE</h2>';
  html += '<p style="color: #666;">Agrupado por: <strong>' + groupBy + '</strong></p>';

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

    const htmlContent = generateShoppingListHTML(groupedIngredients, groupBy);

    const templateParams = {
      to_email: recipientEmail,
      from_name: 'Recetario PAE',
      subject: 'Planificacion Semanal - Recetario PAE',
      message_html: htmlContent.trim()
    };

    // Si hay adjuntos, usar FormData para enviar con archivos
    if (pdfBlob || excelBlob) {
      return await sendEmailWithAttachments(templateParams, pdfBlob, excelBlob);
    }

    // Sin adjuntos, usar el método estándar
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

/**
 * Envía email con adjuntos usando FormData
 */
async function sendEmailWithAttachments(baseParams, pdfBlob, excelBlob) {
  try {
    const formData = new FormData();

    // Agregar parámetros básicos
    formData.append('service_id', EMAILJS_SERVICE_ID);
    formData.append('template_id', EMAILJS_TEMPLATE_ID);
    formData.append('user_id', EMAILJS_PUBLIC_KEY);

    // Agregar parámetros del email
    Object.keys(baseParams).forEach(key => {
      formData.append(key, baseParams[key]);
    });

    // Agregar archivos PDF si existen
    if (pdfBlob) {
      formData.append('attachment_pdf', pdfBlob, `lista_compras_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    // Agregar archivos Excel si existen
    if (excelBlob) {
      formData.append('attachment_excel', excelBlob, `planificacion_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    // Enviar usando fetch a la API de EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
      method: 'POST',
      body: formData
    });

    if (response.status === 200) {
      return { success: true, message: 'Email enviado exitosamente con archivos adjuntos' };
    } else {
      const errorText = await response.text();
      throw new Error(`Error al enviar email: ${errorText}`);
    }
  } catch (error) {
    console.error('Error enviando email con adjuntos:', error);
    // Intentar enviar sin adjuntos si falla
    console.warn('Reintentando sin adjuntos...');
    return {
      success: false,
      message: 'No se pudieron adjuntar los archivos al email. Por favor intenta nuevamente.',
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
