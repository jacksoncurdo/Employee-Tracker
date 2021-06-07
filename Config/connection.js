const mysql = require('mysql');
require('dotenv').config();


const myConnection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  myConnection.connect((err) => {
  if (err) throw err
})
module.exports = myConnection