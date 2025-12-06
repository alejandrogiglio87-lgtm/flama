/**
 * Mapeo de recetas a imágenes locales
 * Las imágenes se encuentran en /public/images/
 * Los nombres de archivo corresponden a los IDs de las recetas
 */

const recipeImages = {
  // Platos Principales
  'bocaditos-de-pollo': '/images/bocaditos_de_pollo.png',
  'budin-de-pescado': '/images/budin_de_pescado.png',
  'carbonada-criolla': '/images/carbonada_criolla.png',
  'carne-a-la-portuguesa': '/images/carne_a_la_portuguesa.png',
  'cazuela-de-lentejas': '/images/cazuela_de_lentejas.png',
  'chop-suey-de-cerdo': '/images/chop_suey_de_cerdo.png',
  'chupin-de-pescado-y-verduras': '/images/chupin_de_pescado_y_verduras.png',
  'croquetas-de-atun-y-papas': '/images/croquetas_de_atun_y_papas.png',
  'hamburguesa-de-pescado': '/images/hamburguesa_de_pescado.png',
  'lasaña': '/images/lasana.png',
  'pan-de-carne-hamburguesa': '/images/pan_de_carne.png',
  'pasta-sorpresa': '/images/pasta_sorpresa.png',
  'pastel-de-carne-con-papa': '/images/pastel_de_carne_y_papa.png',
  'pastel-de-carne-y-berenjenas': '/images/pastel_de_carne_y_berenjenas.png',
  'pollo-colorido': '/images/pollo_colorido.png',
  'pollo-con-salsa-blanca-y-verduras': '/images/pollo_con_salsa_blanca_y_verduras.png',
  'torta-de-atun': '/images/torta_de_atun.png',
  'torta-de-carne-y-vegetales': '/images/torta_de_carne_y_vegetales.png',
  'tortilla-de-papa,-vegetales-y-pollo': '/images/tortilla_de_papa_vegetales_y_pollo.png',
  'ensalada-completa': '/images/ensalada_completa.png',

  // Arroz y Fideos
  'arroz-amarillo': '/images/arroz_amarillo.png',
  'arroz-con-vegetales-salteados': '/images/arroz_con_vegetales_salteados.png',
  'arroz-fideos': '/images/arroz_fideos.png',
  'arroz-fideos-plato-principal': '/images/arroz_fideos_plato_principal.png',
  'polenta-plato-principal': '/images/polenta_plato_principal.png',

  // Ensaladas y Verduras
  'ensalada-de-vegetales': '/images/ensalada_de_vegetales.png',
  'ensalada-jardinera': '/images/ensalada_jardinera.png',
  'ensalada-de-leguminosas-y-vegetales': '/images/ensalada_de_leguminosas_y_vegetales.png',
  'ensalada-primavera': '/images/ensalada_primavera.png',
  'hortalizas-asadas': '/images/hortalizas_asadas.png',

  // Papas y Acompañamientos
  'papas-al-natural': '/images/papas_al_natural.png',
  'pure-de-papas': '/images/pure_de_papas.png',
  'pure-de-papas-instantaneo': '/images/pure_de_papas_instantaneo.png',
  'pure-triple': '/images/pure_triple.png',
  'salsa-blanca-liviana': '/images/salsa_blanca_liviana.png',

  // Salsas y Bases (sin fotos aún)
  'masa-basica-para-tortas-tartas': null,
  'filloas': null,
  'mayonesa-vegetal-de-papa': null,
  'mayonesa-vegetal-de-zanahoria': null,

  // Postres (sin fotos aún)
  'arroz-con-leche': null,
  'crema-de-naranja': null,
  'crema-de-vainilla': null,
  'budin-de-zapallo-y-coco': null,
  'budin-de-harina-de-maiz': null,
  'pasta-con-verdusalsa': '/images/pasta_con_verdusalsa.png',
};

/**
 * Obtiene la URL de imagen para una receta
 * Intenta usar imagen local, si no existe intenta búsqueda en Unsplash con nombre
 */
export function getRecipeImage(recetaId, recetaNombre) {
  if (!recetaId) return getDefaultImage();

  // Buscar imagen local
  const localImage = recipeImages[recetaId];

  if (localImage) {
    return localImage;
  }

  // Si existe en el mapeo pero es null, devuelve imagen por defecto
  if (recetaId in recipeImages) {
    return getDefaultImage();
  }

  // Si no está en el mapeo, intenta búsqueda en Unsplash con nombre
  if (recetaNombre) {
    const searchQuery = recetaNombre.toLowerCase().trim();
    return `https://source.unsplash.com/500x400/?${encodeURIComponent(searchQuery)},food`;
  }

  return getDefaultImage();
}

/**
 * Retorna una imagen por defecto
 */
export function getDefaultImage() {
  return '/images/ensalada_completa.png';
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
