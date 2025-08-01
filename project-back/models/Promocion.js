import pool from '../config/db.js';
//Anahy Herrera - Kevin Lechon
class Promocion {
  constructor({ id, nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa }) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.valor = valor;
    this.condicion_json = condicion_json;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.activa = activa;
  }

  static async getAll() {
    // search_path configurado para esquema ventas en db.js
    const result = await pool.query('SELECT * FROM promocion ORDER BY fecha_inicio DESC');
    return result.rows.map(row => new Promocion(row));
  }

  static async getById(id) {
    // search_path configurado para esquema ventas en db.js
    const result = await pool.query('SELECT * FROM promocion WHERE id = $1', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async getActivas() {
    // Usando tabla sin esquema específico
    const result = await pool.query('SELECT * FROM promocion WHERE activa = true ORDER BY fecha_inicio DESC');
    return result.rows.map(row => new Promocion(row));
  }

  static async getByTipo(tipo) {
    // Para esta versión inicial, filtramos por tipo usando SQL directo
    const result = await pool.query('SELECT * FROM promocion WHERE tipo = $1 AND activa = true', [tipo]);
    return result.rows.map(row => new Promocion(row));
  }

  static async getVigentes() {
    // Promociones vigentes = activas y dentro del rango de fechas
    const result = await pool.query(`
      SELECT * FROM promocion 
      WHERE activa = true 
      AND fecha_inicio <= CURRENT_DATE 
      AND fecha_fin >= CURRENT_DATE
      ORDER BY fecha_inicio DESC
    `);
    return result.rows.map(row => new Promocion(row));
  }

  static async create(data) {
    const { 
      nombre, 
      tipo, 
      valor, 
      condicion_json = null, 
      fecha_inicio, 
      fecha_fin, 
      activa = true 
    } = data;
    
    // Usando tabla sin esquema específico
    const result = await pool.query(
      `INSERT INTO promocion (nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [nombre, tipo, valor, condicion_json, fecha_inicio, fecha_fin, activa]
    );
    return new Promocion(result.rows[0]);
  }

  static async update(id, data) {
    const { 
      nombre, 
      tipo, 
      valor, 
      condicion_json, 
      fecha_inicio, 
      fecha_fin, 
      activa 
    } = data;
    
    // Construir la consulta dinámicamente solo con los campos proporcionados
    const campos = [];
    const valores = [];
    let contador = 1;
    
    if (nombre !== undefined) {
      campos.push(`nombre = $${contador++}`);
      valores.push(nombre);
    }
    if (tipo !== undefined) {
      campos.push(`tipo = $${contador++}`);
      valores.push(tipo);
    }
    if (valor !== undefined) {
      campos.push(`valor = $${contador++}`);
      valores.push(valor);
    }
    if (condicion_json !== undefined) {
      campos.push(`condicion_json = $${contador++}`);
      valores.push(condicion_json);
    }
    if (fecha_inicio !== undefined) {
      campos.push(`fecha_inicio = $${contador++}`);
      valores.push(fecha_inicio);
    }
    if (fecha_fin !== undefined) {
      campos.push(`fecha_fin = $${contador++}`);
      valores.push(fecha_fin);
    }
    if (activa !== undefined) {
      campos.push(`activa = $${contador++}`);
      valores.push(activa);
    }
    
    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    valores.push(id);
    const result = await pool.query(
      `UPDATE promocion SET ${campos.join(', ')} WHERE id = $${contador} RETURNING *`,
      valores
    );
    
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('DELETE FROM promocion WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async activar(id) {
    const result = await pool.query('UPDATE promocion SET activa = true WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async desactivar(id) {
    const result = await pool.query('UPDATE promocion SET activa = false WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return null;
    return new Promocion(result.rows[0]);
  }

  static async aplicarDescuento(ventaId, promocionId) {
    // Solo trabajamos con promociones, no con tablas de ventas
    // Por ahora retornamos información de la promoción aplicada
    const result = await pool.query(
      `SELECT p.*, $1 as venta_id, 
       CASE 
         WHEN p.tipo = 'monto_total' THEN p.valor
         WHEN p.tipo = 'producto' THEN p.valor  
         ELSE p.valor 
       END as descuento_calculado
       FROM promocion p 
       WHERE p.id = $2 AND p.activa = true`,
      [ventaId, promocionId]
    );
    return result.rows[0];
  }
}

export default Promocion;
