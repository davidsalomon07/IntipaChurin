import { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const restarCantidadDelCarrito = (id, cantidadARestar) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === id);
      if (!existe) return prev;
      if (existe.cantidad > cantidadARestar) {
        return prev.map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad - cantidadARestar }
            : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, restarCantidadDelCarrito, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);