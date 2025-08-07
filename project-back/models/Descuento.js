import pool from '../config/db.js';

class Descuento {
  constructor({ id, nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo }) {
    this.id = id;
    this.nombre = nombre;
    this.valor = valor;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.activo = activo;
  }

  static async getAll() {
    try {
      console.log('🔍 Ejecutando SELECT * FROM descuentos...');
      const result = await pool.query('SELECT * FROM descuentos ORDER BY id DESC');
      console.log('✅ Resultado de BD:', result.rows);
      return result.rows.map(row => new Descuento(row));
    } catch (error) {
      console.error('❌ Error en getAll descuentos:', error.message);
      throw error;
    }
  }

  static async getById(id) {
    try {
      console.log('🔍 Buscando descuento ID:', id);
      const result = await pool.query('SELECT * FROM descuentos WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        console.log('❌ No se encontró descuento con ID:', id);
        return null;
      }
      console.log('✅ Descuento encontrado:', result.rows[0]);
      return new Descuento(result.rows[0]);
    } catch (error) {
      console.error('❌ Error en getById descuento:', error.message);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo = true } = data;
      console.log('🔍 Creando descuento:', data);
      const result = await pool.query(
        'INSERT INTO descuentos (nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo]
      );
      console.log('✅ Descuento creado:', result.rows[0]);
      return new Descuento(result.rows[0]);
    } catch (error) {
      console.error('❌ Error en create descuento:', error.message);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const { nombre, valor, tipo, descripcion, fecha_inicio, fecha_fin, activo } = data;
      console.log('🔍 Actualizando descuento ID:', id, 'con data:', data);
      
      // Convertir valor a número si es string
      const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
      console.log('📊 Valor convertido a número:', valorNumerico);
      
      // Convertir ID a número
      const idNumerico = parseInt(id);
      console.log('🔢 ID convertido a número:', idNumerico);
      
      // Primero verificar si el registro existe
      const existeQuery = await pool.query('SELECT id FROM descuentos WHERE id = $1', [idNumerico]);
      console.log('🔍 Verificando existencia del registro:', existeQuery.rowCount > 0 ? 'EXISTE' : 'NO EXISTE');
      
      if (existeQuery.rowCount === 0) {
        console.log('❌ No existe descuento con ID:', idNumerico);
        return null;
      }
      
      const result = await pool.query(
        'UPDATE descuentos SET nombre = $2, valor = $3, tipo = $4, descripcion = $5, fecha_inicio = $6, fecha_fin = $7, activo = $8 WHERE id = $1 RETURNING *',
        [idNumerico, nombre, valorNumerico, tipo, descripcion, fecha_inicio, fecha_fin, activo]
      );
      
      console.log('📊 Resultado de la consulta UPDATE:', {
        rowCount: result.rowCount,
        rows: result.rows
      });
      
      if (result.rowCount === 0) {
        console.log('❌ No se pudo actualizar el descuento con ID:', idNumerico);
        return null;
      }
      console.log('✅ Descuento actualizado:', result.rows[0]);
      return new Descuento(result.rows[0]);
    } catch (error) {
      console.error('❌ Error en update descuento:', error.message);
      console.error('📊 Stack trace:', error.stack);
      throw error;
    }
  }

  static async remove(id) {
    try {
      console.log('🔍 Eliminando descuento ID:', id);
      const result = await pool.query('DELETE FROM descuentos WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        console.log('❌ No se encontró descuento con ID:', id);
        return null;
      }
      console.log('✅ Descuento eliminado:', result.rows[0]);
      return new Descuento(result.rows[0]);
    } catch (error) {
      console.error('❌ Error en remove descuento:', error.message);
      throw error;
    }
  }

  static async activar(id) {
    try {
      console.log('🔍 Activando descuento ID:', id);
      const result = await pool.query('UPDATE descuentos SET activo = true WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        console.log('❌ No se encontró descuento con ID:', id);
        return null;
      }
      console.log('✅ Descuento activado:', result.rows[0]);
      return new Descuento(result.rows[0]);
    } catch (error) {
      console.error('❌ Error en activar descuento:', error.message);
      throw error;
    }
  }

  static async desactivar(id) {
    try {
      console.log('🔍 Desactivando descuento ID:', id);
      const result = await pool.query('UPDATE descuentos SET activo = false WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        console.log('❌ No se encontró descuento con ID:', id);
        return null;
      }
      console.log('✅ Descuento desactivado:', result.rows[0]);
      return new Descuento(result.rows[0]);
    } catch (error) {
      console.error('❌ Error en desactivar descuento:', error.message);
      throw error;
    }
  }
}

export default Descuento;
