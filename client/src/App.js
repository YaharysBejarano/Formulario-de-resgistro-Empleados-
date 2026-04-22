import { useState, useEffect } from 'react';
import './App.css';

function App() {
// Estado para almacenar los datos de los usuarios (Formulario)
//Form para el nombre
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState('');
  const [cargo, setCargo] = useState('');
  const [anios, setAnios] = useState(0);

  // Estado para almacenar los datos de los usuarios (Tabla- lista)
  const [registros, setRegistros] = useState([]); //ejecutar en el momento requerido

  //Estado para controlar la edición de un registro
  const [editIndex, setEditIndex] = useState(null); //null= guardando, numero= editando

  //Cargar los registros al iniciar la aplicación
  useEffect(() => {
    cargarEmpleados();
  }, []);


  // Función para cargar los empleados desde el backend
  const cargarEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:3001/empleados');
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert('Error al cargar los empleados');
    }
  };

  //Función para saber si edita o agrega un nuevo registro 
  const registrarDatos = async (e) => {
    e.preventDefault();

     //Actualizar o guardar un nuevo registro
    if (editIndex !== null) {//actualizando empleado existente
      try {
        const empleado = registros[editIndex];
        const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, edad, pais, cargo, anios })
        });
        
        if (response.ok) {
          const nuevosRegistros = [...registros]
          nuevosRegistros[editIndex] = { ...empleado, nombre, edad, pais, cargo, anios }
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert('Empleado actualizado correctamente');
        } else {
          alert('Error al actualizar el empleado');
        }
        
      }catch (error) {
        alert('Error al actualizar el empleado');
      }
    }

    else { //agregando nuevo empleado
      try {
        const response = await fetch('http://localhost:3001/empleados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, edad, pais, cargo, anios })
        });

        const data = await response.json();
        
        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Empleado guardado correctamente');
        } else {
          alert('Error al guardar el empleado');
        }

      } catch (error) {
        alert('Error de conexión');
      }
    }
    
    //Limpiar el formulario después de registrar o actualizar
    setNombre('');
    setEdad(0);
    setPais('');
    setCargo('');
    setAnios(0);
  };
    //Eliminar un registro de empleado
  const eliminarRegistro = async (idx) => {
    const empleado = registros[idx]; //Obtenemos el empleado por el indice
    try {
      const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== idx));
        if(editIndex === idx) {
          setEditIndex(null);
          setNombre('');
          setEdad(0);
          setPais('');
          setCargo('');
          setAnios(0);
        }
        alert('Empleado eliminado correctamente');
      } else {
          alert('Error al eliminar el empleado');
        }

      } catch (error) {
        alert('Error de conexión al eliminar el empleado');
      }
  };



  //Función que se ejecute cuando se quiera editar un registro
  const editarRegistro = (idx) => {
    const empleado = registros[idx];
    setNombre(empleado.nombre);
    setEdad(empleado.edad);
    setPais(empleado.pais);
    setCargo(empleado.cargo);
    setAnios(empleado.anios);
    setEditIndex(idx);
  };


return (
    <div className="app-container">
      <div className="content-wrapper">
        
        {/* Sección del Formulario */}
        <div className="card form-section">
          <h2>{editIndex !== null ? 'Editar Registro' : 'Nuevo Empleado'}</h2>
          <form onSubmit={registrarDatos} className="styled-form">
            
            <div className="input-group">
              <label>Nombre Completo</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej. Ana Pérez" />
            </div>

            <div className="row">
              <div className="input-group">
                <label>Edad</label>
                <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} required placeholder="Ej. 28" />
              </div>
              <div className="input-group">
                <label>País</label>
                <input type="text" value={pais} onChange={(e) => setPais(e.target.value)} required placeholder="Ej. Colombia" />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Cargo</label>
                <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} required placeholder="Ej. Desarrollador" />
              </div>
              <div className="input-group">
                <label>Años de Experiencia</label>
                <input type="number" value={anios} onChange={(e) => setAnios(e.target.value)} required placeholder="Ej. 3" />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              {editIndex !== null ? 'Actualizar Empleado' : 'Registrar Empleado'}
            </button>
            {editIndex !== null && (
              <button type="button" className="btn-cancel" onClick={() => {
                setEditIndex(null); setNombre(''); setEdad(''); setPais(''); setCargo(''); setAnios('');
              }}>Cancelar Edición</button>
            )}
          </form>
        </div>

        {/* Sección de la Tabla */}
        <div className="card table-section">
          <h2>Directorio de Empleados</h2>
          <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>País</th>
                  <th>Cargo</th>
                  <th>Experiencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.length > 0 ? (
                  registros.map((empleado, index) => (
                    <tr key={index}>
                      <td>{empleado.nombre}</td>
                      <td>{empleado.edad}</td>
                      <td>{empleado.pais}</td>
                      <td>{empleado.cargo}</td>
                      <td>{empleado.anios} años</td>
                      <td className="actions">
                        <button className="btn-edit" onClick={() => editarRegistro(index)}>Editar</button>
                        <button className="btn-delete" onClick={() => eliminarRegistro(index)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">No hay empleados registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
