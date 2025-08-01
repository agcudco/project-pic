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