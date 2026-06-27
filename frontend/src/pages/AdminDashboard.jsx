import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast'; // Importado para alertas de validación
import {
  Search,
  Package,
  Grid,
  Users,
  LogOut,
  Edit,
  Trash2,
  Eye,
  Power,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Store,
  Truck,
  DollarSign,
  ShoppingCart,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import Cropper from 'react-easy-crop';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas vacío"));
      const file = new File([blob], "imagen_recortada.jpg", { type: "image/jpeg" });
      resolve({ file, url: URL.createObjectURL(blob) });
    }, "image/jpeg", 0.95);
  });
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { theme, setTheme } = useContext(ThemeContext);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Control de Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Formularios completos (Agregamos image_file, sizes y color)
  const estadoInicialProducto = { name: '', description: '', price: '', original_price: '', stock_quantity: '', category_id: '', sizes: [], color: '', image_file: null, image_file_2: null, image_file_3: null, image_file_4: null, image_file_5: null, remove_image_2: false, remove_image_3: false, remove_image_4: false, remove_image_5: false, is_active: true };
  const [productForm, setProductForm] = useState(estadoInicialProducto);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  // --- CONTROL DEL RECORTADOR DE IMÁGENES ---
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const procesarRecorte = async () => {
    try {
      const { file, url } = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setProductForm({ ...productForm, image_file: file, image_url: url });
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
    }
  };

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    cargarDatos();
  }, [navigate, token]);

  const cargarDatos = async () => {
    setIsLoading(true);
    await Promise.all([cargarProductos(), cargarCategorias(), cargarUsuarios(), cargarPedidos()]);
    setIsLoading(false);
  };

  const cargarProductos = async () => {
    const res = await fetch('http://localhost:3000/api/products');
    if (res.ok) setProductos(await res.json());
  };

  const cargarCategorias = async () => {
    const res = await fetch('http://localhost:3000/api/categories');
    if (res.ok) setCategorias(await res.json());
  };

  const cargarUsuarios = async () => {
    const res = await fetch('http://localhost:3000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setUsuarios(await res.json());
  };

  const cargarPedidos = async () => {
    const res = await fetch('http://localhost:3000/api/admin/pedidos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setPedidos(await res.json());
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/pedidos/${orderId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success("Estado de la orden actualizado.");
        cargarPedidos();
      } else {
        toast.error("Error al actualizar la orden.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- LÓGICA CRUD PRODUCTOS ---

  // 1. Crear (Ahora enviamos FormData en lugar de JSON)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const priceVal = parseFloat(productForm.price);
    const originalPriceVal = productForm.original_price ? parseFloat(productForm.original_price) : '';
    const stockVal = parseInt(productForm.stock_quantity);

    if (isNaN(priceVal) || priceVal < 0) {
      toast.error("El precio no puede ser negativo ni estar vacío.");
      return;
    }
    if (isNaN(stockVal) || stockVal < 0) {
      toast.error("El stock no puede ser negativo ni estar vacío.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', priceVal);
      if (originalPriceVal) formData.append('original_price', originalPriceVal);
      formData.append('stock_quantity', stockVal);
      formData.append('category_id', parseInt(productForm.category_id));
      formData.append('sizes', JSON.stringify(productForm.sizes || []));
      formData.append('color', productForm.color || '');
      if (productForm.image_file) {
        formData.append('image', productForm.image_file);
      }
      if (productForm.image_file_2) formData.append('image_2', productForm.image_file_2);
      if (productForm.image_file_3) formData.append('image_3', productForm.image_file_3);
      if (productForm.image_file_4) formData.append('image_4', productForm.image_file_4);
      if (productForm.image_file_5) formData.append('image_5', productForm.image_file_5);

      const response = await fetch('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // Quitamos Content-Type
        body: formData
      });

      if (response.ok) {
        setIsProductModalOpen(false);
        setProductForm(estadoInicialProducto);
        cargarProductos();
      }
    } catch (error) { console.error(error); }
  };

  // 2. Preparar Edición
  const handleEditClick = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      original_price: p.original_price || '',
      stock_quantity: p.stock_quantity,
      category_id: p.category_id || '',
      sizes: p.sizes || [],
      color: p.color || '',
      image_url: p.image_url,
      image_url_2: p.image_url_2,
      image_url_3: p.image_url_3,
      image_url_4: p.image_url_4,
      image_url_5: p.image_url_5,
      image_file: null, // Reseteamos por si quiere subir una foto nueva
      image_file_2: null,
      image_file_3: null,
      image_file_4: null,
      image_file_5: null,
      remove_image_2: false,
      remove_image_3: false,
      remove_image_4: false,
      remove_image_5: false,
      is_active: p.is_active
    });
    setIsEditProductModalOpen(true);
  };

  // 3. Enviar Edición (FormData)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const priceVal = parseFloat(productForm.price);
    const originalPriceVal = productForm.original_price ? parseFloat(productForm.original_price) : '';
    const stockVal = parseInt(productForm.stock_quantity);

    if (isNaN(priceVal) || priceVal < 0) {
      toast.error("El precio no puede ser negativo ni estar vacío.");
      return;
    }
    if (isNaN(stockVal) || stockVal < 0) {
      toast.error("El stock no puede ser negativo ni estar vacío.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', priceVal);
      if (originalPriceVal) formData.append('original_price', originalPriceVal);
      formData.append('stock_quantity', stockVal);
      formData.append('category_id', parseInt(productForm.category_id));
      formData.append('sizes', JSON.stringify(productForm.sizes || []));
      formData.append('color', productForm.color || '');
      if (productForm.image_file) {
        formData.append('image', productForm.image_file);
      }
      if (productForm.image_file_2) formData.append('image_2', productForm.image_file_2);
      if (productForm.image_file_3) formData.append('image_3', productForm.image_file_3);
      if (productForm.image_file_4) formData.append('image_4', productForm.image_file_4);
      if (productForm.image_file_5) formData.append('image_5', productForm.image_file_5);
      if (productForm.remove_image_2) formData.append('remove_image_2', 'true');
      if (productForm.remove_image_3) formData.append('remove_image_3', 'true');
      if (productForm.remove_image_4) formData.append('remove_image_4', 'true');
      if (productForm.remove_image_5) formData.append('remove_image_5', 'true');

      const response = await fetch(`http://localhost:3000/api/admin/products/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setIsEditProductModalOpen(false);
        setProductForm(estadoInicialProducto);
        setEditingProductId(null);
        cargarProductos();
      }
    } catch (error) { console.error(error); }
  };

  // 4. Activar/Desactivar (Stock)
  const handleToggleActive = (p) => {
    if (p.is_active) {
      setConfirmAction({ type: 'deactivate', product: p });
    } else {
      executeToggleActive(p.id, p.is_active);
    }
  };

  const executeToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (response.ok) cargarProductos();
      setConfirmAction(null);
    } catch (error) { console.error(error); }
  };

  // 5. Eliminar
  const handleDeleteProduct = (p) => {
    setConfirmAction({ type: 'delete', product: p });
  };

  const executeDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) cargarProductos();
      setConfirmAction(null);
    } catch (error) { console.error(error); }
  };

  // --- LÓGICA CATEGORÍAS ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(categoryForm)
      });
      if (response.ok) {
        setIsCategoryModalOpen(false);
        setCategoryForm({ name: '', description: '' });
        cargarCategorias();
      }
    } catch (error) { console.error(error); }
  };

  const totalIngresos = pedidos.reduce((acc, p) => acc + parseFloat(p.total_amount || 0), 0);
  const pedidosPendientes = pedidos.filter(p => p.status === 'PAGADO').length;
  const totalClientes = usuarios.length;
  const totalProductos = productos.length;

  const filteredProductos = productos.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredCategorias = categorias.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredUsuarios = usuarios.filter(u => u.first_name.toLowerCase().includes(search.toLowerCase()) || u.last_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const filteredPedidos = pedidos.filter(p => p.id.toString().includes(search) || p.first_name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300">

      {/* Sidebar Minimalista y Overlay para Móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen ${isSidebarOpen ? 'translate-x-0 w-64 border-r border-zinc-200 dark:border-zinc-800' : '-translate-x-full w-64 md:translate-x-0 md:w-0 border-r border-transparent'} bg-white dark:bg-zinc-900 flex flex-col shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-2xl md:shadow-none`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0 w-64">
          <span className="text-lg font-bold tracking-widest uppercase dark:text-white leading-none">Intipa Churin</span>
          <button onClick={() => setIsSidebarOpen(false)} className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors" title="Cerrar barra lateral">
            <PanelLeftClose size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto w-64 shrink-0">
          <div
            onClick={() => setActiveTab('productos')}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-colors duration-300 z-10 ${activeTab === 'productos' ? 'text-zinc-950 dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}`}
          >
            {activeTab === 'productos' && (
              <motion.div
                layoutId="activeAdminTabBackground"
                className="absolute inset-0 bg-zinc-100 dark:bg-white rounded-xl -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Package size={18} /> Gestión de Productos
          </div>
          <div
            onClick={() => setActiveTab('categorias')}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-colors duration-300 z-10 ${activeTab === 'categorias' ? 'text-zinc-950 dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}`}
          >
            {activeTab === 'categorias' && (
              <motion.div
                layoutId="activeAdminTabBackground"
                className="absolute inset-0 bg-zinc-100 dark:bg-white rounded-xl -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Grid size={18} /> Gestión de Categorías
          </div>
          <div
            onClick={() => setActiveTab('usuarios')}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-colors duration-300 z-10 ${activeTab === 'usuarios' ? 'text-zinc-950 dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}`}
          >
            {activeTab === 'usuarios' && (
              <motion.div
                layoutId="activeAdminTabBackground"
                className="absolute inset-0 bg-zinc-100 dark:bg-white rounded-xl -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Users size={18} /> Cuentas Registradas
          </div>
          <div
            onClick={() => setActiveTab('pedidos')}
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-colors duration-300 z-10 ${activeTab === 'pedidos' ? 'text-zinc-950 dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}`}
          >
            {activeTab === 'pedidos' && (
              <motion.div
                layoutId="activeAdminTabBackground"
                className="absolute inset-0 bg-zinc-100 dark:bg-white rounded-xl -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Truck size={18} /> Gestión de Pedidos
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 w-64 shrink-0 space-y-1">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 px-4 py-3 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-semibold text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <Store size={18} /> Ir a la Tienda
          </Link>
          <div
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="flex items-center justify-center gap-3 px-4 py-3 text-red-500 font-semibold text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={18} /> Cerrar Sesión
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <header className="py-4 md:h-20 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 gap-4 shrink-0 transition-all duration-300">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-4">
              {!isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors" title="Abrir barra lateral">
                  <PanelLeftOpen size={24} />
                </button>
              )}
              <h1 className="text-xl md:text-2xl font-bold dark:text-white truncate">
                {activeTab === 'productos' && 'Productos'}
                {activeTab === 'categorias' && 'Categorías'}
                {activeTab === 'usuarios' && 'Usuarios'}
                {activeTab === 'pedidos' && 'Gestión de Pedidos'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}
              className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm hover:scale-105"
              title="Cambiar tema"
            >
              {theme === 'Dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-full shadow-sm w-full md:w-64">
              <Search size={16} className="text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none outline-none ml-2 text-sm w-full dark:text-white placeholder-zinc-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-4 md:pt-0">
          
          {/* Tarjetas de Métricas de Negocio (Analytics Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 mt-4">
            {/* Card 1: Ingresos Totales */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Ingresos Totales</span>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                  ${totalIngresos.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-emerald-500 dark:text-emerald-400 font-semibold mt-1">✓ Transacciones procesadas</span>
              </div>
            </motion.div>

            {/* Card 2: Pedidos Pendientes */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Pedidos Pendientes</span>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{pedidosPendientes}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-1">Por gestionar logística</span>
              </div>
            </motion.div>

            {/* Card 3: Clientes Registrados */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Clientes</span>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <Users size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{totalClientes}</span>
                <span className="text-xs text-blue-500 dark:text-blue-400 font-semibold mt-1">Cuentas registradas</span>
              </div>
            </motion.div>

            {/* Card 4: Catálogo de Productos */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[13px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Productos</span>
                <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
                  <Package size={20} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{totalProductos}</span>
                <span className="text-xs text-purple-500 dark:text-purple-400 font-semibold mt-1">Prendas en catálogo</span>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
            <button className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Descargar Reporte
            </button>
            {activeTab === 'productos' && (
              <button onClick={() => { setProductForm(estadoInicialProducto); setIsProductModalOpen(true); }} className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
                <span>+</span> Nuevo Producto
              </button>
            )}
            {activeTab === 'categorias' && (
              <button onClick={() => setIsCategoryModalOpen(true)} className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
                <span>+</span> Nueva Categoría
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="w-full">
                {/* Skeleton Header de tabla */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 py-4 px-6 flex justify-between animate-pulse">
                  <div className="h-3 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-1/6"></div>
                  <div className="h-3 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-1/4"></div>
                  <div className="h-3 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-1/6"></div>
                </div>
                {/* Skeleton Filas */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 px-6 animate-pulse">
                      <div className="flex items-center gap-4 w-1/2">
                        <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800/80 shrink-0"></div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="h-3.5 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-3/4"></div>
                          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/3"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-4 w-1/2">
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/4"></div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800/80"></div>
                          <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800/80"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full text-left">

                  {/* === PRODUCTOS === */}
                  {activeTab === 'productos' && (
                    <>
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr className="w-full">
                          <th className="w-[5%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nº</th>
                          <th className="w-[45%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nombre del Producto</th>
                          <th className="w-[20%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Categoría</th>
                          <th className="w-[20%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Stock / Precio</th>
                          <th className="min-w-[180px] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                        {filteredProductos.length === 0 ? (
                          <tr><td colSpan="5" className="py-16 text-center text-zinc-500 text-sm">No hay productos registrados.</td></tr>
                        ) : (
                          filteredProductos.map((p, index) => (
                            <tr key={p.id} className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors ${!p.is_active ? 'opacity-60 grayscale-[50%]' : ''}`}>
                              <td className="py-4 px-6 text-sm text-zinc-500 dark:text-zinc-400">{index + 1}</td>
                              <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white truncate">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                                    <img src={p.image_url || `https://placehold.co/100x100/f5f5f4/d6d3d1?text=FOTO`} alt={p.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="truncate">{p.name}</span>
                                    {!p.is_active && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider w-fit mt-1">Agotado</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-400 truncate">
                                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-medium">{p.category_name || 'Sin Categoría'}</span>
                              </td>
                              <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-400">
                                <div className="flex flex-col">
                                  <span>{p.stock_quantity} unds.</span>
                                  <span className="font-bold text-zinc-900 dark:text-white">${parseFloat(p.price).toFixed(2)}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex justify-center items-center gap-3">
                                  <button onClick={() => setPreviewProduct(p)} title="Previsualizar en Tienda">
                                    <Eye size={18} className="cursor-pointer text-zinc-400 hover:text-blue-500 transition-colors" />
                                  </button>
                                  <button onClick={() => handleEditClick(p)} title="Editar Producto">
                                    <Edit size={18} className="cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" />
                                  </button>
                                  <button onClick={() => handleToggleActive(p)} title={p.is_active ? "Marcar Agotado / Desactivar" : "Activar Publicación"}>
                                    <Power size={18} className={`cursor-pointer transition-colors ${p.is_active ? 'text-green-500 hover:text-green-600' : 'text-zinc-400 hover:text-zinc-300'}`} />
                                  </button>
                                  <button onClick={() => handleDeleteProduct(p)} title="Eliminar Definitivamente">
                                    <Trash2 size={18} className="cursor-pointer text-zinc-400 hover:text-red-500 transition-colors" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}

                  {/* === CATEGORÍAS === */}
                  {activeTab === 'categorias' && (
                    <>
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr className="w-full">
                          <th className="w-[5%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nº</th>
                          <th className="w-[30%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Categoría</th>
                          <th className="w-[45%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Descripción</th>
                          <th className="w-[20%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                        {filteredCategorias.length === 0 ? (
                          <tr><td colSpan="4" className="py-16 text-center text-zinc-500 text-sm">No hay categorías registradas.</td></tr>
                        ) : (
                          filteredCategorias.map((c, index) => {
                            const isProtected = ['hoodies', 'camisetas', 'pantalones'].includes(c.name.toLowerCase());
                            return (
                              <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="py-4 px-6 text-sm text-zinc-500 dark:text-zinc-400">{index + 1}</td>
                                <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white truncate flex items-center gap-2">
                                  {c.name}
                                  {isProtected && (
                                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Por defecto</span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-400 truncate">{c.description || <span className="text-zinc-300 dark:text-zinc-600 italic">Sin descripción</span>}</td>
                                <td className="py-4 px-6">
                                  <div className="flex justify-center items-center gap-3">
                                    <Edit size={18} className="cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Editar" />
                                    {isProtected ? (
                                      <div className="w-[18px] flex justify-center text-zinc-300 dark:text-zinc-700 cursor-not-allowed" title="Categoría protegida">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                      </div>
                                    ) : (
                                      <Trash2 size={18} className="cursor-pointer text-zinc-400 hover:text-red-500 transition-colors" title="Eliminar" />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </>
                  )}

                  {/* === USUARIOS === */}
                  {activeTab === 'usuarios' && (
                    <>
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr className="w-full">
                          <th className="w-[5%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nº</th>
                          <th className="w-[25%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nombre del Cliente</th>
                          <th className="w-[35%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Correo Electrónico</th>
                          <th className="w-[20%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Fecha de Registro</th>
                          <th className="w-[15%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                        {filteredUsuarios.length === 0 ? (
                          <tr><td colSpan="5" className="py-16 text-center text-zinc-500 text-sm">No hay clientes registrados.</td></tr>
                        ) : (
                          filteredUsuarios.map((u, index) => (
                            <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                              <td className="py-4 px-6 text-sm text-zinc-500 dark:text-zinc-400">{index + 1}</td>
                              <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white truncate">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold uppercase shrink-0 text-zinc-600 dark:text-zinc-300">
                                    {u.first_name[0]}{u.last_name[0]}
                                  </div>
                                  <span className="truncate">{u.first_name} {u.last_name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-400 truncate">{u.email}</td>
                              <td className="py-4 px-6 text-sm text-zinc-500 dark:text-zinc-500 truncate">{new Date(u.created_at).toLocaleDateString('es-EC')}</td>
                              <td className="py-4 px-6 text-center">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">Activo</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}

                  {/* === PEDIDOS === */}
                  {activeTab === 'pedidos' && (
                    <>
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr className="w-full">
                          <th className="w-[10%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Orden</th>
                          <th className="w-[30%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Cliente</th>
                          <th className="w-[20%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Fecha</th>
                          <th className="w-[15%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Total</th>
                          <th className="w-[25%] py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Gestión Logística</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                        {filteredPedidos.length === 0 ? (
                          <tr><td colSpan="5" className="py-16 text-center text-zinc-500 text-sm">No hay pedidos registrados en el sistema.</td></tr>
                        ) : (
                          filteredPedidos.map((p) => (
                            <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                              <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">#{p.id}</td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{p.first_name} {p.last_name}</span>
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{p.email}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-400">
                                {new Date(p.created_at).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </td>
                              <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                                ${parseFloat(p.total_amount).toFixed(2)}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <select
                                  value={p.status}
                                  onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full outline-none cursor-pointer transition-colors border shadow-sm ${
                                    p.status === 'PAGADO' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20' :
                                    p.status === 'ENVIADO' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20' :
                                    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
                                  }`}
                                >
                                  <option value="PAGADO" className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white">PAGADO (Pendiente)</option>
                                  <option value="ENVIADO" className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white">ENVIADO (En tránsito)</option>
                                  <option value="ENTREGADO" className="bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white">ENTREGADO (Finalizado)</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            )}

            {/* Paginador */}
            {!isLoading && (
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                <button className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors">Anterior</button>
                <div className="flex gap-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-sm font-bold shadow-sm">1</span>
                </div>
                <button className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors">Siguiente</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- SLIDE-OVER DRAWER: CREAR PRODUCTO --- */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsProductModalOpen(false)}
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.55 }}
              className="relative w-full max-w-xl md:max-w-2xl bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col z-10 border-l border-zinc-200 dark:border-zinc-800 rounded-l-3xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold dark:text-white">Nuevo Producto</h2>
                <button onClick={() => setIsProductModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <LogOut size={22} className="rotate-45" />
                </button>
              </div>
              <div className="overflow-y-auto p-8 flex-1">
                <form id="create-product-form" onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Nombre del Producto</label>
                      <input required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Categoría</label>
                      <select required value={productForm.category_id} onChange={e => setProductForm({ ...productForm, category_id: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10">
                        <option value="">Selecciona una categoría...</option>
                        {categorias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Precio ($)</label>
                      <input type="number" step="0.01" min="0" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value.replace(/^0+(?=\d)/, '') })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Precio Anterior (Opcional $)</label>
                      <input type="number" step="0.01" min="0" value={productForm.original_price || ''} onChange={e => setProductForm({ ...productForm, original_price: e.target.value.replace(/^0+(?=\d)/, '') })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Stock Total</label>
                      <input type="number" min="0" required value={productForm.stock_quantity} onChange={e => setProductForm({ ...productForm, stock_quantity: e.target.value.replace(/^0+(?=\d)/, '') })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Color</label>
                      <select required value={productForm.color || ''} onChange={e => setProductForm({ ...productForm, color: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10">
                        <option value="">Selecciona un color...</option>
                        <option value="Black">Negro (Black)</option>
                        <option value="White">Blanco (White)</option>
                        <option value="Dark Gray">Gris Oscuro (Dark Gray)</option>
                        <option value="Light Gray">Gris Claro (Light Gray)</option>
                        <option value="Beige">Beige</option>
                        <option value="Navy">Azul Marino (Navy)</option>
                        <option value="Blue">Azul (Blue)</option>
                        <option value="Red">Rojo (Red)</option>
                        <option value="Burgundy">Vino (Burgundy)</option>
                        <option value="Green">Verde (Green)</option>
                        <option value="Olive">Verde Oliva (Olive)</option>
                        <option value="Yellow">Amarillo (Yellow)</option>
                        <option value="Pink">Rosa (Pink)</option>
                        <option value="Purple">Morado (Purple)</option>
                        <option value="Brown">Marrón (Brown)</option>
                        <option value="Orange">Naranja (Orange)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Tallas Disponibles</label>
                      <div className="flex gap-4 pt-2">
                        {['S', 'M', 'L', 'XL'].map(talla => (
                          <label key={talla} className="flex items-center gap-2 cursor-pointer dark:text-white text-sm font-bold">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 accent-zinc-900 dark:accent-white cursor-pointer"
                              checked={(productForm.sizes || []).includes(talla)} 
                              onChange={() => {
                                const currentSizes = productForm.sizes || [];
                                setProductForm({ 
                                  ...productForm, 
                                  sizes: currentSizes.includes(talla) ? currentSizes.filter(s => s !== talla) : [...currentSizes, talla] 
                                });
                              }}
                            />
                            {talla}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Imagen del Producto (Recorte Interactivo)</label>
                    {imageToCrop ? (
                      <div className="space-y-3">
                        <div className="relative w-full h-64 bg-zinc-900 rounded-xl overflow-hidden">
                          <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={3 / 4} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} objectFit="contain" />
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setImageToCrop(null)} className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-2 rounded-lg text-sm font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">Cancelar</button>
                          <button type="button" onClick={procesarRecorte} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Aplicar Recorte</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {productForm.image_url && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                            <img src={productForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none dark:text-white transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Imágenes Secundarias (Opcionales, 4 máx)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[2, 3, 4, 5].map(num => (
                        <div key={num} className="flex flex-col gap-2">
                          <div className="w-full aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden relative group">
                            {productForm[`image_file_${num}`] ? (
                              <>
                                <img src={URL.createObjectURL(productForm[`image_file_${num}`])} className="w-full h-full object-cover" alt={`Secundaria ${num}`} />
                                <button type="button" onClick={() => setProductForm({ ...productForm, [`image_file_${num}`]: null })} className="absolute top-2 right-2 bg-white/80 dark:bg-zinc-900/80 text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors shadow-sm">✕</button>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center relative hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                                <span className="text-3xl text-zinc-300 dark:text-zinc-600 mb-2">+</span>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">Foto {num}</span>
                                <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setProductForm({ ...productForm, [`image_file_${num}`]: e.target.files[0] }); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Descripción</label>
                    <textarea rows="3" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm resize-none focus:ring-4 focus:ring-zinc-500/10"></textarea>
                  </div>
                </form>
              </div>
              <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 shrink-0 bg-zinc-50 dark:bg-zinc-900/50 flex gap-4">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3.5 rounded-xl font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm">Cancelar</button>
                <button type="submit" form="create-product-form" className="flex-1 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 py-3.5 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm text-sm">Crear Producto</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SLIDE-OVER DRAWER: EDITAR PRODUCTO --- */}
      <AnimatePresence>
        {isEditProductModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsEditProductModalOpen(false)}
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.55 }}
              className="relative w-full max-w-xl md:max-w-2xl bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col z-10 border-l border-zinc-200 dark:border-zinc-800 rounded-l-3xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold dark:text-white">Editar Producto</h2>
                <button onClick={() => setIsEditProductModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <LogOut size={22} className="rotate-45" />
                </button>
              </div>
              <div className="overflow-y-auto p-8 flex-1">
                <form id="edit-product-form" onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Nombre del Producto</label>
                      <input required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Categoría</label>
                      <input readOnly value={categorias.find(c => c.id === productForm.category_id)?.name || 'Sin Categoría'} className="w-full p-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none dark:text-zinc-400 transition-all text-sm cursor-not-allowed font-medium" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Precio ($)</label>
                      <input type="number" step="0.01" min="0" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value.replace(/^0+(?=\d)/, '') })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Precio Anterior (Opcional $)</label>
                      <input type="number" step="0.01" min="0" value={productForm.original_price || ''} onChange={e => setProductForm({ ...productForm, original_price: e.target.value.replace(/^0+(?=\d)/, '') })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Stock Total</label>
                      <input type="number" min="0" required value={productForm.stock_quantity} onChange={e => setProductForm({ ...productForm, stock_quantity: e.target.value.replace(/^0+(?=\d)/, '') })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Color</label>
                      <select required value={productForm.color || ''} onChange={e => setProductForm({ ...productForm, color: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm focus:ring-4 focus:ring-zinc-500/10">
                        <option value="">Selecciona un color...</option>
                        <option value="Black">Negro (Black)</option>
                        <option value="White">Blanco (White)</option>
                        <option value="Dark Gray">Gris Oscuro (Dark Gray)</option>
                        <option value="Light Gray">Gris Claro (Light Gray)</option>
                        <option value="Beige">Beige</option>
                        <option value="Navy">Azul Marino (Navy)</option>
                        <option value="Blue">Azul (Blue)</option>
                        <option value="Red">Rojo (Red)</option>
                        <option value="Burgundy">Vino (Burgundy)</option>
                        <option value="Green">Verde (Green)</option>
                        <option value="Olive">Verde Oliva (Olive)</option>
                        <option value="Yellow">Amarillo (Yellow)</option>
                        <option value="Pink">Rosa (Pink)</option>
                        <option value="Purple">Morado (Purple)</option>
                        <option value="Brown">Marrón (Brown)</option>
                        <option value="Orange">Naranja (Orange)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Tallas Disponibles</label>
                      <div className="flex gap-4 pt-2">
                        {['S', 'M', 'L', 'XL'].map(talla => (
                          <label key={talla} className="flex items-center gap-2 cursor-pointer dark:text-white text-sm font-bold">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 accent-zinc-900 dark:accent-white cursor-pointer"
                              checked={(productForm.sizes || []).includes(talla)} 
                              onChange={() => {
                                const currentSizes = productForm.sizes || [];
                                setProductForm({ 
                                  ...productForm, 
                                  sizes: currentSizes.includes(talla) ? currentSizes.filter(s => s !== talla) : [...currentSizes, talla] 
                                });
                              }}
                            />
                            {talla}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Imagen Actual y Actualización (Opcional)</label>
                    {imageToCrop ? (
                      <div className="space-y-3">
                        <div className="relative w-full h-64 bg-zinc-900 rounded-xl overflow-hidden">
                          <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={3 / 4} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} objectFit="contain" />
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setImageToCrop(null)} className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-2 rounded-lg text-sm font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">Cancelar</button>
                          <button type="button" onClick={procesarRecorte} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Aplicar Recorte</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                          <img src={productForm.image_url || `https://placehold.co/100x100/f5f5f4/d6d3d1?text=FOTO`} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none dark:text-white transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Imágenes Secundarias (Opcionales, 4 máx)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[2, 3, 4, 5].map(num => (
                        <div key={num} className="flex flex-col gap-2">
                          <div className="w-full aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden relative group">
                            {(productForm[`image_url_${num}`] && !productForm[`remove_image_${num}`]) || productForm[`image_file_${num}`] ? (
                              <>
                                <img src={productForm[`image_file_${num}`] ? URL.createObjectURL(productForm[`image_file_${num}`]) : productForm[`image_url_${num}`]} className="w-full h-full object-cover" alt={`Secundaria ${num}`} />
                                <button type="button" onClick={() => setProductForm({ ...productForm, [`image_file_${num}`]: null, [`remove_image_${num}`]: true })} className="absolute top-2 right-2 bg-white/80 dark:bg-zinc-900/80 text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors shadow-sm">✕</button>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center relative hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                                <span className="text-3xl text-zinc-300 dark:text-zinc-600 mb-2">+</span>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">Foto {num}</span>
                                <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setProductForm({ ...productForm, [`image_file_${num}`]: e.target.files[0], [`remove_image_${num}`]: false }); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Descripción</label>
                    <textarea rows="3" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm resize-none focus:ring-4 focus:ring-zinc-500/10"></textarea>
                  </div>
                </form>
              </div>
              <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 shrink-0 bg-zinc-50 dark:bg-zinc-900/50 flex gap-4">
                <button type="button" onClick={() => setIsEditProductModalOpen(false)} className="flex-1 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 py-3.5 rounded-xl font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm">Cancelar</button>
                <button type="submit" form="edit-product-form" className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm">Actualizar Producto</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: CREAR CATEGORÍA --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}></div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg z-10 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">Nueva Categoría</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><LogOut size={24} className="rotate-45" /></button>
            </div>
            <form onSubmit={handleCategorySubmit} className="p-8 space-y-5">
              <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Nombre de la Categoría</label>
                <input required placeholder="Ej. Shorts" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Descripción</label>
                <input placeholder="Opcional" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
              </div>
              <button type="submit" className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 p-4 rounded-xl font-bold mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm text-sm">Crear Categoría</button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DE PREVISUALIZACIÓN DE PRODUCTO (OJO) */}
      {/* ========================================== */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Animaciones CSS incrustadas solo para este modal */}
          <style>{`
            @keyframes overlayFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modalPop {
              from { opacity: 0; transform: scale(0.95) translateY(15px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-overlay { animation: overlayFade 0.25s ease-out forwards; }
            .animate-modal { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          `}</style>

          {/* Fondo oscuro con desenfoque (Backdrop) interactivo */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-overlay"
            onClick={() => setPreviewProduct(null)}
          ></div>

          {/* Contenedor principal del Modal con animación de entrada */}
          <div className="bg-white dark:bg-zinc-950 rounded-3xl w-full max-w-4xl relative overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto z-10 animate-modal">

            {/* Botón de cerrar (X) */}
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Lado izquierdo: Imagen del producto (Respetando el formato 3:4) */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
              <div
                className="w-full max-w-sm rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-md relative"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={previewProduct.image_url || `https://placehold.co/600x800/f5f5f4/d6d3d1?text=SIN+FOTO`}
                  alt={previewProduct.name}
                  className="w-full h-full object-cover"
                />

                {/* Etiqueta flotante de Categoría sobre la imagen */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 shadow-sm">
                  {previewProduct.category_name || "Sin Categoría"}
                </div>
              </div>
            </div>

            {/* Lado derecho: Detalles del producto */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400 mb-3">
                Vista Previa Web
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                {previewProduct.name}
              </h2>
              <p className="text-2xl font-light text-zinc-800 dark:text-zinc-200 mb-6">
                $ {parseFloat(previewProduct.price).toFixed(2)}
              </p>

              <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 mb-6"></div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">Descripción</h4>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm whitespace-pre-wrap">
                  {previewProduct.description || "Este producto no tiene una descripción asignada."}
                </p>
              </div>

              {/* Métricas técnicas para el Admin */}
              <div className="flex flex-wrap gap-4 mt-auto">
                <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex-1 min-w-[120px]">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Stock Actual</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{previewProduct.stock_quantity} unidades</p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex-1 min-w-[120px]">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Estado</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${previewProduct.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {previewProduct.is_active ? 'Activo' : 'Agotado/Oculto'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL: CONFIRMACIÓN --- */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmAction(null)}></div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md z-10 overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                {confirmAction.type === 'delete' ? (
                  <Trash2 size={32} className="text-red-600 dark:text-red-500" />
                ) : (
                  <Power size={32} className="text-red-600 dark:text-red-500" />
                )}
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {confirmAction.type === 'delete' ? 'Eliminar Producto' : 'Desactivar Producto'}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                {confirmAction.type === 'delete'
                  ? `¿Estás seguro de que deseas eliminar permanentemente el producto "${confirmAction.product.name}"? Esta acción no se puede deshacer.`
                  : `¿Estás seguro de que deseas desactivar el producto "${confirmAction.product.name}"? No será visible para los clientes.`}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.type === 'delete') {
                      executeDeleteProduct(confirmAction.product.id);
                    } else {
                      executeToggleActive(confirmAction.product.id, confirmAction.product.is_active);
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;