import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import RecipeCalculator from './components/RecipeCalculator';
import WeeklyPlanner from './components/WeeklyPlanner';
import ShoppingList from './components/ShoppingList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar recetas desde el JSON
  useEffect(() => {
    fetch('/data/recetas.json')
      .then(res => res.json())
      .then(data => {
        setRecetas(data.recetas || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando recetas:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando recetario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Menu size={32} />
            <h1 className="text-3xl font-bold">Recetario PAE</h1>
          </div>
          <p className="text-blue-100 mt-2">Calcula ingredientes, planifica tu semana y genera listas de compras</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'calculator'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Calculadora
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'planner'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Planificador Semanal
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'shopping'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista de Compras
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'calculator' && <RecipeCalculator recetas={recetas} />}
        {activeTab === 'planner' && <WeeklyPlanner recetas={recetas} />}
        {activeTab === 'shopping' && <ShoppingList recetas={recetas} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Recetario PAE • Planificación de menús escolares</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
