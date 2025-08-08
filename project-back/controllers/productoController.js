import Producto from "../models/Producto.js";

// Obtener todos los productos activos
export async function getAllProductos(req, res) {
  try {
    const productos = await Producto.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener un producto por ID
export async function getProductoById(req, res) {
  try {
    const producto = await Producto.getById(req.params.id);
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Crear un nuevo producto
export async function createProducto(req, res) {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("❌ Error al crear producto:", error); // <- Añade esto
    res.status(500).json({ error: error.message });
  }
}


// Actualizar un producto existente
export async function updateProducto(req, res) {
  try {
    const productoActualizado = await Producto.update(req.params.id, req.body);
    if (!productoActualizado)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Eliminar (baja lógica) un producto
export async function deleteProducto(req, res) {
  try {
    const productoEliminado = await Producto.remove(req.params.id);
    if (!productoEliminado)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Filtrar productos con paginación
export async function filterProductos(req, res) {
  try {
    const {
      nombre = null,
      precio_min = null,
      precio_max = null,
      limit = 10,
      offset = 0,
    } = req.query;

    const productos = await Producto.filter({
      nombre,
      precio_min: precio_min ? parseFloat(precio_min) : null,
      precio_max: precio_max ? parseFloat(precio_max) : null,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
