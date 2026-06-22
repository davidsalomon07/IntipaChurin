# Intipa Churin - E-commerce

Bienvenido al repositorio oficial de **Intipa Churin**, una plataforma de comercio electrónico diseñada para una marca de ropa urbana premium. Este proyecto acompaña la evolución del estilo urbano para clientes entre 15 y 35 años, priorizando una experiencia de usuario (UX) moderna, rápida y segura.

## 🚀 Tecnologías Principales

### Frontend
- **React 19** + **Vite**: Desarrollo ágil y renderizado optimizado.
- **Tailwind CSS 4**: Estilos utilitarios rápidos y diseños premium (*glassmorphism*, dark mode, animaciones).
- **React Router DOM**: Enrutamiento del lado del cliente.
- **Lucide React**: Iconografía moderna.
- **Zustand / Context API**: Gestión del estado global (Carrito, Lista de Deseos, Autenticación).

### Backend
- **Node.js** + **Express**: API RESTful robusta y escalable.
- **PostgreSQL** + **pg**: Base de datos relacional para garantizar la integridad de productos, usuarios y pedidos.
- **Stripe**: Pasarela de pagos segura e integración mediante Webhooks.
- **JWT (JSON Web Tokens)** + **Bcrypt**: Autenticación y encriptación de contraseñas.
- **Multer**: Gestión de carga de archivos e imágenes.

## 🌟 Funcionalidades Clave

* **Catálogo Dinámico**: Filtrado en tiempo real por categoría, precio, color y talla. Búsqueda global sincronizada.
* **Sistema de Carga Premium**: Esqueletos (Shimmer effects) globales en toda la tienda para evitar tiempos muertos visuales.
* **Gestión de Carrito y Favoritos**: Funcionalidad completa de e-commerce con panel lateral (Drawer) optimizado.
* **Integración de Pagos con Stripe**: Proceso de checkout asegurado.
* **Modelo de Suscripción (En desarrollo)**: Sistema de beneficios VIP (acceso anticipado y envíos gratis).
* **Panel de Administración**: Gestión completa de inventario, incluyendo control de precios originales para mostrar descuentos y ofertas.
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
*Este proyecto se encuentra en constante evolución para añadir nuevas características de personalización, suscripción y mejoras de interfaz, asegurando siempre una fidelidad visual excepcional.*
