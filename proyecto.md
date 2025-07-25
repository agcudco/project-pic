# Sistema de Ventas “VentaExpress”

## Alcance general
Desarrollar un sistema web que permita gestionar el ciclo completo de ventas de productos (catálogo, inventario, clientes, pedidos y facturación). El backend será una API REST desarrollada en Node.js/Express con persistencia en PostgreSQL y toda la lógica transaccional delegada a procedimientos almacenados (PL/pgSQL). El frontend será una Single Page Application en React + Hooks + Context (o Redux opcional).

## Funcionalidades mínimas requeridas
### MÓDULO CATÁLOGO
- CRUD de productos (alta, baja lógica, modificación, listado paginado y filtrado por nombre, categoría o rango de precio).

- Sube y muestra una imagen por producto (almacenar path o base64).

### MÓDULO INVENTARIO
- Control de stock por producto y sucursal (al menos 1 sucursal).

- Registro de entradas (compras) y salidas (ventas) de inventario.

### MÓDULO CLIENTES
- CRUD de clientes (persona o empresa).
- Historial de compras por cliente.
### MÓDULO VENTAS
- Crear carrito de compras (sesión o temporal).
- Confirmar venta: generar pedido, descontar inventario y emitir factura PDF.
- Cancelar o devolver ítems (con re-ingreso de stock).
### MÓDULO REPORTES

- Ventas por día/mes/año.
- Top 10 productos más vendidos.
- Estado actual de inventario (alertas bajo mínimo).
- Reglas de negocio críticas
- No se puede vender sin stock suficiente.
- El precio de venta debe ser >= costo.
- Una factura puede tener varios items pero un solo cliente.

### Los procedimientos almacenados deben garantizar atomicidad en:
- sp_registrar_venta (crea pedido, líneas, descuenta stock, inserta en factura).
- sp_anular_venta (reverso total o parcial de stock y contabilidad).

## Modelo de datos (simplificado)
### Tablas:
- producto(id, nombre, descripcion, precio_venta, costo, imagen_url, activo)
- categoria(id, nombre)
- producto_categoria(producto_id, categoria_id)
- sucursal(id, nombre, direccion)
- inventario(id, producto_id, sucursal_id, stock_actual, stock_minimo)
- cliente(id, tipo, razon_social, nombre, apellido, email, telefono, dni/cuit) *Nota:* se relaciona con la tabla usuario - rol.
- venta(id, cliente_id, fecha_hora, total, estado)
- venta_detalle(id, venta_id, producto_id, cantidad, precio_unitario)
- factura(id, venta_id, tipo, numero, fecha_emision, monto_total)

### API REST – Endpoints base
- GET    /api/productos?search=&categoria=&min=&max=&page=&size=
- POST   /api/productos
- PUT    /api/productos/:id
- DELETE /api/productos/:id
- GET    /api/inventario/sucursal/:sucursalId
- POST   /api/inventario/entrada
- POST   /api/inventario/salida
- GET    /api/clientes
- POST   /api/clientes
- PUT    /api/clientes/:id
- POST   /api/ventas (body: {clienteId, items:[{productoId, cantidad}]})
- GET    /api/ventas/:id
- DELETE /api/ventas/:id/anular
- GET    /api/reportes/ventas?desde=&hasta=
- GET    /api/reportes/top-productos?top=10

*Nota:* Todos los endpoints deben devolver JSON y usar códigos HTTP semánticos (200, 201, 204, 400, 404, 409, 500). Autenticación opcional: JWT en header Authorization.

# Promociones y Descuentos

Permitir la creación, gestión y aplicación automática de promociones y descuentos en productos específicos, categorías o por volumen de compra, mejorando la estrategia de ventas y fidelización de clientes.

## Funcionalidades:
### Gestión de Promociones

**CRUD de promociones (nombre, tipo, condiciones, periodo de validez, estado activo/inactivo).**

#### Tipos de promociones:

- Por producto: aplica un % de descuento a productos específicos.

- Por categoría: aplica un % de descuento a todos los productos de una categoría.

- Por monto total: si el total de la venta supera cierto monto, aplica un descuento global.

- Por cantidad: ejemplo, 2x1 o 3 productos por el precio de 2.

#### Aplicación Automática en Carrito de Compras
- Las promociones activas se aplican automáticamente al momento de agregar productos al carrito si se cumplen las condiciones.

- Visualización del total con y sin descuento.

- Registro en detalle de venta del tipo y valor de descuento aplicado.

#### Control de Vigencia
- Fecha de inicio y fin de cada promoción.

- Inhabilitación automática de promociones vencidas.

#### Reportes de Promociones
- Ventas realizadas bajo promociones.

- Productos con mayor impacto promocional.

- Comparativa entre ventas con y sin promociones.

### Reglas de Negocio
- Las promociones no deben hacer que el precio de venta final sea menor al costo.

- No se pueden aplicar múltiples promociones sobre un mismo ítem (salvo reglas específicas).

- Las promociones se aplican solo si están activas y dentro del rango de fechas.

### Tablas
```sql
promocion(
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  tipo VARCHAR(20), -- producto, categoria, monto_total, cantidad
  valor NUMERIC, -- puede ser porcentaje o cantidad fija
  condicion_json JSONB, -- para reglas específicas
  fecha_inicio DATE,
  fecha_fin DATE,
  activa BOOLEAN DEFAULT true
)

promocion_producto(
  promocion_id INT REFERENCES promocion(id),
  producto_id INT REFERENCES producto(id)
)

promocion_categoria(
  promocion_id INT REFERENCES promocion(id),
  categoria_id INT REFERENCES categoria(id)
)

venta_promocion(
  id SERIAL PRIMARY KEY,
  venta_id INT REFERENCES venta(id),
  promocion_id INT REFERENCES promocion(id),
  monto_descuento NUMERIC
)

```

### Endpoints
```bash
GET    /api/promociones
POST   /api/promociones
PUT    /api/promociones/:id
DELETE /api/promociones/:id
GET    /api/promociones/activas
GET    /api/promociones/producto/:productoId
GET    /api/reportes/promociones?desde=&hasta=
```