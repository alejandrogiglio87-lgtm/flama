# Quick Start - Recetario PAE

## Para Desarrolladores

### 1. Instalación rápida
```bash
cd flama-recetario
npm install
npm run dev
```

Abre http://localhost:5173

### 2. Estructura del proyecto
```
src/
├── App.jsx                 # Componente principal
├── components/
│   ├── RecipeCalculator.jsx    # Calculadora de ingredientes
│   ├── WeeklyPlanner.jsx       # Planificador semanal
│   ├── ShoppingList.jsx        # Lista de compras
│   └── RecipeCard.jsx          # Tarjeta de receta
└── utils/
    ├── recipeCalculations.js   # Lógica de cálculos
    ├── storageManager.js       # LocalStorage
    └── pdfGenerator.js         # Generación de PDFs
```

### 3. Actualizar recetas (desde Excel)
```bash
python3 scripts/excel-to-json.py
# Esto genera public/data/recetas.json
```

### 4. Build para producción
```bash
npm run build
# Output: dist/
```

---

## Para Usuarios

### 1. Calcular Ingredientes

1. Abre la pestaña **"Calculadora"**
2. Busca una receta o filtra por categoría
3. Haz click en la receta
4. Ajusta "Número de Porciones"
5. Ve los ingredientes calculados automáticamente

### 2. Planificar la Semana

1. Abre **"Planificador Semanal"**
2. Para cada día:
   - Click en "Agregar Receta"
   - Selecciona la receta
   - Ajusta porciones
   - Click en "Agregar a Planificador"
3. Verás la semana completa organizada

### 3. Generar Lista de Compras

1. En **"Planificador Semanal"** → Click **"Exportar PDF"**
2. O ve a **"Lista de Compras"**
3. Marca ingredientes mientras compras
4. Agrupa por nombre, unidad o sin agrupar
5. Descarga PDF o imprime

### 4. Guardar y Cargar Planes

- En **"Planificador Semanal"** → **"Guardar Plan"**
- Dale un nombre
- Luego puedes cargar ese plan cuando quieras

---

## Características Clave

✅ **45+ Recetas** del Programa de Alimentación Escolar
✅ **Cálculo Automático** de ingredientes por porciones
✅ **Planificación Semanal** completa (7 días)
✅ **Múltiples Recetas** por día
✅ **Consolidación** automática de ingredientes
✅ **Exportar a PDF** para imprimir
✅ **Guardar Planes** para reutilizar
✅ **Sin Internet** - Funciona completamente offline
✅ **Sin Servidor** - Datos privados en tu navegador

---

## Datos & Privacidad

- ✅ Todos los datos se guardan en tu navegador
- ✅ Nada se envía a servidores
- ✅ Totalmente privado
- ✅ Puedes limpiar datos anytime

---

## Soporte

- Busca recetas por nombre
- Filtra por categoría
- Cálculos dinámicos en tiempo real
- Export a PDF profesional

---

**¡Comienza ahora!** 🚀
