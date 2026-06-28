import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import MiniFooter from '../components/MiniFooter';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

// Configuraciones de Google Maps
const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '200px', borderRadius: '0.75rem' };
const defaultCenter = { lat: -0.2103, lng: -78.4889 }; // Centrado en Quito

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('datos');
  const [userData, setUserData] = useState(null);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(true);

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

  // NUEVO: Estado para Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [isLoadingPedidos, setIsLoadingPedidos] = useState(false);

  // NUEVO: Estados para Membresía
  const [isLoadingMembership, setIsLoadingMembership] = useState(false);

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

  // NUEVA FUNCION: Obtener perfil de usuario actualizado en tiempo real
  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setFormData({
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          email: data.user.email || '',
          phone: data.user.phone || ''
        });
      }
    } catch (err) {
      console.error("Error al cargar perfil de usuario fresco:", err);
    }
  };

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
      fetchUserProfile(storedToken); // Sincroniza datos con Postgres
      fetchAddresses(storedToken);
      fetchPedidos(storedToken); // NUEVO: Cargamos los pedidos
    }
  }, [navigate]);

  // NUEVA FUNCION: Llama a la API de tu backend para obtener el historial
  const fetchPedidos = async (token) => {
    try {
      setIsLoadingPedidos(true);
      const res = await fetch('http://localhost:3000/api/usuarios/pedidos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    } finally {
      setIsLoadingPedidos(false);
    }
  };

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

  // La constante "pedidos" falsa fue eliminada.

  if (!userData) return null;

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-[#333] dark:text-zinc-50 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/50 flex flex-col transition-colors duration-300">

      {/* NAVBAR */}
      <Navbar backButton={true} />

      <main className="max-w-275 mx-auto px-6 pt-28 pb-24 grow w-full flex flex-col md:flex-row gap-8">

        {/* SIDEBAR */}
        <aside className={`w-full md:w-80 flex-col gap-6 ${isMobileMenuVisible ? 'flex' : 'hidden md:flex'}`}>
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

            <nav className="flex flex-col gap-1 relative">
              {[
                { id: 'datos', label: 'Datos Personales', icon: <svg className="w-5 h-5 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> },
                { id: 'direcciones', label: 'Direcciones', icon: <svg className="w-5 h-5 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
                { id: 'pedidos', label: 'Mis Pedidos', icon: <svg className="w-5 h-5 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> },
                { id: 'membresia', label: 'Membresía VIP', icon: <svg className="w-5 h-5 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg> },
                { id: 'configuracion', label: 'Configuración', icon: <svg className="w-5 h-5 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'datos') setIsEditing(false);
                      setIsMobileMenuVisible(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 relative ${
                      isActive
                        ? 'text-zinc-900 dark:text-white'
                        : 'text-gray-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {tab.icon}
                    <span className="z-10">{tab.label}</span>
                  </button>
                );
              })}
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
        <div className={`flex-1 ${!isMobileMenuVisible ? 'block' : 'hidden md:block'}`}>
          {/* BOTÓN VOLVER (SÓLO MÓVIL) */}
          <button
            onClick={() => setIsMobileMenuVisible(true)}
            className="md:hidden flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Volver
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
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
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm ${isEditing
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
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm ${isEditing
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm ${isEditing
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Ingrese su número" : "Añadir número"}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm ${isEditing
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
                    <input type="text" required value={addressFormData.title} onChange={(e) => setAddressFormData({ ...addressFormData, title: e.target.value })} placeholder="Ej. Casa, Oficina" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-300" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                    <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300 pt-3">Dirección</label>
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        {isLoaded ? (
                          <Autocomplete onLoad={(ref) => setAutocompleteRef(ref)} onPlaceChanged={handlePlaceChanged} className="flex-1">
                            <input
                              type="text"
                              required
                              value={addressFormData.street_address}
                              onChange={(e) => setAddressFormData({ ...addressFormData, street_address: e.target.value })}
                              placeholder="Calle Principal y Secundaria o busca tu dirección..."
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-300"
                            />
                          </Autocomplete>
                        ) : (
                          <input
                            type="text"
                            required
                            value={addressFormData.street_address}
                            onChange={(e) => setAddressFormData({ ...addressFormData, street_address: e.target.value })}
                            placeholder="Calle Principal y Secundaria"
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-300"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setShowMap(!showMap)}
                          className={`w-full sm:w-auto px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 text-center cursor-pointer ${
                            showMap
                              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          📍 {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showMap && isLoaded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden w-full"
                          >
                            <div className="pt-2">
                              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-700">
                                <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={15}>
                                  <Marker position={mapCenter} />
                                </GoogleMap>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Ciudad</label>
                    <input type="text" required value={addressFormData.city} onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })} placeholder="Ej. Quito" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-300" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="w-48 text-sm font-semibold text-gray-700 dark:text-zinc-300">Código Postal</label>
                    <input type="text" value={addressFormData.postal_code} onChange={(e) => setAddressFormData({ ...addressFormData, postal_code: e.target.value })} placeholder="Opcional" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 shadow-sm placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-300" />
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
                      <div key={address.id} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <h3 className="font-semibold text-[15px] dark:text-white mb-1">{address.title}</h3>
                        <p className="text-[13px] text-gray-500 dark:text-zinc-400 mb-4">{address.street_address}, {address.city}</p>
                        <div className="flex gap-4">
                          <button onClick={() => openEditAddressForm(address)} className="text-[12px] font-medium text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Editar</button>
                          <button onClick={() => handleDeleteAddressClick(address.id)} className="text-[12px] font-medium text-red-300 dark:text-red-400/70 hover:text-red-500 dark:hover:text-red-400 transition-colors">Eliminar</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 transition-colors duration-300">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800/80 rounded-full flex items-center justify-center text-gray-400 dark:text-zinc-500 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Sin direcciones</h3>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-64">Aún no tienes direcciones registradas. Agrega una para agilizar tus compras.</p>
                      </div>
                      <button type="button" onClick={openNewAddressForm} className="mt-2 text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-transform cursor-pointer">
                        Añadir Dirección
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VISTA: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-10 dark:border dark:border-zinc-800 transition-colors duration-300">
              <h1 className="text-xl font-medium dark:text-white mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">Mis Pedidos</h1>

              {isLoadingPedidos ? (
                <div className="space-y-4 animate-pulse">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-4 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-1/3"></div>
                          <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800/80 rounded-md"></div>
                        </div>
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/2 mb-4"></div>
                        <div className="flex gap-2 mt-3">
                          <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800/80 rounded-lg"></div>
                          <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800/80 rounded-lg"></div>
                          <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800/80 rounded-lg"></div>
                        </div>
                      </div>
                      <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                        <div className="h-5 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-20 mb-2"></div>
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pedidos.length > 0 ? (
                <div className="space-y-4">
                  {pedidos.map((p) => {
                    // Calculamos la cantidad total de artículos en el pedido
                    const totalArticulos = p.items ? p.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

                    // Formateamos la fecha a un formato legible
                    const fechaFormateada = new Date(p.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    });

                    // Colores del estado
                    const estadoColor = p.status === 'PAGADO' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                      : p.status === 'ENVIADO' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
                        : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400';

                    return (
                      <div key={p.id} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-[15px] dark:text-white">Orden #{p.id}</span>
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-bold tracking-wider ${estadoColor}`}>
                              {p.status}
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-500 dark:text-zinc-400 mb-1">
                            {fechaFormateada} • {totalArticulos} {totalArticulos === 1 ? 'artículo' : 'artículos'}
                          </p>
                          {/* Miniatura de los productos (Opcional, muy visual) */}
                          {p.items && p.items.length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-hidden">
                              {p.items.slice(0, 4).map((item, i) => (
                                <img key={i} src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700" title={`${item.name} (x${item.quantity})`} />
                              ))}
                              {p.items.length > 4 && (
                                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-zinc-400">
                                  +{p.items.length - 4}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                          <p className="font-bold text-[18px] text-gray-900 dark:text-white mb-2">${parseFloat(p.total_amount).toFixed(2)}</p>
                          <span className="text-[12px] font-medium text-gray-400 dark:text-zinc-500">ID Pago: {p.stripe_session_id ? p.stripe_session_id.substring(0, 15) + '...' : 'N/A'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 transition-colors duration-300">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800/80 rounded-full flex items-center justify-center text-gray-400 dark:text-zinc-500 shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Sin historial de pedidos</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-64">Aquí aparecerán tus compras. Explora nuestro catálogo y empieza a armar tu look.</p>
                  </div>
                  <Link to="/shop" className="mt-2 text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-transform inline-block">
                    Ir a la tienda
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* VISTA: MEMBRESÍA VIP */}
          {activeTab === 'membresia' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-10 dark:border dark:border-zinc-800 transition-colors duration-300">
              <h1 className="text-xl font-medium dark:text-white mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">Membresía VIP</h1>

              {userData.is_vip ? (
                /* USUARIO ES VIP - TARJETA PREMIUM */
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-yellow-600/5 to-transparent dark:from-amber-500/10 dark:via-zinc-900 dark:to-zinc-900 border border-amber-500/20 dark:border-amber-500/30 rounded-3xl p-8 max-w-2xl">
                  {/* Decoración premium sutil */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">Miembro Distinguido</span>
                        <h2 className="text-2xl font-bold dark:text-white mt-0.5">Club VIP Activo</h2>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                      Estado: ACTIVA
                    </span>
                  </div>

                  <p className="text-[14px] text-gray-600 dark:text-zinc-300 mb-8 leading-relaxed">
                    ¡Felicidades, <strong>{userData.first_name}</strong>! Eres parte del exclusivo grupo VIP de Intipa Churin. Tus privilegios están activos y listos para ser disfrutados.
                  </p>

                  <div className="space-y-4 border-t border-zinc-200/50 dark:border-zinc-800/80 pt-6">
                    <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-3">Tus Beneficios VIP Activos:</h3>
                    {[
                      { title: "15% de Descuento Automático", desc: "Aplicado de forma automática en todas tus compras al hacer checkout." },
                      { title: "Envíos Gratis Sin Mínimos", desc: "No te preocupes por el costo de entrega, todos tus envíos van por nuestra cuenta." },
                      { title: "Acceso Anticipado Exclusivo", desc: "Accede a nuestros nuevos lanzamientos y drops de edición limitada antes que nadie." }
                    ].map((ben, i) => (
                      <div key={i} className="flex gap-3">
                        <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-800 dark:text-zinc-200">{ben.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{ben.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* USUARIO NO ES VIP - PROMO GLASSMORPHISM */
                <div className="relative overflow-hidden bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 sm:p-10 max-w-2xl transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  {/* Efecto decorativo de esfera difusa */}
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h2 className="text-2xl font-bold dark:text-white">Únete al Club VIP</h2>
                      <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">Lleva tu experiencia urbana a otro nivel.</p>
                    </div>
                    <div className="text-left md:text-right shrink-0">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">$5.00</span>
                      <span className="text-gray-500 dark:text-zinc-400 text-xs font-semibold block mt-0.5">Facturado mensualmente</span>
                    </div>
                  </div>

                  <div className="space-y-5 mb-8">
                    {[
                      { title: "15% de Descuento en la Tienda", desc: "Ahorra en cada prenda. El descuento se aplica directo al total en Stripe." },
                      { title: "Envíos Gratis Sin Monto Mínimo", desc: "Pide lo que quieras, cuando quieras. Envío totalmente gratuito." },
                      { title: "Acceso Anticipado", desc: "Asegura tus prendas en ediciones limitadas y lanzamientos especiales." }
                    ].map((ben, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{ben.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{ben.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        setIsLoadingMembership(true);
                        const token = localStorage.getItem('token');
                        const res = await fetch('http://localhost:3000/api/checkout-membership', {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ user_id: userData.id })
                        });
                        const data = await res.json();
                        if (res.ok && data.url) {
                          window.location.href = data.url;
                        } else {
                          toast.error(data.error || "No se pudo generar la sesión de pago.");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Error al procesar la membresía.");
                      } finally {
                        setIsLoadingMembership(false);
                      }
                    }}
                    disabled={isLoadingMembership}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-4 rounded-2xl text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoadingMembership ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      "Adquirir Membresía VIP"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
            </motion.div>
          </AnimatePresence>
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