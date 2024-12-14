const db = require('../config/db');

// Obtener todas las categorías
exports.getCategorias = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categoria');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
    }
};

// Crear una nueva categoría
exports.createCategoria = async (req, res) => {
    try {
        const { Nombre_Categoria } = req.body;
        const [result] = await db.query(
            'INSERT INTO Categoria (Nombre_Categoria) VALUES (?)',
            [Nombre_Categoria]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Categoría creada exitosamente' 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear categoría', error: error.message });
    }
};

// Obtener categoría por ID
exports.getCategoriaById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Categoria WHERE ID_Categoria = ?',
            [req.params.id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
    }
};