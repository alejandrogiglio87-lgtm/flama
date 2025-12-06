import { useState, useEffect } from 'react';
import { UtensilsCrossed, Calendar } from 'lucide-react';
import RecipeCalculator from './components/RecipeCalculator';
import WeeklyPlanner from './components/WeeklyPlanner';
import './App.css';

function App() {
  // Update document title
  if (typeof window !== 'undefined') {
    document.title = 'Recetario PAE - Planificación de Menús Escolares';
  }

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Cargando recetario...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'calculator', label: 'Calculadora', icon: UtensilsCrossed },
    { id: 'planner', label: 'Planificador', icon: Calendar }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(to bottom right, rgb(249, 250, 251), rgb(240, 245, 250), rgb(224, 242, 254))',
      backgroundAttachment: 'fixed'
    }}>
      {/* Patrón en los bordes - visible solo en pantallas grandes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{
        backgroundImage: `url('/food-pattern.jpg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        opacity: 0.35,
        zIndex: 0
      }}></div>

      <div className="relative flex flex-col z-10">
      {/* Header Profesional con Imagen de Fondo */}
      <header
        className="relative text-white shadow-2xl overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=400&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/70 to-indigo-900/80"></div>

        {/* Contenido */}
        <div className="relative max-w-7xl mx-auto px-4 py-6 w-full">
          <div className="flex items-center gap-4 mb-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src="/logo2.jpg"
                alt="Logo"
                className="h-20 w-20 rounded-lg shadow-lg object-contain bg-white p-2 border-4 border-white"
              />
            </div>
            {/* Título */}
            <div>
              <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg">Recetario PAE</h1>
              <p className="text-blue-100 text-lg mt-1 drop-shadow-md">Planificación Inteligente de Menús Escolares</p>
            </div>
          </div>
          <p className="text-blue-100 text-base max-w-3xl drop-shadow-md">
            Calcula ingredientes, planifica tu semana y genera listas de compras automáticas con nuestra herramienta profesional
          </p>
        </div>
      </header>

      {/* Navigation Tabs - Mejorado */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-all duration-200 ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {activeTab === 'calculator' && <RecipeCalculator recetas={recetas} />}
        {activeTab === 'planner' && <WeeklyPlanner recetas={recetas} />}
      </main>

      {/* Footer Profesional */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo en footer */}
            <div className="flex items-start md:col-span-1">
              <img
                src="/footer-logo.jpg"
                alt="ANEP Logo"
                className="h-40 w-40 object-contain rounded-lg"
              />
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Sobre Recetario PAE</h3>
              <p className="text-sm text-gray-400">
                Herramienta moderna para planificar menús escolares, calcular ingredientes y generar listas de compras automáticas.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Características</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ 45+ recetas del PAE</li>
                <li>✓ Cálculo automático de ingredientes</li>
                <li>✓ Exportación a PDF y Excel</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Información</h3>
              <p className="text-sm text-gray-400">
                Todos tus datos se guardan localmente en tu navegador. Privacidad garantizada.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Recetario PAE • Planificación de Menús Escolares</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
