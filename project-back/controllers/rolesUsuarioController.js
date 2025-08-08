// Controlador para obtener los roles de un usuario por su ID
import { Rol } from '../models/User.js';

export async function getRolesByUserId(req, res) {
  try {
    const roles = await Rol.findByUserId(req.params.id);
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
