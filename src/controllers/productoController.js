const db = require('../config/db');

// Obtener todos los productos
exports.getProductos = async (req, res) => {
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
};

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
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
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Producto creado exitosamente' 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Producto WHERE ID_Producto = ?',
            [req.params.id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
};