# Memoria del Proyecto: Intipa Churin

## 1. Proyecto
### Objetivo Principal y Usuarios Finales
* **Público Objetivo**: Jóvenes desde los 15 años hasta adultos de 30-35 años.
* **Estilo / Nicho**: Marca de ropa urbana. Se entiende que a medida que el cliente crece, su forma de vestir evoluciona, por lo que la marca acompaña esta transición dentro del estilo urbano.

### Reglas de Negocio y Funcionalidades
* **Modelo de Suscripción**: Se integrará un modelo de suscripción de pago. Los suscriptores tendrán acceso anticipado a prendas antes del lanzamiento oficial y envíos gratis.
* **Tipos de Colecciones**: Habrá tanto colecciones temporales (ediciones limitadas/drops) como permanentes.
* **Mínimo de Compra**: No existe un monto mínimo de compra, ya que el beneficio del envío gratis estará sujeto a la suscripción.
* **Prioridad Crítica de Desarrollo**: **La integración de pagos con Stripe**. Es la funcionalidad más importante y debe estar programada con los más altos estándares de seguridad y robustez para evitar problemas legales o financieros.

## 2. Preferencias de Desarrollo
### Convenciones de Nombres e Idioma
* **Spanglish Permitido y Preferido**: 
  - **Archivos**: Deben nombrarse en **Inglés** (ej. `ProductDetail.jsx`, `CartDrawer.jsx`).
  - **Variables/Funciones**: Se prefiere el uso del **Español** (ej. `productosFiltrados`, `agregarAlCarrito`), ya que facilita la búsqueda y comprensión por parte del creador.
* **Librerías y Tecnologías**: No hay restricciones. Se acepta la introducción de cualquier tecnología, patrón o librería nueva siempre y cuando aporte valor real y no desestabilice el proyecto.

## 3. Preferencias Personales y Flujo de Trabajo
* **Nivel de Explicación**: Se requieren explicaciones detalladas y pedagógicas, no excesivamente técnicas. El objetivo es que el desarrollador entienda el porqué de los cambios.
* **Refactorización**: Es bienvenida siempre y cuando reduzca la cantidad de código manteniendo intacta la lógica y el estilo visual. No se deben alterar los estilos de componentes UI (modales, toasts, etc.) sin permiso.
* **Manejo de Base de Datos**: **Estrictamente intocable por el Agente**. Cualquier modificación a la base de datos (PostgreSQL) debe ser provista como un bloque de código SQL explícito para que el usuario lo ejecute manualmente.
* **Gestión de Commits**:
  - El Agente crea el commit local (máx. 50 caracteres de título).
  - El Usuario realiza el `git push` manualmente.
  - Si el usuario requiere correcciones tras un commit, el Agente debe **actualizar/enmendar el commit previo** (ej. `git commit --amend`) en lugar de crear commits nuevos, manteniendo el historial limpio.
  - **Regla del README**: El archivo `README.md` se debe modificar **obligatoriamente después de realizar cada cambio y antes de hacer los commits**, de modo que los cambios del README vayan siempre dentro de la misma confirmación (commit) del código. ¡Esto es inquebrantable, no te olvides jamás de esta regla!
* **Historias de Usuario**: Cada historia de usuario debe incluir de manera obligatoria criterios de aceptación específicos dentro de su descripción (con estructura Como/Quiero/Para). Al generar historias de usuario nuevas, estas deben registrarse en el archivo de historias de usuario (`user_stories.md`) reemplazando las anteriores por las nuevas (ya que tras cada push se asume que las anteriores ya fueron subidas y procesadas en Jira).
* **Guía de Pruebas**: En cada entrega o reporte de cambios finalizados, el Agente debe incluir obligatoriamente una sección detallada explicando al usuario cómo probar de forma práctica y paso a paso que las nuevas funciones sirven y son estables en el entorno local.

