import { useState } from 'react';
import { Search, X, Plus, ArrowLeft, Download, FileText } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { calculateIngredients, formatNumber, isValidQuantity } from '../utils/recipeCalculations';
import { getRecipeImage } from '../utils/recipeImages';
import { downloadRecipeExcel } from '../utils/excelGenerator';
import { downloadRecipePDF } from '../utils/pdfGenerator';

export default function RecipeCalculator({ recetas, onAddToPlanner = null }) {
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [porciones, setPorciones] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Obtener categorías únicas
  const categorias = ['Todas', ...new Set(recetas.map(r => r.categoria))];

  // Obtener filtros disponibles
  const availableFilters = ['Vegano', 'Sin Gluten', 'Vegetariano', 'Sin Azúcar', 'Sin Sal'];

  // Filtrar recetas
  const filteredRecetas = recetas.filter(r => {
    const matchSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Todas' || r.categoria === selectedCategory;

    // Si no hay filtros seleccionados, mostrar todas las recetas
    let matchFilters = true;
    if (selectedFilters.length > 0) {
      // Solo mostrar si la receta tiene AL MENOS UNO de los filtros seleccionados
      matchFilters = selectedFilters.some(filter =>
        (r.filtros || []).includes(filter)
      );
    }

    return matchSearch && matchCategory && matchFilters;
  });

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Calcular ingredientes si hay receta seleccionada
  const calculatedIngredients = selectedReceta
    ? calculateIngredients(selectedReceta.ingredientes, porciones)
    : [];

  const handleSelectReceta = (receta) => {
    console.log('DEBUG: handleSelectReceta called with:', receta);
    setSelectedReceta(receta);
    setPorciones(1);
  };

  const handleBackToSearch = () => {
    setSelectedReceta(null);
    setPorciones(1);
  };

  const handleAddToPlanner = () => {
    if (onAddToPlanner && selectedReceta) {
      onAddToPlanner({
        recetaId: selectedReceta.id,
        nombre: selectedReceta.nombre,
        porciones: porciones,
        peso_porcion_g: selectedReceta.peso_porcion_g || 0
      });
      handleBackToSearch();
    }
  };

  const handlePortionesChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isValidQuantity(value)) {
      setPorciones(value);
    }
  };

  // VISTA: Búsqueda y selección de receta
  console.log('RecipeCalculator render - selectedReceta:', selectedReceta);
  if (!selectedReceta) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Buscar Receta</h2>

          {/* Búsqueda */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filtrar por Categoría
            </label>
            <div className="flex flex-wrap gap-2">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por características dietéticas */}
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🌿 Filtrar por Características Dietéticas
            </label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                    selectedFilters.includes(filter)
                      ? 'bg-green-600 text-white border-green-600 shadow-md'
                      : 'bg-white text-gray-700 border-green-300 hover:border-green-500'
                  }`}
                >
                  {filter === 'Vegano' && '🌱 '}
                  {filter === 'Sin Gluten' && '🌾 '}
                  {filter === 'Vegetariano' && '🥬 '}
                  {filter === 'Sin Azúcar' && '🍯 '}
                  {filter === 'Sin Sal' && '🧂 '}
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600">
            {filteredRecetas.length} receta{filteredRecetas.length !== 1 ? 's' : ''} encontrada{filteredRecetas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de recetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecetas.map(receta => (
            <RecipeCard
              key={receta.id}
              receta={receta}
              onSelect={handleSelectReceta}
              actionLabel="Ver Detalles"
            />
          ))}
        </div>

        {filteredRecetas.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No se encontraron recetas con esos criterios.</p>
          </div>
        )}
      </div>
    );
  }

  // VISTA: Detalles de la receta seleccionada
  return (
    <div className="space-y-6">
      {/* Header con botón de volver */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBackToSearch}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a Recetas
        </button>
      </div>

      {/* Detalles de la receta */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Imagen de la receta */}
        <div className="relative h-64 bg-gray-200">
          <img
            src={getRecipeImage(selectedReceta.id, selectedReceta.nombre)}
            alt={selectedReceta.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Información */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedReceta.nombre}</h2>
            <p className="text-gray-600">
              {selectedReceta.categoria} • {selectedReceta.ingredientes.length} ingredientes
              {selectedReceta.peso_porcion_g > 0 && (
                <> • <span className="font-semibold text-blue-600">⚖️ {selectedReceta.peso_porcion_g}g por porción</span></>
              )}
            </p>
          </div>

          {/* Control de porciones */}
          <div className="mb-8 bg-blue-50 rounded-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Número de Porciones
            </label>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                min="1"
                step="1"
                value={porciones}
                onChange={handlePortionesChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              {onAddToPlanner && (
                <button
                  onClick={handleAddToPlanner}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Plus size={20} />
                  Agregar al Plan
                </button>
              )}
            </div>

            {/* Botones de exportación */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => downloadRecipeExcel(selectedReceta, porciones)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Download size={18} />
                Exportar a Excel
              </button>
              <button
                onClick={() => downloadRecipePDF(selectedReceta, porciones, calculatedIngredients)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <FileText size={18} />
                Exportar a PDF
              </button>
            </div>
          </div>

          {/* Tabla de ingredientes */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredientes para {formatNumber(porciones)} porción{porciones !== 1 ? 'es' : ''}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Ingrediente</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Cantidad</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedIngredients.map((ing, idx) => (
                    <tr
                      key={idx}
                      className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">{ing.nombre}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600">
                        {formatNumber(ing.cantidad_total)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ing.unidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
