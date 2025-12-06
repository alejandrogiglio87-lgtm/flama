/**
 * Calcula los ingredientes escalados según el número de porciones
 * @param {Array} ingredientes - Array de ingredientes de la receta
 * @param {number} porciones - Número de porciones deseadas
 * @returns {Array} Array con ingredientes escalados
 */
export function calculateIngredients(ingredientes, porciones) {
  if (!ingredientes || porciones <= 0) return [];

  return ingredientes.map(ing => ({
    ...ing,
    cantidad_total: ing.cantidad * porciones
  }));
}

/**
 * Consolida múltiples ingredientes con la misma unidad
 * @param {Array} recetasDelDia - Array con recetas del día [{receta, porciones}, ...]
 * @param {Array} todasLasRecetas - Array con todas las recetas disponibles
 * @returns {Object} Ingredientes consolidados {nombreIngrediente: {cantidad, unidad}}
 */
export function consolidateIngredients(recetasDelDia, todasLasRecetas) {
  const consolidated = {};

  recetasDelDia.forEach(({ recetaId, porciones }) => {
    const receta = todasLasRecetas.find(r => r.id === recetaId);
    if (!receta) return;

    const calculados = calculateIngredients(receta.ingredientes, porciones);

    calculados.forEach(ing => {
      const key = `${ing.nombre}|${ing.unidad}`;

      if (consolidated[key]) {
        consolidated[key].cantidad_total += ing.cantidad_total;
      } else {
        consolidated[key] = {
          nombre: ing.nombre,
          unidad: ing.unidad,
          cantidad_total: ing.cantidad_total
        };
      }
    });
  });

  return consolidated;
}

/**
 * Consolida ingredientes de toda la semana
 * @param {Object} planificacionSemanal - Objeto con plan de la semana
 * @param {Array} todasLasRecetas - Array con todas las recetas disponibles
 * @returns {Array} Array de ingredientes consolidados ordenados alfabéticamente
 */
export function consolidateWeeklyIngredients(planificacionSemanal, todasLasRecetas) {
  const consolidated = {};
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  dias.forEach(dia => {
    const recetasDelDia = planificacionSemanal[dia] || [];
    const ingredientesDelDia = consolidateIngredients(recetasDelDia, todasLasRecetas);

    Object.values(ingredientesDelDia).forEach(ing => {
      const key = `${ing.nombre}|${ing.unidad}`;

      if (consolidated[key]) {
        consolidated[key].cantidad_total += ing.cantidad_total;
      } else {
        consolidated[key] = {
          nombre: ing.nombre,
          unidad: ing.unidad,
          cantidad_total: ing.cantidad_total
        };
      }
    });
  });

  return Object.values(consolidated).sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );
}

/**
 * Consolida ingredientes por día manteniendo información de origen
 * @param {Object} planificacionSemanal - Plan de la semana
 * @param {Array} todasLasRecetas - Todas las recetas
 * @returns {Object} Ingredientes agrupados por día
 */
export function consolidateByDay(planificacionSemanal, todasLasRecetas) {
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const diasDisplay = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const byDay = {};

  dias.forEach((dia, idx) => {
    const recetasDelDia = planificacionSemanal[dia] || [];
    const ingredientesDelDia = consolidateIngredients(recetasDelDia, todasLasRecetas);
    if (Object.keys(ingredientesDelDia).length > 0) {
      byDay[diasDisplay[idx]] = Object.values(ingredientesDelDia);
    }
  });

  return byDay;
}

/**
 * Consolida ingredientes por receta manteniendo información de origen
 * @param {Object} planificacionSemanal - Plan de la semana
 * @param {Array} todasLasRecetas - Todas las recetas
 * @returns {Object} Ingredientes agrupados por receta
 */
export function consolidateByRecipe(planificacionSemanal, todasLasRecetas) {
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const byRecipe = {};

  dias.forEach(dia => {
    const recetasDelDia = planificacionSemanal[dia] || [];
    recetasDelDia.forEach(({ recetaId, porciones, nombre }) => {
      const receta = todasLasRecetas.find(r => r.id === recetaId);
      if (!receta) return;

      const calculados = calculateIngredients(receta.ingredientes, porciones);
      if (!byRecipe[nombre]) {
        byRecipe[nombre] = [];
      }
      byRecipe[nombre].push(...calculados.map(ing => ({
        ...ing,
        cantidad_total: ing.cantidad_total
      })));
    });
  });

  // Consolidar cantidad para cada receta
  const consolidated = {};
  Object.entries(byRecipe).forEach(([receta, ings]) => {
    const consolidada = {};
    ings.forEach(ing => {
      const key = `${ing.nombre}|${ing.unidad}`;
      if (consolidada[key]) {
        consolidada[key].cantidad_total += ing.cantidad_total;
      } else {
        consolidada[key] = {
          nombre: ing.nombre,
          unidad: ing.unidad,
          cantidad_total: ing.cantidad_total
        };
      }
    });
    consolidated[receta] = Object.values(consolidada);
  });

  return consolidated;
}

/**
 * Agrupa ingredientes por categoría o criterio
 * @param {Array} ingredientes - Array de ingredientes consolidados
 * @param {string} criterio - 'nombre' (alfabético), 'unidad', 'ninguno', 'dia', 'receta', 'semana'
 * @param {Object} planificacionSemanal - Plan de la semana (requerido para día y receta)
 * @param {Array} todasLasRecetas - Todas las recetas (requerido para día y receta)
 * @returns {Object} Ingredientes agrupados
 */
export function groupIngredients(ingredientes, criterio = 'nombre', planificacionSemanal = null, todasLasRecetas = null) {
  // Agrupación por día
  if (criterio === 'dia' && planificacionSemanal && todasLasRecetas) {
    return consolidateByDay(planificacionSemanal, todasLasRecetas);
  }

  // Agrupación por receta
  if (criterio === 'receta' && planificacionSemanal && todasLasRecetas) {
    return consolidateByRecipe(planificacionSemanal, todasLasRecetas);
  }

  // Agrupación por semana (sin agrupar internamente, solo una sección)
  if (criterio === 'semana') {
    return { 'Semana Completa': ingredientes };
  }

  if (criterio === 'ninguno') {
    return { 'Todos': ingredientes };
  }

  if (criterio === 'unidad') {
    return ingredientes.reduce((acc, ing) => {
      const grupo = ing.unidad || 'Sin unidad';
      if (!acc[grupo]) acc[grupo] = [];
      acc[grupo].push(ing);
      return acc;
    }, {});
  }

  // Criterio 'nombre' - agrupación alfabética por primera letra
  return ingredientes.reduce((acc, ing) => {
    const primera = ing.nombre.charAt(0).toUpperCase();
    if (!acc[primera]) acc[primera] = [];
    acc[primera].push(ing);
    return acc;
  }, {});
}

/**
 * Valida que una cantidad sea un número válido
 * @param {any} valor - Valor a validar
 * @returns {boolean} True si es un número válido
 */
export function isValidQuantity(valor) {
  const num = parseFloat(valor);
  return !isNaN(num) && num > 0;
}

/**
 * Formatea un número para mostrar (máximo 2 decimales)
 * @param {number} numero - Número a formatear
 * @returns {string} Número formateado
 */
export function formatNumber(numero) {
  if (!numero) return '0';
  const num = parseFloat(numero);
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(2).replace(/\.?0+$/, '');
}
