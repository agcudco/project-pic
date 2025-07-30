import Menu from '../models/Menu.js';

export async function getAllMenus(req, res) {
  try {
    const menus = await Menu.getAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getMenuById(req, res) {
  try {
    const menu = await Menu.getById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menú no encontrado' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createMenu(req, res) {
  try {
    const nuevoMenu = await Menu.create(req.body);
    res.status(201).json(nuevoMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateMenu(req, res) {
  try {
    const menuActualizado = await Menu.update(req.params.id, req.body);
    if (!menuActualizado) return res.status(404).json({ message: 'Menú no encontrado' });
    res.json(menuActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteMenu(req, res) {
  try {
    const menuEliminado = await Menu.remove(req.params.id);
    if (!menuEliminado) return res.status(404).json({ message: 'Menú no encontrado' });
    res.json({ message: 'Menú eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
