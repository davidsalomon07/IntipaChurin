import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="bg-fog-white min-h-screen text-fog-black font-sans selection:bg-fog-gray">
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;