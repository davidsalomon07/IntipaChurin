import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { ThemeProvider } from './context/ThemeContext'; 
import { LanguageProvider } from './context/LanguageContext'; 
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Terms from './pages/Terms';
import Faq from './pages/Faq';
import Shipping from './pages/Shipping';
import Privacy from './pages/Privacy';
import Shop from './pages/Shop';
import UserProfile from './pages/UserProfile';
import Lookbook from './pages/Lookbook';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider> 
        <CartProvider>
          <Router>
            <div className="bg-fog-white dark:bg-zinc-950 min-h-screen text-fog-black dark:text-zinc-50 font-sans selection:bg-fog-gray transition-colors duration-300">
            
              {/* Colocamos el Toaster aquí, con un diseño premium y minimalista */}
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#ffffff',
                    color: '#1c1917', 
                    border: '1px solid #e7e5e4', 
                    borderRadius: '1rem', 
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    padding: '16px 24px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#1c1917', 
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    style: {
                      background: '#fef2f2', 
                      color: '#dc2626', 
                      border: '1px solid #fee2e2', 
                    },
                    iconTheme: {
                      primary: '#dc2626',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />

              <Routes>
                <Route path="/" element={<Home />} />
                {/* Ruta para la página de Login */}
                <Route path="/login" element={<Login />} />
                {/* Ruta para la página de Registro */}
                <Route path="/register" element={<Register />} />
                {/* Ruta para la página de Acerca de About*/}
                <Route path="/about" element={<About />} />
                {/* Ruta para la página de Términos de Servicio */}
                <Route path="/terms" element={<Terms />} />
                {/* Ruta para la página de Preguntas Frecuentes */}
                <Route path="/faq" element={<Faq />} />
                {/* Ruta para la página de Envío */}
                <Route path="/shipping" element={<Shipping />} />
                {/* Ruta para la página de Privacidad */}
                <Route path="/privacy" element={<Privacy />} />
                {/* Ruta para la página de la Tienda */}
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                {/* Ruta para la página de Perfil de Usuario */}
                <Route path="/profile" element={<UserProfile />} />
                {/* Ruta para la página de Lookbook */}
                <Route path="/lookbook" element={<Lookbook />} />
              </Routes>

              {/* Botón de WhatsApp, que se renderiza en todas las páginas excepto en las rutas especificadas */}
              <WhatsAppButton />

            </div>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;