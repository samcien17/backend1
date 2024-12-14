const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las empresas
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Empresa');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener empresas', error: error.message });
    }
});

// Obtener una empresa por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Empresa WHERE ID_Empresa = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener empresa', error: error.message });
    }
});

// Crear nueva empresa
router.post('/', async (req, res) => {
    try {
        const { Nombre, Correo_Electronico, Telefono, Direccion } = req.body;
        const [result] = await db.query(
            'INSERT INTO Empresa (Nombre, Correo_Electronico, Telefono, Direccion) VALUES (?, ?, ?, ?)',
            [Nombre, Correo_Electronico, Telefono, Direccion]
        );
        res.status(201).json({ id: result.insertId, message: 'Empresa creada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear empresa', error: error.message });
    }
});

// Actualizar empresa
router.put('/:id', async (req, res) => {
    try {
        const { Nombre, Correo_Electronico, Telefono, Direccion } = req.body;
        const [result] = await db.query(
            'UPDATE Empresa SET Nombre = ?, Correo_Electronico = ?, Telefono = ?, Direccion = ? WHERE ID_Empresa = ?',
            [Nombre, Correo_Electronico, Telefono, Direccion, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.json({ message: 'Empresa actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar empresa', error: error.message });
    }
});

// Eliminar empresa
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Empresa WHERE ID_Empresa = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.json({ message: 'Empresa eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar empresa', error: error.message });
    }
});

module.exports = router;
