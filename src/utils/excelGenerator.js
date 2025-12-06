import * as XLSX from 'xlsx';
import { formatNumber } from './recipeCalculations';

/**
 * Genera un archivo Excel con lista de compras
 * @param {Array} ingredientes - Array de ingredientes consolidados
 * @param {Object} planificacion - Objeto con la planificación (para referencias)
 * @returns {Blob} El Excel generado
 */
export function generateShoppingListExcel(ingredientes, planificacion = null) {
  // Crear workbook
  const wb = XLSX.utils.book_new();

  // Preparar datos para la tabla
  const data = [
    ['LISTA DE COMPRAS - RECETARIO PAE'],
    ['Fecha:', new Date().toLocaleDateString('es-AR')],
    [],
    ['Ingrediente', 'Cantidad', 'Unidad'],
    ...ingredientes.map(ing => [
      ing.nombre,
      formatNumber(ing.cantidad_total),
      ing.unidad || ''
    ])
  ];

  // Crear worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Estilos y formato
  ws['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 12 }];

  // Agregar al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Lista de Compras');

  return wb;
}

/**
 * Descarga el Excel de la lista de compras
 * @param {Array} ingredientes - Array de ingredientes consolidados
 * @param {Object} planificacion - Objeto con la planificación (opcional)
 */
export function downloadShoppingListExcel(ingredientes, planificacion = null) {
  const wb = generateShoppingListExcel(ingredientes, planificacion);
  XLSX.writeFile(wb, `lista-compras-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Genera un archivo Excel con la planificación semanal
 * @param {Object} planificacion - Planificación semanal
 * @param {Array} recetas - Array de todas las recetas
 * @returns {Blob} El Excel generado
 */
export function generateWeeklyPlanExcel(planificacion, recetas) {
  const wb = XLSX.utils.book_new();
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const diasDisplay = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Hoja 1: Planificación resumida
  const summaryData = [
    ['PLANIFICADOR SEMANAL - RECETARIO PAE'],
    ['Fecha:', new Date().toLocaleDateString('es-AR')],
    []
  ];

  dias.forEach((dia, idx) => {
    const recetasDelDia = planificacion[dia] || [];
    summaryData.push([diasDisplay[idx]]);

    if (recetasDelDia.length === 0) {
      summaryData.push(['Sin recetas programadas']);
    } else {
      recetasDelDia.forEach(r => {
        summaryData.push([`  - ${r.nombre}`, `${r.porciones} porciones`]);
      });
    }
    summaryData.push([]);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  ws1['!cols'] = [{ wch: 40 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Planificación');

  // Hoja 2: Detalles de ingredientes por día
  const detailsData = [['INGREDIENTES POR DÍA']];
  dias.forEach((dia, idx) => {
    detailsData.push([]);
    detailsData.push([`${diasDisplay[idx]} - INGREDIENTES`]);
    detailsData.push(['Ingrediente', 'Cantidad', 'Unidad']);

    const recetasDelDia = planificacion[dia] || [];
    const ingredientesDelDia = {};

    recetasDelDia.forEach(r => {
      const receta = recetas.find(rec => rec.id === r.recetaId);
      if (receta) {
        receta.ingredientes.forEach(ing => {
          const key = `${ing.nombre}|${ing.unidad}`;
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

    Object.values(ingredientesDelDia).forEach(ing => {
      detailsData.push([
        ing.nombre,
        formatNumber(ing.cantidad),
        ing.unidad || ''
      ]);
    });
  });

  const ws2 = XLSX.utils.aoa_to_sheet(detailsData);
  ws2['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Ingredientes por Día');

  return wb;
}

/**
 * Descarga el Excel del planificador semanal
 * @param {Object} planificacion - Planificación semanal
 * @param {Array} recetas - Array de todas las recetas
 */
export function downloadWeeklyPlanExcel(planificacion, recetas) {
  const wb = generateWeeklyPlanExcel(planificacion, recetas);
  XLSX.writeFile(wb, `planificador-semanal-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Genera un archivo Excel con detalles de una receta calculada
 * @param {Object} receta - Objeto de la receta
 * @param {number} porciones - Número de porciones
 * @returns {Blob} El Excel generado
 */
export function generateRecipeExcel(receta, porciones) {
  const wb = XLSX.utils.book_new();

  const data = [
    ['CÁLCULO DE INGREDIENTES'],
    ['Receta:', receta.nombre],
    ['Porciones:', porciones],
    ['Fecha:', new Date().toLocaleDateString('es-AR')],
    [],
    ['Ingrediente', 'Cantidad por Porción', 'Unidad', 'Cantidad Total'],
    ...receta.ingredientes.map(ing => [
      ing.nombre,
      formatNumber(ing.cantidad),
      ing.unidad || '',
      formatNumber(ing.cantidad * porciones)
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 35 }, { wch: 20 }, { wch: 12 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, ws, 'Receta');
  return wb;
}

/**
 * Descarga el Excel de una receta calculada
 * @param {Object} receta - Objeto de la receta
 * @param {number} porciones - Número de porciones
 */
export function downloadRecipeExcel(receta, porciones) {
  const wb = generateRecipeExcel(receta, porciones);
  const safeFileName = receta.nombre.replace(/\s+/g, '-').toLowerCase();
  XLSX.writeFile(wb, `${safeFileName}-${new Date().toISOString().split('T')[0]}.xlsx`);
}
