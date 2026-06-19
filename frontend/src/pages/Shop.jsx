import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniFooter from '../components/MiniFooter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuickViewModal from '../components/QuickViewModal';

// --- Subcomponente Acordeón ---
const FilterAccordion = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800/50 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-xs tracking-widest text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none"
      >
        {title}
        <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

// --- Subcomponente Checkbox ---
const FilterCheckbox = ({ label, count, checked, onChange }) => (
  <label className="flex items-center gap-3 mb-3 cursor-pointer group">
    <div className="relative flex items-center justify-center">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${checked ? 'bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white text-white dark:text-zinc-900' : 'border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400 dark:group-hover:border-zinc-400 bg-transparent'}`}>
        {checked && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
      </div>
    </div>
    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
      {label} {count !== undefined && <span className="text-zinc-400 dark:text-zinc-500 font-normal ml-1">({count})</span>}
    </span>
  </label>
);

const checkPixelColor = (imageUrl, xPercent, yPercent) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = img.naturalWidth || img.width || 300;
        const h = img.naturalHeight || img.height || 400;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const pixel = ctx.getImageData(Math.floor(xPercent * w), Math.floor(yPercent * h), 1, 1).data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        const a = pixel[3];
        const isWhite = a < 50 || (r > 235 && g > 235 && b > 235);
        resolve(isWhite);
      } catch (err) {
        resolve(true);
      }
    };
    img.onerror = () => resolve(true);
    img.src = imageUrl;
  });
};

const normalizarTexto = (texto) => {
  if (!texto) return '';
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const Shop = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { agregarAlCarrito } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [sortOption, setSortOption] = useState('destacados');
  const sortOptions = [
    { value: 'destacados', label: 'Destacados' },
    { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
    { value: 'precio_desc', label: 'Precio: Mayor a Menor' },
    { value: 'nuevos', label: 'Nuevos' }
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortOption)?.label || 'Destacados';

  // Estados de datos
  const [productosDB, setProductosDB] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Filtro
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [minPrice, setMinPrice] = useState("0");
  const [priceRange, setPriceRange] = useState("300"); // max value
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [whiteBgProductIds, setWhiteBgProductIds] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleMinChange = (valStr) => {
    if (valStr === "") {
      setMinPrice("");
      return;
    }
    let cleanValStr = valStr;
    if (cleanValStr.length > 1 && cleanValStr.startsWith("0")) {
      cleanValStr = cleanValStr.replace(/^0+/, "");
      if (cleanValStr === "") cleanValStr = "0";
    }
    const val = parseInt(cleanValStr);
    if (isNaN(val)) return;
    const cleanVal = Math.max(0, Math.min(300, val));
    setMinPrice(cleanVal.toString());
    const maxVal = priceRange === "" ? 300 : parseInt(priceRange);
    if (cleanVal > maxVal && priceRange !== "") {
      setPriceRange(cleanVal.toString());
    }
  };

  const handleMaxChange = (valStr) => {
    if (valStr === "") {
      setPriceRange("");
      return;
    }
    let cleanValStr = valStr;
    if (cleanValStr.length > 1 && cleanValStr.startsWith("0")) {
      cleanValStr = cleanValStr.replace(/^0+/, "");
      if (cleanValStr === "") cleanValStr = "0";
    }
    const val = parseInt(cleanValStr);
    if (isNaN(val)) return;
    const cleanVal = Math.max(0, Math.min(300, val));
    setPriceRange(cleanVal.toString());
    const minVal = minPrice === "" ? 0 : parseInt(minPrice);
    if (cleanVal < minVal && minPrice !== "") {
      setMinPrice(cleanVal.toString());
    }
  };

  const sizesList = ['S', 'M', 'L', 'XL'];
  const colorsList = [
    { name: 'Black', hex: '#18181b' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Dark Gray', hex: '#52525b' },
    { name: 'Light Gray', hex: '#e4e4e7' },
    { name: 'Beige', hex: '#f5f5dc' },
    { name: 'Navy', hex: '#1e3a8a' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Burgundy', hex: '#7f1d1d' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Olive', hex: '#556b2f' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Brown', hex: '#5c4033' },
    { name: 'Orange', hex: '#f97316' },
  ];

  const colorNamesEs = {
    'Black': 'Negro',
    'White': 'Blanco',
    'Dark Gray': 'Gris Oscuro',
    'Light Gray': 'Gris Claro',
    'Beige': 'Beige',
    'Navy': 'Azul Marino',
    'Blue': 'Azul',
    'Red': 'Rojo',
    'Burgundy': 'Vino',
    'Green': 'Verde',
    'Olive': 'Verde Oliva',
    'Yellow': 'Amarillo',
    'Pink': 'Rosa',
    'Purple': 'Morado',
    'Brown': 'Marrón',
    'Orange': 'Naranja'
  };

  const getHoverBg = (colorName) => {
    if (!colorName) return 'rgba(9, 9, 11, 0.4)';
    if (colorName === 'White') return 'rgba(9, 9, 11, 0.6)';
    const found = colorsList.find(c => c.name === colorName);
    if (!found) return 'rgba(9, 9, 11, 0.4)';
    return `${found.hex}66`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/products');
        if (res.ok) {
          const data = await res.json();
          const processedData = data.filter(p => p.is_active);
          setProductosDB(processedData);
        }
      } catch (error) {
        console.error("Error al cargar catálogo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (productosDB.length === 0) return;
    const checkAllImages = async () => {
      const whiteIds = new Set();
      await Promise.all(
        productosDB.map(async (product) => {
          if (!product.image_url) {
            whiteIds.add(product.id);
            return;
          }
          try {
            const isWhite = await checkPixelColor(product.image_url, 0.92, 0.94);
            if (isWhite) whiteIds.add(product.id);
          } catch (e) {
            whiteIds.add(product.id);
          }
        })
      );
      setWhiteBgProductIds(whiteIds);
    };
    checkAllImages();
  }, [productosDB]);

  // Lógica de filtrado
  let productosFiltrados = [...productosDB];

  if (category && category.toLowerCase() === 'nuevos') {
    productosFiltrados = productosFiltrados
      .sort((a, b) => b.id - a.id)
      .slice(0, 10);
  } else if (category) {
    productosFiltrados = productosFiltrados.filter(p => p.category_name && p.category_name.toLowerCase() === category.toLowerCase());
  }

  // Filtrado por atributos
  if (selectedCategories.length > 0) {
    productosFiltrados = productosFiltrados.filter(p => selectedCategories.includes(p.category_name));
  }
  if (selectedSizes.length > 0) {
    productosFiltrados = productosFiltrados.filter(p => p.sizes && selectedSizes.some(s => p.sizes.includes(s)));
  }
  if (selectedColor) {
    productosFiltrados = productosFiltrados.filter(p => p.color === selectedColor);
  }
  if (searchQuery) {
    const queryLimpiada = normalizarTexto(searchQuery);
    const palabrasEscritas = queryLimpiada.split(' ').filter(Boolean);
    productosFiltrados = productosFiltrados.filter(p => {
      const nombreLimpiado = normalizarTexto(p.name);
      const categoriaLimpiada = normalizarTexto(p.category_name || '');
      const textoBuscable = `${nombreLimpiado} ${categoriaLimpiada}`;
      return palabrasEscritas.every(palabra => {
        const regex = new RegExp(`\\b${palabra}`);
        return regex.test(textoBuscable);
      });
    });
  }
  const min = minPrice === "" ? 0 : parseFloat(minPrice);
  const max = priceRange === "" ? 300 : parseFloat(priceRange);
  if (min > 0 || max < 300) {
    productosFiltrados = productosFiltrados.filter(p => {
      const price = parseFloat(p.price);
      return price >= min && price <= max;
    });
  }

  // Lógica de ordenamiento
  if (sortOption === 'precio_asc') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortOption === 'precio_desc') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (sortOption === 'nuevos') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => b.id - a.id);
  } else {
    productosFiltrados = [...productosFiltrados].sort((a, b) => a.id - b.id);
  }

  const toggleCategory = (catName) => {
    setSelectedCategories(prev =>
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  let tituloPagina = "Catálogo Completo";
  if (category) {
    if (category.toLowerCase() === 'nuevos') {
      tituloPagina = "Novedades";
    } else {
      tituloPagina = category.charAt(0).toUpperCase() + category.slice(1);
    }
  }

  // Categorías dinámicas a partir de productosDB
  const categoryCounts = productosDB.reduce((acc, p) => {
    if (p.category_name) {
      acc[p.category_name] = (acc[p.category_name] || 0) + 1;
    }
    return acc;
  }, {});

  const categoriesList = Object.keys(categoryCounts).map(name => ({
    name,
    count: categoryCounts[name]
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 flex flex-col transition-colors duration-300">

      <Navbar />

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full flex flex-col lg:flex-row gap-0">

        {/* --- SIDEBAR IZQUIERDO (Filtros) --- */}
        <aside className={`w-full lg:w-64 flex-shrink-0 bg-white dark:bg-[#0e1014] rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-500 ease-in-out overflow-hidden ${isMobileFiltersOpen ? 'opacity-100 max-h-[1500px] lg:max-h-none p-6 md:p-8 border border-zinc-200/80 dark:border-white/10 mb-12 lg:mb-0 lg:mr-12 lg:min-w-[16rem] lg:max-w-[16rem]' : 'opacity-0 max-h-0 lg:max-h-0 lg:w-0 p-0 border-0 mb-0 lg:mr-0 pointer-events-none lg:min-w-0 lg:max-w-0'}`}>
          <div className="mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800/50 lg:border-none lg:pb-0 lg:mb-6">
            <h2 className="text-xs font-bold tracking-widest text-zinc-900 dark:text-zinc-100">FILTRAR POR</h2>
          </div>

          <FilterAccordion title="CATEGORÍA" defaultOpen={true}>
            {categoriesList.map(cat => (
              <FilterCheckbox
                key={cat.name}
                label={cat.name}
                count={cat.count}
                checked={selectedCategories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
              />
            ))}
          </FilterAccordion>

          <FilterAccordion title="TALLA" defaultOpen={true}>
            {sizesList.map(size => (
              <FilterCheckbox
                key={size}
                label={size}
                checked={selectedSizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
            ))}
            <button className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white mt-2 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 transition-colors">Ver más</button>
          </FilterAccordion>

          <FilterAccordion title="COLOR" defaultOpen={true}>
            <div className="flex flex-wrap gap-3">
              {colorsList.map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name === selectedColor ? null : color.name)}
                  title={colorNamesEs[color.name] || color.name}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedColor === color.name ? 'border border-zinc-400 dark:border-zinc-300 scale-110 shadow-sm' : 'border border-transparent hover:scale-110'}`}
                >
                  <span className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-inner" style={{ backgroundColor: color.hex }}></span>
                </button>
              ))}
            </div>
          </FilterAccordion>

          <FilterAccordion title="PRECIO" defaultOpen={true}>
            <div className="pt-2 pb-2">
              {/* Slider de rango */}
              <div className="px-1">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={priceRange === "" ? 300 : priceRange}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800/80 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white hover:bg-zinc-300 dark:hover:bg-zinc-700/80 transition-all duration-300 focus:outline-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-950 dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-zinc-950 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                />
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-2.5 uppercase tracking-wider">
                  <span>S/ {minPrice === "" ? 0 : minPrice}</span>
                  <span>{priceRange === "" || priceRange >= 300 ? 'S/ 300+' : `S/ ${priceRange}`}</span>
                </div>
              </div>

              {/* Entradas numéricas horizontales */}
              <div className="flex items-center gap-2 mt-4">
                <div className="relative flex items-center flex-1">
                  <span className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 text-xs font-semibold">S/</span>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    placeholder="Mín"
                    value={minPrice}
                    onChange={(e) => handleMinChange(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl pl-7 pr-2 py-2 text-xs text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                  />
                </div>
                <span className="text-zinc-300 dark:text-zinc-700 text-xs font-semibold">—</span>
                <div className="relative flex items-center flex-1">
                  <span className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 text-xs font-semibold">S/</span>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    placeholder="Máx"
                    value={priceRange}
                    onChange={(e) => handleMaxChange(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl pl-7 pr-2 py-2 text-xs text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                  />
                </div>
              </div>

              {/* Atajos de preselección rápida en lista vertical limpia */}
              <div className="flex flex-col gap-1 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900/40">
                {[
                  { label: 'Todos los precios', min: "0", max: "300" },
                  { label: 'Hasta S/ 100', min: "0", max: "100" },
                  { label: 'S/ 100 - S/ 200', min: "100", max: "200" },
                  { label: 'S/ 200 a más', min: "200", max: "300" }
                ].map((preset) => {
                  const isActive = minPrice === preset.min && priceRange === preset.max;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setMinPrice(preset.min);
                        setPriceRange(preset.max);
                      }}
                      className={`flex items-center justify-between text-xs py-2 px-3 rounded-xl transition-all duration-300 text-left ${isActive ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/30'}`}
                    >
                      <span>{preset.label}</span>
                      {isActive && (
                        <svg className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </FilterAccordion>
        </aside>

        {/* --- CONTENIDO PRINCIPAL (Productos) --- */}
        <section className="flex-1 w-full max-w-full">

          {/* Cabecera de Main */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-6 border-b border-zinc-100 dark:border-zinc-800/50 pb-6 gap-6 lg:gap-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 dark:text-white">{tituloPagina}</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-[15px] mb-5">Descubre todas nuestras prendas diseñadas para acompañarte siempre.</p>

              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{productosFiltrados.length} productos encontrados</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto self-end lg:self-auto mt-auto lg:mb-2">
              {/* Botón Filtros (Desktop/Mobile Toggle) */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border text-sm transition-all duration-300 focus:outline-none shrink-0 ${isMobileFiltersOpen ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 shadow-md scale-105' : 'bg-transparent border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-950 dark:hover:text-white'}`}
                title={isMobileFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}
              >
                <svg className={`w-4 h-4 transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-90 scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </button>

              <div className="relative w-full lg:w-auto">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                  className="flex items-center justify-between gap-3 bg-transparent border border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-300 text-sm rounded-full px-5 py-2 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors focus:outline-none w-full lg:w-auto lg:min-w-[220px]"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-zinc-400 dark:text-zinc-500 font-normal">Ordenar por:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{currentSortLabel}</span>
                  </span>
                  <svg className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <div className={`absolute top-full right-0 mt-2 w-full lg:min-w-[220px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl rounded-2xl py-2 z-20 origin-top-right transition-all duration-200 ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${sortOption === option.value ? 'font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800/50' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chips de Filtros Activos */}
          {(selectedCategories.length > 0 || selectedSizes.length > 0 || selectedColor || min > 0 || max < 300 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {searchQuery && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-semibold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
                  Búsqueda: {searchQuery}
                  <button onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    setSearchParams(newParams);
                  }} className="hover:text-zinc-900 dark:hover:text-white"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </span>
              )}
              {selectedCategories.map(cat => (
                <span key={cat} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-semibold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="hover:text-zinc-900 dark:hover:text-white"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </span>
              ))}
              {selectedSizes.map(size => (
                <span key={size} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-semibold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
                  Talla: {size}
                  <button onClick={() => toggleSize(size)} className="hover:text-zinc-900 dark:hover:text-white"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </span>
              ))}
              {selectedColor && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-semibold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
                  Color: {colorNamesEs[selectedColor] || selectedColor}
                  <button onClick={() => setSelectedColor(null)} className="hover:text-zinc-900 dark:hover:text-white"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </span>
              )}
              {(min > 0 || max < 300) && (
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-semibold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
                  Precio: {min > 0 && max < 300 ? `S/ ${min} - S/ ${max}` : min > 0 ? `S/ ${min} a más` : `Hasta S/ ${max}`}
                  <button
                    onClick={() => {
                      setMinPrice("0");
                      setPriceRange("300");
                    }}
                    className="hover:text-zinc-900 dark:hover:text-white"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSizes([]);
                  setSelectedColor(null);
                  setMinPrice("0");
                  setPriceRange("300");
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline underline-offset-4 ml-2"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {/* Grid de Productos */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-12 w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col animate-pulse w-full">
                  <div className="w-full aspect-[4/5] rounded-xl bg-zinc-200 dark:bg-zinc-800/50 mb-4"></div>
                  <div className="mt-auto px-1">
                    <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/3 mb-3"></div>
                    <div className="h-3.5 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-3/4 mb-2.5"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-12">
              {productosFiltrados.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/shop/producto/${item.id}`)}
                  onMouseEnter={() => setHoveredProductId(item.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 dark:bg-[#151515] mb-4 relative transition-colors duration-300">
                    <img
                      src={item.image_url || `https://placehold.co/600x800/f5f5f4/d6d3d1?text=SIN+FOTO`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-100"
                      alt={item.name}
                    />
                    {item.image_url_2 && (
                      <img
                        src={item.image_url_2}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${hoveredProductId === item.id ? 'opacity-100' : 'opacity-0'}`}
                        alt={`${item.name} vista trasera`}
                      />
                    )}

                    {/* Etiqueta de Descuento */}
                    {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">
                        -{Math.round((1 - parseFloat(item.price) / parseFloat(item.original_price)) * 100)}%
                      </div>
                    )}

                    {/* Botón de Wishlist */}
                    <div className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:group-hover:translate-y-0 md:-translate-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        title={isInWishlist(item.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20" height="20"
                          viewBox="0 0 24 24"
                          fill={isInWishlist(item.id) ? "#ef4444" : "none"}
                          stroke={isInWishlist(item.id) ? "#ef4444" : "currentColor"}
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                          className="transition-colors duration-300"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Botón Vista Rápida */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(item);
                        }}
                        title="Vista Rápida"
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transform transition-all duration-500 ease-out active:scale-95 text-white border border-white/10 backdrop-blur-md"
                        style={{ backgroundColor: (hoveredProductId === item.id && !whiteBgProductIds.has(item.id)) ? getHoverBg(item.color) : 'rgba(9, 9, 11, 0.4)' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>

                    {/* Botón de Carrito (estilo bolsa) */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          agregarAlCarrito({
                            id: item.id,
                            nombre: item.name,
                            precio: parseFloat(item.price),
                            categoria: item.category_name,
                            imagen: item.image_url,
                            stock_quantity: item.stock_quantity
                          });
                        }}
                        title="Añadir al carrito"
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transform transition-all duration-500 ease-out active:scale-95 text-white border border-white/10 backdrop-blur-md"
                        style={{ backgroundColor: (hoveredProductId === item.id && !whiteBgProductIds.has(item.id)) ? getHoverBg(item.color) : 'rgba(9, 9, 11, 0.4)' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-auto px-1">
                    <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{item.category_name || 'PRENDA'}</p>
                    <h3 className="text-[13px] md:text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-xs md:text-[13px] text-zinc-900 dark:text-white font-bold">S/ {parseFloat(item.price).toFixed(2)}</p>
                      {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
                        <p className="text-xs md:text-[13px] text-zinc-400 dark:text-zinc-500 font-medium line-through">S/ {parseFloat(item.original_price).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center w-full bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
              <p>No se encontraron productos con los filtros seleccionados.</p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSizes([]);
                  setSelectedColor(null);
                  setMinPrice("0");
                  setPriceRange("300");
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  setSearchParams(newParams);
                }}
                className="mt-4 text-xs font-semibold underline underline-offset-4 hover:text-zinc-900 dark:hover:text-white"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </section>
      </main>

      <MiniFooter />

      <QuickViewModal 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        producto={quickViewProduct} 
      />
    </div>
  );
};

export default Shop;