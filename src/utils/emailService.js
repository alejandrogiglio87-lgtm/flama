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
  let html = '<h2>Lista de Compras - Recetario PAE</h2>';
  html += '<p>Agrupado por: <strong>' + groupBy + '</strong></p>';
  html += '<hr>';

  Object.entries(groupedIngredients).forEach(([group, items]) => {
    html += '<h3>' + group + '</h3>';
    html += '<table border="1" cellpadding="10">';
    html += '<tr><th>Ingrediente</th><th>Cantidad</th><th>Unidad</th></tr>';

    items.forEach((ing) => {
      html += '<tr>';
      html += '<td>' + ing.nombre + '</td>';
      html += '<td>' + formatNumberEmail(ing.cantidad_total) + '</td>';
      html += '<td>' + (ing.unidad || '') + '</td>';
      html += '</tr>';
    });

    html += '</table>';
  });

  html += '<hr>';
  html += '<p style="font-size: 12px; color: #999;">Generado con Recetario PAE • ' + new Date().toLocaleDateString('es-AR') + '</p>';

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
      subject: `Lista de Compras - ${new Date().toLocaleDateString('es-AR')}`,
      message_html: htmlContent
    };

    // Agregar archivos adjuntos si existen
    if (pdfBlob) {
      const pdfBase64 = await blobToBase64(pdfBlob);
      templateParams.attachment = {
        filename: `lista_compras_${new Date().toISOString().split('T')[0]}.pdf`,
        base64: pdfBase64,
        type: 'application/pdf'
      };
    }

    if (excelBlob) {
      const excelBase64 = await blobToBase64(excelBlob);
      templateParams.attachment_excel = {
        filename: `planificacion_${new Date().toISOString().split('T')[0]}.xlsx`,
        base64: excelBase64,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    }

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
