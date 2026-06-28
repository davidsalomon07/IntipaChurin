import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const Success = () => {
    // Llamar a vaciarCarrito para limpiar la sesión después del pago
    const { vaciarCarrito } = useCart();
    const [searchParams] = useSearchParams();
    const tipo = searchParams.get('tipo');

    useEffect(() => {
      vaciarCarrito();

      const actualizarPerfilVip = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const res = await fetch('http://localhost:3000/api/usuarios/perfil', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            // Desencadenar evento de almacenamiento local para forzar renderizados si aplica
            window.dispatchEvent(new Event('storage'));
          }
        } catch (err) {
          console.error("Error al actualizar el estado VIP del usuario:", err);
        }
      };

      if (tipo === 'membresia') {
        actualizarPerfilVip();
      }
    }, [tipo, vaciarCarrito]);

    return (
        <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300">
            <Navbar />
            <main className="pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight dark:text-white">¡Pago Exitoso!</h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-10 text-lg">
                    Tu pedido ha sido procesado correctamente. En breve recibirás un correo con los detalles de tu compra.
                </p>
                <Link
                    to="/shop"
                    className="bg-zinc-900 text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg hover:scale-105"
                >
                    Seguir Comprando
                </Link>
            </main>
        </div>
    );
};

export default Success;