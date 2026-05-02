import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [userData, setUserData] = useState(null); 
  
  const [isEditing, setIsEditing] = useState(false);
  // Añadimos el email al estado del formulario
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedToken || !storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      // Inicializamos el formulario incluyendo el correo
      setFormData({
        first_name: parsedUser.first_name,
        last_name: parsedUser.last_name,
        email: parsedUser.email
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCancelEdit = () => {
    // Restauramos todos los campos, incluyendo el correo
    setFormData({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email
    });
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al actualizar los datos');
      }

      setUserData(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); 
      setIsEditing(false); 
      
      // ✨ MAGIA AQUÍ: Reemplazamos el alert por un toast.success
      toast.success("¡Tus datos han sido actualizados exitosamente!");

    } catch (err) {
      // Reemplazamos el alert de error por toast.error
      toast.error(err.message);
    }
  };

  const pedidos = [
    { id: "ORD-0921", fecha: "15 Abr 2026", total: 140.00, estado: "Entregado", items: "Essential Hoodie, Classic Boxy Tee" },
    { id: "ORD-0854", fecha: "02 Mar 2026", total: 75.00, estado: "Entregado", items: "Cargo Pant Parachute" }
  ];

  if (!userData) return null;

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-stone-900 font-sans selection:bg-stone-200 flex flex-col">
      
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 h-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex justify-between items-center relative">
          <div className="flex-1">
            <Link to="/shop" className="text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Seguir Comprando
            </Link>
          </div>
          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2">
            Intipa Churin
          </div>
          <div className="flex-1 flex justify-end">
            <button 
              onClick={handleLogout}
              className="text-stone-400 hover:text-red-500 transition-colors text-[11px] font-bold uppercase tracking-widest"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full flex flex-col md:flex-row gap-12">
        
        <aside className="w-full md:w-1/4">
          <div className="bg-stone-100 p-8 rounded-3xl mb-8 text-center">
            <div className="w-20 h-20 bg-stone-300 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-stone-600 uppercase">
              {userData.first_name.charAt(0)}
            </div>
            <h2 className="font-bold text-lg">{userData.first_name} {userData.last_name}</h2>
            <p className="text-sm text-stone-500">{userData.email}</p>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('pedidos')}
              className={`text-left px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'pedidos' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-600'}`}
            >
              Mis Pedidos
            </button>
            <button 
              onClick={() => {
                setActiveTab('datos');
                setIsEditing(false); 
              }}
              className={`text-left px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'datos' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-600'}`}
            >
              Datos Personales
            </button>
            <button 
              onClick={() => setActiveTab('direcciones')}
              className={`text-left px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'direcciones' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-600'}`}
            >
              Direcciones
            </button>
          </nav>
        </aside>

        <div className="w-full md:w-3/4">
          
          {activeTab === 'pedidos' && (
            <div>
              <h1 className="text-2xl font-bold mb-8 tracking-tight">Historial de Pedidos</h1>
              {pedidos.length > 0 ? (
                <div className="space-y-4">
                  {pedidos.map((pedido, index) => (
                    <div key={index} className="bg-white border border-stone-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold">{pedido.id}</span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md font-semibold">{pedido.estado}</span>
                        </div>
                        <p className="text-sm text-stone-500">{pedido.fecha}</p>
                        <p className="text-sm text-stone-600 mt-2">{pedido.items}</p>
                      </div>
                      <div className="text-right w-full md:w-auto">
                        <p className="font-bold text-lg mb-2">${pedido.total.toFixed(2)}</p>
                        <button className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-stone-50 p-12 rounded-3xl text-center border border-stone-100">
                  <p className="text-stone-500 mb-4">Aún no has realizado ningún pedido.</p>
                  <Link to="/shop" className="text-sm font-bold border-b border-stone-900 pb-1">Explorar catálogo</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'datos' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Datos Personales</h1>
                
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>

              <div className="bg-white border border-stone-100 p-8 rounded-3xl shadow-sm space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Nombre</label>
                    <input 
                      type="text" 
                      value={formData.first_name} 
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${!isEditing ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500'}`} 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Apellido</label>
                    <input 
                      type="text" 
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${!isEditing ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500'}`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Correo Electrónico</label>
                  {/* El campo de correo ahora responde al estado isEditing */}
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing} 
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${!isEditing ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500'}`}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={handleSaveChanges}
                      className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="bg-stone-100 text-stone-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'direcciones' && (
            <div>
              <h1 className="text-2xl font-bold mb-8 tracking-tight">Direcciones Guardadas</h1>
              <div className="bg-white border border-stone-100 border-dashed p-10 rounded-3xl text-center cursor-pointer hover:bg-stone-50 transition-colors">
                <p className="text-sm font-bold text-stone-600">+ Agregar nueva dirección</p>
              </div>
            </div>
          )}

        </div>
      </main>

      <MiniFooter />
    </div>
  );
};

export default UserProfile;