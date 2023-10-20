const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'departments_db'
    },
    console.log(`Connected to the departments_db database.`)
  );

module.exports = db;