const db = require('../config/db');

// Obtener todas las transacciones
exports.getTransacciones = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, 
                   p.Nombre as Nombre_Producto,
                   per.Nombre as Nombre_Personal 
            FROM Transaccion t
            LEFT JOIN Producto p ON t.ID_Producto = p.ID_Producto
            LEFT JOIN Personal per ON t.ID_Personal = per.ID_Personal
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener transacciones', error: error.message });
    }
};

// Crear nueva transacción
exports.createTransaccion = async (req, res) => {
    try {
        const { 
            Fecha,
            Tipo_Transaccion,
            Cantidad,
            ID_Producto,
            ID_Personal
        } = req.body;

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
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Transacción creada exitosamente' 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear transacción', error: error.message });
    }
};

// Obtener transacción por ID
exports.getTransaccionById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Transaccion WHERE ID_Transaccion = ?',
            [req.params.id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Transacción no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener transacción', error: error.message });
    }
};