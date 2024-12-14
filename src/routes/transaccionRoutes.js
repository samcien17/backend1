const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las transacciones
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, 
                   p.Nombre as Nombre_Producto,
                   per.Nombre as Nombre_Personal 
            FROM Transaccion t
            LEFT JOIN Producto p ON t.ID_Producto = p.ID_Producto
            LEFT JOIN Personal per ON t.ID_Personal = per.ID_Personal
            ORDER BY t.Fecha DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener transacciones', error: error.message });
    }
});

// Obtener transacción por ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, 
                   p.Nombre as Nombre_Producto,
                   per.Nombre as Nombre_Personal 
            FROM Transaccion t
            LEFT JOIN Producto p ON t.ID_Producto = p.ID_Producto
            LEFT JOIN Personal per ON t.ID_Personal = per.ID_Personal
            WHERE t.ID_Transaccion = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener transacción', error: error.message });
    }
});

// Crear nueva transacción
router.post('/', async (req, res) => {
    try {
        const { Fecha, Tipo_Transaccion, Cantidad, ID_Producto, ID_Personal } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO Transaccion (Fecha, Tipo_Transaccion, Cantidad, ID_Producto, ID_Personal) VALUES (?, ?, ?, ?, ?)',
            [Fecha || new Date(), Tipo_Transaccion, Cantidad, ID_Producto, ID_Personal]
        );
        
        // Actualizar stock del producto
        if (Tipo_Transaccion === 'VENTA' || Tipo_Transaccion === 'SALIDA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad - ? WHERE ID_Producto = ?',
                [Cantidad, ID_Producto]
            );
        } else if (Tipo_Transaccion === 'ENTRADA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad + ? WHERE ID_Producto = ?',
                [Cantidad, ID_Producto]
            );
        }
        
        res.status(201).json({ id: result.insertId, message: 'Transacción creada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear transacción', error: error.message });
    }
});

// Actualizar transacción
router.put('/:id', async (req, res) => {
    try {
        const { Fecha, Tipo_Transaccion, Cantidad, ID_Producto, ID_Personal } = req.body;
        
        // Obtener la transacción anterior para revertir el cambio en el stock
        const [oldTransaction] = await db.query(
            'SELECT * FROM Transaccion WHERE ID_Transaccion = ?',
            [req.params.id]
        );

        if (oldTransaction.length === 0) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        // Revertir el cambio anterior en el stock
        if (oldTransaction[0].Tipo_Transaccion === 'VENTA' || oldTransaction[0].Tipo_Transaccion === 'SALIDA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad + ? WHERE ID_Producto = ?',
                [oldTransaction[0].Cantidad, oldTransaction[0].ID_Producto]
            );
        } else if (oldTransaction[0].Tipo_Transaccion === 'ENTRADA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad - ? WHERE ID_Producto = ?',
                [oldTransaction[0].Cantidad, oldTransaction[0].ID_Producto]
            );
        }

        // Actualizar la transacción
        const [result] = await db.query(
            'UPDATE Transaccion SET Fecha = ?, Tipo_Transaccion = ?, Cantidad = ?, ID_Producto = ?, ID_Personal = ? WHERE ID_Transaccion = ?',
            [Fecha, Tipo_Transaccion, Cantidad, ID_Producto, ID_Personal, req.params.id]
        );

        // Aplicar el nuevo cambio en el stock
        if (Tipo_Transaccion === 'VENTA' || Tipo_Transaccion === 'SALIDA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad - ? WHERE ID_Producto = ?',
                [Cantidad, ID_Producto]
            );
        } else if (Tipo_Transaccion === 'ENTRADA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad + ? WHERE ID_Producto = ?',
                [Cantidad, ID_Producto]
            );
        }
        
        res.json({ message: 'Transacción actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar transacción', error: error.message });
    }
});

// Eliminar transacción
router.delete('/:id', async (req, res) => {
    try {
        // Obtener la transacción antes de eliminarla para revertir el stock
        const [transaction] = await db.query(
            'SELECT * FROM Transaccion WHERE ID_Transaccion = ?',
            [req.params.id]
        );

        if (transaction.length === 0) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        // Revertir el cambio en el stock
        if (transaction[0].Tipo_Transaccion === 'VENTA' || transaction[0].Tipo_Transaccion === 'SALIDA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad + ? WHERE ID_Producto = ?',
                [transaction[0].Cantidad, transaction[0].ID_Producto]
            );
        } else if (transaction[0].Tipo_Transaccion === 'ENTRADA') {
            await db.query(
                'UPDATE Producto SET Cantidad = Cantidad - ? WHERE ID_Producto = ?',
                [transaction[0].Cantidad, transaction[0].ID_Producto]
            );
        }

        const [result] = await db.query('DELETE FROM Transaccion WHERE ID_Transaccion = ?', [req.params.id]);
        res.json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar transacción', error: error.message });
    }
});

module.exports = router;
