# Coservanguard - Plataforma Web Administrativa

Proyecto de Angular con el frontend del aplicativo web del proyecto de grado Coservanguard. 

Este aplicativo es el centro de control operativo, diseñado exclusivamente para el uso de personal administrativo y de mando (**Administradores, Coordinadores y Supervisores**). Desde aquí se gestiona la estructura de seguridad física y se monitorean las rondas de vigilancia en tiempo real.

*(Nota: El personal operativo o "Vigilantes" no tienen acceso a esta plataforma web; su interacción se realiza de forma exclusiva a través del aplicativo móvil).*

---

## Ruta de Uso (Paso a Paso)

### Paso 1: Autenticación en el Sistema (Login)
El punto de partida. Por seguridad, todas las rutas están protegidas mediante tokens JWT.
1. Ingresa a la URL del aplicativo web.
2. Digita tu **Cédula** y **Contraseña**.
3. Al ingresar exitosamente, el sistema validará tu rol (Admin, Coordinador o Supervisor) y te redirigirá al Dashboard principal.

### Paso 2: Gestión de Personal (Usuarios y Cargos)
Antes de asignar servicios, el sistema necesita registrar a todo el personal.
1. Dirígete al módulo de **Cargos** y verifica o crea los roles necesarios.
2. Ve al módulo de **Usuarios**.
3. Registra los datos del personal. *Asegúrate de crear también a los Vigilantes aquí para que puedan usar la app móvil, aunque no puedan iniciar sesión en esta web.*

### Paso 3: Estructura Comercial (Clientes y Sedes)
El sistema está diseñado para manejar múltiples clientes y sus respectivas sucursales.
1. Ingresa al módulo de **Clientes** y registra la empresa contratante.
2. Ve al módulo de **Sedes**.
3. Crea una nueva sede, asóciala al Cliente correspondiente y define su ubicación.

### Paso 4: Creación de Puntos de Control (Puestos)
Lugares específicos donde el vigilante deberá reportar su ronda.
1. Dirígete al módulo de **Puestos**.
2. Crea un puesto (ej. *Portería Principal*, *Sótano 1*).
3. Selecciona a qué Sede pertenece.

### Paso 5: Gestión de Asignaciones
Conecta al personal operativo con la estructura física.
1. Ve al módulo de **Asignaciones**.
2. Crea una nueva asignación vinculando a un **Usuario** (Vigilante) con un **Puesto** específico. Con esto, el vigilante verá su asignación activa al entrar a su aplicación móvil.

### Paso 6: Generación y Descarga de Códigos QR 
Para que la validación en sitio funcione, debes imprimir los identificadores físicos.
1. Dirígete al módulo de **Códigos QR**.
2. Selecciona la opción para crear un nuevo código asociándolo a un **Puesto**. 
3. El sistema inyectará las coordenadas y generará el código encriptado.
4. Utiliza el botón de **Descarga** para obtener la imagen del QR e instalarla físicamente en el puesto.

### Paso 7: Monitoreo y Reportes 
Una vez los vigilantes escaneen los QR con su app:
1. **Mapa de Puntos:** Visualiza en el mapa interactivo los marcadores georreferenciados de las rondas.
2. **Historial de Marcaciones:** Accede a la tabla de reportes para ver el registro detallado en formato lista (sólo visualización).
3. **Módulo de Reportes (Gráficas):** Ingresa a la sección de analítica para visualizar gráficas de rendimiento. Estas gráficas pueden ser filtradas por **Cliente, Sede o Puesto** y son el único elemento habilitado para su **descarga/exportación**, ideal para entregar a los clientes.

---

## Tecnologías y Arquitectura
* **Frontend Framework:** Angular 20
* **UI/UX Componentes:** Angular Material 3
* **Seguridad:** JSON Web Tokens (JWT)
* **Georreferenciación:** Integración con Leaflet para mapas interactivos.

## Despliegue Automatizado (CI/CD)
El proyecto no requiere instalación manual para su revisión, ya que se encuentra desplegado en un entorno real.
La plataforma cuenta con un flujo de **Integración y Entrega Continua (CI/CD)** configurado mediante **GitHub Actions**. Al realizar un *push* a la rama principal, el entorno compila la aplicación (`npm run build --configuration production`) y transfiere automáticamente los artefactos a un servidor web **Nginx** alojado en una Máquina Virtual de **Microsoft Azure**, garantizando disponibilidad inmediata.
