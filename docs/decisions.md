# Registro de Decisiones (ADR) - Intipa Churin

Este documento registra las decisiones técnicas y operativas críticas del proyecto.

## D-001: Política de Modificación de Base de Datos
* **Contexto**: El proyecto utiliza PostgreSQL como base de datos y la integridad de los datos es crítica.
* **Decisión**: La base de datos es **estrictamente intocable** por agentes automatizados. No se ejecutarán scripts SQL de forma autónoma.
* **Proceso**: Si se requiere una migración, cambio de esquema o inserción de datos, el agente redactará explícitamente el bloque de código SQL y se lo proporcionará al usuario para que este lo ejecute de forma manual.

## D-002: Política de Versionamiento (Git)
* **Contexto**: Se requiere mantener un historial de commits limpio y descriptivo.
* **Decisión**: Los títulos de los commits no deben exceder los 50 caracteres.
* **Proceso**: El agente creará los commits localmente, pero el usuario será el responsable absoluto de realizar el `git push`. Si un cambio necesita corrección antes del push, el agente **siempre usará `git commit --amend`** para modificar el último commit, evitando generar múltiples commits basura.

## D-003: Estructura, UI/UX y Reutilización
* **Contexto**: La marca requiere un estilo urbano premium y fidelidad visual en todas sus páginas.
* **Decisión**: Se conservan celosamente los estilos actuales (modales, toasts, paleta de colores). 
* **Política de Reutilización**: Si existe un diseño de botón (ej. el botón de agregar al carrito con *glassmorphism*) o un componente de UI que ya cumple una función estética, **debe ser reutilizado** en otras partes de la web en lugar de crear estilos nuevos desde cero. Esto garantiza la fidelidad visual y reduce código duplicado. Cualquier refactorización debe orientarse a aislar estos elementos en componentes reutilizables si es necesario.

## D-004: Mantenimiento del README
* **Contexto**: El proyecto necesita una portada clara (`README.md`) para entender su alcance sin ensuciarse con archivos internos de documentación.
* **Decisión**: El archivo `README.md` no incluirá información sobre la estructura de conocimiento orgánico gestionado por el agente (carpetas `docs/`, `skills/`, `tasks/`, `knowledge/`, `checklists/`, `examples/`).
* **Proceso**: El agente **actualizará de forma automática el `README.md`** cada vez que se complete de forma exitosa una característica y el usuario haga push, o cuando se transicione a una planificación de una nueva fase de desarrollo.
