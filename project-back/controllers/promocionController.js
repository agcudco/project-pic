// Aplicar descuento/promoción a un producto
export async function aplicarDescuentoProducto(req, res) {
  try {
    let { productoId, promocionId } = req.body;
    productoId = Number(productoId);
    promocionId = Number(promocionId);
    if (!productoId || !promocionId || isNaN(productoId) || isNaN(promocionId)) {
      return res.status(400).json({ message: 'Se requieren productoId y promocionId válidos' });
    }

    // Validar existencia del producto
    const prod = await pool.query('SELECT 1 FROM producto WHERE id = $1', [productoId]);
    if (prod.rowCount === 0) {
      return res.status(404).json({ message: 'El producto no existe' });
    }

    // Validar existencia y vigencia de la promoción
    const promo = await pool.query('SELECT * FROM promocion WHERE id = $1', [promocionId]);
    if (promo.rowCount === 0) {
      return res.status(404).json({ message: 'La promoción no existe' });
    }
    const p = promo.rows[0];
    const hoy = new Date();
    if (!p.activa || new Date(p.fecha_inicio) > hoy || new Date(p.fecha_fin) < hoy) {
      return res.status(400).json({ message: 'La promoción no está vigente o activa' });
    }
    if (p.tipo !== 'producto') {
      return res.status(400).json({ message: 'La promoción seleccionada no es de tipo "producto"' });
    }

    // Validar que no exista ya la relación
    const existe = await pool.query('SELECT 1 FROM promocion_producto WHERE promocion_id = $1 AND producto_id = $2', [promocionId, productoId]);
    if (existe.rowCount > 0) {
      return res.status(409).json({ message: 'Ya existe un descuento aplicado a este producto con esa promoción' });
    }

    // Registrar la relación
    await pool.query(
      `INSERT INTO promocion_producto (promocion_id, producto_id)
       VALUES ($1, $2)`,
      [promocionId, productoId]
    );

    res.json({ message: 'Descuento aplicado correctamente al producto' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Aplicar descuento/promoción a una categoría
// ...existing code...
// ...existing code...
export async function aplicarDescuentoCategoria(req, res) {
  try {
    let { categoriaId, promocionId } = req.body;
    categoriaId = Number(categoriaId);
    promocionId = Number(promocionId);
    if (!categoriaId || !promocionId || isNaN(categoriaId) || isNaN(promocionId)) {
      return res.status(400).json({ message: 'Se requieren categoriaId y promocionId válidos' });
    }

    // Validar existencia de la categoría
    const cat = await pool.query('SELECT 1 FROM categoria WHERE id = $1', [categoriaId]);
    if (cat.rowCount === 0) {
      return res.status(404).json({ message: 'La categoría no existe' });
    }

    // Validar existencia y vigencia de la promoción
    const promo = await pool.query('SELECT * FROM promocion WHERE id = $1', [promocionId]);
    if (promo.rowCount === 0) {
      return res.status(404).json({ message: 'La promoción no existe' });
    }
    const p = promo.rows[0];
    const hoy = new Date();
    if (!p.activa || new Date(p.fecha_inicio) > hoy || new Date(p.fecha_fin) < hoy) {
      return res.status(400).json({ message: 'La promoción no está vigente o activa' });
    }
    if (p.tipo !== 'categoria') {
      return res.status(400).json({ message: 'La promoción seleccionada no es de tipo "categoria"' });
    }

    // Validar que no exista ya la relación
    const existe = await pool.query('SELECT 1 FROM promocion_categoria WHERE promocion_id = $1 AND categoria_id = $2', [promocionId, categoriaId]);
    if (existe.rowCount > 0) {
      return res.status(409).json({ message: 'Ya existe un descuento aplicado a esta categoría con esa promoción' });
    }

    // Registrar la relación
    await pool.query(
      `INSERT INTO promocion_categoria (promocion_id, categoria_id)
       VALUES ($1, $2)`,
      [promocionId, categoriaId]
    );

    res.json({ message: 'Descuento aplicado correctamente a la categoría' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
import Promocion from '../models/Promocion.js';
import pool from '../config/db.js';

export async function getAllPromociones(req, res) {
  try {
    const promociones = await Promocion.getAll();
    res.json(promociones);
  } catch (error) {
    console.error('Error en aplicarDescuento:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
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

import Venta from '../models/Venta.js';

export async function aplicarDescuento(req, res) {
  try {
    let { ventaId, promocionId } = req.body;
    ventaId = Number(ventaId);
    promocionId = Number(promocionId);
    if (!ventaId || !promocionId || isNaN(ventaId) || isNaN(promocionId)) {
      return res.status(400).json({ message: 'Se requieren ventaId y promocionId válidos' });
    }

    // Obtener la venta real
    const venta = await Venta.getById(ventaId);
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Obtener el total y la cantidad total de productos de la venta
  const detalles = await pool.query('SELECT SUM(cantidad) as cantidad FROM venta_detalle WHERE venta_id = $1', [ventaId]);
    const cantidad = detalles.rows[0]?.cantidad ? Number(detalles.rows[0].cantidad) : 1;
    const montoBase = venta.total;

    // Calcular el descuento usando los valores reales
    const resultado = await Promocion.aplicarDescuento(ventaId, promocionId, montoBase, cantidad);
    const monto_descuento = resultado && resultado.monto_descuento ? resultado.monto_descuento : 0;

    // Registrar el descuento en la tabla venta_promocion
    // Solo si el descuento es mayor a 0
    if (monto_descuento > 0) {
      await pool.query(
        'INSERT INTO venta_promocion (venta_id, promocion_id, monto_descuento) VALUES ($1, $2, $3)',
        [ventaId, promocionId, monto_descuento]
      );
    }

    res.json({ 
      message: monto_descuento > 0 ? 'Descuento aplicado correctamente' : 'No se aplicó descuento', 
      resultado 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
