import Rol from '../models/Rol.js';

export async function getAllRoles(req, res) {
    try {
        const roles = await Rol.getAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getRolById(req, res) {
    try {
        const rol = await Rol.getById(req.params.id);
        if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });
        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createRol(req, res) {
    try {
        const nuevoRol = await Rol.create(req.body);
        res.status(201).json(nuevoRol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateRol(req, res) {
    try {
        const rolActualizado = await Rol.update(req.params.id, req.body);
        if (!rolActualizado) return res.status(404).json({ message: 'Rol no encontrado' });
        res.json(rolActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteRol(req, res) {
    try {
        const deleted = await Rol.remove(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Rol no encontrado' });
        res.json({ message: 'Rol eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Métodos adicionales para gestión de módulos
export async function getModulosByRol(req, res) {
    try {
        const modulos = await Rol.getModulosByRol(req.params.id);
        res.json(modulos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener todos los roles de un usuario logeado
import { Rol as UserRol } from '../models/User.js';
export async function getRolesByUserId(req, res) {
    try {
        const userId = req.params.id;
        const roles = await UserRol.findByUserId(userId);
        if (!roles || roles.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles para este usuario' });
        }
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function assignModuloToRol(req, res) {
    try {
        const { moduloId, permisos } = req.body;
        const result = await Rol.assignModulo(req.params.id, moduloId, permisos);
        res.json({ message: 'Módulo asignado al rol correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function removeModuloFromRol(req, res) {
    try {
        const { moduloId } = req.body;
        const result = await Rol.removeModulo(req.params.id, moduloId);
        res.json({ message: 'Módulo removido del rol correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}