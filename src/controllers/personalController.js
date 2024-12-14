const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Obtener todo el personal
exports.getPersonal = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.ID_Personal, p.Nombre, p.Correo_Electronico, 
                   p.Rol, e.Nombre as Nombre_Empresa 
            FROM Personal p
            LEFT JOIN Empresa e ON p.ID_Empresa = e.ID_Empresa
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personal', error: error.message });
    }
};

// Crear nuevo personal
exports.createPersonal = async (req, res) => {
    try {
        const { Nombre, Correo_Electronico, Contraseña, Rol, ID_Empresa } = req.body;
        
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(Contraseña, 10);
        
        const [result] = await db.query(
            'INSERT INTO Personal (Nombre, Correo_Electronico, Contraseña, Rol, ID_Empresa) VALUES (?, ?, ?, ?, ?)',
            [Nombre, Correo_Electronico, hashedPassword, Rol, ID_Empresa]
        );
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Personal creado exitosamente' 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear personal', error: error.message });
    }
};

// Obtener personal por ID
exports.getPersonalById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT ID_Personal, Nombre, Correo_Electronico, Rol, ID_Empresa FROM Personal WHERE ID_Personal = ?',
            [req.params.id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Personal no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personal', error: error.message });
    }
};