import { query } from '../config/db.js';

// Login: valida usuario y contraseña usando la función almacenada
export async function login(req, res) {
    const { usuario, contrasenia } = req.body;
    try {
        // Llama a la función verificacion_credenciales
        const result = await query(
            'SELECT verificacion_credenciales($1, $2) AS valido',
            [usuario, contrasenia]
        );
        if (!result.rows[0].valido) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        // Si es válido, obtiene los datos del usuario
        const userResult = await query(
            'SELECT * FROM usuario WHERE usuario = $1',
            [usuario]
        );
        res.json(userResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener roles del usuario por id
export async function getRolesByUserId(req, res) {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT r.* FROM rol r
             JOIN rol_usuario ru ON ru.id_rol = r.id
             WHERE ru.id_usuario = $1`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Editar contraseña
export async function updatePassword(req, res) {
    const { id } = req.params;
    const { nuevaContrasenia } = req.body;
    try {
        const result = await pool.query(
            'UPDATE usuario SET contrasenia = $1 WHERE id = $2 RETURNING *',
            [nuevaContrasenia, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Contraseña actualizada', usuario: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default {
    getRolesByUserId,
    updatePassword
};