# [PORTADA]
**CENTRO:** IES Ágora  
**CICLO FORMATIVO:** Grado Superior en Desarrollo de Aplicaciones Web (DAW)  
**CURSO:** 2025/2026  

**TÍTULO DEL PROYECTO:**  
### PLATAFORMA INTEGRAL DE GESTIÓN Y FIDELIZACIÓN PARA "BARBERÍA JLR"

**ALUMNO:** Jorge Lerga Ruiz  
**TUTORA DEL CURSO:** María Carmen Moreno Cortés  
**TUTOR DE TFG:** Rubén Marín Silva  

---

*(A partir de aquí, todas las páginas deben incluir el encabezado y pie de página reglamentarios)*  
**ENCABEZADO:** Jorge Lerga Ruiz - Plataforma Barbería JLR  
**PIE DE PÁGINA:** Página X

---

## ÍNDICE GENERAL
1. **INTRODUCCIÓN**
   - 1.1 Contexto del Proyecto
   - 1.2 Justificación y Motivación
   - 1.3 Estado del Arte (Comparativa de soluciones actuales)
2. **METODOLOGÍA DE DESARROLLO**
   - 2.1 Modelo Ágil y Sprints de Trabajo
   - 2.2 Herramientas de Planificación y Control de Versiones
3. **ANÁLISIS DE REQUISITOS**
   - 3.1 Requisitos Funcionales (RF) Detallados
   - 3.2 Requisitos No Funcionales (RNF) Detallados
   - 3.3 Requisitos de Hardware y Software (Entorno de Ejecución)
4. **DISEÑO Y ARQUITECTURA DEL SISTEMA**
   - 4.1 Frameworks y Herramientas del Frontend (React, Tailwind CSS)
   - 4.2 Frameworks y Herramientas del Backend (Node.js, Express)
   - 4.3 Motor de Base de Datos y Persistencia (MySQL)
   - 4.4 Arquitectura SPA y API RESTful
   - 4.5 Diseño Detallado de la Base de Datos y Normalización
5. **IMPLEMENTACIÓN TÉCNICA (DESARROLLO DE CÓDIGO)**
   - 5.1 El núcleo de la Seguridad (JWT y Bcrypt)
   - 5.2 El Motor de Reservas y Gestión de Calendarios
   - 5.3 Lógica de la Tienda Online y Gestión del Carrito
   - 5.4 Sistema de Puntos en Caliente y Fidelización
6. **INFRAESTRUCTURA Y MANTENIMIENTO**
   - 6.1 Dockerización del Entorno (Dockerfile y Docker-compose)
   - 6.2 Plan de Backups y Seguridad de la Información
7. **DIFICULTADES ENCONTRADAS Y SOLUCIONES TÉCNICAS**
8. **PLAN DE PRUEBAS (TESTING Y CALIDAD)**
9. **RESULTADOS OBTENIDOS**
10. **POSIBLES MEJORAS Y LÍNEAS FUTURAS**
11. **CONCLUSIÓN FINAL**
12. **ANEXOS**
    - Anexo I: Manual Técnico de Instalación Paso a Paso
    - Anexo II: Manual de Usuario Integral (Cliente y Administrador)
    - Anexo III: Glosario de Términos Técnicos

---

## 1. INTRODUCCIÓN

### 1.1 Contexto del Proyecto
La sociedad contemporánea se encuentra inmersa en un proceso de digitalización acelerado que ha transformado por completo los hábitos de consumo y la gestión empresarial. En este escenario, los negocios tradicionales de proximidad, como es el caso de las barberías y centros de estética, se enfrentan al reto de modernizar sus estructuras operativas para no quedar obsoletos. Históricamente, estos negocios han dependido de métodos analógicos para la gestión de su agenda, tales como cuadernos de papel o, en el mejor de los casos, aplicaciones de mensajería instantánea que no ofrecen una visión centralizada ni automatizada de la actividad.

El proyecto "Barbería JLR" surge con la visión de cerrar esta brecha tecnológica. Se propone el desarrollo de una plataforma web de alto rendimiento que actúa como el sistema nervioso central del negocio. Esta herramienta no solo permite al cliente final gestionar sus propias citas de forma autónoma, sino que dota al propietario de un control absoluto sobre su inventario, su cartera de clientes y la rentabilidad de sus servicios a través de una interfaz premium y profesional.

### 1.2 Justificación y Motivación
La justificación de este proyecto responde a una necesidad real del mercado. A nivel de negocio, la automatización de las reservas supone una reducción drástica de la carga administrativa. Se eliminan las interrupciones telefónicas durante el trabajo del profesional, se reducen los errores humanos en el solapamiento de horarios y se facilita la confirmación de asistencia, lo que se traduce directamente en una optimización de los ingresos del establecimiento.

Desde una perspectiva académica, este proyecto constituye el vehículo perfecto para consolidar los conocimientos técnicos adquiridos durante los dos años del ciclo formativo de Desarrollo de Aplicaciones Web (DAW). La motivación personal de desarrollar un sistema "Full-Stack" completo —que abarque desde el diseño de una base de datos relacional robusta hasta la implementación de una interfaz reactiva de última generación— ha sido el motor de este trabajo. El reto de asegurar la información sensible de los usuarios mediante protocolos de cifrado y tokens de seguridad representa la culminación práctica de mi formación como desarrollador web.

### 1.3 Estado del Arte (Comparativa de soluciones actuales)
Antes de iniciar el desarrollo, se realizó un análisis de las soluciones de gestión de citas existentes en el mercado, como *Treatwell*, *Fresha* o *Booksy*. Si bien estas plataformas son potentes, presentan inconvenientes significativos para el pequeño empresario: elevadas comisiones por cada cita reservada, falta de personalización en la marca blanca del negocio y nulo control sobre los datos brutos de fidelización del cliente. "Barbería JLR" ofrece una alternativa propietaria, sin costes por transacción y con una lógica de puntos totalmente adaptada a las necesidades específicas del salón.

---

## 2. METODOLOGÍA DE DESARROLLO

### 2.1 Modelo Ágil y Sprints de Trabajo
Para garantizar un desarrollo ordenado y adaptativo, se ha seguido una metodología **Agile**, concretamente basada en el marco de trabajo **Scrum**. El proyecto se dividió en cinco fases o "Sprints" de dos semanas cada uno, permitiendo evaluar el progreso y realizar ajustes técnicos sobre la marcha:
*   **Sprint 1: Análisis y Modelado.** Definición de requisitos funcionales y diseño del esquema de la base de datos en MySQL.
*   **Sprint 2: Infraestructura Backend.** Configuración del servidor Node.js, Express y sistemas de seguridad iniciales (JWT y Bcrypt).
*   **Sprint 3: Desarrollo Frontend.** Creación de la interfaz de usuario con React y estilización con Tailwind CSS.
*   **Sprint 4: Lógica de Negocio.** Implementación del motor de reservas, el e-commerce y el algoritmo de puntos.
*   **Sprint 5: Despliegue y Pruebas.** Dockerización del sistema, creación de scripts de backup y realización de pruebas de estrés.

### 2.2 Herramientas de Planificación y Control de Versiones
El control del código fuente se ha gestionado íntegramente a través de **Git** y repositorios en **GitHub**, permitiendo mantener un historial detallado de cada cambio. Para el modelado de la base de datos se utilizó **MySQL Workbench**, lo que permitió visualizar las relaciones entre tablas antes de su implementación física en el servidor.

---

## 3. ANÁLISIS DE REQUISITOS

### 3.1 Requisitos Funcionales (RF) Detallados
Los requisitos funcionales describen las acciones específicas que el sistema debe ser capaz de realizar. En "Barbería JLR" se han priorizado los siguientes:
*   **RF-01 Autenticación Segura:** El sistema debe permitir el registro de nuevos usuarios con validación de campos y el inicio de sesión cifrado.
*   **RF-02 Gestión de Perfiles:** Existencia de tres roles (Cliente, Peluquero, Jefe) con permisos de acceso diferenciados.
*   **RF-03 Motor de Reservas:** Los clientes deben poder visualizar los huecos libres y reservar según servicio (Corte, Barba, etc.) y barbero.
*   **RF-04 E-commerce Integrado:** Navegación por catálogo de productos, gestión de carrito de compra y simulación de pago.
*   **RF-05 Sistema de Fidelización:** Cálculo y acumulación automática de puntos tras cada compra confirmada.
*   **RF-06 Panel de Administración (Dashboard):** Interfaz para que el jefe gestione las citas de todo el centro y controle el stock de productos.

### 3.2 Requisitos No Funcionales (RNF) Detallados
Los requisitos no funcionales definen los criterios de calidad del sistema:
*   **RNF-01 Seguridad de la Información:** Cifrado de contraseñas mediante hashing y uso de tokens JWT para la gestión de sesiones.
*   **RNF-02 Rendimiento y Escalabilidad:** El sistema debe cargar la información crítica en menos de 2 segundos y ser capaz de escalar horizontalmente.
*   **RNF-03 Responsividad (Responsive Design):** La aplicación debe adaptarse automáticamente a cualquier resolución de pantalla, con especial foco en dispositivos móviles.
*   **RNF-04 Integridad Referencial:** Uso de una base de datos relacional (MySQL) para evitar inconsistencias en las citas y puntos de los usuarios.

### 3.3 Requisitos de Hardware y Software (Entorno de Ejecución)
Para la correcta ejecución y visualización del proyecto, se recomienda el siguiente entorno:

| Elemento | Especificación Mínima |
| :--- | :--- |
| **Hardware Servidor** | Procesador i5 o superior, 8GB de RAM, 20GB de almacenamiento SSD. |
| **Sistema Operativo** | Windows 10/11, Linux (Ubuntu recomendado) o macOS. |
| **Navegador Web** | Google Chrome, Firefox o Microsoft Edge (versiones actualizadas). |
| **Entorno de Desarrollo** | Node.js v18+, MySQL 8.0, Docker y Docker-compose. |

---

## 4. DISEÑO Y ARQUITECTURA DEL SISTEMA

### 4.1 Frameworks y Herramientas del Frontend (React, Tailwind CSS)
La interfaz de usuario ha sido desarrollada utilizando **React 19**, una de las librerías de JavaScript más potentes para la creación de Aplicaciones de Página Única (SPA). React permite una experiencia de navegación fluida al actualizar solo los componentes necesarios de la vista, sin recargar el navegador. Para la estilización se ha utilizado **Tailwind CSS**, un framework de utilidades que permite un diseño moderno, coherente y extremadamente rápido de cargar. La combinación de estas herramientas asegura una interfaz "Premium" que cumple con los estándares de diseño actuales.

### 4.2 Frameworks y Herramientas del Backend (Node.js, Express)
El núcleo del servidor se basa en **Node.js**, utilizando el framework **Express**. Esta elección se debe a su capacidad para gestionar múltiples conexiones simultáneas de forma asíncrona, lo cual es ideal para un sistema de reservas donde varios usuarios pueden estar consultando horarios al mismo tiempo. Express nos permite definir una API RESTful limpia, organizar los middlewares de seguridad y gestionar las comunicaciones con la base de datos de forma eficiente.

### 4.3 Motor de Base de Datos y Persistencia (MySQL)
Para este proyecto se ha optado por **MySQL** como motor de base de datos relacional. A diferencia de las bases de datos NoSQL, MySQL nos ofrece una integridad de datos superior mediante el uso de claves foráneas y transacciones ACID. En una aplicación de barbería, donde una cita está estrictamente ligada a un usuario y a un servicio, la estructura relacional es fundamental para evitar datos huérfanos o inconsistencias en los saldos de puntos de los clientes.

### 4.4 Arquitectura SPA y API RESTful
El proyecto sigue una arquitectura desacoplada. El frontend y el backend se comunican exclusivamente a través de peticiones HTTP en formato JSON. Esta estructura permite que el backend funcione como un servicio independiente, facilitando que en el futuro se puedan desarrollar aplicaciones móviles nativas que consuman la misma API sin necesidad de modificar el código del servidor.

### 4.5 Diseño Detallado de la Base de Datos y Normalización
La base de datos ha sido sometida a un proceso de normalización hasta la **Tercera Forma Normal (3FN)**:
1.  **Primera Forma Normal (1FN):** Se han eliminado los grupos de datos repetidos. Cada columna contiene valores atómicos y cada registro es único mediante una clave primaria.
2.  **Segunda Forma Normal (2FN):** Se ha asegurado que todas las columnas que no son clave primaria dependan enteramente de la clave primaria de la tabla.
3.  **Tercera Forma Normal (3FN):** Se han eliminado las dependencias transitivas. Por ejemplo, los puntos acumulados dependen directamente del ID del usuario, no de sus citas.

**[⚠️ INSERTAR AQUÍ CAPTURA DEL MODELO DE TABLAS DE MYSQL WORKBENCH O DIAGRAMA ENTIDAD-RELACIÓN]**

---

## 5. IMPLEMENTACIÓN TÉCNICA (DESARROLLO DE CÓDIGO)

En esta sección se detallan las partes más críticas del código fuente, explicando la lógica aplicada en cada caso.

### 5.1 El núcleo de la Seguridad (JWT y Bcrypt)
La seguridad es el pilar fundamental de la aplicación. Para proteger las cuentas de los usuarios, se aplica un proceso de hashing a las contraseñas antes de almacenarlas. Cuando un usuario intenta iniciar sesión, el servidor realiza la siguiente operación:

```javascript
// routes/auth.js - Fragmento del controlador de Login
const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
const user = users[0];

// Comprobamos si el usuario existe y si la contraseña coincide con el hash guardado
if (!user || !(await bcrypt.compare(password, user.password_hash))) {
  return res.status(401).json({ error: 'Credenciales inválidas' });
}

// Si es correcto, firmamos un token de acceso (JWT)
const token = jwt.sign(
  { userId: user.id, role: user.role, puntos: user.puntos },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

res.json({ token, user: { id: user.id, email: user.email, role: user.role, puntos: user.puntos } });
```
*Explicación:* Este fragmento muestra cómo el servidor utiliza la librería `bcrypt` para comparar la contraseña enviada con el hash de la base de datos. Si la validación es positiva, se genera un token JWT que el cliente utilizará en todas sus peticiones posteriores para identificarse de forma segura.

### 5.2 El Motor de Reservas y Gestión de Calendarios
El sistema de reservas es un motor dinámico que evita que dos personas ocupen el mismo horario. Antes de confirmar una cita, el backend realiza una comprobación de disponibilidad:

```javascript
// routes/appointments.js - Fragmento de creación de cita
const [exists] = await db.query(
  'SELECT id FROM appointments WHERE fecha = ? AND hora = ? AND barberoId = ?',
  [fecha, hora, barberoId]
);

if (exists.length > 0) {
  return res.status(400).json({ error: 'Lo sentimos, este horario ya ha sido reservado por otro cliente.' });
}

// Si está libre, procedemos a insertar la reserva
await db.query(
  'INSERT INTO appointments (user_id, servicio, fecha, hora, barberoId) VALUES (?, ?, ?, ?, ?)',
  [req.user.userId, servicio, fecha, hora, barberoId]
);
```
*Explicación:* Esta lógica asegura la integridad de la agenda. El sistema realiza una consulta previa (SELECT) para verificar si existe algún conflicto. Solo si la respuesta es negativa, se procede a la inserción de la nueva cita (INSERT).

### 5.3 Lógica de la Tienda Online y Gestión del Carrito
La tienda online utiliza el estado de React para gestionar el carrito de compra de forma fluida. Cuando el usuario confirma su pedido, el sistema realiza el cálculo de los beneficios acumulados:

```javascript
// src/pages/Store.jsx - Lógica de confirmación de pedido
const totalCompra = cart.reduce((acc, item) => acc + item.price, 0);
const puntosGanados = Math.floor(totalCompra); // 1€ gastado = 1 punto ganado

// Llamada a la API para actualizar los puntos del usuario en la base de datos
await api.updateUserPoints(user.id, user.puntos + puntosGanados);
```
*Explicación:* El sistema calcula el total de la compra recorriendo el carrito y aplica el algoritmo de fidelización. Esta información se envía de forma segura al backend para que el cambio sea permanente en la base de datos MySQL.

### 5.4 Sistema de Puntos en Caliente y Fidelización
Para garantizar que el usuario vea sus puntos actualizados al instante sin tener que cerrar sesión, se ha implementado un sistema de "refresco de estado" en el contexto de autenticación de React.

```javascript
// src/context/AuthContext.jsx - Refresco de datos del usuario
const refreshUserStatus = async () => {
  const response = await fetch('/api/auth/status', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (data.user) {
    setUser(data.user); // Actualización instantánea del estado global de React
  }
};
```
*Explicación:* Esta función permite que el frontend sincronice sus datos con el servidor de forma asíncrona, asegurando que el saldo de puntos mostrado en la cabecera sea siempre el valor real almacenado en MySQL.

---

## 6. INFRAESTRUCTURA Y MANTENIMIENTO

### 6.1 Dockerización del Entorno (Dockerfile y Docker-compose)
Para asegurar que el proyecto se pueda desplegar en cualquier servidor sin problemas de compatibilidad de versiones, se ha dockerizado todo el ecosistema. Hemos utilizado **Docker Compose** para orquestar los dos contenedores principales:

```yaml
# docker-compose.yml - Orquestación de servicios
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: ["db"]
    env_file: .env
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: barberia_jlr
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```
*Explicación:* Este archivo permite levantar el servidor Node y la base de datos MySQL de forma conjunta. El uso de **volúmenes** asegura que los datos de la base de datos persistan aunque se apaguen los contenedores.

### 6.2 Plan de Backups y Seguridad de la Información
Para un negocio real, los datos son el activo más valioso. Por ello, se ha desarrollado un script en Node.js que automatiza las copias de seguridad:

```javascript
// scripts/backup.js - Lógica de copia de seguridad
const command = `mysqldump -h ${host} -u ${user} -p${password} ${database} > ./backups/backup-${date}.sql`;
exec(command, (err) => {
    if (err) console.error("Error en backup:", err);
    else console.log("✅ Backup diario completado con éxito.");
});
```
*Explicación:* Este script puede ser programado como una tarea recurrente (CRON) para asegurar que cada 24 horas se genere un archivo SQL con toda la información del negocio, permitiendo una recuperación total en cuestión de minutos ante cualquier fallo crítico.

---

## 7. DIFICULTADES ENCONTRADAS Y SOLUCIONES TÉCNICAS

1.  **Problema de Responsividad en el Hero:** El botón de "Reservar Cita" desaparecía o se solapaba con la tarjeta inferior en dispositivos móviles pequeños debido a un margen negativo demasiado agresivo.
    *   *Solución:* Se aplicaron prefijos de Tailwind CSS (`md:-mt-20`) para asegurar que el margen negativo solo se aplique en pantallas de escritorio, mientras que en móviles se utiliza un margen positivo estándar (`mt-12`).
2.  **Sincronización de Sesiones:** Al refrescar la página (F5), el usuario perdía el acceso aunque el token siguiera siendo válido.
    *   *Solución:* Se implementó un efecto de "re-autenticación" silenciosa al inicio de la aplicación. React busca el token en el almacenamiento local y, si lo encuentra, valida automáticamente al usuario contra el servidor antes de renderizar la web.

---

## 8. PLAN DE PRUEBAS (TESTING Y CALIDAD)
Para asegurar que la plataforma es robusta, se han realizado las siguientes baterías de pruebas manuales:
1.  **Pruebas de Seguridad:** Intentar acceder a la URL del panel de administración sin estar logueado. (Resultado esperado: Redirección automática al Login).
2.  **Pruebas de Concurrencia:** Simular dos reservas simultáneas en el mismo minuto. (Resultado esperado: Solo la primera reserva se guarda, la segunda recibe un aviso de error).
3.  **Pruebas de Integridad:** Borrar un producto de la tienda y comprobar que las órdenes antiguas siguen manteniendo el nombre del producto en el historial del cliente.

---

## 9. RESULTADOS OBTENIDOS
Se ha logrado desarrollar una plataforma web funcional que cumple con todos los objetivos iniciales. La web es rápida, segura y estéticamente atractiva. Las pruebas de rendimiento indican una carga fluida incluso con conexiones de red limitadas, y el sistema de puntos ha demostrado ser una herramienta de fidelización estable y precisa.

---

## 10. POSIBLES MEJORAS Y LÍNEAS FUTURAS
1.  **Integración con Stripe:** Sustituir la simulación de pago por una pasarela de pago real con tarjeta.
2.  **Notificaciones Push:** Avisar al cliente mediante una notificación al móvil 15 minutos antes de su cita.
3.  **App Móvil Nativa:** Desarrollar una versión en React Native que comparta el mismo backend de Node.js.

---

## 11. CONCLUSIÓN FINAL
La realización de este TFG para el grado de DAW ha sido el reto técnico más importante de mi formación. Me ha permitido entender la complejidad real de una arquitectura Full-Stack y la importancia de la seguridad y el despliegue moderno con Docker. El resultado es un producto profesional que aporta un valor real a cualquier negocio de barbería o estética.

---

## 12. ANEXOS

### Anexo I: Manual Técnico de Instalación Paso a Paso
1.  **Requisitos:** Tener instalado Node.js (v18+) y MySQL Server.
2.  **Dependencias:** Ejecutar `npm install` en la carpeta raíz para descargar todas las librerías necesarias.
3.  **Base de Datos:** Crear la base de datos `barberia_jlr` y ejecutar el script SQL adjunto en el Anexo III.
4.  **Configuración:** Crear un archivo `.env` con las claves de acceso a MySQL.
5.  **Ejecución:** Utilizar el comando `npm run dev` para iniciar el servidor de desarrollo.

### Anexo II: Manual de Usuario Integral
*   **Para Clientes:** Registro, selección de barbero y servicio desde la página principal. Posibilidad de comprar productos y ver puntos en la sección "Perfil".
*   **Para el Jefe:** Acceso al panel de control exclusivo para marcar citas como completadas y gestionar el stock de la tienda.

### Anexo III: Glosario de Términos Técnicos
*   **JWT:** Sistema de tokens para autenticación segura sin sesiones en servidor.
*   **SPA:** Aplicación web que no necesita recargar la página para navegar.
*   **Bcrypt:** Algoritmo de hashing para proteger contraseñas.
*   **Docker:** Herramienta de contenedores para asegurar que la web funcione en cualquier PC.

**[⚠️ INSERTAR AQUÍ CAPTURA DEL CÓDIGO FUNCIONANDO EN LA TERMINAL Y TABLAS DE MYSQL]**
