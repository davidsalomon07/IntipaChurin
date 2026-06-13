import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cancel = () => {
    return (
        <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300">
            <Navbar />
            <main className="pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-8">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight dark:text-white">Pago Cancelado</h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-10 text-lg">
                    No se ha realizado ningún cargo en tu tarjeta. Tus artículos siguen guardados en el carrito para cuando estés listo.
                </p>
                <Link
                    to="/shop"
                    className="bg-zinc-900 text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg hover:scale-105"
                >
                    Volver a la Tienda
                </Link>
            </main>
        </div>
    );
};

export default Cancel;