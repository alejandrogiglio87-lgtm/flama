import { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { calculateIngredients, formatNumber, isValidQuantity } from '../utils/recipeCalculations';

export default function RecipeCalculator({ recetas, onAddToPlanner = null }) {
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [porciones, setPorciones] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Obtener categorías únicas
  const categorias = ['Todas', ...new Set(recetas.map(r => r.categoria))];

  // Filtrar recetas
  const filteredRecetas = recetas.filter(r => {
    const matchSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Todas' || r.categoria === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Calcular ingredientes si hay receta seleccionada
  const calculatedIngredients = selectedReceta
    ? calculateIngredients(selectedReceta.ingredientes, porciones)
    : [];

  const handleSelectReceta = (receta) => {
    setSelectedReceta(receta);
    setPorciones(1);
  };

  const handleClearSelection = () => {
    setSelectedReceta(null);
    setPorciones(1);
  };

  const handleAddToPlanner = () => {
    if (onAddToPlanner && selectedReceta) {
      onAddToPlanner({
        recetaId: selectedReceta.id,
        nombre: selectedReceta.nombre,
        porciones: porciones
      });
      handleClearSelection();
    }
  };

  const handlePortionesChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isValidQuantity(value)) {
      setPorciones(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Panel de búsqueda y filtros */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Buscar Receta</h2>

            {/* Búsqueda */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar receta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filtro por categoría */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categorias.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="categoria"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {filteredRecetas.length} receta{filteredRecetas.length !== 1 ? 's' : ''} encontrada{filteredRecetas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Grid de recetas */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRecetas.map(receta => (
              <RecipeCard
                key={receta.id}
                receta={receta}
                onSelect={handleSelectReceta}
                isSelected={selectedReceta?.id === receta.id}
                actionLabel={selectedReceta?.id === receta.id ? 'Seleccionada' : 'Seleccionar'}
              />
            ))}
          </div>

          {filteredRecetas.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No se encontraron recetas con esos criterios.</p>
            </div>
          )}
        </div>
      </div>

      {/* Panel de detalles y cálculo */}
      {selectedReceta && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedReceta.nombre}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {selectedReceta.categoria} • {selectedReceta.ingredientes.length} ingredientes
              </p>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X size={24} />
            </button>
          </div>

          {/* Control de porciones */}
          <div className="mb-6 flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Porciones
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={porciones}
                onChange={handlePortionesChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cantidad base: 1 porción
              </p>
            </div>

            {onAddToPlanner && (
              <button
                onClick={handleAddToPlanner}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Agregar a Planificador
              </button>
            )}
          </div>

          {/* Tabla de ingredientes */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Ingrediente</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Por Porción</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Unidad</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Total ({porciones > 1 ? `${formatNumber(porciones)} porciones` : '1 porción'})
                  </th>
                </tr>
              </thead>
              <tbody>
                {calculatedIngredients.map((ing, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 text-gray-800">{ing.nombre}</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatNumber(ing.cantidad)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ing.unidad}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {formatNumber(ing.cantidad_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
