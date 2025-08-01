import { getAll, getById, create, update, remove } from '../models/acciones.js';

export async function getAllAcciones(req, res) {
    try {
        const acciones = await getAll();
        res.json(acciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getAccionById(req, res) {
    try {
        const accion = await getById(req.params.id);
        if (!accion) return res.status(404).json({ message: 'Acción no encontrada' });
        res.json(accion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createAccion(req, res) {
    try {
        const nuevaAccion = await create(req.body);
        res.status(201).json(nuevaAccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateAccion(req, res) {
    try {
        const accionActualizada = await update(req.params.id, req.body);
        if (!accionActualizada) return res.status(404).json({ message: 'Acción no encontrada' });
        res.json(accionActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteAccion(req, res) {
    try {
        const accionEliminada = await remove(req.params.id);
        res.json({ message: 'Acción eliminada', accion: accionEliminada });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
