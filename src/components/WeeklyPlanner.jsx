import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Download, Upload } from 'lucide-react';
import RecipeCalculator from './RecipeCalculator';
import { savePlanification, loadPlanification, clearPlanification, createEmptyPlanification, savePlan, getSavedPlans, loadPlan, deletePlan } from '../utils/storageManager';
import { consolidateWeeklyIngredients } from '../utils/recipeCalculations';
import { downloadShoppingListPDF } from '../utils/pdfGenerator';

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIAS_DISPLAY = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function WeeklyPlanner({ recetas }) {
  const [planificacion, setPlanificacion] = useState(createEmptyPlanification());
  const [showCalculator, setShowCalculator] = useState(false);
  const [diaActual, setDiaActual] = useState('lunes');
  const [showSavePlan, setShowSavePlan] = useState(false);
  const [planName, setPlanName] = useState('');
  const [savedPlans, setSavedPlans] = useState([]);

  // Cargar planificación al montar el componente
  useEffect(() => {
    const saved = loadPlanification();
    if (saved) {
      setPlanificacion(saved);
    }
    setSavedPlans(getSavedPlans());
  }, []);

  // Guardar planificación automáticamente
  useEffect(() => {
    savePlanification(planificacion);
  }, [planificacion]);

  const handleAddRecipe = (recipe) => {
    setPlanificacion(prev => ({
      ...prev,
      [diaActual]: [
        ...prev[diaActual],
        {
          recetaId: recipe.recetaId,
          nombre: recipe.nombre,
          porciones: recipe.porciones
        }
      ]
    }));
    setShowCalculator(false);
  };

  const handleRemoveRecipe = (dia, index) => {
    setPlanificacion(prev => ({
      ...prev,
      [dia]: prev[dia].filter((_, i) => i !== index)
    }));
  };

  const handleClearDay = (dia) => {
    setPlanificacion(prev => ({
      ...prev,
      [dia]: []
    }));
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar toda la planificación?')) {
      setPlanificacion(createEmptyPlanification());
      clearPlanification();
    }
  };

  const handleSavePlan = () => {
    if (!planName.trim()) {
      alert('Por favor ingresa un nombre para el plan');
      return;
    }
    savePlan(planName, planificacion);
    setSavedPlans(getSavedPlans());
    setPlanName('');
    setShowSavePlan(false);
    alert('Plan guardado exitosamente');
  };

  const handleLoadPlan = (planId) => {
    const plan = loadPlan(planId);
    if (plan) {
      setPlanificacion(plan);
      setShowCalculator(false);
    }
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      deletePlan(planId);
      setSavedPlans(getSavedPlans());
    }
  };

  const handleExportPDF = () => {
    const ingredientes = consolidateWeeklyIngredients(planificacion, recetas);
    downloadShoppingListPDF(ingredientes, planificacion);
  };

  const getTotalRecipes = () => {
    return Object.values(planificacion).reduce((sum, day) => sum + day.length, 0);
  };

  const getRecipeDetails = (recetaId) => {
    return recetas.find(r => r.id === recetaId);
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Planificador Semanal</h2>
            <p className="text-gray-600 text-sm mt-1">
              Total de recetas: {getTotalRecipes()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Agregar Receta
            </button>
            <button
              onClick={() => setShowSavePlan(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save size={20} />
              Guardar Plan
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              disabled={getTotalRecipes() === 0}
            >
              <Download size={20} />
              Exportar PDF
            </button>
            <button
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Limpiar Todo
            </button>
          </div>
        </div>
      </div>

      {/* Selector de día y planes guardados */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Calculadora */}
          {showCalculator && (
            <div className="mb-6">
              <RecipeCalculator
                recetas={recetas}
                onAddToPlanner={handleAddRecipe}
              />
            </div>
          )}

          {/* Planificación de la semana */}
          <div className="space-y-4">
            {DIAS.map((dia, idx) => (
              <div key={dia} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">{DIAS_DISPLAY[idx]}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDiaActual(dia)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        diaActual === dia
                          ? 'bg-white text-blue-600'
                          : 'bg-blue-400 text-white hover:bg-blue-300'
                      }`}
                    >
                      Agregar
                    </button>
                    {planificacion[dia].length > 0 && (
                      <button
                        onClick={() => handleClearDay(dia)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  {planificacion[dia].length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Sin recetas programadas</p>
                  ) : (
                    <div className="space-y-2">
                      {planificacion[dia].map((recipe, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{recipe.nombre}</p>
                            <p className="text-sm text-gray-600">
                              {recipe.porciones} porción{recipe.porciones !== 1 ? 'es' : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveRecipe(dia, idx)}
                            className="text-red-600 hover:text-red-700 p-2 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planes guardados */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={20} />
              Planes Guardados
            </h3>

            {showSavePlan && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Nombre del plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePlan}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setShowSavePlan(false);
                      setPlanName('');
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {savedPlans.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No hay planes guardados</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {savedPlans.map(plan => (
                  <div
                    key={plan.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <p className="font-medium text-gray-800 text-sm mb-1">{plan.nombre}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(plan.fecha).toLocaleDateString('es-AR')}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadPlan(plan.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Cargar
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
