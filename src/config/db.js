const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: 'junction.proxy.rlwy.net',
    port: 16283,
    user: 'root',
    password: 'lQyOIGZVMxtQMbEpKlSsKuBKNTkrdVzf',
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

const promisePool = pool.promise();

module.exports = promisePool;
