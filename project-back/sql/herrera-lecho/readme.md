# 📦 Sistema de Promociones y Descuentos

Este proyecto permite **crear** y **consultar** promociones y descuentos en la plataforma.  
⚠️ **No está permitido modificar ni eliminar registros** una vez creados.

---

## ✅ Funcionalidad del sistema

- ✅ Crear promociones y descuentos
- ✅ Ver (listar y consultar) promociones y descuentos
- ❌ **No se puede modificar (actualizar)**

---

## 🛠️ Tecnologías utilizadas

- Backend: Node.js + Express / ASP.NET Core / Django *(ajusta según tu proyecto)*
- Base de datos: MongoDB / SQL Server / PostgreSQL
- Frontend: React / Angular / Razor Pages *(si aplica)*

---

## 🔧 Endpoints disponibles

### 📂 Promociones

| Método | Ruta                   | Descripción                          |
|--------|------------------------|--------------------------------------|
| `POST` | `/api/promociones`     | Crear una nueva promoción            |
| `GET`  | `/api/promociones`     | Ver todas las promociones            |
| `GET`  | `/api/promociones/:id` | Ver una promoción específica         |
| `PUT`  | `/api/promociones/:id` | ❌ No permitido (actualizar)         |

---

### 💸 Descuentos

| Método | Ruta                   | Descripción                          |
|--------|------------------------|--------------------------------------|
| `POST` | `/api/descuentos`      | Crear un nuevo descuento             |
| `GET`  | `/api/descuentos`      | Ver todos los descuentos             |
| `GET`  | `/api/descuentos/:id`  | Ver un descuento específico          |
| `PUT`  | `/api/descuentos/:id`  | ❌ No permitido (actualizar)         |

---

## 🚨 Restricción clave

> Los registros de promociones y descuentos son **inmutables**.  
> Una vez creados, **no se pueden editar ni borrar desde la aplicación**.


