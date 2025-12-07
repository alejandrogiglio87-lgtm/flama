import jsPDF from 'jspdf';
import { formatNumber, consolidateIngredients } from './recipeCalculations.js';

/**
 * Genera un PDF con la planificación semanal completa
 * @param {Object} planificacion - Planificación semanal
 * @param {Array} recetas - Array de todas las recetas
 * @returns {Blob} El PDF generado
 */
export function generateWeeklyPlanPDF(planificacion, recetas) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const diasDisplay = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const cellHeight = 6;
  const margin = 10;
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 10;
  const maxY = pageHeight - bottomMargin;

  // Título
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Planificador Semanal - Recetario PAE', margin, 12);

  // Fecha
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const fechaActual = new Date().toLocaleDateString('es-AR');
  doc.text(`Generado: ${fechaActual}`, margin, 18);

  let currentY = 25;

  // ========== SECCIÓN 1: RECETAS POR DÍA ==========
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('1. RECETAS POR DÍA', margin, currentY);
  currentY += 8;

  dias.forEach((dia, idx) => {
    if (currentY > maxY - 15) {
      doc.addPage();
      currentY = margin;
    }

    // Día
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 86, 179); // Azul
    doc.text(`${diasDisplay[idx]}`, margin, currentY);
    currentY += 6;

    const recetasDelDia = planificacion[dia] || [];
    if (recetasDelDia.length === 0) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('Sin recetas programadas', margin + 5, currentY);
      currentY += 5;
    } else {
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      recetasDelDia.forEach(r => {
        doc.text(`• ${r.nombre} (${r.porciones} porciones)`, margin + 5, currentY);
        currentY += 5;
      });
    }
    currentY += 2;
  });

  // ========== SECCIÓN 2: INGREDIENTES POR DÍA ==========
  doc.addPage();
  currentY = margin;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('2. INGREDIENTES POR DÍA', margin, currentY);
  currentY += 8;

  dias.forEach((dia, idx) => {
    if (currentY > maxY - 20) {
      doc.addPage();
      currentY = margin;
    }

    // Encabezado de día
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 86, 179);
    doc.text(`${diasDisplay[idx]}`, margin, currentY);
    currentY += 6;

    const recetasDelDia = planificacion[dia] || [];
    const ingredientesDelDia = consolidateIngredients(recetasDelDia, recetas);

    if (Object.keys(ingredientesDelDia).length === 0) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('Sin ingredientes', margin + 5, currentY);
      currentY += 4;
    } else {
      // Encabezados de tabla
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Ingrediente', margin + 2, currentY);
      doc.text('Cantidad', 130, currentY);
      doc.text('Unidad', 160, currentY);

      doc.setDrawColor(150);
      doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
      currentY += 5;

      // Ingredientes
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      Object.entries(ingredientesDelDia).forEach(([key, ing], idx2) => {
        if (idx2 % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, currentY - 3, pageWidth - 2 * margin, cellHeight, 'F');
        }

        const nombreTruncado = ing.nombre.length > 50
          ? ing.nombre.substring(0, 50) + '...'
          : ing.nombre;

        doc.text(nombreTruncado, margin + 2, currentY);
        doc.text(formatNumber(ing.cantidad_total), 130, currentY);
        doc.text(ing.unidad || '', 160, currentY);
        currentY += cellHeight;
      });
    }
    currentY += 3;
  });

  // ========== SECCIÓN 3: LISTA CONSOLIDADA SEMANAL ==========
  doc.addPage();
  currentY = margin;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('3. LISTA DE COMPRAS - SEMANA COMPLETA', margin, currentY);
  currentY += 8;

  // Consolidar ingredientes de toda la semana
  const ingredientesSemanales = {};
  dias.forEach(dia => {
    const recetasDelDia = planificacion[dia] || [];
    const ingredientes = consolidateIngredients(recetasDelDia, recetas);
    Object.entries(ingredientes).forEach(([key, ing]) => {
      if (!ingredientesSemanales[key]) {
        ingredientesSemanales[key] = {
          nombre: ing.nombre,
          cantidad_total: 0,
          unidad: ing.unidad
        };
      }
      ingredientesSemanales[key].cantidad_total += ing.cantidad_total;
    });
  });

  // Ordenar alfabéticamente
  const ingredientesOrdenados = Object.values(ingredientesSemanales).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  );

  // Encabezados
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Ingrediente', margin + 2, currentY);
  doc.text('Cantidad Total', 130, currentY);
  doc.text('Unidad', 160, currentY);

  doc.setDrawColor(100);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  // Ingredientes
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  ingredientesOrdenados.forEach((ing, idx) => {
    if (currentY > maxY) {
      doc.addPage();
      currentY = margin;

      // Repetir encabezados
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      doc.text('Ingrediente', margin + 2, currentY);
      doc.text('Cantidad Total', 130, currentY);
      doc.text('Unidad', 160, currentY);

      doc.setDrawColor(100);
      doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
      currentY += 6;
      doc.setFont(undefined, 'normal');
    }

    if (idx % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, currentY - 4, pageWidth - 2 * margin, cellHeight, 'F');
    }

    const nombreTruncado = ing.nombre.length > 60
      ? ing.nombre.substring(0, 60) + '...'
      : ing.nombre;

    doc.text(nombreTruncado, margin + 2, currentY);
    doc.text(formatNumber(ing.cantidad_total), 130, currentY);
    doc.text(ing.unidad || '', 160, currentY);

    currentY += cellHeight;
  });

  return doc.output('blob');
}

/**
 * Genera un PDF con la lista de compras (versión legacy)
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

/**
 * Genera un PDF con los detalles de una receta calculada
 * @param {Object} receta - Objeto de la receta
 * @param {number} porciones - Número de porciones
 * @param {Array} calculatedIngredients - Array de ingredientes calculados
 * @returns {jsPDF} El PDF generado
 */
export function generateRecipePDF(receta, porciones, calculatedIngredients) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 15;
  const maxY = pageHeight - bottomMargin;

  // Título
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(receta.nombre.toUpperCase(), margin, 20);

  // Información general
  let currentY = 30;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Categoría: ${receta.categoria}`, margin, currentY);
  currentY += 6;
  doc.text(`Porciones: ${formatNumber(porciones)}`, margin, currentY);
  currentY += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, margin, currentY);
  currentY += 10;

  // Línea divisoria
  doc.setDrawColor(100);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // Tabla de ingredientes
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('INGREDIENTES', margin, currentY);
  currentY += 8;

  // Encabezados de tabla
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Ingrediente', margin + 2, currentY);
  doc.text('Cantidad por Porción', 100, currentY);
  doc.text('Total', 150, currentY);
  doc.text('Unidad', 175, currentY);

  doc.setDrawColor(150);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
  currentY += 7;

  // Filas de ingredientes
  doc.setFont(undefined, 'normal');
  calculatedIngredients.forEach((ing, idx) => {
    if (currentY > maxY - 10) {
      doc.addPage();
      currentY = margin;

      // Repetir encabezados
      doc.setFont(undefined, 'bold');
      doc.text('Ingrediente', margin + 2, currentY);
      doc.text('Cantidad por Porción', 100, currentY);
      doc.text('Total', 150, currentY);
      doc.text('Unidad', 175, currentY);

      doc.setDrawColor(150);
      doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
      currentY += 7;
      doc.setFont(undefined, 'normal');
    }

    // Fila de ingrediente
    const bgColor = idx % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
    doc.setFillColor(...bgColor);
    doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 6, 'F');

    doc.text(ing.nombre.substring(0, 25), margin + 2, currentY);
    doc.text(formatNumber(ing.cantidad).substring(0, 8), 115, currentY);
    doc.text(formatNumber(ing.cantidad_total).substring(0, 10), 160, currentY);
    doc.text(ing.unidad || '', 180, currentY);
    currentY += 6;
  });

  return doc;
}

/**
 * Descarga el PDF de una receta calculada
 * @param {Object} receta - Objeto de la receta
 * @param {number} porciones - Número de porciones
 * @param {Array} calculatedIngredients - Array de ingredientes calculados
 */
export function downloadRecipePDF(receta, porciones, calculatedIngredients) {
  const doc = generateRecipePDF(receta, porciones, calculatedIngredients);
  const safeFileName = receta.nombre.replace(/\s+/g, '-').toLowerCase();
  doc.save(`${safeFileName}-${new Date().toISOString().split('T')[0]}.pdf`);
}
