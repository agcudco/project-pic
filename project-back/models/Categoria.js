
import pool from '../config/db.js';

class Categoria {
    constructor({ id, nombre }) {
        this.id = id;
        this.nombre = nombre;
    }

    static async getAll() {
        const result = await pool.query('SELECT * FROM obtener_categorias()');
        return result.rows.map(row => new Categoria(row));
    }

    static async getById(id) {
        const result = await pool.query('SELECT * FROM obtener_categoria_por_id($1)', [id]);
        if (result.rowCount === 0) return null;
        return new Categoria(result.rows[0]);
    }

    static async create(data) {
        const { nombre } = data;
        const result = await pool.query('SELECT * FROM crear_categoria($1)', [nombre]);
        return new Categoria(result.rows[0]);
    }

    static async update(id, data) {
        const { nombre } = data;
        const result = await pool.query('SELECT * FROM actualizar_categoria($1, $2)', [id, nombre]);
        if (result.rowCount === 0) return null;
        return new Categoria(result.rows[0]);
    }

    static async remove(id) {
        const result = await pool.query('SELECT eliminar_categoria($1)', [id]);
        return result.rows[0].eliminar_categoria;
    }

    static async search(busqueda) {
        const result = await pool.query('SELECT * FROM buscar_categorias($1)', [busqueda]);
        return result.rows.map(row => new Categoria(row));
    }
}

export default Categoria;