require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
   
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
});

// pool.query("SELECT * FROM employee", function(err, rows) {
//     // Connection is automatically released when query resolves
//     if(err) {
//         console.log(err);
//         return;
//     }
//     console.log(rows);
// })

module.exports = pool.promise();