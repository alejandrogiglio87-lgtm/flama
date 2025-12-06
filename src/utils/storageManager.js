const STORAGE_KEY = 'flama_planificacion_semanal';
const SAVED_PLANS_KEY = 'flama_planes_guardados';

/**
 * Guarda la planificación semanal en LocalStorage
 * @param {Object} planificacion - Objeto con la planificación de la semana
 * @returns {boolean} True si se guardó exitosamente
 */
export function savePlanification(planificacion) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planificacion));
    return true;
  } catch (error) {
    console.error('Error guardando planificación:', error);
    return false;
  }
}

/**
 * Carga la planificación semanal desde LocalStorage
 * @returns {Object|null} La planificación guardada o null si no existe
 */
export function loadPlanification() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error cargando planificación:', error);
    return null;
  }
}

/**
 * Limpia la planificación actual
 * @returns {boolean} True si se limpió exitosamente
 */
export function clearPlanification() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error limpiando planificación:', error);
    return false;
  }
}

/**
 * Guarda un plan con un nombre específico
 * @param {string} nombre - Nombre del plan
 * @param {Object} planificacion - Objeto con la planificación
 * @returns {boolean} True si se guardó exitosamente
 */
export function savePlan(nombre, planificacion) {
  try {
    const planes = getSavedPlans();
    const newPlan = {
      id: Date.now(),
      nombre: nombre,
      fecha: new Date().toISOString(),
      data: planificacion
    };
    planes.push(newPlan);
    localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(planes));
    return true;
  } catch (error) {
    console.error('Error guardando plan:', error);
    return false;
  }
}

/**
 * Obtiene todos los planes guardados
 * @returns {Array} Array de planes guardados
 */
export function getSavedPlans() {
  try {
    const data = localStorage.getItem(SAVED_PLANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error cargando planes guardados:', error);
    return [];
  }
}

/**
 * Carga un plan específico
 * @param {number} planId - ID del plan a cargar
 * @returns {Object|null} El plan o null si no existe
 */
export function loadPlan(planId) {
  try {
    const planes = getSavedPlans();
    const plan = planes.find(p => p.id === planId);
    return plan ? plan.data : null;
  } catch (error) {
    console.error('Error cargando plan:', error);
    return null;
  }
}

/**
 * Elimina un plan guardado
 * @param {number} planId - ID del plan a eliminar
 * @returns {boolean} True si se eliminó exitosamente
 */
export function deletePlan(planId) {
  try {
    const planes = getSavedPlans();
    const filtered = planes.filter(p => p.id !== planId);
    localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando plan:', error);
    return false;
  }
}

/**
 * Crea una planificación vacía inicial
 * @returns {Object} Planificación inicial
 */
export function createEmptyPlanification() {
  return {
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: []
  };
}
