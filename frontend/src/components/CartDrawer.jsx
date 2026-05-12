import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { carrito, eliminarDelCarrito, totalPrecio } = useCart();

  return (
    <>
      {/* Overlay oscuro detrás del panel */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel lateral */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="text-sm font-bold uppercase tracking-widest">Tu Carrito</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 text-sm gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl">
                <div className="w-14 h-14 bg-stone-200 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={`https://placehold.co/200x200/f5f5f4/d6d3d1?text=${item.categoria.toUpperCase()}`}
                    className="w-full h-full object-cover"
                    alt={item.nombre}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{item.nombre}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Cantidad: {item.cantidad}</p>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">$ {(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-stone-300 hover:text-red-400 transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pie con total y botón */}
        {carrito.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500">Total</span>
              <span className="text-lg font-bold text-stone-900">$ {totalPrecio.toFixed(2)}</span>
            </div>
            <button className="w-full bg-stone-900 text-white py-4 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors">
              Proceder al pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;