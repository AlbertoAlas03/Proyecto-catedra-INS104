# 🎓 Sistema de Gestión Académica — Escuela de Idiomas

<p align="center">
  <strong>Plataforma web para apoyar la gestión de los procesos académicos de administración, docentes y estudiantes.</strong>
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white">
  <img alt="Sequelize" src="https://img.shields.io/badge/Sequelize-ORM-52B0E7?logo=sequelize&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
</p>

---

## 📑 Contenido

- [Descripción general](#-descripción-general)
- [Funcionalidades principales](#-funcionalidades-principales)
- [Tecnologías y herramientas](#-tecnologías-y-herramientas)
- [Organización del proyecto](#-organización-del-proyecto)
- [Requisitos previos](#-requisitos-previos)
- [Levantar el sistema con Docker Compose](#-levantar-el-sistema-con-docker-compose)
- [Ejecutar el backend localmente](#-ejecutar-el-backend-localmente)
- [Probar el sistema](#-probar-el-sistema)
- [Solución de problemas](#-solución-de-problemas)
- [Seguridad](#-seguridad)

## 🧭 Descripción general

El **Sistema de Gestión Académica de la Escuela de Idiomas** es una aplicación web que facilita la administración y consulta de información académica para tres perfiles: **administración, docentes y estudiantes**.

El proyecto está dividido en un backend que expone una API REST y tres interfaces web independientes. La API proporciona operaciones para gestionar usuarios, idiomas, cursos, asignaciones de docentes, inscripciones, evaluaciones y notas. También incluye autenticación, manejo de sesiones, recuperación de contraseña y una tarea programada relacionada con la actualización de cursos.

## ✨ Funcionalidades principales

| Módulo | Descripción |
|---|---|
| 👥 Usuarios | Administración de usuarios y estado de sus cuentas. |
| 🌎 Idiomas | Consulta y mantenimiento de idiomas disponibles. |
| 📚 Cursos | Creación, consulta, actualización y eliminación de cursos. |
| 🧑‍🏫 Docentes | Asignación de docentes a cursos y consulta de estudiantes. |
| 🎒 Inscripciones | Inscripción de estudiantes y consulta de cursos inscritos. |
| 📝 Evaluaciones y notas | Gestión de evaluaciones y calificaciones. |
| 🔐 Autenticación | Inicio y cierre de sesión, revisión de sesión y renovación de token. |
| ✉️ Correo | Flujos de correo y cambio de contraseña. |

## 🧰 Tecnologías y herramientas

**Backend y datos**
- **Node.js** — entorno de ejecución de JavaScript.
- **Express 5** — servidor HTTP y API REST.
- **MySQL** — base de datos relacional.
- **Sequelize** — ORM para la conexión y sincronización de modelos.
- **JWT, cookies y bcryptjs** — componentes utilizados en autenticación y contraseñas.
- **dotenv** — carga de variables de entorno.
- **CORS, cookie-parser y Morgan** — configuración de orígenes, cookies y registro HTTP.
- **node-cron** — ejecución de tareas programadas.
- **Nodemailer** — envío de correos electrónicos.

**Interfaces y herramientas de desarrollo**
- **React** — interfaces web para administración, docentes y estudiantes.
- **Docker y Docker Compose** — construcción y ejecución de servicios.
- **Git y GitHub** — control de versiones y colaboración.
- **Postman o Thunder Client** — herramientas opcionales para probar endpoints.

## 🏗️ Organización del proyecto

El repositorio utiliza ramas separadas para cada parte del proyecto:

| Rama | Contenido |
|---|---|
| `Backend` | API REST, modelos, lógica del servidor y conexión a MySQL. |
| `Interfaz-admin` | Interfaz de administración. |
| `Interfaz-profesor` | Interfaz para docentes. |
| `Interfaz-estudiante` | Interfaz para estudiantes. |

### Estructura del backend

```text
src/
├── controllers/   # Lógica de las operaciones
├── database/      # Conexión a MySQL
├── emails/        # Utilidades de correo
├── middlewares/   # Autenticación y middlewares
├── models/        # Modelos y relaciones
├── routes/        # Endpoints de la API
├── utils/         # Funciones auxiliares y tareas programadas
└── index.js       # Punto de entrada del servidor
```

## ✅ Requisitos previos

Para ejecutar el sistema se necesita:

- Git.
- Docker Desktop con Docker Compose habilitado, **o** Node.js 18 o superior y npm para ejecutar el backend localmente.
- Un servidor MySQL accesible desde el backend.
- Las carpetas de las tres interfaces y sus respectivos `Dockerfile` si se va a levantar el sistema completo con Compose.

## 🐳 Levantar el sistema con Docker Compose

Se proporcionó un archivo `docker-compose.yml` para levantar cuatro servicios:

| Servicio | Puerto local | Función |
|---|---:|---|
| `backend` | `3001` | API REST |
| `interfaz_administrativa` | `3000` | Portal de administración |
| `interfaz-estudiante` | `3002` | Portal de estudiantes |
| `interfaz-profesor` | `3003` | Portal de docentes |

### 1. Organizar las carpetas

El archivo Compose recibido utiliza rutas absolutas de una computadora específica (`/Backend/...` y `/Frontend/...`). **Es necesario cambiar esas rutas** por las ubicaciones reales en tu equipo. Una opción es guardar el archivo Compose en una carpeta raíz que contenga las carpetas del backend y los tres frontends y utilizar rutas relativas.

Ejemplo de organización posible (los nombres deben coincidir con tus carpetas reales):

```text
Proyecto-catedra-INS104/
├── docker-compose.yml
├── Backend/
│   └── Proyecto-academia-idiomas-UDB/
│       ├── Dockerfile
│       └── .env
└── Frontend/
    ├── Interfaz-administrativa/my-app/
    ├── Interfaz-estudiante/my-app/
    └── Interfaz-profesores/my-app/
```

En `docker-compose.yml`, actualiza cada `build.context` y cada ruta de `env_file` para que apunte a las carpetas de tu copia local. Si utilizas rutas relativas, se resuelven desde la ubicación del archivo Compose.

### 2. Preparar las variables de entorno

Coloca el archivo de configuración del backend en la ubicación indicada por `env_file` y los archivos de configuración de estudiante y profesor en las rutas que indica Compose. Los archivos de entorno que recibiste son ejemplos de configuración; no los publiques en el repositorio.

El backend requiere estas variables:

```dotenv
PORT=3001
DATABASE=nombre_de_la_base
USER=usuario_mysql
PASSWORD=contraseña_mysql
SERVER=host.docker.internal
JWT_SECRET=reemplazar_por_un_secreto_seguro
REFRESH_SECRET=reemplazar_por_otro_secreto_seguro
SESSION_SECRET=reemplazar_por_otro_secreto_seguro
EMAIL=cuenta_de_correo
KEY_EMAIL=clave_de_aplicacion_de_correo
URL_ADMIN=http://localhost:3000
URL_TEACHER=http://localhost:3003
URL_STUDENT=http://localhost:3002
```

Los valores anteriores son una **plantilla**, no credenciales. Sustituye cada uno por la configuración de tu entorno. `host.docker.internal` permite que un contenedor Docker acceda a un servicio del equipo anfitrión en entornos compatibles; si MySQL está en otro contenedor, configura `SERVER` con el nombre del servicio de MySQL en la red Compose.

Las variables de los frontends recibidas apuntan al backend local:

```dotenv
# Interfaz de estudiante (.env)
REACT_APP_URL_BACKEND=http://localhost:3001/api/
```

```dotenv
# Interfaz de profesor (.env)
REACT_APP_BACKEND_URL=http://localhost:3001/api/
```

Respeta los nombres de variables utilizados por cada interfaz. La configuración de la interfaz administrativa debe verificarse en su propio código o archivo de entorno.

> **Base de datos:** el Compose proporcionado no define un servicio MySQL. Debes tener MySQL ejecutándose por separado y accesible desde el contenedor del backend. Crea previamente la base indicada en `DATABASE` y confirma que el usuario configurado tenga permisos suficientes.

### 3. Construir e iniciar los servicios

Abre una terminal en la carpeta donde se encuentra el archivo `docker-compose.yml` y ejecuta:

```bash
# Construir las imágenes y arrancar los servicios
docker compose up --build -d

# Ver el estado de los contenedores y los puertos
docker compose ps

# Consultar los logs de todos los servicios
docker compose logs -f

# Consultar solo los logs del backend
docker compose logs -f backend
```

Cuando los servicios estén activos, abre:

| Interfaz | Dirección |
|---|---|
| Administración | http://localhost:3000 |
| Estudiantes | http://localhost:3002 |
| Docentes | http://localhost:3003 |
| API (prueba) | http://localhost:3001/api/test |

Para detener los servicios:

```bash
docker compose down
```

> Si un servicio no inicia, revisa primero las rutas `build.context`, las rutas `env_file`, los puertos y los logs. El archivo Compose recibido no incluye automáticamente MySQL.

## 💻 Ejecutar el backend localmente

Si quieres ejecutar únicamente el backend sin Docker:

### 1. Clonar el repositorio y seleccionar la rama

```bash
git clone https://github.com/AlbertoAlas03/Proyecto-catedra-INS104.git
cd Proyecto-catedra-INS104
git switch Backend
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Crear el archivo `.env`

Crea un `.env` en la raíz del backend con las variables requeridas. Para ejecución local, `SERVER` normalmente debe ser `localhost` si MySQL se encuentra en tu propia computadora. Utiliza `PORT=3001` si deseas que coincida con el puerto de la configuración de servicios compartida.

### 4. Crear la base de datos e iniciar

Crea en MySQL la base especificada en `DATABASE` y después ejecuta:

```bash
npm run dev
```

El backend intenta autenticar la conexión y sincronizar los modelos al arrancar. Si se produce un error de conexión, revisa las variables del `.env` y el estado de MySQL.

## 🧪 Probar el sistema

### 1. Verificar la API

Con el backend en ejecución, abre esta dirección:

```text
http://localhost:3001/api/test
```

La ruta de prueba debe responder con un JSON similar a:

```json
{
  "id": 1,
  "message": "API is working"
}
```

Una respuesta `200 OK` confirma que el servidor responde. No confirma por sí sola que todas las operaciones o la conexión a la base de datos estén funcionando correctamente.

### 2. Probar con Postman o Thunder Client

Usa como URL base `http://localhost:3001`. Algunos endpoints definidos en el backend son:

| Método | Endpoint | Propósito |
|---|---|---|
| `GET` | `/api/test` | Verificar respuesta del servidor. |
| `POST` | `/api/login` | Iniciar sesión. |
| `GET` | `/api/session` | Consultar el estado de la sesión. |
| `GET` | `/api/logout` | Cerrar sesión. |
| `GET` | `/api/refresh_token` | Renovar el token de acceso. |

El cuerpo exacto de las solicitudes depende de cada controlador. Para las rutas protegidas, inicia sesión y envía las cookies o tokens que la API requiera. No se incluyen cuentas ni contraseñas de prueba.

### 3. Prueba funcional de las interfaces

1. Confirma que MySQL esté disponible.
2. Inicia los servicios con Docker Compose.
3. Abre la interfaz correspondiente a cada rol.
4. Inicia sesión con una cuenta válida.
5. Comprueba las operaciones que correspondan al perfil: cursos, inscripciones, evaluaciones, notas y administración de usuarios.
6. Si una pantalla no carga o una solicitud falla, revisa los logs de Docker y la consola de desarrollo del navegador.

## 🧯 Solución de problemas

| Problema | Qué revisar |
|---|---|
| No conecta con MySQL | Verifica que MySQL esté activo, que la base exista y que `DATABASE`, `USER`, `PASSWORD` y `SERVER` sean correctos. |
| No abre una interfaz | Ejecuta `docker compose ps`, revisa los logs y confirma el puerto publicado. |
| Error CORS | Comprueba que las variables `URL_ADMIN`, `URL_TEACHER` y `URL_STUDENT` coincidan con los orígenes y puertos reales. |
| Error `401` o `403` | Revisa si el endpoint requiere sesión y si las cookies o tokens se están enviando correctamente. |
| Contenedor detenido | Ejecuta `docker compose logs -f nombre_del_servicio`. |
| Error de rutas al construir | Corrige los `build.context` absolutos del archivo Compose para que correspondan a las carpetas de tu computadora. |
| Cambios no visibles | Confirma la rama y reconstruye los servicios con `docker compose up --build -d`. |

## 🔐 Seguridad

- No subas archivos `.env`, contraseñas, tokens ni credenciales de correo a GitHub.
- Los archivos de entorno compartidos pueden contener secretos reales. Si ya se compartieron fuera de un canal seguro, rota las contraseñas de correo y los secretos de sesión/JWT antes de utilizar el sistema.
- Usa una cuenta de MySQL con permisos mínimos y contraseñas fuertes.
- Limita los orígenes CORS a las URLs que realmente correspondan.
- No utilices datos reales de estudiantes en pruebas sin autorización.
- Antes de producción, revisa HTTPS, configuración de cookies, expiración de tokens, autorización por rol y estrategia de migraciones de base de datos.

---

<p align="center"><sub>Proyecto académico · Escuela de Idiomas · Sistema de Gestión Académica</sub></p>

