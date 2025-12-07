import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Download, Upload, ChevronDown, ChevronUp, Mail, X, Printer } from 'lucide-react';
import RecipeCalculator from './RecipeCalculator';
import { savePlanification, loadPlanification, clearPlanification, createEmptyPlanification, savePlan, getSavedPlans, loadPlan, deletePlan } from '../utils/storageManager';
import { consolidateWeeklyIngredients, consolidateIngredients, formatNumber } from '../utils/recipeCalculations';
import { generateWeeklyPlanPDF } from '../utils/pdfGenerator';
import { downloadWeeklyPlanExcel } from '../utils/excelGenerator';
import { sendWeeklyPlanEmail } from '../utils/emailService';

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIAS_DISPLAY = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function WeeklyPlanner({ recetas }) {
  const [planificacion, setPlanificacion] = useState(createEmptyPlanification());
  const [showCalculator, setShowCalculator] = useState(false);
  const [diaActual, setDiaActual] = useState('lunes');
  const [showSavePlan, setShowSavePlan] = useState(false);
  const [planName, setPlanName] = useState('');
  const [savedPlans, setSavedPlans] = useState([]);
  const [expandedDay, setExpandedDay] = useState('lunes');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  // Cargar planificación al montar
  useEffect(() => {
    const saved = loadPlanification();
    if (saved) {
      setPlanificacion(saved);
    }
    setSavedPlans(getSavedPlans());
  }, []);

  // Guardar automáticamente
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
          porciones: recipe.porciones,
          peso_porcion_g: recipe.peso_porcion_g || 0
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
    if (window.confirm(`¿Limpiar todas las recetas del ${DIAS_DISPLAY[DIAS.indexOf(dia)]}?`)) {
      setPlanificacion(prev => ({
        ...prev,
        [dia]: []
      }));
    }
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
    const pdfBlob = generateWeeklyPlanPDF(planificacion, recetas);
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planificacion-semanal-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    downloadWeeklyPlanExcel(planificacion, recetas);
  };

  const handlePrint = () => {
    window.print();
  };


  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      setEmailMessage('Por favor ingresa un email válido');
      return;
    }

    setEmailLoading(true);
    setEmailMessage('');

    try {
      const result = await sendWeeklyPlanEmail(emailInput, planificacion, recetas);

      if (result.success) {
        setEmailMessage('✓ Email enviado exitosamente');
        setEmailInput('');
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailMessage('');
        }, 2000);
      } else {
        setEmailMessage(`✗ Error: ${result.message}`);
      }
    } catch (error) {
      setEmailMessage(`✗ Error: ${error.message}`);
    }

    setEmailLoading(false);
  };

  const getTotalRecipes = () => {
    return Object.values(planificacion).reduce((sum, day) => sum + day.length, 0);
  };

  const getDayIngredients = (dia) => {
    const recetasDelDia = planificacion[dia] || [];
    return consolidateIngredients(recetasDelDia, recetas);
  };

  const getDayTotal = (dia) => {
    const ingredients = getDayIngredients(dia);
    return Object.values(ingredients).length;
  };

  // VISTA: Calculadora
  if (showCalculator) {
    return (
      <div>
        <button
          onClick={() => setShowCalculator(false)}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
        >
          ← Volver al Planificador
        </button>
        <RecipeCalculator
          recetas={recetas}
          onAddToPlanner={handleAddRecipe}
        />
      </div>
    );
  }

  // VISTA: Planificador Principal
  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Planificador Semanal</h2>
            <p className="text-gray-600 text-sm mt-1">
              {getTotalRecipes()} receta{getTotalRecipes() !== 1 ? 's' : ''} planificadas
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowSavePlan(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save size={20} />
              Guardar
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              disabled={getTotalRecipes() === 0}
            >
              <Download size={20} />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              disabled={getTotalRecipes() === 0}
            >
              <Download size={20} />
              Excel
            </button>
            <button
              onClick={handlePrint}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              disabled={getTotalRecipes() === 0}
            >
              <Printer size={20} />
              Imprimir
            </button>
            <button
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Limpiar Todo
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              disabled={getTotalRecipes() === 0}
            >
              <Mail size={20} />
              Enviar por Email
            </button>
          </div>
        </div>

        {/* Guardador de planes */}
        {showSavePlan && (
          <div className="mt-4 pb-4 border-b border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre del plan (ej: Semana escolar)"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSavePlan}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowSavePlan(false);
                  setPlanName('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Contenedor principal: Planificación + Ingredientes */}
        <div className="lg:col-span-3 space-y-6">
          {/* Planificación de la semana */}
          <div className="space-y-3">
            {DIAS.map((dia, idx) => {
              const recetasDelDia = planificacion[dia] || [];
              const ingredientesDelDia = getDayIngredients(dia);
              const isExpanded = expandedDay === dia;

              return (
                <div key={dia} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header del día */}
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : dia)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-6 py-4 flex items-center justify-between text-white transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-bold">{DIAS_DISPLAY[idx]}</h3>
                      <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {recetasDelDia.length} receta{recetasDelDia.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>

                  {/* Contenido expandible - siempre en DOM para que print CSS pueda mostrarlo */}
                  <div
                    className="p-6 space-y-4 bg-gray-50 day-content overflow-hidden transition-all"
                    style={!isExpanded ? { maxHeight: '0px', opacity: '0', marginTop: '0', marginBottom: '0', paddingTop: '0', paddingBottom: '0' } : { maxHeight: '10000px', opacity: '1' }}
                  >
                      {/* Recetas del día */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Recetas</h4>
                        {recetasDelDia.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">Sin recetas programadas</p>
                        ) : (
                          <div className="space-y-2">
                            {recetasDelDia.map((recipe, idx) => {
                              // Obtener los filtros y categoría de la receta original
                              const recetaOriginal = recetas.find(r => r.id === recipe.recetaId);
                              const filtros = recetaOriginal?.filtros || [];
                              const categoria = recetaOriginal?.categoria || '';

                              return (
                                <div
                                  key={idx}
                                  className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors relative"
                                >
                                  {/* Badge de categoría en esquina superior izquierda */}
                                  {categoria && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                      {categoria}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-800">{recipe.nombre}</p>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveRecipe(dia, idx)}
                                      className="text-red-600 hover:text-red-700 p-1 transition-colors flex-shrink-0 ml-2"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>

                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p>{recipe.porciones} porción{recipe.porciones !== 1 ? 'es' : ''}</p>
                                    {recipe.peso_porcion_g && recipe.peso_porcion_g > 0 ? (
                                      <p className="text-blue-600 font-semibold">⚖️ Peso: {recipe.peso_porcion_g}g/porción × {recipe.porciones} = {recipe.peso_porcion_g * recipe.porciones}g total</p>
                                    ) : (
                                      recipe.peso_porcion_g !== undefined && recipe.peso_porcion_g !== null && (
                                        <p className="text-gray-500 text-xs">Sin peso definido</p>
                                      )
                                    )}
                                  </div>

                                  {/* Filtros/Características */}
                                  {filtros.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {filtros.map(filtro => (
                                        <span
                                          key={filtro}
                                          className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${
                                            filtro === 'Vegano'
                                              ? 'bg-green-500'
                                              : filtro === 'Sin Gluten'
                                              ? 'bg-yellow-600'
                                              : filtro === 'Vegetariano'
                                              ? 'bg-blue-500'
                                              : filtro === 'Sin Azúcar'
                                              ? 'bg-orange-500'
                                              : 'bg-red-500'
                                          }`}
                                        >
                                          {filtro === 'Vegano' && '🌱 '}
                                          {filtro === 'Sin Gluten' && '🌾 '}
                                          {filtro === 'Vegetariano' && '🥬 '}
                                          {filtro === 'Sin Azúcar' && '🍯 '}
                                          {filtro === 'Sin Sal' && '🧂 '}
                                          {filtro}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setDiaActual(dia);
                            setShowCalculator(true);
                          }}
                          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Agregar Receta
                        </button>
                      </div>

                      {/* Divisor */}
                      {recetasDelDia.length > 0 && <hr className="border-gray-200" />}

                      {/* Ingredientes del día */}
                      {recetasDelDia.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Ingredientes Totales ({Object.keys(ingredientesDelDia).length})
                          </h4>
                          <div className="bg-white rounded-lg p-3 max-h-48 overflow-y-auto">
                            <div className="space-y-1">
                              {Object.values(ingredientesDelDia).map((ing, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-700">{ing.nombre}</span>
                                  <span className="font-semibold text-blue-600">
                                    {formatNumber(ing.cantidad_total)} {ing.unidad}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Botones */}
                      {recetasDelDia.length > 0 && (
                        <button
                          onClick={() => handleClearDay(dia)}
                          className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Limpiar {DIAS_DISPLAY[idx]}
                        </button>
                      )}
                    </div>
                </div>
              );
            })}
          </div>

          {/* Ingredientes Totales de la Semana - Debajo de días */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredientes Totales de la Semana</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(() => {
                const weeklyIngredients = consolidateWeeklyIngredients(planificacion, recetas);
                if (Object.keys(weeklyIngredients).length === 0) {
                  return <p className="text-gray-500 text-sm italic">Sin ingredientes planificados</p>;
                }
                return Object.values(weeklyIngredients).map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-700 font-medium">{ing.nombre}</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatNumber(ing.cantidad_total)} {ing.unidad}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Sidebar: Planes guardados y resumen */}
        <div className="space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Resumen semanal e ingredientes totales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen Semanal</h3>

            {/* Días de la semana */}
            <div className="space-y-3 mb-4">
              {DIAS.map((dia, idx) => (
                <div key={dia} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-700">{DIAS_DISPLAY[idx]}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    planificacion[dia].length > 0
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {planificacion[dia].length} receta{planificacion[dia].length !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Total de recetas y porciones */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-800">Total Recetas</span>
                  <span className="text-blue-600">{getTotalRecipes()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-800">Total Porciones</span>
                  <span className="text-green-600">
                    {Object.values(planificacion).reduce((sum, day) => sum + day.reduce((daySum, recipe) => daySum + recipe.porciones, 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Planes guardados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={20} />
              Planes Guardados
            </h3>

            {savedPlans.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No hay planes guardados aún</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedPlans.map(plan => (
                  <div
                    key={plan.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-gray-800 text-sm mb-1">{plan.nombre}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(plan.fecha).toLocaleDateString('es-AR')}
                    </p>
                    <div className="flex gap-1">
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

      {/* Modal de Email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800">Enviar Planificación por Email</h3>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailMessage('');
                  setEmailInput('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={emailLoading}
                />
              </div>


              {emailMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                  emailMessage.includes('✓')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {emailMessage}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSendEmail}
                  disabled={emailLoading || !emailInput.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  {emailLoading ? 'Enviando...' : 'Enviar'}
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailMessage('');
                    setEmailInput('');
                  }}
                  disabled={emailLoading}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
