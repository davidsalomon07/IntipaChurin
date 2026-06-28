# Checklist Pre-Commit y Revisiones

Esta lista de comprobación se aplica implícitamente antes de finalizar la escritura de código y proceder con un commit.

## Revisión de Código (Frontend)
- [ ] ¿Se mantuvieron intactos los estilos visuales principales (especialmente componentes flotantes y modales)?
- [ ] ¿El nuevo código reduce o mantiene la complejidad? (Sin repetición innecesaria).
- [ ] ¿Los nombres de archivo están en Inglés (`PascalCase` para componentes)?
- [ ] ¿Las variables de lógica de negocio están preferiblemente en Español (`camelCase`) para rápida ubicación?

## Revisión de Versionamiento (Git)
- [ ] ¿El título del commit tiene 50 caracteres o menos?
- [ ] Si se detectaron errores *después* de un commit no pusheado, ¿Se utilizó `git commit --amend` para enmendar el error en vez de crear un commit basura?
- [ ] ¿Se le notificó claramente al usuario que el commit local está listo para que él haga el `git push` manualmente?
