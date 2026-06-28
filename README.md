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
* **Modelo de Suscripción VIP**: Sistema de beneficios (acceso anticipado y envíos gratis) con facturación mensual. Integrada la lógica de backend para cobros y descuentos, la interfaz de membresía VIP en el perfil del usuario (Glassmorphism) con visualización de vigencia en una tarjeta centrada con grilla simétrica y alineación optimizada, desglose detallado de descuentos VIP en el carrito de compras (Cart Drawer), e indicadores visuales distintivos para los socios VIP (corona dorada animada de tres puntos con halo en el botón principal del Navbar, y badges de texto 'VIP' de alto contraste junto al nombre en el dropdown de cuenta, menú móvil y perfil, contando con un rediseño de profundidad, contraste y elevación visual en modo oscuro). Incluye una sección promocional en el Home con diseño responsivo adaptado, una página dedicada (`/membership` / `Membership.jsx`) que integra el desglose completo de ventajas, preguntas frecuentes (FAQ) y pasarela de pago segura con Stripe, con sincronización de estado VIP en tiempo real (`localStorage`) al visitar la página de membresía o al retornar con éxito del checkout de Stripe.
* **Panel de Administración**: Gestión completa de inventario, incluyendo control de precios originales para mostrar descuentos y ofertas. Cuenta con tarjetas de métricas analíticas animadas, un panel lateral deslizante (Slide-over Drawer) responsivo para productos, estados de gestión de pedidos con selectores tipo botón-badge de alto contraste, una barra lateral (Sidebar) colapsable con transiciones de ancho ultra-suaves y deslizador dinámico de pestañas, un área de carga de imágenes interactiva (Drag & Drop Dropzone) con carrusel de miniaturas animadas, e historial y vigencia detallada de membresías VIP (fechas de inicio y caducidad) en la sección de clientes, todo adaptado a un sistema premium de profundidad visual en modo oscuro mediante elevación de capas, bordes ultra-finos semi-transparentes (`border-white/[0.06]`), sombras de dispersión profunda, barra de pestañas activas e indicadores con fondos translúcidos en gris vidrio (`dark:bg-white/[0.04]` y `dark:border-white/10`), tarjetas analíticas superiores y botones de descarga de reporte y paginación con estilos gris vidrio permanentes.
* **Atención al Cliente Integrada**: Centro de ayuda (FAQ) dinámico con contacto directo a WhatsApp y Email, y un botón flotante de WhatsApp global con prioridad de capa de estilo en línea (`zIndex: 99999`) y diagnóstico en consola optimizado para permanecer siempre accesible y visible en dispositivos móviles de la misma forma que en escritorio, ocultándose automáticamente en perfiles, paneles de administración, procesos de pago y al abrir el carrito de compras en cualquier sección de la web.
* **Perfil de Usuario**: Cuenta con vista unificada para datos personales, historial de compras y gestión de direcciones de envío en tarjetas con elevación premium, incluyendo un rediseño de contraste de tarjetas de direcciones y pedidos en modo claro (`bg-zinc-100/80` y `border-zinc-200`) y modo oscuro (gris vidrio `dark:bg-white/[0.04]` y `dark:border-white/10`) para una estandarización perfecta, y botones principales de guardado con micro-interacciones de escalado táctil (`hover:scale-[1.02] active:scale-95`) y transiciones de color optimizadas.

## 📦 Estructura del Proyecto

El proyecto sigue una arquitectura cliente-servidor clásica dividida en dos aplicaciones principales:

```text
/
├── backend/            # API en Node.js/Express, configuración de BD y rutas.
├── frontend/           # Aplicación React/Vite con componentes y páginas UI.
├── tasks/              # Contiene reglas de historias de usuario, historias de usuario activas y cambios de BD.
└── README.md           # Documentación principal del proyecto.
```

## ⚙️ Requisitos y Ejecución Local

Para ejecutar el proyecto localmente, asegúrate de tener instalado Node.js (v18+) y PostgreSQL.

1. **Configurar y Ejecutar Backend (Requiere abrir 2 consolas/servicios del backend)**:
   - Accede a `/backend` y ejecuta `npm install`.
   - Configura las variables de entorno (`.env`) para PostgreSQL y Stripe.
   - **Servidor API (Backend 1)**: En la primera consola de backend, ejecuta el servidor principal: `npm run dev` (por defecto en el puerto 3000).
   - **Escucha de Webhooks de Stripe (Backend 2)**: Para que los pagos y el webhook de Stripe se sincronicen localmente, abre una segunda consola en `/backend` y ejecuta el reenvío de webhooks:
     ```powershell
     ./stripe.exe listen --forward-to localhost:3000/api/webhook
     ```

2. **Clonar y configurar Frontend**:
   - Accede a `/frontend`, ejecuta `npm install`.
   - Ejecuta la aplicación de React: `npm run dev`.

---
*Fase de Desarrollo Actual: Refactorización Visual y Micro-interacciones Premium en el Perfil de Usuario y Panel de Administración.*
*Este proyecto se encuentra en constante evolución para añadir nuevas características de personalización, suscripción y mejoras de interfaz, asegurando siempre una fidelidad visual excepcional.*
