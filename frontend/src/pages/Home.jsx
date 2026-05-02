import React from 'react';
import { Link } from 'react-router-dom';

// Íconos SVG
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;

const Home = () => {
  
  // Función exclusiva para "Inicio"
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-stone-900 font-sans selection:bg-stone-200 relative">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center relative">
          
          {/* Izquierda: Menú */}
          <div className="hidden md:flex gap-8 text-[13px] font-medium text-stone-500 flex-1 justify-start items-center">
            <button onClick={scrollToTop} className="hover:text-stone-900 transition-colors uppercase tracking-wider text-[11px]">
              Inicio
            </button>
            
            {/* Menú Desplegable: Colecciones */}
            <div className="relative group py-8">
              <button className="hover:text-stone-900 transition-colors uppercase tracking-wider text-[11px] flex items-center gap-1">
                Colecciones
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {/* Caja del Dropdown */}
              <div className="absolute top-[60px] left-0 w-48 bg-white border border-stone-100 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Link to="/shop" className="block px-6 py-2 text-[12px] font-bold text-stone-900 hover:bg-stone-50 transition-colors border-b border-stone-100 mb-1 pb-3">Catálogo Completo</Link>
                <Link to="/shop/Hoddies" className="block px-6 py-2 text-[12px] hover:bg-stone-50 hover:text-stone-900 transition-colors">Hoodies</Link>
                <Link to="/shop/Camisetas" className="block px-6 py-2 text-[12px] hover:bg-stone-50 hover:text-stone-900 transition-colors">Camisetas</Link>
                <Link to="/shop/Pantalones" className="block px-6 py-2 text-[12px] hover:bg-stone-50 hover:text-stone-900 transition-colors">Pantalones</Link>
              </div>
            </div>

            <Link to="/shop/nuevos" className="hover:text-stone-900 transition-colors uppercase tracking-wider text-[11px]">
              Nuevos
            </Link>
          </div>

          {/* Centro: Logo */}
          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 shrink-0">
            Intipa Churin
          </div>

          {/* Derecha: Íconos */}
          <div className="flex gap-6 text-stone-600 flex-1 justify-end">
            <button className="hover:text-stone-900 transition-transform hover:scale-110"><SearchIcon /></button>
            <Link to="/login" className="hover:text-stone-900 transition-transform hover:scale-110"><UserIcon /></Link>
            <button className="hover:text-stone-900 transition-transform hover:scale-110 relative">
              <CartIcon />
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-28 pb-12 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="relative w-full h-[75vh] md:h-[85vh] rounded-3xl overflow-hidden group shadow-sm">
          <img 
            src="https://placehold.co/1920x1080/e7e5e4/a8a29e?text=MODELOS+DIVERSOS+UNISEX" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" 
            alt="Nueva Colección"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase mb-4 drop-shadow-md">
              Colección Esencial 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
              Define tu estilo.
            </h1>
            <p className="text-base md:text-lg font-light mb-10 max-w-lg drop-shadow-md">
              Siluetas modernas y versátiles. Diseñadas sin distinciones de género para una comodidad absoluta y expresión libre.
            </p>
            <Link to="/shop" className="bg-white text-stone-900 px-8 py-4 rounded-full text-sm font-semibold hover:bg-stone-900 hover:text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              Explorar Colección
            </Link>
          </div>
        </div>
      </section>

      {/* --- CATEGORÍAS --- */}
      <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-16 tracking-tight">Comprar por Categoría</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {['Hoodies', 'Camisetas', 'Pantalones'].map((cat, i) => (
            <Link to={`/shop/${cat.toLowerCase()}`} key={i} className="group cursor-pointer flex flex-col items-center">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 mb-6 relative shadow-sm">
                <img 
                  src={`https://placehold.co/600x800/f5f5f4/d6d3d1?text=${cat.toUpperCase()}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={cat}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS --- */}
      <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-stone-100">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Selección Inicial</h2>
          <Link to="/shop" className="text-sm font-medium text-stone-500 hover:text-stone-900 border-b border-transparent hover:border-stone-900 transition-all pb-1">
            Ver catálogo
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 mb-5 relative">
                <img 
                  src={`https://placehold.co/600x800/f5f5f4/d6d3d1?text=PRENDA+${item}`} 
                  className="w-full h-full object-cover" 
                  alt={`Producto ${item}`}
                />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <button className="w-full bg-white/95 backdrop-blur-sm text-stone-900 py-3 rounded-xl text-sm font-semibold hover:bg-stone-900 hover:text-white transition-colors shadow-lg">
                    Agregar al carrito
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-medium text-stone-800 mb-1">Oversize Basic Tee</h3>
              <p className="text-sm text-stone-500 font-semibold">$ 45.00</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- NUEVA COLECCIÓN / DROP (Lookbook) --- */}
      <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="bg-stone-100 rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-4">Lanzamiento Exclusivo</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Trazabilidad <br /> & Minimalismo
            </h2>
            <p className="text-stone-600 mb-10 leading-relaxed max-w-md">
              Descubre nuestra primera línea de prendas estructuradas. Diseñadas en Quito, pensadas para adaptarse a cualquier estilo de vida sin perder la esencia.
            </p>
            <div>
              <Link to="/lookbook" className="border-2 border-stone-900 text-stone-900 px-8 py-3 rounded-full text-sm font-semibold hover:bg-stone-900 hover:text-white transition-all duration-300 inline-block">
                Ver Lookbook
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-full min-h-[500px] relative">
            <img 
              src="https://placehold.co/1000x1200/e7e5e4/a8a29e?text=IMAGEN+EDITORIAL" 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Lookbook"
            />
          </div>
        </div>
      </section>

      {/* --- BENEFICIOS --- */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-stone-100">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
          
          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <h3 className="text-base font-bold mb-2">Envío Gratis</h3>
            <p className="text-sm text-stone-500 max-w-xs">En todas las órdenes a nivel nacional superiores a $100.</p>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </div>
            <h3 className="text-base font-bold mb-2">Devoluciones Fáciles</h3>
            <p className="text-sm text-stone-500 max-w-xs">Tienes 30 días para realizar cambios o devoluciones sin costo.</p>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            </div>
            <h3 className="text-base font-bold mb-2">Pago 100% Seguro</h3>
            <p className="text-sm text-stone-500 max-w-xs">Procesamos tus pagos con los más altos estándares de seguridad.</p>
          </div>

        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section className="py-24 px-6 md:px-12 bg-stone-50">
        <div className="max-w-[1600px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-16 tracking-tight">Lo que dice nuestra comunidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "La calidad de las telas es increíble. Por fin una marca que entiende que el buen diseño no tiene género.", author: "Andrea V." },
              { text: "El calce de los pantalones es perfecto. La experiencia de compra y el empaque se sienten totalmente premium.", author: "Mateo R." },
              { text: "Piezas minimalistas que combinan con todo. Definitivamente mis nuevos básicos para el día a día.", author: "Sofía C." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">
                <div className="flex text-stone-800 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">"{testimonial.text}"</p>
                <p className="text-sm font-bold text-stone-900">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-20 pb-10 px-6 md:px-12 border-t border-stone-200">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="text-xl font-bold tracking-widest uppercase mb-6">Intipa Churin</div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Moda contemporánea, inclusiva y transparente. Diseñada para trascender temporadas.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider">Enlaces</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link to="/about" className="hover:text-stone-900 transition-colors">Sobre la marca</Link></li>
              <li><Link to="/faq" className="hover:text-stone-900 transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider">Políticas</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link to="/shipping" className="hover:text-stone-900 transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/terms" className="hover:text-stone-900 transition-colors">Términos de Servicio</Link></li>
              <li><Link to="/privacy" className="hover:text-stone-900 transition-colors">Aviso de Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-stone-500 mb-4">Únete para recibir noticias sobre nuevos drops y ofertas exclusivas.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all"
              />
              <button className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm">
                Unirme
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto border-t border-stone-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-400 font-medium">© 2026 Intipa Churin. Todos los derechos reservados.</p>
          <div className="flex gap-6 pr-20 md:pr-24">
            <a href="https://instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-wider">Instagram</a>
            <a href="https://tiktok.com/@tu_usuario" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-wider">Tiktok</a>
          </div>
        </div>
      </footer>

      {/* --- BOTÓN FLOTANTE DE WHATSAPP --- */}
      <a
        // Cambia el 593999999999 por el número real con código de país (sin el +)
        href="https://wa.me/593999999999?text=Hola,%20me%20gustaría%20obtener%20más%20información"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.245 3.483 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

    </div>
  );
};

export default Home;