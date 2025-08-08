import Promocion from '../models/Promocion.js';

export async function getAllPromociones(req, res) {
  try {
    const promociones = await Promocion.getAll();
    res.json(promociones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPromocionById(req, res) {
  try {
    const promocion = await Promocion.getById(req.params.id);
    if (!promocion) return res.status(404).json({ message: 'Promoción no encontrada' });
    res.json(promocion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPromocionesActivas(req, res) {
  try {
    const promociones = await Promocion.getActivas();
    res.json(promociones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPromocionesPorTipo(req, res) {
  try {
    const { tipo } = req.params;
    const promociones = await Promocion.getByTipo(tipo);
    res.json(promociones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getPromocionesVigentes(req, res) {
  try {
    const promociones = await Promocion.getVigentes();
    res.json(promociones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createPromocion(req, res) {
  try {
    // Validaciones básicas
    const { nombre, tipo, valor, fecha_inicio, fecha_fin } = req.body;
    
    if (!nombre || !tipo || valor === undefined || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios: nombre, tipo, valor, fecha_inicio, fecha_fin' 
      });
    }

    // Validar tipos permitidos
    const tiposPermitidos = ['producto', 'categoria', 'monto_total', 'cantidad'];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ 
        message: `Tipo de promoción no válido. Tipos permitidos: ${tiposPermitidos.join(', ')}` 
      });
    }

    // Validar que fecha_fin sea mayor a fecha_inicio
    if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
      return res.status(400).json({ 
        message: 'La fecha de fin debe ser posterior a la fecha de inicio' 
      });
    }

    const nuevaPromocion = await Promocion.create(req.body);
    res.status(201).json(nuevaPromocion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updatePromocion(req, res) {
  try {
    const { tipo, fecha_inicio, fecha_fin } = req.body;
    
    // Validar tipos permitidos si se proporciona
    if (tipo) {
      const tiposPermitidos = ['producto', 'categoria', 'monto_total', 'cantidad'];
      if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ 
          message: `Tipo de promoción no válido. Tipos permitidos: ${tiposPermitidos.join(', ')}` 
        });
      }
    }

    // Validar fechas si se proporcionan ambas
    if (fecha_inicio && fecha_fin && new Date(fecha_fin) <= new Date(fecha_inicio)) {
      return res.status(400).json({ 
        message: 'La fecha de fin debe ser posterior a la fecha de inicio' 
      });
    }

    const promocionActualizada = await Promocion.update(req.params.id, req.body);
    if (!promocionActualizada) return res.status(404).json({ message: 'Promoción no encontrada' });
    res.json(promocionActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deletePromocion(req, res) {
  try {
    const promocionEliminada = await Promocion.remove(req.params.id);
    if (!promocionEliminada) return res.status(404).json({ message: 'Promoción no encontrada' });
    res.json({ message: 'Promoción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function activarPromocion(req, res) {
  try {
    const promocionActivada = await Promocion.activar(req.params.id);
    if (!promocionActivada) return res.status(404).json({ message: 'Promoción no encontrada' });
    res.json({ message: 'Promoción activada correctamente', promocion: promocionActivada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function desactivarPromocion(req, res) {
  try {
    const promocionDesactivada = await Promocion.desactivar(req.params.id);
    if (!promocionDesactivada) return res.status(404).json({ message: 'Promoción no encontrada' });
    res.json({ message: 'Promoción desactivada correctamente', promocion: promocionDesactivada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function aplicarDescuento(req, res) {
  try {
    const { ventaId, promocionId } = req.body;
    
    if (!ventaId || !promocionId) {
      return res.status(400).json({ 
        message: 'Se requieren ventaId y promocionId' 
      });
    }

    const resultado = await Promocion.aplicarDescuento(ventaId, promocionId);
    res.json({ 
      message: 'Descuento aplicado correctamente', 
      resultado 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
