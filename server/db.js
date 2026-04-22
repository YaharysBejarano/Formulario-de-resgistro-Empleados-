//Llamamos el módulo mysql2 para conectar a la base de datos
const mysql = require('mysql2');

//Petición para conectar a la base de datos
require('dotenv').config();

//Metodo para conectar a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Metodo para mostrar posibles errores
connection.connect((err) => {
    //Si hay un error, se muestra en la consola
    if (err) {
        console.err('Error de conexión: ' + err);
        return;
    }
    //Si la conexión es exitosa, se muestra un mensaje en la consola
    console.log('Conexión exitosa a la base de datos');

})

//Exportar la conexión
module.exports = connection;