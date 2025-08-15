// REALIZADO POR JAMES MENA
import Factura from "../models/Factura.js";

export const getFacturas = async (req, res) => {
  try {
    const facturas = await Factura.getAll();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFacturaById = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await Factura.getById(id);
    if (!factura) return res.status(404).json({ message: "Factura no encontrada" });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetallesByFacturaId = async (req, res) => {
  try {
    const { id } = req.params;
    const detalles = await Factura.getDetallesByFacturaId(id);
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFactura = async (req, res) => {
  try {
    await Factura.create(req.body);
    res.status(201).json({ message: "Factura creada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateFactura = async (req, res) => {
  try {
    const { id } = req.params;
    await Factura.update(id, req.body);
    res.json({ message: "Factura actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFactura = async (req, res) => {
  try {
    const { id } = req.params;
    await Factura.remove(id);
    res.json({ message: "Factura eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
