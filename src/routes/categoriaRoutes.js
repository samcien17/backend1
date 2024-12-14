const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categoria');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
    }
});

// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categoria WHERE ID_Categoria = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
    }
});

// Crear nueva categoría
router.post('/', async (req, res) => {
    try {
        const { Nombre_Categoria } = req.body;
        const [result] = await db.query(
            'INSERT INTO Categoria (Nombre_Categoria) VALUES (?)',
            [Nombre_Categoria]
        );
        res.status(201).json({ id: result.insertId, message: 'Categoría creada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear categoría', error: error.message });
    }
});

// Actualizar categoría
router.put('/:id', async (req, res) => {
    try {
        const { Nombre_Categoria } = req.body;
        const [result] = await db.query(
            'UPDATE Categoria SET Nombre_Categoria = ? WHERE ID_Categoria = ?',
            [Nombre_Categoria, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
    }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Categoria WHERE ID_Categoria = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
    }
});

module.exports = router;
