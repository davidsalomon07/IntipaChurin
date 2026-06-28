# Tarea Recurrente: Modificaciones de Base de Datos

Dado que existe una prohibición estricta sobre la alteración automática de la base de datos por parte del agente, esta es la tarea estandarizada cuando se detecta la necesidad de una modificación en el modelo de datos.

## Flujo de Ejecución

1. **Identificar la necesidad**: Se descubre que hace falta una nueva tabla, columna o registro (ej. Modelo de Suscripción).
2. **Generar SQL Explicito**: El agente redactará un script SQL compatible con PostgreSQL.
3. **Bloque de Código Aislado**: El agente presentará el script SQL en un bloque de código Markdown claro al usuario.
4. **Instrucciones Claras**: Se le pedirá al usuario que copie y ejecute este script en su gestor de PostgreSQL (pgAdmin, DBeaver, psql).
5. **Esperar Confirmación**: El agente no escribirá el código de backend dependiente de este cambio hasta que el usuario confirme que la base de datos ha sido actualizada exitosamente.
