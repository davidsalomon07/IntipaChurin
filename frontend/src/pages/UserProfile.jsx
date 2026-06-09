import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import MiniFooter from '../components/MiniFooter';
import Navbar from '../components/Navbar';

// Configuraciones de Google Maps
const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '200px', borderRadius: '0.75rem' };
const defaultCenter = { lat: -0.2103, lng: -78.4889 }; // Centrado en Quito

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('datos'); 
  const [userData, setUserData] = useState(null); 
  
  // Estados para Datos Personales
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '' });

  // Estados para Direcciones
  const [addresses, setAddresses] = useState([]); 
  const [showAddressForm, setShowAddressForm] = useState(false); 
  const [editingAddressId, setEditingAddressId] = useState(null); 
  const [addressFormData, setAddressFormData] = useState({
    title: '', street_address: '', city: '', postal_code: ''
  });

  // Estados y Hooks de Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [autocompleteRef, setAutocompleteRef] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Estado para el Modal de confirmación de eliminación
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Estados para Configuración y Custom Dropdowns
  const { theme, setTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

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
      toast.success("¡Datos actualizados correctamente!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ==========================================
  // FUNCIONES DE DIRECCIONES (CRUD)
  // ==========================================
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
      console.error("Error:", err);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingAddressId 
        ? `http://localhost:3000/api/usuarios/direcciones/${editingAddressId}` 
        : 'http://localhost:3000/api/usuarios/direcciones';
      
      const method = editingAddressId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(addressFormData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success(data.message);
      fetchAddresses(token); 
      closeAddressForm(); 
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAddressClick = (id) => setAddressToDelete(id);

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
      fetchAddresses(token); 
      setAddressToDelete(null); 
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

  const openNewAddressForm = () => {
    setAddressFormData({ title: '', street_address: '', city: '', postal_code: '' });
    setMapCenter(defaultCenter);
    setEditingAddressId(null);
    setShowMap(false);
    setShowAddressForm(true);
  };

  const openEditAddressForm = (address) => {
    setAddressFormData({
      title: address.title || '',
      street_address: address.street_address || '',
      city: address.city || '',
      postal_code: address.postal_code || ''
    });
    setEditingAddressId(address.id);
    setShowMap(false);
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setShowMap(false);
  };

  const pedidos = [
    { id: "ORD-0921", fecha: "15 Abr 2026", total: 140.00, estado: "Entregado", items: "Essential Hoodie, Classic Boxy Tee" },
    { id: "ORD-0854", fecha: "02 Mar 2026", total: 75.00, estado: "Entregado", items: "Cargo Pant Parachute" }
  ];

  if (!userData) return null;

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-[#333] dark:text-zinc-50 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/50 flex flex-col transition-colors duration-300">
      
      {/* NAVBAR */}
      <Navbar backButton={true} />

      <main className="max-w-275 mx-auto px-6 pt-28 pb-24 grow w-full flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-6 dark:border dark:border-zinc-800 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-xl font-bold text-gray-500 dark:text-zinc-400 uppercase transition-colors duration-300">
                {userData.first_name ? userData.first_name.charAt(0) : 'U'}
              </div>
              <div>
                <h2 className="font-semibold text-[15px] dark:text-white">{userData.first_name} {userData.last_name}</h2>
                <p className="text-[13px] text-gray-500 dark:text-zinc-400">{userData.email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <button onClick={() => { setActiveTab('datos'); setIsEditing(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${activeTab === 'datos' ? 'bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Datos Personales
              </button>
              <button onClick={() => setActiveTab('direcciones')} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${activeTab === 'direcciones' ? 'bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Direcciones
              </button>
              <button onClick={() => setActiveTab('pedidos')} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${activeTab === 'pedidos' ? 'bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Mis Pedidos
              </button>
              <button onClick={() => setActiveTab('configuracion')} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${activeTab === 'configuracion' ? 'bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Configuración
              </button>
            </nav>

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1">
          
          {/* VISTA: DATOS PERSONALES */}
          {activeTab === 'datos' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-10 relative dark:border dark:border-zinc-800 transition-colors duration-300">
              
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="absolute top-8 right-8 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              ) : (
                <button onClick={handleCancelEdit} className="absolute top-8 right-8 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}

              <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-zinc-400 relative uppercase transition-colors duration-300">
                  {userData.first_name ? userData.first_name.charAt(0) : 'U'}
                </div>
                <h2 className="text-xl font-medium mt-4 dark:text-white">{formData.first_name} {formData.last_name}</h2>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">{formData.email}</p>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Nombre</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    disabled={!isEditing}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500 shadow-sm ${
                      isEditing
                        ? 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white'
                        : 'bg-gray-100/30 dark:bg-zinc-800/10 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 cursor-not-allowed'
                    }`}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Apellido</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    disabled={!isEditing}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500 shadow-sm ${
                      isEditing
                        ? 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white'
                        : 'bg-gray-100/30 dark:bg-zinc-800/10 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Cuenta de Correo</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500 shadow-sm ${
                      isEditing
                        ? 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white'
                        : 'bg-gray-100/30 dark:bg-zinc-800/10 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Número Móvil</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Ingrese su número" : "Añadir número"}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500 shadow-sm ${
                      isEditing
                        ? 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white'
                        : 'bg-gray-100/30 dark:bg-zinc-800/10 border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 cursor-not-allowed'
                    }`}
                  />
                </div>

                {isEditing && (
                  <div className="pt-8">
                    <button onClick={handleSaveChanges} className="bg-[#2B80FF] hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-[14px] font-medium transition-colors shadow-lg shadow-blue-500/20">
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VISTA: CONFIGURACIÓN */}
          {activeTab === 'configuracion' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-10 max-w-xl dark:border dark:border-zinc-800 transition-colors duration-300">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <h2 className="text-xl font-medium dark:text-white">Configuración</h2>
              </div>

              <div className="space-y-2">
                {/* Custom Dropdown Tema */}
                <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-[15px] text-gray-700 dark:text-zinc-300">Tema</span>
                  <div className="relative">
                    <button onClick={() => setIsThemeOpen(!isThemeOpen)} onBlur={() => setTimeout(() => setIsThemeOpen(false), 200)} className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 text-sm rounded-xl px-4 py-2 hover:border-gray-300 dark:hover:border-zinc-600 transition-colors focus:outline-none min-w-32.5">
                      <span>{theme}</span>
                      <svg className={`w-4 h-4 text-gray-400 dark:text-zinc-500 transition-transform duration-300 ${isThemeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className={`absolute top-full right-0 mt-2 w-full min-w-32.5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-xl rounded-xl py-2 z-20 origin-top-right transition-all duration-200 ${isThemeOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                      {['Light', 'Dark'].map((opt) => (
                        <button key={opt} onClick={() => { setTheme(opt); setIsThemeOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${theme === opt ? 'font-medium text-[#2B80FF] bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Custom Dropdown Idioma */}
                <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-[15px] text-gray-700 dark:text-zinc-300">Idioma</span>
                  <div className="relative">
                    <button onClick={() => setIsLanguageOpen(!isLanguageOpen)} onBlur={() => setTimeout(() => setIsLanguageOpen(false), 200)} className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 text-sm rounded-xl px-4 py-2 hover:border-gray-300 dark:hover:border-zinc-600 transition-colors focus:outline-none min-w-32.5">
                      <span>{language}</span>
                      <svg className={`w-4 h-4 text-gray-400 dark:text-zinc-500 transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className={`absolute top-full right-0 mt-2 w-full min-w-32.5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-xl rounded-xl py-2 z-20 origin-top-right transition-all duration-200 ${isLanguageOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                      {['Español', 'Inglés'].map((opt) => (
                        <button key={opt} onClick={() => { setLanguage(opt); setIsLanguageOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === opt ? 'font-medium text-[#2B80FF] bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA: DIRECCIONES */}
          {activeTab === 'direcciones' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-10 dark:border dark:border-zinc-800 transition-colors duration-300">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <h1 className="text-xl font-medium dark:text-white">Direcciones</h1>
                {!showAddressForm && (
                  <button onClick={openNewAddressForm} className="text-sm font-medium text-[#2B80FF] hover:text-blue-700 transition-colors">+ Añadir Nueva</button>
                )}
              </div>

              {showAddressForm ? (
                <form onSubmit={handleSaveAddress} className="space-y-5 max-w-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Título</label>
                    <input type="text" required value={addressFormData.title} onChange={(e) => setAddressFormData({...addressFormData, title: e.target.value})} placeholder="Ej. Casa, Oficina" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-colors" />
                  </div>
                  
                  {!showMap ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Dirección</label>
                      <div className="flex-1 flex gap-3">
                        <input type="text" required value={addressFormData.street_address} onChange={(e) => setAddressFormData({...addressFormData, street_address: e.target.value})} placeholder="Calle Principal y Secundaria" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-colors" />
                        <button type="button" onClick={() => setShowMap(true)} className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shrink-0">📍 Mapa</button>
                      </div>
                    </div>
                  ) : (
                    isLoaded ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Buscar en mapa</label>
                          <button type="button" onClick={() => setShowMap(false)} className="text-xs font-bold text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300">Ocultar mapa</button>
                        </div>
                        <Autocomplete onLoad={(ref) => setAutocompleteRef(ref)} onPlaceChanged={handlePlaceChanged}>
                          <input type="text" required value={addressFormData.street_address} onChange={(e) => setAddressFormData({...addressFormData, street_address: e.target.value})} placeholder="Busca tu dirección..." className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-colors" />
                        </Autocomplete>
                        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-700">
                          <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={15}><Marker position={mapCenter} /></GoogleMap>
                        </div>
                      </div>
                    ) : (<div className="p-4 text-sm text-gray-500 dark:text-zinc-400">Cargando mapa...</div>)
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Ciudad</label>
                    <input type="text" required value={addressFormData.city} onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} placeholder="Ej. Quito" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-colors" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Código Postal</label>
                    <input type="text" value={addressFormData.postal_code} onChange={(e) => setAddressFormData({...addressFormData, postal_code: e.target.value})} placeholder="Opcional" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-colors" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-[#2B80FF] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[14px] font-medium shadow-md shadow-blue-500/20 transition-colors">Guardar</button>
                    <button type="button" onClick={closeAddressForm} className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 px-6 py-2.5 rounded-xl text-[14px] font-medium transition-colors">Cancelar</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <div key={address.id} className="border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl hover:border-gray-200 dark:hover:border-zinc-700 transition-colors group">
                        <h3 className="font-semibold text-[15px] dark:text-white mb-1">{address.title}</h3>
                        <p className="text-[13px] text-gray-500 dark:text-zinc-400 mb-4">{address.street_address}, {address.city}</p>
                        <div className="flex gap-4">
                          <button onClick={() => openEditAddressForm(address)} className="text-[12px] font-medium text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Editar</button>
                          <button onClick={() => handleDeleteAddressClick(address.id)} className="text-[12px] font-medium text-red-300 dark:text-red-400/70 hover:text-red-500 dark:hover:text-red-400 transition-colors">Eliminar</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-gray-400 dark:text-zinc-500 text-sm">No tienes direcciones guardadas.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VISTA: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-10 dark:border dark:border-zinc-800 transition-colors duration-300">
              <h1 className="text-xl font-medium dark:text-white mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">Mis Pedidos</h1>
              {pedidos.length > 0 ? (
                <div className="space-y-4">
                  {pedidos.map((p, idx) => (
                    <div key={idx} className="border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl flex justify-between items-center hover:border-gray-200 dark:hover:border-zinc-700 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1"><span className="font-semibold text-[14px] dark:text-white">{p.id}</span><span className="text-[11px] px-2 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-md font-medium">{p.estado}</span></div>
                        <p className="text-[13px] text-gray-500 dark:text-zinc-400">{p.fecha}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[15px] dark:text-white mb-1">${p.total.toFixed(2)}</p>
                        <button className="text-[12px] text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Detalles</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 dark:text-zinc-500 text-sm">No has realizado pedidos todavía.</div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL ELIMINAR */}
      {addressToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl max-w-sm w-full text-center scale-up-center transition-colors duration-300 border border-transparent dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">¿Eliminar dirección?</h3>
            <p className="text-[14px] text-gray-500 dark:text-zinc-400 mb-8">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setAddressToDelete(null)} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium text-[14px] rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">Cancelar</button>
              <button onClick={confirmDeleteAddress} className="flex-1 py-3 bg-red-500 text-white font-medium text-[14px] rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <MiniFooter />
    </div>
  );
};

export default UserProfile;