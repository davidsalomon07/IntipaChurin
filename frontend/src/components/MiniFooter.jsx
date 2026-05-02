import React from 'react';

const MiniFooter = () => {
  return (
    <footer className="bg-white pt-10 pb-10 px-6 md:px-12 border-t border-stone-100">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Copyright */}
        <p className="text-xs text-stone-400 font-medium text-center md:text-left">
          © 2026 Intipa Churin. Todos los derechos reservados.
        </p>
        
        {/* Enlaces de Redes Sociales, conservando el espaciado para WhatsApp */}
        <div className="flex gap-6 pr-20 md:pr-24">
          <a href="https://instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-wider">
            Instagram
          </a>
          <a href="https://tiktok.com/@tu_usuario" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold uppercase tracking-wider">
            Tiktok
          </a>
        </div>

      </div>
    </footer>
  );
};

export default MiniFooter;