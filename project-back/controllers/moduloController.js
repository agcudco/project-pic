import { getAll, getById, create, update, remove } from '../models/Modulo.js';

export async function getAllModulos(req, res) {
    try {
        const modulos = await getAll();
        res.json(modulos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getModuloById(req, res) {
    try {
        const modulo = await getById(req.params.id);
        if (!modulo) return res.status(404).json({ message: 'Módulo no encontrado' });
        res.json(modulo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createModulo(req, res) {
    try {
        const nuevoModulo = await create(req.body);
        res.status(201).json(nuevoModulo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateModulo(req, res) {
    try {
        const moduloActualizado = await update(req.params.id, req.body);
        if (!moduloActualizado) return res.status(404).json({ message: 'Módulo no encontrado' });
        res.json(moduloActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteModulo(req, res) {
    try {
        const deleted = await remove(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Módulo no encontrado' });
        res.json({ message: 'Módulo eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}