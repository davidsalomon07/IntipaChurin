import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose }) => {
  const { carrito, eliminarDelCarrito, restarCantidadDelCarrito, totalPrecio } = useCart();
  const [deletingItemNombre, setDeletingItemNombre] = useState(null);
  const [cantidadAEliminar, setCantidadAEliminar] = useState(1);
  const [isCargandoPago, setIsCargandoPago] = useState(false);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isVip = user ? user.is_vip : false;

  // NUEVA FUNCION: Llama al backend para ir a Stripe mandando el user_id
  const handleCheckout = async () => {
    try {
      setIsCargandoPago(true);

      const token = localStorage.getItem('token');
      let userId = null;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          userId = decoded.id;
        } catch (error) {
          console.error("Token inválido:", error);
        }
      }

      if (!userId) {
        toast.error("Debes iniciar sesión para poder comprar.", { id: 'checkout-login-error' });
        setIsCargandoPago(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: carrito,
          user_id: userId
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Hubo un problema al generar el enlace de pago.", { id: 'checkout-payment-error' });
        setIsCargandoPago(false);
      }
    } catch (error) {
      console.error("Error al ir a pagar:", error);
      setIsCargandoPago(false);
    }
  };

  return (
    <>
      {/* Overlay oscuro detrás del panel */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel lateral */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-950 z-[110] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-transparent dark:border-zinc-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
          <h2 className="text-sm font-bold uppercase tracking-widest dark:text-white">Tu Carrito</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 text-sm gap-3 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.nombre} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl transition-colors duration-300">
                <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden shrink-0 transition-colors duration-300">
                  <img
                    src={item.imagen || `https://placehold.co/200x200/f5f5f4/d6d3d1?text=${(item.categoria || 'PRENDA').toUpperCase()}`}
                    className="w-full h-full object-cover opacity-90 dark:opacity-75"
                    alt={item.nombre}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {deletingItemNombre === item.nombre ? (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">¿Cuántos deseas eliminar?</span>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={cantidadAEliminar}
                          onChange={(e) => setCantidadAEliminar(parseInt(e.target.value))}
                          className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg px-2 py-1 outline-none text-zinc-850 dark:text-zinc-200 font-bold cursor-pointer"
                        >
                          {Array.from({ length: item.cantidad }, (_, i) => i + 1).map((val) => (
                            <option
                              key={val}
                              value={val}
                              className="bg-white dark:bg-zinc-800 text-zinc-850 dark:text-zinc-200"
                            >
                              {val === item.cantidad ? `Todos (${val})` : `${val} unid.`}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            restarCantidadDelCarrito(item.nombre, cantidadAEliminar);
                            setDeletingItemNombre(null);
                          }}
                          className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                          title="Confirmar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                        <button
                          onClick={() => setDeletingItemNombre(null)}
                          className="w-7 h-7 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg flex items-center justify-center transition-colors"
                          title="Cancelar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate transition-colors duration-300">{item.nombre}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors duration-300">Cantidad: {item.cantidad}</p>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mt-1.5 transition-colors duration-300">$ {(item.precio * item.cantidad).toFixed(2)}</p>
                    </>
                  )}
                </div>
                {deletingItemNombre !== item.nombre && (
                  <button
                    onClick={() => {
                      if (item.cantidad > 1) {
                        setDeletingItemNombre(item.nombre);
                        setCantidadAEliminar(1);
                      } else {
                        eliminarDelCarrito(item.nombre);
                      }
                    }}
                    className="text-zinc-350 hover:text-red-400 dark:text-zinc-600 dark:hover:text-red-450 transition-colors shrink-0 p-1"
                    title="Eliminar del carrito"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pie con total y botón */}
        {carrito.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-100 dark:border-zinc-800 space-y-4 transition-colors duration-300">
            {isVip && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold gap-2">
                <div className="flex items-center gap-2">
                  <span>👑</span>
                  <span>Descuento VIP (15%)</span>
                </div>
                <span>-${(totalPrecio * 0.15).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
                {isVip ? 'Total Estimado' : 'Total'}
              </span>
              <span className="text-lg font-bold text-zinc-900 dark:text-white transition-colors duration-300">
                $ {(isVip ? totalPrecio * 0.85 : totalPrecio).toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCargandoPago}
              className="w-full py-4 rounded-xl text-sm font-semibold transition-colors duration-300 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isCargandoPago ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Procesando...
                </>
              ) : (
                "Proceder al pago"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;