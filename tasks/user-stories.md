# Tarea Recurrente: Historias de Usuario

Esta tarea se ejecuta automáticamente cada vez que se realice una implementación importante o un cambio significativo en el proyecto.

## Funcionalidad Activa
* **Nombre:** Página Detallada de Membresía VIP y Checkout Integrado
* **Descripción:** 
  - **Como** usuario o visitante de la plataforma, **quiero** tener acceso a una sección descriptiva en el Home y una página dedicada de información de la membresía VIP, **para** entender todos los beneficios exclusivos (15% de descuento en el catálogo, envíos gratis y acceso anticipado) antes de suscribirme y poder pagar de forma segura con Stripe en un solo clic.
  - **Criterios de Aceptación:**
    - La página de inicio (Home) debe contener una sección dedicada de la Membresía VIP, completamente adaptativa (responsive) y visualmente atractiva, que enlace a la página de detalles de la membresía.
    - La nueva página `/membership` debe renderizar con estilos de Glassmorphism acordes a la identidad visual de la marca y mostrar el precio de $5.00 USD/mes de la suscripción mensual.
    - Si el usuario no está autenticado, la página debe invitarlo a iniciar sesión, redirigiendo a la pantalla de Login y volviendo de manera segura.
    - Si el usuario está autenticado pero no es VIP, debe ver un botón de acción principal para suscribirse por $5.00 USD/mes, el cual llamará a la API `/api/checkout-membership` y lo redirigirá al checkout seguro de Stripe.
    - Si el usuario ya posee un estatus VIP activo, el sistema debe desplegar un mensaje afirmativo de "¡Ya eres Socio VIP!" acompañado de las fechas exactas de inicio y término de su membresía.
* **Subtareas:** 
  - Diseñar la sección responsiva de membresía VIP en `Home.jsx`.
  - Crear el componente de página `Membership.jsx` con Glassmorphism y consumir `/api/usuarios/perfil` para validar y actualizar el estatus.
  - Habilitar la integración del botón con la API `/api/checkout-membership` en `Membership.jsx`.
  - Configurar la ruta `/membership` en `App.jsx`.
