# Recetario PAE - Planificador de Menús Escolares

Una aplicación web moderna para calcular ingredientes, planificar menús semanales y generar listas de compras para el Programa de Alimentación Escolar (PAE).

## Características

✅ **Calculadora de Ingredientes**
- Selecciona una receta y ajusta el número de porciones
- Visualiza el cálculo automático de ingredientes
- Interfaz intuitiva con búsqueda y filtrado por categoría

✅ **Planificador Semanal**
- Programa recetas para cada día (Lunes-Domingo)
- Agregar múltiples recetas por día
- Guardar y cargar planificaciones predeterminadas

✅ **Lista de Compras Consolidada**
- Consolidación automática de ingredientes de toda la semana
- Agrupación por nombre, unidad de medida o sin agrupar
- Marcar ingredientes como comprados
- Exportar a PDF e imprimir

## Instalación y Ejecución

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build para Producción

```bash
npm run build
```

## Deployment

Sube la carpeta `dist/` a:
- Vercel (vercel.com)
- Netlify (netlify.com)
- GitHub Pages
- Tu servidor web preferido

## Tecnología

- React + Vite
- Tailwind CSS
- LocalStorage (sin base de datos)
- jsPDF para exportar

---
**Versión 1.0.0** - Diciembre 2025
