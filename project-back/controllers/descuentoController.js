import Descuento from '../models/Descuento.js';

export async function getAllDescuentos(req, res) {
  try {
    console.log('🚀 Controller: getAllDescuentos ejecutándose...');
    const descuentos = await Descuento.getAll();
    console.log('✅ Controller: Descuentos obtenidos:', descuentos.length);
    res.json(descuentos);
  } catch (error) {
    console.error('❌ Controller error:', error);
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
    let { nombre, valor, porcentaje, tipo, descripcion, fecha_inicio, fecha_fin, activo = true } = req.body;
    
    // Si no viene 'valor', pero sí 'porcentaje', usarlo como valor
    if (valor === undefined && porcentaje !== undefined) {
      valor = porcentaje;
    }
    
    if (!nombre || valor === undefined || !tipo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: nombre, valor, tipo' });
    }
    
    // Valores por defecto para fechas si no se proporcionan
    const data = {
      nombre,
      valor,
      tipo,
      descripcion: descripcion || '',
      fecha_inicio: fecha_inicio || new Date().toISOString().split('T')[0],
      fecha_fin: fecha_fin || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 año después
      activo
    };
    
    const nuevoDescuento = await Descuento.create(data);
    res.status(201).json(nuevoDescuento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Función de diagnóstico
export async function diagnosticoDescuento(req, res) {
  console.log('🩺 DIAGNÓSTICO COMPLETO');
  console.log('🔹 Method:', req.method);
  console.log('🔹 URL:', req.url);
  console.log('🔹 Params:', req.params);
  console.log('🔹 Body:', req.body);
  console.log('🔹 Headers:', req.headers);
  console.log('🔹 Content-Type:', req.get('Content-Type'));
  
  res.json({
    success: true,
    diagnostico: {
      method: req.method,
      url: req.url,
      params: req.params,
      body: req.body,
      contentType: req.get('Content-Type')
    }
  });
}

export async function updateDescuento(req, res) {
  try {
    console.log('🚀 Controller: updateDescuento ejecutándose...');
    console.log('📝 ID recibido:', req.params.id);
    console.log('📝 Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    let { nombre, valor, porcentaje, tipo, descripcion, fecha_inicio, fecha_fin, activo } = req.body;
    
    // Si no viene 'valor', pero sí 'porcentaje', usarlo como valor
    if (valor === undefined && porcentaje !== undefined) {
      valor = porcentaje;
    }
    
    console.log('📊 Datos después del mapeo:', { nombre, valor, tipo, activo });
    
    // Validar que el ID sea un número válido
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      console.log('❌ ID inválido:', req.params.id);
      return res.status(400).json({ message: 'ID debe ser un número válido' });
    }
    
    if (!nombre || valor === undefined || !tipo) {
      console.log('❌ Faltan campos obligatorios');
      console.log('📊 nombre:', nombre);
      console.log('📊 valor:', valor);
      console.log('📊 tipo:', tipo);
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios: nombre, valor, tipo',
        received: { nombre, valor, tipo }
      });
    }
    
    // Convertir valor a número si es string
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(valorNumerico)) {
      console.log('❌ Valor inválido:', valor);
      return res.status(400).json({ message: 'El valor debe ser un número válido' });
    }
    
    const data = {
      nombre: nombre.trim(),
      valor: valorNumerico,
      tipo: tipo.trim(),
      descripcion: descripcion ? descripcion.trim() : '',
      fecha_inicio: fecha_inicio || new Date().toISOString().split('T')[0],
      fecha_fin: fecha_fin || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activo: activo !== undefined ? activo : true
    };
    
    console.log('📝 Datos limpiados y validados:', data);
    const descuentoActualizado = await Descuento.update(id, data);
    if (!descuentoActualizado) {
      console.log('❌ Descuento no encontrado para actualizar');
      return res.status(404).json({ message: 'Descuento no encontrado' });
    }
    console.log('✅ Descuento actualizado exitosamente');
    res.json(descuentoActualizado);
  } catch (error) {
    console.error('❌ Error en updateDescuento controller:', error.message);
    console.error('📊 Stack trace completo:', error.stack);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteDescuento(req, res) {
  try {
    console.log('🚀 Controller: deleteDescuento ejecutándose...');
    console.log('📝 ID recibido para eliminar:', req.params.id);
    
    const descuentoEliminado = await Descuento.remove(req.params.id);
    if (!descuentoEliminado) {
      console.log('❌ Descuento no encontrado para eliminar');
      return res.status(404).json({ message: 'Descuento no encontrado' });
    }
    console.log('✅ Descuento eliminado exitosamente');
    res.json({ message: 'Descuento eliminado correctamente', descuento: descuentoEliminado });
  } catch (error) {
    console.error('❌ Error en deleteDescuento controller:', error.message);
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
