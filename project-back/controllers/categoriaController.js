// Listar categorías con descuento aplicado (unión con promociones)
import pool from '../config/db.js';
export async function getCategoriasConDescuento(req, res) {
    try {
        const result = await pool.query(`
            SELECT c.id as categoria_id, c.nombre as categoria_nombre, p.id as promocion_id, p.nombre as promocion_nombre, p.valor, p.fecha_inicio, p.fecha_fin
            FROM categoria c
            JOIN promocion_categoria pc ON c.id = pc.categoria_id
            JOIN promocion p ON pc.promocion_id = p.id
            ORDER BY c.nombre, p.fecha_inicio DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

import Categoria from '../models/Categoria.js';

export async function getAllCategorias(req, res) {
    try {
        const categorias = await Categoria.getAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getCategoriaById(req, res) {
    try {
        const categoria = await Categoria.getById(req.params.id);
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createCategoria(req, res) {
    try {
        const nuevaCategoria = await Categoria.create(req.body);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateCategoria(req, res) {
    try {
        const categoriaActualizada = await Categoria.update(req.params.id, req.body);
        if (!categoriaActualizada) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json(categoriaActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteCategoria(req, res) {
    try {
        const deleted = await Categoria.remove(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function searchCategorias(req, res) {
    try {
        const { q } = req.query;
        const categorias = await Categoria.search(q || '');
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}