# Tarea Recurrente: Historias de Usuario

Esta tarea se ejecuta automáticamente cada vez que se realice una implementación importante o un cambio significativo en el proyecto.

## Funcionalidad Activa
* **Nombre:** Motor de Suscripción VIP y Descuentos Dinámicos (Backend)
* **Descripción:** 
  - **Como** usuario registrado, **quiero** poder adquirir una membresía VIP mediante Stripe, **para** obtener automáticamente descuentos en mis compras futuras, acceso anticipado y envíos gratis.
  - **Criterios de Aceptación:**
    - El sistema debe contar con un endpoint para generar la sesión de pago de la membresía con `tipo_compra: membresia`.
    - Al confirmarse el pago por webhook, el sistema debe actualizar el rol del usuario a VIP e insertar el registro correspondiente en la tabla de membresías.
    - El checkout de productos debe detectar de forma autónoma si el usuario posee una membresía activa y recalcular los precios aplicando el porcentaje de descuento antes de enviar el cobro a Stripe.
* **Subtareas:** 
  - Crear ruta `POST /api/checkout-membership`.
  - Agregar lógica bifurcada en `POST /api/webhook`.
  - Crear bloque de validación y cálculo de `discountRate` en `POST /api/checkout`.
