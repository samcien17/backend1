const db = require('../config/db');

// Obtener todas las empresas
exports.getEmpresas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Empresa');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener empresas', error: error.message });
    }
};

// Crear una nueva empresa
exports.createEmpresa = async (req, res) => {
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
};