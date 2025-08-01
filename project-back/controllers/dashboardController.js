import Producto from '../models/Dashboard.js';

export async function getAllProductos(req, res) {
  try {
    const productos = await Producto.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProductoById(req, res) {
  try {
    const producto = await Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createProducto(req, res) {
  try {
    const nuevo = await Producto.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProducto(req, res) {
  try {
    const actualizado = await Producto.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProducto(req, res) {
  try {
    const eliminado = await Producto.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
}