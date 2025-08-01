
// Obtener roles del usuario por id usando función almacenada
export async function getRolesByUserId(req, res) {
    const { id } = req.params;
    try {
        // Llama a la función obtener_roles y filtra por usuario si tienes relación usuario-rol
        // Si no, puedes hacer la consulta directa a la tabla usuario_rol
        const result = await query(
            `SELECT r.* FROM obtener_roles() r
             JOIN usuario_rol ur ON ur.rol_id = r.id
             WHERE ur.usuario_id = $1`,
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
        const result = await query(
            'UPDATE usuario SET contrasenia = $1 WHERE id = $2 RETURNING *',
            [nuevaContrasenia, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Contraseña actualizada', usuario: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Recuperar contraseña (ejemplo: por email)
export async function recoverPassword(req, res) {
    const { email } = req.body;
    try {
        const result = await query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Aquí podrías enviar email o devolver info para recuperación
        res.json({ message: 'Usuario encontrado', usuario: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}