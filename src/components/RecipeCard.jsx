import { ChefHat, Image as ImageIcon } from 'lucide-react';
import { getRecipeImage, getCategoryColor } from '../utils/recipeImages';

export default function RecipeCard({ receta, onSelect, isSelected = false, actionLabel = 'Seleccionar' }) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(receta);
    }
  };

  const imageUrl = getRecipeImage(receta.id, receta.nombre);
  const categoryColor = getCategoryColor(receta.categoria);

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all cursor-pointer hover:shadow-xl hover:scale-105 ${
        isSelected ? 'ring-2 ring-blue-600 shadow-xl scale-105' : ''
      }`}
    >
      {/* Imagen */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={receta.nombre}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        {/* Fallback si la imagen no carga */}
        <div className={`hidden absolute inset-0 bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
          <ImageIcon size={48} className="text-white opacity-50" />
        </div>
        {/* Badge de categoría */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
          {receta.categoria}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 h-10">
          {receta.nombre}
        </h3>

        <div className="space-y-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ChefHat size={16} className="flex-shrink-0" />
            <span>{receta.ingredientes.length} ingredientes</span>
          </div>
          {receta.peso_porcion_g > 0 && (
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <span>⚖️ {receta.peso_porcion_g}g por porción</span>
            </div>
          )}
        </div>

        {/* Filtros/Características */}
        {receta.filtros && receta.filtros.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {receta.filtros.map(filtro => (
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

        <button
          onClick={handleClick}
          className={`w-full py-2 rounded-md font-medium transition-all ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
