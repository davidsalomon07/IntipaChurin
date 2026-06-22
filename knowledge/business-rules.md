# Reglas de Negocio Centrales

## Gestión de Inventario y Carrito
* **Stock Exhaustivo**: No se permite agregar al carrito productos con `stock_quantity <= 0`. La UI debe reflejar visualmente (ej. tachado, deshabilitado) la indisponibilidad de estas tallas o productos.
* **Tallas Obligatorias**: A excepción del listado rápido (por ahora), agregar un producto requiere especificar la talla (`S`, `M`, `L`, `XL`).

## Precios y Ofertas
* **Descuentos Visuales**: Si un producto tiene `original_price` mayor a `price`, el frontend debe calcular y mostrar automáticamente el porcentaje de descuento en una etiqueta (*badge*), usualmente en la esquina superior izquierda de la imagen.

## Pagos y Suscripciones
* **Stripe como Única Pasarela**: La seguridad es crítica. Todas las transacciones deben enviarse al backend (`/api/checkout`) mandando el `user_id` decodificado del JWT, asegurando que solo usuarios registrados puedan comprar.
* **Suscripción VIP (Futuro)**: El modelo de envío gratis y acceso anticipado estará acoplado a un sistema de suscripción, el cual aún no está implementado en la base de datos ni en el backend.
