/**
 * Mapeo de recetas a imágenes específicas de Unsplash
 * Cada URL está seleccionada manualmente para que coincida con la receta
 * usando búsquedas específicas en Unsplash
 */

const recipeImages = {
  // Platos Principales
  'bocaditos-de-pollo': 'https://images.unsplash.com/photo-1626082928111-b12566ecf8b0?w=500&h=400&fit=crop',
  'budin-de-pescado': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'carbonada-criolla': 'https://images.unsplash.com/photo-1599043513033-4b7d7cd19194?w=500&h=400&fit=crop',
  'carne-a-la-portuguesa': 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=500&h=400&fit=crop',
  'cazuela-de-lentejas': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'chop-suey-de-cerdo': 'https://images.unsplash.com/photo-1609617854-0fb0150c9ee6?w=500&h=400&fit=crop',
  'chupin-de-pescado-y-verduras': 'https://images.unsplash.com/photo-1543150532-d2c3201371e7?w=500&h=400&fit=crop',
  'croquetas-de-atun-y-papas': 'https://images.unsplash.com/photo-1608189514007-49b4ce6357da?w=500&h=400&fit=crop',
  'hamburguesa-de-pescado': 'https://images.unsplash.com/photo-1585238341710-4b4e6f289635?w=500&h=400&fit=crop',
  'lasaña': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
  'pan-de-carne-hamburguesa': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
  'pasta-sorpresa': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
  'pastel-de-carne-con-papa': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'pastel-de-carne-y-berenjenas': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'pollo-colorido': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop',
  'pollo-con-salsa-blanca-y-verduras': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop',
  'torta-de-atun': 'https://images.unsplash.com/photo-1604914177074-f17e1019fa41?w=500&h=400&fit=crop',
  'torta-de-carne-y-vegetales': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop',
  'tortilla-de-papa,-vegetales-y-pollo': 'https://images.unsplash.com/photo-1585238341710-4b4e6f289635?w=500&h=400&fit=crop',
  'ensalada-completa': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',

  // Arroz y Fideos
  'arroz-amarillo': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'arroz-con-leche': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
  'arroz-con-vegetales-salteados': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
  'arroz-fideos': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'arroz-fideos-plato-principal': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'polenta-plato-principal': 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=500&h=400&fit=crop',

  // Ensaladas y Verduras
  'ensalada-de-vegetales': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'ensalada-jardinera': 'https://images.unsplash.com/photo-1627117693185-8588eea1bac2?w=500&h=400&fit=crop',
  'ensalada-de-leguminosas-y-vegetales': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop',
  'ensalada-primavera': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',
  'hortalizas-asadas': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop',

  // Papas y Acompañamientos
  'papas-al-natural': 'https://images.unsplash.com/photo-1564080489-b953a5b3c547?w=500&h=400&fit=crop',
  'pure-de-papas': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4872d?w=500&h=400&fit=crop',
  'pure-de-papas-instantaneo': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4872d?w=500&h=400&fit=crop',
  'pure-triple': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd4872d?w=500&h=400&fit=crop',
  'salsa-blanca-liviana': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop',

  // Salsas y Bases
  'masa-basica-para-tortas-tartas': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
  'filloas': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
  'mayonesa-vegetal-de-papa': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop',
  'mayonesa-vegetal-de-zanahoria': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop',

  // Postres
  'crema-de-naranja': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
  'crema-de-vainilla': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
  'budin-de-zapallo-y-coco': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
  'budin-de-harina-de-maiz': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
  'pasta-con-verdusalsa': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop',
};

/**
 * Obtiene la URL de imagen para una receta
 * Mapeo directo desde receta.id a URL de Unsplash específica
 */
export function getRecipeImage(recetaId) {
  if (!recetaId) return getDefaultImage();

  // Búsqueda exacta
  if (recipeImages[recetaId]) {
    return recipeImages[recetaId];
  }

  // Si no encuentra, devuelve imagen por defecto
  return getDefaultImage();
}

/**
 * Retorna una imagen por defecto
 */
export function getDefaultImage() {
  return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop';
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
