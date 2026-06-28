import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.nombre === producto.nombre);

    if (existe) {
      if (producto.stock_quantity !== undefined && existe.cantidad >= producto.stock_quantity) {
        toast.error("Límite de stock alcanzado para este producto.", { id: `stock-limit-${producto.nombre}` });
        return;
      }
      toast.success("Producto agregado al carrito", { id: `add-cart-${producto.nombre}` });
      setCarrito((prev) => {
        const itemExistente = prev.find((item) => item.nombre === producto.nombre);
        if (itemExistente) {
          if (producto.stock_quantity !== undefined && itemExistente.cantidad >= producto.stock_quantity) {
            return prev;
          }
          return prev.map((item) =>
            item.nombre === producto.nombre
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }
        return [...prev, { ...producto, cantidad: 1 }];
      });
    } else {
      if (producto.stock_quantity !== undefined && producto.stock_quantity <= 0) {
        toast.error("Este producto está agotado.", { id: `out-of-stock-${producto.nombre}` });
        return;
      }
      toast.success("Producto agregado al carrito", { id: `add-cart-${producto.nombre}` });
      setCarrito((prev) => {
        const itemExistente = prev.find((item) => item.nombre === producto.nombre);
        if (itemExistente) {
          if (producto.stock_quantity !== undefined && itemExistente.cantidad >= producto.stock_quantity) {
            return prev;
          }
          return prev.map((item) =>
            item.nombre === producto.nombre
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }
        return [...prev, { ...producto, cantidad: 1 }];
      });
    }
  };

  const vaciarCarrito = () => setCarrito([]);

  const eliminarDelCarrito = (nombre) => {
    setCarrito((prev) => prev.filter((item) => item.nombre !== nombre));
  };

  const restarCantidadDelCarrito = (nombre, cantidadARestar) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.nombre === nombre);
      if (!existe) return prev;
      if (existe.cantidad > cantidadARestar) {
        return prev.map((item) =>
          item.nombre === nombre
            ? { ...item, cantidad: item.cantidad - cantidadARestar }
            : item
        );
      }
      return prev.filter((item) => item.nombre !== nombre);
    });
  };

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, restarCantidadDelCarrito, vaciarCarrito, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);