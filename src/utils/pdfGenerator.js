import jsPDF from 'jspdf';
import { formatNumber } from './recipeCalculations.js';

/**
 * Genera un PDF con la lista de compras
 * @param {Array} ingredientes - Array de ingredientes consolidados
 * @param {Object} planificacion - Objeto con la planificación (para referencias)
 * @returns {Blob} El PDF generado
 */
export function generateShoppingListPDF(ingredientes, planificacion = null) {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text('Lista de Compras - Recetario PAE', 10, 15);

  // Información de la planificación
  if (planificacion) {
    doc.setFontSize(10);
    const fechaActual = new Date().toLocaleDateString('es-AR');
    doc.text(`Generado: ${fechaActual}`, 10, 23);
  }

  // Encabezados de tabla
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');

  const startY = 30;
  const cellHeight = 7;
  const col1X = 10;
  const col2X = 120;
  const col3X = 170;
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.text('Ingrediente', col1X, startY);
  doc.text('Cantidad', col2X, startY);
  doc.text('Unidad', col3X, startY);

  // Línea separadora
  doc.setDrawColor(100);
  doc.line(col1X, startY + 2, pageWidth - 10, startY + 2);

  // Contenido
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);

  let currentY = startY + cellHeight;
  const maxY = doc.internal.pageSize.getHeight() - 10;

  ingredientes.forEach((ing, index) => {
    // Agregar nueva página si es necesario
    if (currentY > maxY) {
      doc.addPage();
      currentY = 15;

      // Repetir encabezados en nueva página
      doc.setFont(undefined, 'bold');
      doc.setFontSize(11);
      doc.text('Ingrediente', col1X, currentY);
      doc.text('Cantidad', col2X, currentY);
      doc.text('Unidad', col3X, currentY);

      doc.setDrawColor(100);
      doc.line(col1X, currentY + 2, pageWidth - 10, currentY + 2);

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      currentY += cellHeight;
    }

    // Alternar color de fondo para mejor legibilidad
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(col1X, currentY - 5, pageWidth - 20, cellHeight, 'F');
    }

    // Texto
    const nombreTruncado = ing.nombre.length > 60
      ? ing.nombre.substring(0, 60) + '...'
      : ing.nombre;

    doc.text(nombreTruncado, col1X, currentY);
    doc.text(formatNumber(ing.cantidad_total), col2X, currentY);
    doc.text(ing.unidad || '', col3X, currentY);

    currentY += cellHeight;
  });

  return doc.output('blob');
}

/**
 * Obtiene el Blob PDF de la lista de compras (para email)
 * @param {Array} ingredientes - Array de ingredientes consolidados
 * @param {Object} planificacion - Objeto con la planificación (opcional)
 * @returns {Blob} El blob PDF
 */
export function getShoppingListPDFBlob(ingredientes, planificacion = null) {
  return generateShoppingListPDF(ingredientes, planificacion);
}

/**
 * Descarga el PDF de la lista de compras
 * @param {Array} ingredientes - Array de ingredientes consolidados
 * @param {Object} planificacion - Objeto con la planificación (opcional)
 */
export function downloadShoppingListPDF(ingredientes, planificacion = null) {
  const blob = generateShoppingListPDF(ingredientes, planificacion);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lista-compras-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Imprime la lista de compras
 * @param {Array} ingredientes - Array de ingredientes consolidados
 */
export function printShoppingList(ingredientes) {
  const blob = generateShoppingListPDF(ingredientes);
  const url = window.URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
  newWindow.print();
}

/**
 * Genera HTML de tabla para mostrar en la aplicación
 * @param {Array} ingredientes - Array de ingredientes consolidados
 * @returns {string} HTML de la tabla
 */
export function generateTableHTML(ingredientes) {
  let html = '<table class="w-full border-collapse"><thead><tr>';
  html += '<th class="border p-2 text-left">Ingrediente</th>';
  html += '<th class="border p-2 text-right">Cantidad</th>';
  html += '<th class="border p-2 text-left">Unidad</th>';
  html += '</tr></thead><tbody>';

  ingredientes.forEach((ing, idx) => {
    const bgClass = idx % 2 === 0 ? 'bg-gray-100' : '';
    html += `<tr class="${bgClass}">`;
    html += `<td class="border p-2">${ing.nombre}</td>`;
    html += `<td class="border p-2 text-right">${formatNumber(ing.cantidad_total)}</td>`;
    html += `<td class="border p-2">${ing.unidad || ''}</td>`;
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
}
