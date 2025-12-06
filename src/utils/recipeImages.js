/**
 * Mapeo de recetas a imágenes de alta calidad
 * Usando API de Unsplash con palabras clave españolas
 */

const recipeImages = {
  'bocaditos-pollo': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4872d?w=500&h=400&fit=crop',
  'budin-pescado': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'carbonada-criolla': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'carne-la-portuguesa': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'cazuela-lentejas': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'chop-suey-cerdo': 'https://images.unsplash.com/photo-1609617854-0fb0150c9ee6?w=500&h=400&fit=crop',
  'chupin-pescado-verduras': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'croquetas-atun-papas': 'https://images.unsplash.com/photo-1585238341710-4b4e6f289635?w=500&h=400&fit=crop',
  'ensalada-completa': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'hamburguesa-pescado': 'https://images.unsplash.com/photo-1572802419224-7b1aca3a7f29?w=500&h=400&fit=crop',
  'lasana': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
  'pan-carne-hamburguesa': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
  'pasta-sorpresa': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
  'pastel-carne-papa': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'pastel-carne-berenjenas': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'pollo-colorido': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop',
  'pollo-salsa-blanca-verduras': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop',
  'torta-atun': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'torta-carne-vegetales': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'tortilla-papa-vegetales-pollo': 'https://images.unsplash.com/photo-1585238341710-4b4e6f289635?w=500&h=400&fit=crop',
  'arroz-amarillo': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'arroz-leche': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
  'arroz-vegetales-salteados': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'ensalada-vegetales': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'ensalada-jardinera': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'ensalada-leguminosas-vegetales': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'ensalada-primavera': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'papas-natural': 'https://images.unsplash.com/photo-1564080489-b953a5b3c547?w=500&h=400&fit=crop',
  'pure-papas': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4872d?w=500&h=400&fit=crop',
  'pure-papas-instantaneo': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4872d?w=500&h=400&fit=crop',
  'pure-triple': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4872d?w=500&h=400&fit=crop',
  'hortalizas-asadas': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'salsa-blanca-liviana': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop',
  'crema-naranja': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
  'crema-vainilla': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
  'budin-zapallo-coco': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
  'budin-harina-maiz': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
};

/**
 * Obtiene la URL de imagen para una receta
 * @param {string} recetaId - ID de la receta
 * @returns {string} URL de la imagen
 */
export function getRecipeImage(recetaId) {
  return recipeImages[recetaId] || getDefaultImage();
}

/**
 * Retorna una imagen por defecto
 */
export function getDefaultImage() {
  return 'https://images.unsplash.com/photo-1495597687212-47540e488b12?w=500&h=400&fit=crop';
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
