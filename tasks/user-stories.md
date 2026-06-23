# Tarea Recurrente: Historias de Usuario

Esta tarea se ejecuta automáticamente cada vez que se realice una implementación importante o un cambio significativo en el proyecto.

## Flujo de Ejecución y Condición
Al finalizar la implementación de una **NUEVA FUNCIONALIDAD MAYOR** (ej. un nuevo filtro, sistema de paginación, nuevo flujo de compra), el agente generará un documento que describa la funcionalidad implementada bajo el formato de Historia de Usuario.

**EXCEPCIONES (NO crear historia de usuario):**
* Correcciones de errores (Bugfixes).
* Retoques visuales o modificaciones menores de UI (ej. cambiar colores del header, márgenes, textos).
* Refactorización de código que no añade valor de negocio visible al usuario.

## Formato Estricto Requerido
* **Nombre:** [Nombre descriptivo de la funcionalidad]
* **Descripción:** [Descripción detallada desde la perspectiva del usuario final o de negocio]
* **Subtareas:** (Opcional, solo si aplica para desglosar el cambio)
  - [Subtarea 1]
  - [Subtarea 2]

## Regla de Extractos de Código
* **Código Corto y Literal:** Si se requiere incluir código en una subtarea, debe ser un fragmento **extremadamente corto y literal** (ej. nombre de un estado, variable o función simple).
* **Evitar Código Largo:** Si el extracto que se quiere poner es largo (como operadores ternarios complejos, clases CSS extensas, o lógica anidada), **está prohibido poner el extracto de código**. En su lugar, se debe escribir únicamente una subtarea descriptiva que defina claramente el comportamiento en lenguaje natural.
