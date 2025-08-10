import { query } from '../config/db.js';

// ==================
// 1. LOGIN
// ==================
export async function login(req, res) {
    const { email, contrasenia } = req.body;
    try {
        const result = await query(
            'SELECT verificacion_credenciales($1, $2) AS valido',
            [email, contrasenia]
        );

        if (!result.rows[0].valido) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const userResult = await query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );
        const usuario = userResult.rows[0];

        // Obtener roles del usuario
        const rolesResult = await query(
            `SELECT r.* FROM rol r JOIN rol_usuario ru ON ru.id_rol = r.id WHERE ru.id_usuario = $1`,
            [usuario.id]
        );
        const roles = rolesResult.rows;

        res.json({ usuario, roles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// ==================
// 2. OBTENER ROLES DE UN USUARIO
// ==================
export async function getRolesByUserId(req, res) {
  const { id } = req.params;
  try {
    // Usando el procedimiento almacenado obtener_roles_usuario
    const result = await query(
      'SELECT * FROM obtener_roles_usuario($1)',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No se encontraron roles para este usuario' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error en getRolesByUserId:', error);
    res.status(500).json({ error: error.message });
  }
}



// ==================
// 3. ACTUALIZAR CONTRASEÑA
// ==================
export async function updatePassword(req, res) {
    const { id } = req.params;
    const { nuevaContrasenia } = req.body;

    try {
        const result = await query(
            'SELECT actualizar_contrasenia($1, $2) AS actualizado',
            [id, nuevaContrasenia]
        );

        if (!result.rows[0].actualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// ==================
// 4. OBTENER TODOS LOS ROLES
// ==================
export async function getAllRoles(req, res) {
    try {
        const result = await query('SELECT * FROM obtener_roles()');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
