// Modelo de Usuario
import pool from '../config/db.js';

export class Usuario {
    static async findByUsuario(usuario) {
        const result = await pool.query('SELECT * FROM usuario WHERE usuario = $1', [usuario]);
        return result.rows[0];
    }

    static async updatePassword(id, nuevaContrasenia) {
        const result = await pool.query('UPDATE usuario SET contrasenia = $1 WHERE id = $2 RETURNING *', [nuevaContrasenia, id]);
        return result.rows[0];
    }
}

// Modelo de Rol
export class Rol {
    static async findByUserId(id) {
        const result = await pool.query(`SELECT r.* FROM rol r JOIN rol_usuario ru ON ru.id_rol = r.id WHERE ru.id_usuario = $1`, [id]);
        return result.rows;
    }
}
