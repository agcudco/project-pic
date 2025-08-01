import {getAll,getByIds,create,update,remove} from '../models/RolModulo.js';

export async function getAllRolModulos(req, res) {
  try {
    const rolModulos = await getAll();
    res.json(rolModulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRolModuloByIds(req, res) {
  try {
    const { id_rol, id_modulo } = req.params;
    const rolModulo = await getByIds(id_rol, id_modulo);
    if (!rolModulo) {
      return res.status(404).json({ message: 'Rol-Módulo no encontrado' });
    }
    res.json(rolModulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createRolModulo(req, res) {
  try {
    const nuevoRolModulo = await create(req.body);
    res.status(201).json(nuevoRolModulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateRolModulo(req, res) {
  try {
    const data = {
      id_rol: req.params.id_rol,
      id_modulo: req.params.id_modulo,
      ...req.body
    };
    const actualizado = await update(data);
    if (!actualizado) {
      return res.status(404).json({ message: 'Rol-Módulo no encontrado' });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteRolModulo(req, res) {
  try {
    const { id_rol, id_modulo } = req.params;
    const eliminado = await remove(id_rol, id_modulo);
    if (!eliminado) {
      return res.status(404).json({ message: 'Rol-Módulo no encontrado' });
    }
    res.json({ message: 'Rol-Módulo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
