import { useState, useEffect } from 'react';
import { UtensilsCrossed, Calendar } from 'lucide-react';
import RecipeCalculator from './components/RecipeCalculator';
import WeeklyPlanner from './components/WeeklyPlanner';
import './App.css';

function App() {
  // Update document title
  if (typeof window !== 'undefined') {
    document.title = 'Recetario PAE - Planificación de Menús Escolares (v2)';
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
      {/* Header Profesional Refinado */}
      <header
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 25%, rgba(240, 147, 251, 0.85) 50%, rgba(79, 172, 254, 0.85) 75%, rgba(102, 126, 234, 0.85) 100%), url(https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=400&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          minHeight: '320px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}
      >
        {/* Efecto de animación suave con patrón */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            pointerEvents: 'none'
          }}
        ></div>

        {/* Contenido del Header */}
        <div className="relative max-w-7xl mx-auto px-4 py-12 w-full">
          {/* Sección superior: Logo y Títulos */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* Logo con efecto */}
            <div
              className="flex-shrink-0 relative"
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))',
                transform: 'perspective(1000px) rotateX(5deg)',
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <img
                src="/logo2.jpg"
                alt="Logo"
                className="h-24 w-24 rounded-xl object-contain bg-white p-3 border-4 border-white"
                style={{
                  boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
              />
            </div>

            {/* Sección de Títulos */}
            <div className="text-center">
              <h1
                className="text-6xl font-black tracking-tight mb-2"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 40%, #e8e8e8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                  letterSpacing: '0.08em',
                  fontWeight: '900',
                  textShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                  paintOrder: 'stroke fill'
                }}
              >
                Recetario PAE
              </h1>
              <p
                className="text-xl font-light tracking-wide"
                style={{
                  color: '#ffffff',
                  textShadow: '0 3px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4)',
                  letterSpacing: '0.03em',
                  fontWeight: '400'
                }}
              >
                Planificación Inteligente de Menús Escolares
              </p>
            </div>
          </div>

          {/* Descripción con estilo refinado - CENTRADA */}
          <div className="flex justify-center">
            <div
              className="text-center"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '20px 30px',
                borderRadius: '12px',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <p
                className="text-lg leading-relaxed"
                style={{
                  color: '#ffffff',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                  fontWeight: '400',
                  letterSpacing: '0.3px',
                  margin: '0px',
                  maxWidth: '600px'
                }}
              >
                Calcula ingredientes, planifica tu semana y genera listas de compras automáticas con nuestra herramienta profesional
              </p>
            </div>
          </div>

          {/* Línea decorativa */}
          <div className="flex justify-center mt-6">
            <div
              className="w-20 h-1"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
              }}
            ></div>
          </div>
        </div>

        {/* Efecto de brillo sutil en la esquina */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(100px, -100px)'
          }}
        ></div>
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
