//Crear las rutas para poder conectar la base de datos
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

//Peticiones desde frondend
app.use(cors());
app.use(express.json());

//Creación de la ruta para obtener los datos de la base de datos
//Ruta 1: GET Obtener = POST crear = PUT actualizar = DELETE eliminar

app.get('/empleados', (req, res) => {
    const sql = 'SELECT * FROM empleados'; //para que me muestre todos los empleados

    db.query(sql, (err, results) => {
       //Si hay error me muestra el mensaje
        if (err) {
            return res.status(500).json({
                error: 'Error al obtener los empleados'
            });
        }
        return res.json(results); //Si no hay error, me muestra los resultados
    }); 
});

//Ruta 2: para crear un nuevo empleado
app.post('/empleados', (req, res) => {
    const { nombre, edad, pais, cargo, anios } = req.body; //Obtener los datos del cuerpo de la petición
    const sql = 'INSERT INTO empleados (nombre, edad, pais, cargo, anios) VALUES (?, ?, ?, ?, ?)'; //para insertar un nuevo empleado

    db.query(sql, [nombre, edad, pais, cargo, anios], (err, result) => {
       //Si hay error me muestra el mensaje
        if (err) {exi
            return res.status(500).json({
                error: 'Error al guardar los datos del empleado'
            });
        }
        return res.json({
            message: 'Empleado guardado exitosamente',
            id: result.insertId, //Me muestra el id del nuevo empleado 
            nombre,
            edad,
            pais,
            cargo,
            anios
        
        }); 
    }); 
});

//Ruta 3: para actualizar un empleado
app.put('/empleados/:id', (req, res) => {
    const { id } = req.params; //Obtener el id del empleado a actualizar
    const { nombre, edad, pais, cargo, anios } = req.body; //Obtener los datos del cuerpo de la petición
    const sql = 'UPDATE empleados SET nombre = ?, edad = ?, pais = ?, cargo = ?, anios = ? WHERE id = ?'; //para actualizar un empleado

    db.query(sql, [nombre, edad, pais, cargo, anios, id], (err, result) => {
         //Si hay error me muestra el mensaje
        if (err) {
            return res.status(500).json({
                error: 'Error al actualizar los datos del empleado'
            });
        }
        return res.json({
            message: 'Empleado actualizado exitosamente'
        });
    });
});

//Ruta 4: para eliminar un empleado
app.delete('/empleados/:id', (req, res) => {
    const { id } = req.params; //Obtener el id del empleado a eliminar
    const sql = 'DELETE FROM empleados WHERE id = ?'; //para eliminar un empleado
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al eliminar el empleado'
            });
        }
        return res.json({
            message: 'Empleado eliminado exitosamente'
        });
    });
});

//Iniciar el servidor
app.listen(3001, () => {
    console.log('Servidor del backend corriendo en el puerto 3001');
}); 