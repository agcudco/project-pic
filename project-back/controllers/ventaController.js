
//REALIZADO POR KAREN YANEZ 

import Venta from '../models/Venta.js';

export async function getAllVentas(req, res) {
  try {
    const ventas = await Venta.getAll();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getVentaById(req, res) {
  try {
    const venta = await Venta.getById(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createVenta(req, res) {
  try {
    const { cliente_id, productos, cantidades } = req.body;

    if (!Array.isArray(productos) || !Array.isArray(cantidades) || productos.length === 0 || cantidades.length === 0) {
      return res.status(400).json({ error: "Los productos y cantidades deben ser arrays no vacíos" });
    }

    const result = await Venta.create({ cliente_id, productos, cantidades });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function updateVenta(req, res) {
  try {
    const { estado, total } = req.body;
    const result = await Venta.update(req.params.id, estado, total);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function anularVenta(req, res) {
  try {
    const { id } = req.params;
    await Venta.remove(id); 
    res.json({ message: `Venta con ID ${id} anulada correctamente.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}