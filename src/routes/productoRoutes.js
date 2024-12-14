const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.Nombre_Categoria, e.Nombre as Nombre_Empresa 
            FROM Producto p
            LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
            LEFT JOIN Empresa e ON p.ID_Empresa = e.ID_Empresa
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.Nombre_Categoria, e.Nombre as Nombre_Empresa 
            FROM Producto p
            LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
            LEFT JOIN Empresa e ON p.ID_Empresa = e.ID_Empresa
            WHERE p.ID_Producto = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
});

// Crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const {
            Nombre,
            Descripcion,
            Codigo_Barras,
            Codigo_QR,
            Cantidad,
            Precio,
            ID_Empresa,
            ID_Categoria
        } = req.body;

        const [result] = await db.query(
            'INSERT INTO Producto (Nombre, Descripcion, Codigo_Barras, Codigo_QR, Cantidad, Precio, ID_Empresa, ID_Categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [Nombre, Descripcion, Codigo_Barras, Codigo_QR, Cantidad, Precio, ID_Empresa, ID_Categoria]
        );
        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
    try {
        const {
            Nombre,
            Descripcion,
            Codigo_Barras,
            Codigo_QR,
            Cantidad,
            Precio,
            ID_Empresa,
            ID_Categoria
        } = req.body;

        const [result] = await db.query(
            'UPDATE Producto SET Nombre = ?, Descripcion = ?, Codigo_Barras = ?, Codigo_QR = ?, Cantidad = ?, Precio = ?, ID_Empresa = ?, ID_Categoria = ? WHERE ID_Producto = ?',
            [Nombre, Descripcion, Codigo_Barras, Codigo_QR, Cantidad, Precio, ID_Empresa, ID_Categoria, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Producto WHERE ID_Producto = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});

module.exports = router;
