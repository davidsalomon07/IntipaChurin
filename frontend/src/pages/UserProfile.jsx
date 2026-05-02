import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';

const UserProfile = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Estado para simular qué pestaña está activa
  const [activeTab, setActiveTab] = useState('pedidos');

  // Datos simulados del usuario
  const usuario = {
    nombre: "David Salomón",
    email: "david@ejemplo.com",
    miembroDesde: "Febrero 2026"
  };

  // Historial de pedidos simulado
  const pedidos = [
    { id: "ORD-0921", fecha: "15 Abr 2026", total: 140.00, estado: "Entregado", items: "Essential Hoodie, Classic Boxy Tee" },
    { id: "ORD-0854", fecha: "02 Mar 2026", total: 75.00, estado: "Entregado", items: "Cargo Pant Parachute" }
  ];

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-stone-900 font-sans selection:bg-stone-200 flex flex-col">
      
      {/* --- NAVBAR SIMPLIFICADO --- */}
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
            <button className="text-stone-400 hover:text-red-500 transition-colors text-[11px] font-bold uppercase tracking-widest">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* --- CONTENIDO DEL PERFIL --- */}
      <main className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full flex flex-col md:flex-row gap-12">
        
        {/* Columna Izquierda: Menú y Resumen */}
        <aside className="w-full md:w-1/4">
          <div className="bg-stone-100 p-8 rounded-3xl mb-8 text-center">
            <div className="w-20 h-20 bg-stone-300 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-stone-600">
              {usuario.nombre.charAt(0)}
            </div>
            <h2 className="font-bold text-lg">{usuario.nombre}</h2>
            <p className="text-sm text-stone-500">{usuario.email}</p>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('pedidos')}
              className={`text-left px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'pedidos' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-600'}`}
            >
              Mis Pedidos
            </button>
            <button 
              onClick={() => setActiveTab('datos')}
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

        {/* Columna Derecha: Contenido Dinámico */}
        <div className="w-full md:w-3/4">
          
          {/* Vista de Pedidos */}
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

          {/* Vista de Datos (Plantilla visual) */}
          {activeTab === 'datos' && (
            <div>
              <h1 className="text-2xl font-bold mb-8 tracking-tight">Datos Personales</h1>
              <div className="bg-white border border-stone-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Nombre Completo</label>
                    <input type="text" defaultValue={usuario.nombre} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Correo Electrónico</label>
                    <input type="email" defaultValue={usuario.email} disabled className="w-full px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-stone-400 cursor-not-allowed" />
                  </div>
                </div>
                <button className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors">
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {/* Vista de Direcciones (Plantilla visual) */}
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