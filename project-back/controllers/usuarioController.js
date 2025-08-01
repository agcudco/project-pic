import Usuario from '../models/Usuario.js';

export async function getAllUsuarios(req, res) {
  try {
    const usuarios = await Usuario.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUsuarioById(req, res) {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createUsuario(req, res) {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateUsuario(req, res) {
  try {
    const usuarioActualizado = await Usuario.update(req.params.id, req.body);
    if (!usuarioActualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUsuario(req, res) {
  try {
    const usuarioEliminado = await Usuario.remove(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deactivateUsuario(req, res) {
  try {
    const usuarioInactivado = await Usuario.deactivate(req.params.id);
    if (!usuarioInactivado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario inactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
