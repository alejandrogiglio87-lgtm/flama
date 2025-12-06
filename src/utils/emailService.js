import emailjs from '@emailjs/browser';

// Inicializar EmailJS (necesitas obtener una PUBLIC KEY gratuita en emailjs.com)
// Para desarrollo, puedes usar una clave pública de prueba
const EMAILJS_SERVICE_ID = 'recetas_flama';
const EMAILJS_TEMPLATE_ID = 'yjQPVGxxzArERJjj-';
const EMAILJS_PUBLIC_KEY = 'yjQPVGxxzArERJjj-'; // Reemplazar con tu clave pública

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
  let html = `
    <h2 style="color: #1e40af; text-align: center;">Lista de Compras - Recetario PAE</h2>
    <p style="text-align: center; color: #666;">Agrupado por: <strong>${groupBy}</strong></p>
    <hr style="border: none; border-top: 2px solid #e0e7ff;">
  `;

  Object.entries(groupedIngredients).forEach(([group, items]) => {
    html += `
      <h3 style="color: #1e40af; margin-top: 20px; padding: 10px; background: #f0f4ff; border-radius: 5px;">
        ${group}
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
        <thead>
          <tr style="background: #e0e7ff;">
            <th style="padding: 10px; text-align: left; border: 1px solid #bfdbfe;">Ingrediente</th>
            <th style="padding: 10px; text-align: right; border: 1px solid #bfdbfe;">Cantidad</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #bfdbfe;">Unidad</th>
          </tr>
        </thead>
        <tbody>
    `;

    items.forEach((ing, idx) => {
      const bgColor = idx % 2 === 0 ? '#ffffff' : '#f9fafb';
      html += `
        <tr style="background: ${bgColor};">
          <td style="padding: 10px; border: 1px solid #e0e7ff;">${ing.nombre}</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #e0e7ff; font-weight: bold;">${formatNumberEmail(ing.cantidad_total)}</td>
          <td style="padding: 10px; border: 1px solid #e0e7ff;">${ing.unidad || ''}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;
  });

  html += `
    <hr style="border: none; border-top: 2px solid #e0e7ff; margin-top: 20px;">
    <p style="text-align: center; color: #999; font-size: 12px;">
      Generado con Recetario PAE • ${new Date().toLocaleDateString('es-AR')}
    </p>
  `;

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
 * @returns {Promise}
 */
export async function sendShoppingListEmail(recipientEmail, groupedIngredients, groupBy) {
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

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
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
 * Verifica si EmailJS está configurado
 * @returns {boolean}
 */
export function isEmailJSConfigured() {
  // Retornar true si hay alguna credencial configurada (no es la default)
  return EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && EMAILJS_PUBLIC_KEY.length > 0;
}
