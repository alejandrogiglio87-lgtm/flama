import { ChefHat, Utensils } from 'lucide-react';

export default function RecipeCard({ receta, onSelect, isSelected = false, actionLabel = 'Seleccionar' }) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(receta);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all cursor-pointer hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      {/* Imagen placeholder */}
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 h-40 flex items-center justify-center">
        <div className="text-center">
          <Utensils size={48} className="text-blue-400 mx-auto mb-2" />
          <p className="text-blue-600 text-sm font-medium">{receta.categoria}</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {receta.nombre}
        </h3>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <ChefHat size={16} className="flex-shrink-0" />
          <span>{receta.ingredientes.length} ingredientes</span>
        </div>

        <button
          onClick={handleClick}
          className={`w-full py-2 rounded-md font-medium transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
