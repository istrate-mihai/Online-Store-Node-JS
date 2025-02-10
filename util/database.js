const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '1996',
    database: 'node-complete',
});

module.exports = pool.promise();
