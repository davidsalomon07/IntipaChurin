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
  - El Agente crea el commit local (máx. 50 caracteres de título) únicamente cuando se realizan cambios funcionales en el código de la web. En ese commit se **DEBEN** incluir todos los archivos modificados hasta el momento (tanto código como documentación o reglas `.md`). No debe quedar ningún archivo modificado suelto.
  - Si solo se hacen cambios de datos en archivos `.md`, **NO** se hacen commits. Esos cambios se quedan modificados localmente y se guardarán en el commit siguiente en el que se realicen cambios a la web.
  - El Usuario realiza el `git push` manualmente.
  - El Agente solo tiene permiso de editar/enmendar el último commit local (ej. `git commit --amend`) si a este **NO** se le ha hecho push. Si ya se le hizo push, los nuevos cambios deben ir en un commit diferente. El usuario realiza `git push` normal sin `-f`.
  - **Regla del README**: El archivo `README.md` se debe modificar **obligatoriamente después de realizar cada cambio y antes de hacer los commits**, de modo que los cambios del README vayan siempre dentro de la misma confirmación (commit) del código. ¡Esto es inquebrantable, no te olvides jamás de esta regla!
* **Historias de Usuario**: Cada historia de usuario debe incluir de manera obligatoria criterios de aceptación específicos dentro de su descripción (con estructura Como/Quiero/Para). El archivo `tasks/user-stories.md` contiene las **reglas y directrices** para crear historias de usuario y no debe contener historias específicas. Al generar historias de usuario nuevas, estas **NO** se guardan en un archivo `.md` de la carpeta `tasks` ni del repositorio. Deben presentarse únicamente dentro del plan de implementación (`implementation_plan.md`) en la interfaz de chat de la IA, para que el usuario pueda visualizarlas en formato rico legible e interactivo, facilitando su lectura y copia sin exponer código crudo.
* **Guía de Pruebas**: En cada entrega o reporte de cambios finalizados, el Agente debe incluir obligatoriamente una sección detallada explicando al usuario cómo probar de forma práctica y paso a paso que las nuevas funciones sirven y son estables en el entorno local.

