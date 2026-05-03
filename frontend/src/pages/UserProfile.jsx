import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import MiniFooter from '../components/MiniFooter';

// Configuraciones de Google Maps
const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '200px', borderRadius: '0.75rem' };
const defaultCenter = { lat: -0.2103, lng: -78.4889 }; // Centrado en Quito

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [userData, setUserData] = useState(null); 
  
  // Estados para Datos Personales
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '' });

  // NUEVO: Estados para Direcciones
  const [addresses, setAddresses] = useState([]); // Lista de direcciones
  const [showAddressForm, setShowAddressForm] = useState(false); // Mostrar/Ocultar formulario
  const [editingAddressId, setEditingAddressId] = useState(null); // Saber si creamos o editamos
  const [addressFormData, setAddressFormData] = useState({
    title: '', street_address: '', city: '', postal_code: '', phone_number: ''
  });

  // Estados y Hooks de Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  
  // NUEVO: Estado para controlar cuándo dibujar el mapa y ahorrar cuota
  const [showMap, setShowMap] = useState(false);

  // NUEVO: Estado para el Modal de confirmación de eliminación
  const [addressToDelete, setAddressToDelete] = useState(null);

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
      setFormData({
        first_name: parsedUser.first_name || '',
        last_name: parsedUser.last_name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || ''
      });
      // Cuando carga el perfil, pedimos las direcciones al backend
      fetchAddresses(storedToken);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ==========================================
  // FUNCIONES DE DATOS PERSONALES
  // ==========================================
  const handleCancelEdit = () => {
    setFormData({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      phone: userData.phone || ''
    });
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUserData(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); 
      setIsEditing(false); 
      toast.success("¡Tus datos han sido actualizados exitosamente!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ==========================================
  // FUNCIONES DE DIRECCIONES (CRUD)
  // ==========================================

  // 1. READ: Obtener direcciones
  const fetchAddresses = async (token) => {
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/direcciones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (err) {
      console.error("Error cargando direcciones:", err);
    }
  };

  // 2. CREATE / UPDATE: Guardar formulario
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingAddressId 
        ? `http://localhost:3000/api/usuarios/direcciones/${editingAddressId}` // Si hay ID, es UPDATE
        : 'http://localhost:3000/api/usuarios/direcciones'; // Si no hay ID, es CREATE
      
      const method = editingAddressId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(addressFormData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(data.message);
      fetchAddresses(token); // Recargamos la lista
      closeAddressForm(); // Cerramos y limpiamos
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 3. DELETE: Lógica de eliminación con Modal Personalizado
  const handleDeleteAddressClick = (id) => {
    setAddressToDelete(id);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/usuarios/direcciones/${addressToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(data.message);
      fetchAddresses(token); // Recargamos la lista
      setAddressToDelete(null); // Cerramos el modal
    } catch (err) {
      toast.error(err.message);
      setAddressToDelete(null);
    }
  };

  // ==========================================
  // FUNCIONES DE GOOGLE MAPS
  // ==========================================
  const handlePlaceChanged = () => {
    if (autocompleteRef !== null) {
      const place = autocompleteRef.getPlace();
      if (place.geometry && place.geometry.location) {
        let city = '';
        const cityComponent = place.address_components?.find(c => c.types.includes('locality') || c.types.includes('administrative_area_level_2'));
        if (cityComponent) city = cityComponent.long_name;

        setAddressFormData({
          ...addressFormData,
          street_address: place.formatted_address || place.name,
          city: city || addressFormData.city 
        });
        
        setMapCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }
  };

  // Controladores de UI del formulario
  const openNewAddressForm = () => {
    setAddressFormData({ title: '', street_address: '', city: '', postal_code: '', phone_number: '' });
    setMapCenter(defaultCenter); // Reseteamos el mapa a Quito
    setEditingAddressId(null);
    setShowMap(false); // Nos aseguramos de que el mapa inicie oculto
    setShowAddressForm(true);
  };

  const openEditAddressForm = (address) => {
    setAddressFormData({
      title: address.title || '',
      street_address: address.street_address || '',
      city: address.city || '',
      postal_code: address.postal_code || '',
      phone_number: address.phone_number || ''
    });
    setEditingAddressId(address.id);
    setShowMap(false); // Nos aseguramos de que el mapa inicie oculto
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setShowMap(false);
  };

  // Mock de pedidos
  const pedidos = [
    { id: "ORD-0921", fecha: "15 Abr 2026", total: 140.00, estado: "Entregado", items: "Essential Hoodie, Classic Boxy Tee" },
    { id: "ORD-0854", fecha: "02 Mar 2026", total: 75.00, estado: "Entregado", items: "Cargo Pant Parachute" }
  ];

  if (!userData) return null;

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-stone-900 font-sans selection:bg-stone-200 flex flex-col">
      
      {/* NAVBAR */}
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
            <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors text-[11px] font-bold uppercase tracking-widest">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR LATERAL */}
        <aside className="w-full md:w-1/4">
          <div className="bg-stone-100 p-8 rounded-3xl mb-8 text-center">
            <div className="w-20 h-20 bg-stone-300 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-stone-600 uppercase">
              {userData.first_name ? userData.first_name.charAt(0) : 'U'}
            </div>
            <h2 className="font-bold text-lg">{userData.first_name} {userData.last_name}</h2>
            <p className="text-sm text-stone-500">{userData.email}</p>
          </div>

          <nav className="flex flex-col gap-2">
            <button onClick={() => setActiveTab('pedidos')} className={`text-left px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'pedidos' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-600'}`}>Mis Pedidos</button>
            <button onClick={() => { setActiveTab('datos'); setIsEditing(false); }} className={`text-left px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'datos' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-600'}`}>Datos Personales</button>
            <button onClick={() => setActiveTab('direcciones')} className={`text-left px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'direcciones' ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-600'}`}>Direcciones</button>
          </nav>
        </aside>

        {/* AREA PRINCIPAL */}
        <div className="w-full md:w-3/4">
          
          {/* VISTA: PEDIDOS */}
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
                        <button className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors">Ver Detalles</button>
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

          {/* VISTA: DATOS PERSONALES */}
          {activeTab === 'datos' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Datos Personales</h1>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors">Editar</button>
                )}
              </div>

              <div className="bg-white border border-stone-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Nombre</label>
                    <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${!isEditing ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500'}`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Apellido</label>
                    <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${!isEditing ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500'}`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Correo Electrónico</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${!isEditing ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500'}`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Teléfono</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} placeholder="Ej. 0987654321" className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${!isEditing ? 'bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500'}`} />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-2">
                    <button onClick={handleSaveChanges} className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors">Guardar Cambios</button>
                    <button onClick={handleCancelEdit} className="bg-stone-100 text-stone-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors">Cancelar</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VISTA: DIRECCIONES */}
          {activeTab === 'direcciones' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Libreta de Direcciones</h1>
                {!showAddressForm && (
                  <button onClick={openNewAddressForm} className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors">
                    + Nueva
                  </button>
                )}
              </div>

              {showAddressForm ? (
                /* FORMULARIO DE DIRECCIÓN */
                <form onSubmit={handleSaveAddress} className="bg-white border border-stone-100 p-8 rounded-3xl shadow-sm space-y-6">
                  <h3 className="font-bold text-lg mb-4">{editingAddressId ? 'Editar Dirección' : 'Agregar Dirección'}</h3>
                  
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Título de la dirección</label>
                    <input type="text" required value={addressFormData.title} onChange={(e) => setAddressFormData({...addressFormData, title: e.target.value})} placeholder="Ej. Casa, Oficina" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-500" />
                  </div>
                  
                  {/* INYECCIÓN CONDICIONAL DE GOOGLE MAPS */}
                  {!showMap ? (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Dirección completa</label>
                      <div className="flex gap-3">
                        <input type="text" required value={addressFormData.street_address} onChange={(e) => setAddressFormData({...addressFormData, street_address: e.target.value})} placeholder="Calle Principal y Secundaria" className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-500" />
                        <button type="button" onClick={() => setShowMap(true)} className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-bold uppercase rounded-xl hover:bg-stone-300 transition-colors whitespace-nowrap">
                          📍 Usar Mapa
                        </button>
                      </div>
                    </div>
                  ) : (
                    isLoaded ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-end mb-1.5">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">Dirección completa (Busca en el mapa)</label>
                            <button type="button" onClick={() => setShowMap(false)} className="text-[10px] font-bold uppercase text-stone-400 hover:text-stone-600 transition-colors">Ocultar Mapa</button>
                          </div>
                          <Autocomplete onLoad={(ref) => setAutocompleteRef(ref)} onPlaceChanged={handlePlaceChanged}>
                            <input type="text" required value={addressFormData.street_address} onChange={(e) => setAddressFormData({...addressFormData, street_address: e.target.value})} placeholder="Empieza a escribir tu dirección..." className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-500" />
                          </Autocomplete>
                        </div>
                        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-inner">
                          <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={15}>
                            <Marker position={mapCenter} />
                          </GoogleMap>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-stone-500 bg-stone-50 rounded-xl">Cargando mapa...</div>
                    )
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Ciudad</label>
                      <input type="text" required value={addressFormData.city} onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} placeholder="Ej. Quito" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Código Postal</label>
                      <input type="text" value={addressFormData.postal_code} onChange={(e) => setAddressFormData({...addressFormData, postal_code: e.target.value})} placeholder="Opcional" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">Teléfono de contacto</label>
                    <input type="tel" required value={addressFormData.phone_number} onChange={(e) => setAddressFormData({...addressFormData, phone_number: e.target.value})} placeholder="Para el repartidor" className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-500" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors">Guardar Dirección</button>
                    <button type="button" onClick={closeAddressForm} className="bg-stone-100 text-stone-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors">Cancelar</button>
                  </div>
                </form>
              ) : (
                /* LISTA DE DIRECCIONES */
                addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="bg-white border border-stone-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="mb-4">
                          <h3 className="font-bold text-lg">{address.title}</h3>
                          <p className="text-sm text-stone-500 mt-1">{address.street_address}</p>
                          <p className="text-sm text-stone-500">{address.city} {address.postal_code ? `- ${address.postal_code}` : ''}</p>
                          <p className="text-sm text-stone-500 mt-2 font-medium">📞 {address.phone_number}</p>
                        </div>
                        
                        <div className="flex gap-4 border-t border-stone-100 pt-4">
                          <button onClick={() => openEditAddressForm(address)} className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors">Editar</button>
                          <button onClick={() => handleDeleteAddressClick(address.id)} className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-600 transition-colors">Eliminar</button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Botón rápido para agregar otra */}
                    <div onClick={openNewAddressForm} className="border-2 border-stone-100 border-dashed p-6 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-stone-50 transition-colors min-h-[200px]">
                      <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 mb-3">+</div>
                      <p className="text-sm font-bold text-stone-600">Agregar nueva dirección</p>
                    </div>
                  </div>
                ) : (
                  /* ESTADO VACÍO */
                  <div className="bg-white border border-stone-100 border-dashed p-12 rounded-3xl text-center">
                    <p className="text-stone-500 mb-4">No tienes direcciones guardadas.</p>
                    <button onClick={openNewAddressForm} className="text-sm font-bold border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors">Agregar tu primera dirección</button>
                  </div>
                )
              )}
            </div>
          )}

        </div>
      </main>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {addressToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full border border-stone-100 transform transition-all text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 tracking-tight">¿Eliminar dirección?</h3>
            <p className="text-sm text-stone-500 mb-8">Esta acción no se puede deshacer. Tendrás que volver a llenar los datos si quieres usarla después.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setAddressToDelete(null)} 
                className="flex-1 py-3.5 px-4 bg-stone-100 text-stone-600 font-bold text-[11px] uppercase tracking-wider rounded-xl hover:bg-stone-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteAddress} 
                className="flex-1 py-3.5 px-4 bg-red-500 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <MiniFooter />
    </div>
  );
};

export default UserProfile;