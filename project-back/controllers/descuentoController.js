import Descuento from '../models/Descuento.js';

export async function getAllDescuentos(req, res) {
  try {
    const descuentos = await Descuento.getAll();
    res.json(descuentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDescuentoById(req, res) {
  try {
    const descuento = await Descuento.getById(req.params.id);
    if (!descuento) return res.status(404).json({ message: 'Descuento no encontrado' });
    res.json(descuento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createDescuento(req, res) {
  try {
    let { nombre, valor, porcentaje, tipo } = req.body;
    // Si no viene 'valor', pero sí 'porcentaje', usarlo como valor
    if (valor === undefined && porcentaje !== undefined) {
      valor = porcentaje;
    }
    if (!nombre || valor === undefined || !tipo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, valor, tipo' });
    }
    // Construir el objeto a guardar con 'valor' correcto
    const data = { ...req.body, valor };
    const nuevoDescuento = await Descuento.create(data);
    res.status(201).json(nuevoDescuento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateDescuento(req, res) {
  try {
    let { valor, porcentaje } = req.body;
    if (valor === undefined && porcentaje !== undefined) {
      valor = porcentaje;
    }
    const data = { ...req.body, valor };
    const descuentoActualizado = await Descuento.update(req.params.id, data);
    if (!descuentoActualizado) return res.status(404).json({ message: 'Descuento no encontrado' });
    res.json(descuentoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteDescuento(req, res) {
  try {
    const descuentoEliminado = await Descuento.remove(req.params.id);
    if (!descuentoEliminado) return res.status(404).json({ message: 'Descuento no encontrado' });
    res.json({ message: 'Descuento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function activarDescuento(req, res) {
  try {
    const descuentoActivado = await Descuento.activar(req.params.id);
    if (!descuentoActivado) return res.status(404).json({ message: 'Descuento no encontrado' });
    res.json({ message: 'Descuento activado correctamente', descuento: descuentoActivado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function desactivarDescuento(req, res) {
  try {
    const descuentoDesactivado = await Descuento.desactivar(req.params.id);
    if (!descuentoDesactivado) return res.status(404).json({ message: 'Descuento no encontrado' });
    res.json({ message: 'Descuento desactivado correctamente', descuento: descuentoDesactivado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
