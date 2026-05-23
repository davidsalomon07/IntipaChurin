import React from 'react';

const MiniFooter = () => {
  return (
    <footer className="bg-white dark:bg-zinc-950 pt-10 pb-10 px-6 md:px-12 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Copyright */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium text-center md:text-left transition-colors duration-300">
          © 2026 Intipa Churin. Todos los derechos reservados.
        </p>
        
        {/* Enlaces de Redes Sociales, conservando el espaciado para WhatsApp */}
        <div className="flex gap-6 pr-20 md:pr-24">
          <a href="https://instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 text-xs font-bold uppercase tracking-wider">
            Instagram
          </a>
          <a href="https://tiktok.com/@tu_usuario" target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 text-xs font-bold uppercase tracking-wider">
            Tiktok
          </a>
        </div>

      </div>
    </footer>
  );
};

export default MiniFooter;