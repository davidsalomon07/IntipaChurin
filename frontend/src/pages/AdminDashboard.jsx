import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  Grid,
  Users,
  LogOut,
  Edit,
  Trash2,
  Eye,
  Power
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [search, setSearch] = useState("");
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Control de Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Formularios completos
  const estadoInicialProducto = { name: '', description: '', price: '', stock_quantity: '', category_id: '', image_url: '', is_active: true };
  const [productForm, setProductForm] = useState(estadoInicialProducto);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

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
    await Promise.all([cargarProductos(), cargarCategorias(), cargarUsuarios()]);
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

  // --- LÓGICA CRUD PRODUCTOS ---

  // 1. Crear
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock_quantity: parseInt(productForm.stock_quantity),
          category_id: parseInt(productForm.category_id)
        })
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
      stock_quantity: p.stock_quantity,
      category_id: p.category_id || '',
      image_url: p.image_url || '',
      is_active: p.is_active
    });
    setIsEditProductModalOpen(true);
  };

  // 3. Enviar Edición
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock_quantity: parseInt(productForm.stock_quantity),
          category_id: parseInt(productForm.category_id)
        })
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
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (response.ok) cargarProductos();
    } catch (error) { console.error(error); }
  };

  // 5. Eliminar
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) cargarProductos();
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

  const filteredProductos = productos.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredCategorias = categorias.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredUsuarios = usuarios.filter(u => u.first_name.toLowerCase().includes(search.toLowerCase()) || u.last_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Sidebar Minimalista */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-10 shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-lg font-bold tracking-widest uppercase dark:text-white">Intipa Churin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div 
            onClick={() => setActiveTab('productos')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200 ${activeTab === 'productos' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            <Package size={18} /> Gestión de Productos
          </div>
          <div 
            onClick={() => setActiveTab('categorias')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200 ${activeTab === 'categorias' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            <Grid size={18} /> Gestión de Categorías
          </div>
          <div 
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200 ${activeTab === 'usuarios' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          >
            <Users size={18} /> Cuentas Registradas
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="flex items-center justify-center gap-3 px-4 py-3 text-red-500 font-semibold text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={18} /> Cerrar Sesión
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold dark:text-white">
            {activeTab === 'productos' && 'Gestión de Productos'}
            {activeTab === 'categorias' && 'Gestión de Categorías'}
            {activeTab === 'usuarios' && 'Cuentas Registradas'}
          </h1>
          <div className="flex items-center gap-4">
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

        <div className="flex-1 overflow-y-auto p-8 pt-0">
          <div className="flex justify-end gap-3 mb-6">
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
              <div className="p-20 text-center text-zinc-500 font-medium flex flex-col items-center">
                 <svg className="animate-spin h-8 w-8 mb-4 text-zinc-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Cargando información...
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left table-fixed">
                  
                  {/* === PRODUCTOS === */}
                  {activeTab === 'productos' && (
                    <>
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                          <th className="w-16 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nº</th>
                          <th className="w-1/3 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nombre del Producto</th>
                          <th className="w-1/4 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Categoría</th>
                          <th className="w-1/6 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Stock / Precio</th>
                          <th className="w-40 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Acciones</th>
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
                                {p.name}
                                {!p.is_active && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Agotado</span>}
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
                              <td className="py-4 px-6 flex justify-center items-center gap-3">
                                <button onClick={() => window.open(`/shop/producto/${p.id}`, '_blank')} title="Previsualizar en Tienda">
                                  <Eye size={18} className="cursor-pointer text-zinc-400 hover:text-blue-500 transition-colors" />
                                </button>
                                <button onClick={() => handleEditClick(p)} title="Editar Producto">
                                  <Edit size={18} className="cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" />
                                </button>
                                <button onClick={() => handleToggleActive(p.id, p.is_active)} title={p.is_active ? "Marcar Agotado / Desactivar" : "Activar Publicación"}>
                                  <Power size={18} className={`cursor-pointer transition-colors ${p.is_active ? 'text-green-500 hover:text-green-600' : 'text-zinc-400 hover:text-zinc-300'}`} />
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id)} title="Eliminar Definitivamente">
                                  <Trash2 size={18} className="cursor-pointer text-zinc-400 hover:text-red-500 transition-colors" />
                                </button>
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
                        <tr>
                          <th className="w-16 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nº</th>
                          <th className="w-1/3 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Categoría</th>
                          <th className="w-2/3 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Descripción</th>
                          <th className="w-24 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Acciones</th>
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
                                <td className="py-4 px-6 flex justify-center items-center gap-3">
                                  <Edit size={18} className="cursor-pointer text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Editar" />
                                  {isProtected ? (
                                    <div className="w-[18px] flex justify-center text-zinc-300 dark:text-zinc-700 cursor-not-allowed" title="Categoría protegida">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </div>
                                  ) : (
                                    <Trash2 size={18} className="cursor-pointer text-zinc-400 hover:text-red-500 transition-colors" title="Eliminar" />
                                  )}
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
                        <tr>
                          <th className="w-16 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nº</th>
                          <th className="w-1/3 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Nombre del Cliente</th>
                          <th className="w-1/3 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Correo Electrónico</th>
                          <th className="w-1/3 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500">Fecha de Registro</th>
                          <th className="w-24 py-4 px-6 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Estado</th>
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

      {/* --- MODAL: CREAR PRODUCTO --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold dark:text-white">Nuevo Producto</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><LogOut size={24} className="rotate-45" /></button>
            </div>
            <div className="overflow-y-auto p-8">
              <form id="create-product-form" onSubmit={handleProductSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Nombre del Producto</label>
                    <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Categoría</label>
                    <select required value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm">
                      <option value="">Selecciona una categoría...</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Precio ($)</label>
                    <input type="number" step="0.01" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Stock Total</label>
                    <input type="number" required value={productForm.stock_quantity} onChange={e => setProductForm({...productForm, stock_quantity: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">URL de la Imagen</label>
                  <input placeholder="https://..." value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Descripción</label>
                  <textarea rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm resize-none"></textarea>
                </div>
              </form>
            </div>
            <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
              <button type="submit" form="create-product-form" className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 p-4 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm text-sm">Crear Producto</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: EDITAR PRODUCTO --- */}
      {isEditProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditProductModalOpen(false)}></div>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold dark:text-white">Editar Producto</h2>
              <button onClick={() => setIsEditProductModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><LogOut size={24} className="rotate-45" /></button>
            </div>
            <div className="overflow-y-auto p-8">
              <form id="edit-product-form" onSubmit={handleEditSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Nombre del Producto</label>
                    <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Categoría</label>
                    <select required value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm">
                      <option value="">Selecciona una categoría...</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Precio ($)</label>
                    <input type="number" step="0.01" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Stock Total</label>
                    <input type="number" required value={productForm.stock_quantity} onChange={e => setProductForm({...productForm, stock_quantity: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">URL de la Imagen</label>
                  <input placeholder="https://..." value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Descripción</label>
                  <textarea rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm resize-none"></textarea>
                </div>
              </form>
            </div>
            <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
              <button type="submit" form="edit-product-form" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm">Actualizar Producto</button>
            </div>
          </div>
        </div>
      )}

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
                <input required placeholder="Ej. Shorts" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Descripción</label>
                <input placeholder="Opcional" value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-zinc-900 dark:focus:border-zinc-400 dark:text-white transition-all text-sm" />
              </div>
              <button type="submit" className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 p-4 rounded-xl font-bold mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm text-sm">Crear Categoría</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;