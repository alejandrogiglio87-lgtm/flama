import { useState, useEffect } from 'react';
import { Download, Printer, CheckCircle2, Circle, Mail, X } from 'lucide-react';
import { loadPlanification } from '../utils/storageManager';
import { consolidateWeeklyIngredients, groupIngredients, formatNumber } from '../utils/recipeCalculations';
import { downloadShoppingListPDF, printShoppingList } from '../utils/pdfGenerator';
import { sendShoppingListEmail, isEmailJSConfigured } from '../utils/emailService';

export default function ShoppingList({ recetas }) {
  const [planificacion, setPlanificacion] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [groupBy, setGroupBy] = useState('nombre');
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  // Cargar planificación
  useEffect(() => {
    const saved = loadPlanification();
    setPlanificacion(saved);
    setLoading(false);
  }, []);

  // Calcular ingredientes cuando cambia la planificación
  useEffect(() => {
    if (planificacion) {
      const consolidated = consolidateWeeklyIngredients(planificacion, recetas);
      setIngredientes(consolidated);
    }
  }, [planificacion, recetas]);

  const handleToggleCheck = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const handleCheckAll = () => {
    if (checkedItems.size === ingredientes.length) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(ingredientes.map((_, i) => i)));
    }
  };

  const handleExportPDF = () => {
    downloadShoppingListPDF(ingredientes, planificacion);
  };

  const handlePrint = () => {
    printShoppingList(ingredientes);
  };

  const handleClearChecks = () => {
    setCheckedItems(new Set());
  };

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      setEmailMessage('Por favor ingresa un email válido');
      return;
    }

    setEmailLoading(true);
    setEmailMessage('');

    console.log('Enviando email a:', emailInput, 'Agrupado por:', groupBy);

    const result = await sendShoppingListEmail(emailInput, groupedIngredients, groupBy);

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

    setEmailLoading(false);
  };

  const groupedIngredients = groupIngredients(ingredientes, groupBy, planificacion, recetas);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Cargando lista de compras...</p>
      </div>
    );
  }

  if (!planificacion || ingredientes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">
          No hay una planificación semanal aún.
        </p>
        <p className="text-sm text-gray-500">
          Crea una planificación en el "Planificador Semanal" para ver la lista de compras consolidada.
        </p>
      </div>
    );
  }

  const totalIngredientes = ingredientes.length;
  const checkedCount = checkedItems.size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lista de Compras</h2>
            <p className="text-gray-600 text-sm mt-1">
              Total: {totalIngredientes} ingrediente{totalIngredientes !== 1 ? 's' : ''} •
              Marcados: {checkedCount}/{totalIngredientes}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCheckAll}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                checkedCount === totalIngredientes
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {checkedCount === totalIngredientes ? 'Desmarcar Todo' : 'Marcar Todo'}
            </button>
            {checkedCount > 0 && (
              <button
                onClick={handleClearChecks}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Limpiar Marcas
              </button>
            )}
            <button
              onClick={handleExportPDF}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Download size={20} />
              Descargar PDF
            </button>
            <button
              onClick={handlePrint}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Printer size={20} />
              Imprimir
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Mail size={20} />
              Enviar por Email
            </button>
          </div>
        </div>

        {/* Opciones de agrupación */}
        <div className="border-t border-gray-200 pt-4">
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            Agrupar por:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'dia', label: 'Por Día' },
              { value: 'receta', label: 'Por Receta' },
              { value: 'nombre', label: 'Nombre (A-Z)' },
              { value: 'unidad', label: 'Unidad de Medida' },
              { value: 'semana', label: 'Semana Completa' },
              { value: 'ninguno', label: 'Sin Agrupar' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setGroupBy(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  groupBy === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de ingredientes */}
      <div className="space-y-4">
        {Object.entries(groupedIngredients).map(([group, items]) => (
          <div key={group} className="bg-white rounded-lg shadow-md overflow-hidden">
            {groupBy !== 'ninguno' && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3">
                <h3 className="text-white font-bold text-lg">{group}</h3>
              </div>
            )}

            <div className="p-4">
              <div className="space-y-2">
                {items.map((ing, idx) => {
                  const globalIdx = ingredientes.indexOf(ing);
                  const isChecked = checkedItems.has(globalIdx);

                  return (
                    <div
                      key={globalIdx}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-gray-100 border-green-500'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleToggleCheck(globalIdx)}
                    >
                      {isChecked ? (
                        <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle size={24} className="text-gray-400 flex-shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {ing.nombre}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-2 whitespace-nowrap text-right">
                        <span className={`font-semibold ${isChecked ? 'text-gray-500' : 'text-blue-600'}`}>
                          {formatNumber(ing.cantidad_total)}
                        </span>
                        <span className={`text-sm ${isChecked ? 'text-gray-500' : 'text-gray-600'}`}>
                          {ing.unidad || ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de compra */}
      {checkedCount > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">
            Excelente! Has completado {checkedCount} de {totalIngredientes} ingredientes
          </p>
        </div>
      )}

      {/* Modal de Email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800">Enviar por Email</h3>
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
