let mysql = require("mysql");

let connectionMysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mbebe'
  });
  
  connectionMysql.connect(function(err){
    if (err) return console.error('ha ocurido un error conectando a la base de datos');
    console.log('conexion exitosa');
  });

  module.exports = {
    connectionMysql
  }