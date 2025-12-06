/**
 * Obtiene imagen desde Unsplash usando el nombre completo de la receta
 * Búsqueda dinámica: cada receta busca su nombre en Unsplash
 */

/**
 * Obtiene la URL de imagen para una receta usando búsqueda en Unsplash
 * Utiliza el nombre completo de la receta para buscar una imagen relevante
 */
export function getRecipeImage(recetaId, recetaNombre) {
  if (!recetaNombre) return getDefaultImage();

  // Convertir el nombre a una búsqueda URL-safe
  // Ej: "ARROZ AMARILLO" -> "arroz amarillo"
  const searchQuery = recetaNombre.toLowerCase().trim();

  // Usar la API de Unsplash con búsqueda dinámica
  // Parámetros:
  // - q: término de búsqueda (nombre de la receta)
  // - w: ancho de la imagen (500px)
  // - h: alto de la imagen (400px)
  // - fit: recortar para ajustarse
  // - auto: formato automático
  const unsplashUrl = `https://source.unsplash.com/500x400/?${encodeURIComponent(searchQuery)},food`;

  return unsplashUrl;
}

/**
 * Retorna una imagen por defecto
 */
export function getDefaultImage() {
  return 'https://source.unsplash.com/500x400/?food,cooking';
}

/**
 * Obtiene el color de gradiente según la categoría
 */
export function getCategoryColor(categoria) {
  const colors = {
    'Plato Principal': 'from-orange-400 to-orange-200',
    'Postre': 'from-pink-400 to-pink-200',
    'Arroz/Fideos': 'from-yellow-400 to-yellow-200',
    'Ensalada/Verdura': 'from-green-400 to-green-200',
    'Acompañamiento': 'from-blue-400 to-blue-200',
  };
  return colors[categoria] || 'from-gray-400 to-gray-200';
}
