import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;