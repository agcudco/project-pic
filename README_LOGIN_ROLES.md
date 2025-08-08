# Proyecto: Gestión de Usuarios y Roles

## Resumen de Cambios y Mejoras

### 1. Backend (Node.js + Express + PostgreSQL)

- **Tablas y relaciones:**
  - Se definieron las tablas `usuario`, `rol`, y la tabla intermedia `rol_usuario` para permitir que un usuario tenga múltiples roles.
  - Se crearon funciones y endpoints para gestionar roles y su relación con los usuarios.

- **Endpoints implementados:**
  - `/api/roles/usuario/:id`: Devuelve todos los roles asociados a un usuario específico.
  - CRUD completo para roles y usuarios.

- **Controladores:**
  - Se añadió el controlador `rolesUsuarioController.js` para obtener los roles de un usuario por su ID.

### 2. Base de Datos

- **Script de ejemplo:**
  - Se proporcionó un script SQL para crear un usuario y asignarle varios roles (por ejemplo, ADMIN y USUARIO).

### 3. Frontend (React + PrimeReact)

- **Contexto de Autenticación:**
  - Se mejoró el `AuthContext` para que, al iniciar sesión, consulte los roles del usuario y los almacene en el contexto global.

- **Selección de Roles:**
  - Se corrigió el componente de selección de roles para mostrar todos los roles asociados al usuario autenticado.
  - Se agregó validación para evitar errores si el usuario no tiene roles.

- **Diseño de Login:**
  - Se implementó un login moderno y elegante usando PrimeReact y CSS personalizado.
  - El login es responsivo, con campos flotantes y feedback visual para errores.

- **Redirección al cerrar sesión:**
  - Al cerrar sesión, el usuario es redirigido automáticamente a la página de inicio.

### 4. Archivos creados o modificados

- `src/components/login/Login.tsx`: Nuevo diseño de login.
- `src/components/login/Login.css`: Estilos personalizados para el login.
- `src/components/Roles/Roles.tsx`: Validación y visualización de roles.
- `src/context/AuthContext.tsx`: Lógica para obtener y almacenar roles del usuario.
- `project-back/controllers/rolesUsuarioController.js`: Controlador para obtener roles de usuario.
- `project-back/routes/rolRoutes.js`: Nueva ruta para obtener roles de usuario.

### 5. Uso

1. Inicia sesión con un usuario que tenga varios roles.
2. El sistema mostrará todos los roles disponibles para ese usuario.
3. El login es visualmente atractivo y funcional.
4. Al cerrar sesión, regresa a la página de inicio.

---

**Autor:**
- Adaptado y automatizado con ayuda de GitHub Copilot
