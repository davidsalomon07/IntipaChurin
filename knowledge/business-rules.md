# Reglas de Negocio Centrales

## Gestión de Inventario y Carrito
* **Stock Exhaustivo**: No se permite agregar al carrito productos con `stock_quantity <= 0`. La UI debe reflejar visualmente (ej. tachado, deshabilitado) la indisponibilidad de estas tallas o productos.
* **Tallas Obligatorias**: A excepción del listado rápido (por ahora), agregar un producto requiere especificar la talla (`S`, `M`, `L`, `XL`).

## Precios y Ofertas
* **Descuentos Visuales**: Si un producto tiene `original_price` mayor a `price`, el frontend debe calcular y mostrar automáticamente el porcentaje de descuento en una etiqueta (*badge*), usualmente en la esquina superior izquierda de la imagen.

## Pagos y Suscripciones
* **Stripe como Única Pasarela**: La seguridad es crítica. Todas las transacciones deben enviarse al backend (`/api/checkout`) mandando el `user_id` decodificado del JWT, asegurando que solo usuarios registrados puedan comprar.
* **Suscripción VIP (Activa)**: El modelo de membresías VIP está completamente implementado. Los usuarios pueden suscribirse por una tarifa anual de $50.00 a través de Stripe. Al activarse la membresía, se otorga de forma automática un 15% de descuento en el subtotal del carrito de compras y en la pasarela de pagos de Stripe, además de habilitar envíos gratis y beneficios exclusivos de socio VIP.
