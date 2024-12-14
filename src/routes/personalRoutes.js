const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Obtener todo el personal
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.ID_Personal, p.Nombre, p.Correo_Electronico, p.Rol, 
                   e.Nombre as Nombre_Empresa 
            FROM Personal p
            LEFT JOIN Empresa e ON p.ID_Empresa = e.ID_Empresa
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personal', error: error.message });
    }
});

// Obtener personal por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.ID_Personal, p.Nombre, p.Correo_Electronico, p.Rol, 
                   e.Nombre as Nombre_Empresa 
            FROM Personal p
            LEFT JOIN Empresa e ON p.ID_Empresa = e.ID_Empresa
            WHERE p.ID_Personal = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Personal no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personal', error: error.message });
    }
});

// Crear nuevo personal
router.post('/', async (req, res) => {
    try {
        const { Nombre, Correo_Electronico, Contraseña, Rol, ID_Empresa } = req.body;
        const hashedPassword = await bcrypt.hash(Contraseña, 10);
        
        const [result] = await db.query(
            'INSERT INTO Personal (Nombre, Correo_Electronico, Contraseña, Rol, ID_Empresa) VALUES (?, ?, ?, ?, ?)',
            [Nombre, Correo_Electronico, hashedPassword, Rol, ID_Empresa]
        );
        res.status(201).json({ id: result.insertId, message: 'Personal creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear personal', error: error.message });
    }
});

// Actualizar personal
router.put('/:id', async (req, res) => {
    try {
        const { Nombre, Correo_Electronico, Contraseña, Rol, ID_Empresa } = req.body;
        let query, params;

        if (Contraseña) {
            // Si se proporciona nueva contraseña, actualizarla también
            const hashedPassword = await bcrypt.hash(Contraseña, 10);
            query = 'UPDATE Personal SET Nombre = ?, Correo_Electronico = ?, Contraseña = ?, Rol = ?, ID_Empresa = ? WHERE ID_Personal = ?';
            params = [Nombre, Correo_Electronico, hashedPassword, Rol, ID_Empresa, req.params.id];
        } else {
            // Si no hay nueva contraseña, actualizar todo excepto la contraseña
            query = 'UPDATE Personal SET Nombre = ?, Correo_Electronico = ?, Rol = ?, ID_Empresa = ? WHERE ID_Personal = ?';
            params = [Nombre, Correo_Electronico, Rol, ID_Empresa, req.params.id];
        }

        const [result] = await db.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Personal no encontrado' });
        }
        res.json({ message: 'Personal actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar personal', error: error.message });
    }
});

// Eliminar personal
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Personal WHERE ID_Personal = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Personal no encontrado' });
        }
        res.json({ message: 'Personal eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar personal', error: error.message });
    }
});

module.exports = router;
