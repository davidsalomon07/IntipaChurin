# Intipa Churin - E-commerce

Bienvenido al repositorio oficial de **Intipa Churin**, una plataforma de comercio electrónico diseñada para una marca de ropa urbana premium. Este proyecto acompaña la evolución del estilo urbano para clientes entre 15 y 35 años, priorizando una experiencia de usuario (UX) moderna, rápida y segura.

## 🚀 Tecnologías Principales

### Frontend
- **React 19** + **Vite**: Desarrollo ágil y renderizado optimizado.
- **Framer Motion**: Animaciones fluidas, transiciones de vistas y micro-interacciones premium.
- **Tailwind CSS 4**: Estilos utilitarios rápidos y diseños premium (*glassmorphism*, dark mode, animaciones).
- **React Router DOM**: Enrutamiento del lado del cliente.
- **Lucide React**: Iconografía moderna.
- **Zustand / Context API**: Gestión del estado global (Carrito, Lista de Deseos, Autenticación).

### Backend
- **Node.js** + **Express**: API RESTful robusta y escalable.
- **PostgreSQL** + **pg**: Base de datos relacional para garantizar la integridad de productos, usuarios y pedidos.
- **Stripe**: Pasarela de pagos segura e integración mediante Webhooks.
- **JWT (JSON Web Tokens)** + **Bcrypt**: Autenticación y encriptación de contraseñas. Redireccionamiento inteligente tras inicio de sesión (clientes al Home para comprar y administradores al Dashboard de control).
- **Multer**: Gestión de carga de archivos e imágenes.

## 🌟 Funcionalidades Clave

* **Catálogo Dinámico**: Filtrado en tiempo real por categoría, precio, ofertas/descuentos, color y talla. Búsqueda global sincronizada.
* **Paginación Numérica Premium**: Navegación de 12 prendas por página (se activa a partir de la prenda 13) con scroll superior automático y animaciones de entrada fluidas (*fade-in-up*).
* **Selector Rápido de Tallas**: Menú emergente al pulsar el botón de carrito que permite elegir la talla directamente en el catálogo sin redirecciones.
* **Indicadores de Talla en Hover**: Visualización minimalista del stock de tallas (S, M, L, XL) directamente sobre la imagen al pasar el cursor.
* **Navegación Móvil por Gestos**: Soporte completo para deslizamiento táctil (swipe), arrastre con el ratón (drag) y scroll horizontal del trackpad en los carruseles de categorías, productos y testimonios.
* **Hero Interactivo en Bucle**: Diapositivas de imágenes en el Hero navegables mediante gestos e infinitas (bucle continuo) con transiciones suaves de traducción lateral (slide-fade-zoom) y bloqueo de cambio consecutivo para evitar saltos bruscos.
* **Diseño Responsivo Refinado**: Centrado automático de textos y botones en móviles, reducción y balanceo del espaciado entre secciones en responsive y prevención de desbordes de texto.
* **Interacciones y Animaciones del Perfil**: Transiciones de pestañas fluidas con `framer-motion`, un indicador dinámico y deslizante de la sección activa en el menú lateral, focus glow rings en inputs y efectos de elevación hover en tarjetas.
* **Estados Vacíos Diseñados (Empty States)**: Componentes premium con íconos vectoriales amplios y botones de llamada a la acción en secciones vacías del perfil para optimizar el flujo de navegación.
* **Buscador y Mapa de Google en Direcciones**: Campo de dirección con autocompletado en tiempo real (Google Places) y visor de mapa interactivo que se expande y colapsa de forma animada abajo de la dirección.
* **Notificaciones de Alto Contraste (Toasts)**: Alertas premium para interacciones con favoritos y errores de carrito/checkout usando `react-hot-toast` en lugar de diálogos nativos del navegador.
* **Sistema de Carga Premium**: Esqueletos (Shimmer effects) globales en toda la tienda para evitar tiempos muertos visuales.
* **Gestión de Carrito y Favoritos**: Funcionalidad completa de e-commerce con panel lateral (Drawer) optimizado.
* **Integración de Pagos con Stripe**: Proceso de checkout asegurado.
* **Modelo de Suscripción VIP**: Sistema de beneficios (acceso anticipado y envíos gratis) con facturación mensual. Integrada la lógica de backend para cobros y descuentos, la interfaz de membresía VIP en el perfil del usuario (Glassmorphism) con visualización de vigencia en una tarjeta centrada con grilla simétrica y alineación optimizada, y desglose detallado de descuentos VIP en el carrito de compras (Cart Drawer).
* **Panel de Administración**: Gestión completa de inventario, incluyendo control de precios originales para mostrar descuentos y ofertas. Cuenta con tarjetas de métricas analíticas animadas, un panel lateral deslizante (Slide-over Drawer) responsivo para productos, estados de gestión de pedidos con selectores tipo botón-badge de alto contraste, una barra lateral (Sidebar) colapsable con transiciones de ancho ultra-suaves y deslizador dinámico de pestañas, un área de carga de imágenes interactiva (Drag & Drop Dropzone) con carrusel de miniaturas animadas, e historial y vigencia detallada de membresías VIP (fechas de inicio y caducidad) en la sección de clientes.
* **Atención al Cliente Integrada**: Centro de ayuda (FAQ) dinámico con contacto directo a WhatsApp y Email.

## 📦 Estructura del Proyecto

El proyecto sigue una arquitectura cliente-servidor clásica dividida en dos aplicaciones principales:

```text
/
├── backend/            # API en Node.js/Express, configuración de BD y rutas.
├── frontend/           # Aplicación React/Vite con componentes y páginas UI.
└── README.md           # Documentación principal del proyecto.
```

## ⚙️ Requisitos y Ejecución Local

Para ejecutar el proyecto localmente, asegúrate de tener instalado Node.js (v18+) y PostgreSQL.

1. **Clonar y configurar Backend**:
   - Accede a `/backend`, ejecuta `npm install`.
   - Configura las variables de entorno (`.env`) para PostgreSQL y Stripe.
   - Ejecuta el servidor: `npm run dev` (por defecto en el puerto 3000).
   - *Nota: Si vas a probar pagos, ejecuta el CLI de Stripe para los webhooks.*

2. **Clonar y configurar Frontend**:
   - Accede a `/frontend`, ejecuta `npm install`.
   - Ejecuta la aplicación de React: `npm run dev`.

---
*Fase de Desarrollo Actual: Refactorización Visual y Micro-interacciones Premium en el Perfil de Usuario y Panel de Administración.*
*Este proyecto se encuentra en constante evolución para añadir nuevas características de personalización, suscripción y mejoras de interfaz, asegurando siempre una fidelidad visual excepcional.*
