# Tarea Recurrente: Historias de Usuario

Esta tarea se ejecuta automáticamente cada vez que se realice una implementación importante o un cambio significativo en el proyecto.

## Funcionalidad Activa
* **Nombre:** Visibilidad del Botón de WhatsApp en Modo Responsivo
* **Descripción:**
  - **Como** visitante móvil de la plataforma Intipa Churin,
  - **quiero** que el botón flotante de WhatsApp permanezca visible y sea accesible en todas las páginas públicas de la web,
  - **para** poder contactar a soporte de manera inmediata ante cualquier consulta o duda, de la misma forma en que funciona en el modo escritorio.
  - **Criterios de Aceptación:**
    - El botón de WhatsApp flotante debe tener un `z-index` de `9999` para garantizar que aparezca sobre todos los elementos fijos, carruseles, layouts o pies de página (footers).
    - En el modo responsivo móvil (viewport < 768px), el botón debe renderizarse en el extremo inferior derecho (`bottom-6 right-6`) de manera visible y sin ser obstruido por otros elementos visuales.
    - Se mantendrán las exclusiones de rutas especificadas (`/profile`, `/checkout`, `/login`, `/register`) y se ocultará automáticamente al abrir el carrito de compras (Cart Drawer) en cualquier parte de la web para evitar obstruir el botón de pago y los elementos del carrito, comportándose de manera idéntica al modo escritorio en el resto de páginas.
* **Subtareas:**
  - Modificar el `z-index` del botón flotante en `WhatsAppButton.jsx` a `z-[9999]` e inline `style={{ zIndex: 99999 }}`.
  - Elevar el estado `cartOpen` y la función `setCartOpen` a `CartContext.jsx` para compartirlos globalmente.
  - Consumir el estado `cartOpen` en `Navbar.jsx` y `WhatsAppButton.jsx` para ocultar dinámicamente el botón de WhatsApp cuando el carrito esté abierto.
  - Probar la compilación y verificar la visualización responsive en pantallas móviles y con el carrito desplegado.
