You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Agregar un log en el proceso de arranque (startup) de la aplicación React para facilitar el seguimiento y diagnóstico.

## SCOPE
### In scope
- Modificar el archivo src/main.tsx donde se realiza el bootstrap de la aplicación React.
- Agregar un log informativo que indique que la aplicación ha iniciado el proceso de arranque.
- Asegurar que el log se ejecute al inicio antes de que la aplicación se renderice.
- Mantener las convenciones de código y formato existentes (TypeScript, 2 espacios, printWidth 110).
### Out of scope
- Cambios en la lógica de negocio o funcionalidades de la aplicación.
- Modificaciones en otros módulos o features que no estén relacionados con el arranque.
- Cambios en la configuración de despliegue o CI/CD.
- Implementación de sistemas de logging avanzados o externos.

## TECHNICAL CONTEXT
- La aplicación es un SPA React 18 bootstrapped con Vite, con código principal en src/main.tsx y src/App.tsx.
- El bootstrap de la app ocurre en src/main.tsx, donde se aplica el CSS global y se invoca reportWebVitals.
- El proyecto usa TypeScript 5, con convenciones estrictas y formateo definido en .vscode/settings.json y .prettierrc.
- El entorno de ejecución es ESM-only con Vite 7.
- El log debe integrarse respetando la estructura y estilo del código existente.
- No se usa un sistema de logging externo, por lo que se recomienda usar console.log para el mensaje.
- El log debe ser condicionalmente visible en entornos de desarrollo para evitar ruido en producción.

## CONSTRAINTS
- No introducir dependencias nuevas para logging.
- Seguir las convenciones de formateo y organización de imports.
- El log debe ser claro y descriptivo, indicando que la aplicación está iniciando.
- No afectar el rendimiento ni la experiencia de usuario.
- El cambio debe ser mínimo y localizado en src/main.tsx.
- El log debe poder ser deshabilitado fácilmente para producción si es necesario.

## ASSUMPTIONS
- El archivo src/main.tsx es el punto adecuado para agregar el log de startup.
- El equipo acepta el uso de console.log para logs simples de diagnóstico.
- No se requiere configuración adicional para habilitar o deshabilitar el log.
- El entorno de desarrollo permite visualizar logs en la consola del navegador.
- No existen mecanismos automáticos de logging que deban ser integrados o respetados.

## ACCEPTANCE CRITERIA
- Al iniciar la aplicación localmente (y en entornos de desarrollo), se muestra en consola un mensaje claro indicando que la aplicación está arrancando.
- El mensaje de log aparece antes de que la aplicación se renderice en el DOM.
- No se generan errores ni warnings relacionados con el log.
- El código modificado cumple con las reglas de formateo y linting del proyecto.
- El cambio es revisado y aprobado en el control de versiones.
- El log no aparece en entornos de producción si se configura así (opcional).

## EXECUTION PLAN
- Abrir el archivo src/main.tsx donde se realiza el bootstrap de la aplicación.
- Agregar una línea console.log con un mensaje descriptivo, por ejemplo: 'App startup: iniciando aplicación'.
- Colocar el log al inicio del archivo, antes de la llamada a ReactDOM.createRoot o render.
- Verificar que el mensaje se muestre correctamente al iniciar la app en entorno local.
- Ejecutar linters y formateadores para asegurar cumplimiento de convenciones.
- Realizar pruebas básicas de arranque para confirmar que no hay impactos negativos.
- Documentar el cambio en el commit con un mensaje claro.
- Opcional: agregar lógica para que el log solo aparezca en entornos de desarrollo (por ejemplo, usando import.meta.env.MODE).

## RISK AREAS
- Agregar el log en un lugar incorrecto que pueda afectar el flujo de arranque.
- Generar ruido excesivo en consola en producción si no se controla adecuadamente.
- Romper convenciones de código o formateo que provoquen fallos en CI.
- Olvidar validar que el log no impacta el rendimiento o la experiencia de usuario.

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate