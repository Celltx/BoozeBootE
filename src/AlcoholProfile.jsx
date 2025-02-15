import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AlcoholProfile.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Input,
  Label
} from "reactstrap";

const AlcoholProfile = () => {
  const [modalActualizar, setModalActualizar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [dataState, setDataState] = useState([]);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    precio: '',
    image_url: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/alcohol_read.php');
        setDataState(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);

  const mostrarModalActualizar = (dato) => {
    setForm(dato);
    setModalActualizar(true);
  };

  const cerrarModalActualizar = () => {
    setModalActualizar(false);
  };

  const mostrarModalInsertar = () => {
    setForm({
      id: '',
      nombre: '',
      precio: '',
      image_url: ''
    });
    setModalInsertar(true);
  };

  const cerrarModalInsertar = () => {
    setModalInsertar(false);
  };

  const editar = () => {
    axios.post('http://localhost/alcohol_update.php', form)
      .then(response => {
        if (response.data.success) {
          let newArr = dataState.map(item => item.id === form.id ? form : item);
          setDataState(newArr);
          setModalActualizar(false);
        } else {
          alert('Error al actualizar: ' + response.data.message);
        }
      })
      .catch(error => {
        alert('Error al actualizar');
      });
  };

  const eliminar = (id) => {
    const opcion = window.confirm('Estás seguro que deseas eliminar el elemento ' + id);
    if (opcion) {
      axios.post('http://localhost/alcohol_delete.php', { id })
        .then(response => {
          if (response.data.success) {
            const newData = dataState.filter(item => item.id !== id);
            setDataState(newData);
          } else {
            alert('Error al eliminar: ' + response.data.message);
          }
        })
        .catch(error => {
          alert('Error al eliminar');
        });
    }
  };

  const insertar = () => {
    if (form.nombre && form.precio && form.image_url) {
      axios.post('http://localhost/alcohol_create.php', form)
        .then(response => {
          if (response.data.success) {
            setDataState([...dataState, { ...form, id: response.data.id }]);
            setModalInsertar(false);
          } else {
            alert('Error al insertar: ' + response.data.message);
          }
        })
        .catch(error => {
          alert('Error al insertar');
        });
    } else {
      alert('Por favor, complete todos los campos');
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const generatePDF = () => {
    axios.post('http://localhost/generar_pdf_alcohol.php', { data: dataState }, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        window.open(url, '_blank'); 
      })
      .catch(error => console.error('Error al generar el PDF:', error));
  };

  return (
    <>
      <Container>
        <br />
        <Button color="success" onClick={mostrarModalInsertar}>Crear</Button>
        <br /><br />
        <div className="table-container" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <Table striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen URL</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {dataState.length > 0 ? (
                dataState.map(dato => (
                  <tr key={dato.id}>
                    <td>{dato.id}</td>
                    <td>{dato.nombre}</td>
                    <td>{dato.precio}</td>
                    <td>{dato.image_url}</td>
                    <td>
                      <Button color="primary" onClick={() => mostrarModalActualizar(dato)}>Editar</Button>{" "}
                      <Button color="danger" onClick={() => eliminar(dato.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <Button color="primary" onClick={generatePDF}>Generar PDF</Button>
      </Container>

      <Modal isOpen={modalActualizar} toggle={cerrarModalActualizar}>
        <ModalHeader toggle={cerrarModalActualizar}>
          Editar Registro
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="id">ID:</Label>
            <Input type="text" name="id" id="id" readOnly value={form.id} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="nombre">Nombre:</Label>
            <Input type="text" name="nombre" id="nombre" value={form.nombre} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="precio">Precio:</Label>
            <Input type="text" name="precio" id="precio" value={form.precio} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="image_url">Imagen URL:</Label>
            <Input type="text" name="image_url" id="image_url" value={form.image_url} onChange={handleChange} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={editar}>Actualizar</Button>
          <Button color="danger" onClick={cerrarModalActualizar}>Cancelar</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar} toggle={cerrarModalInsertar}>
        <ModalHeader toggle={cerrarModalInsertar}>
          Insertar Nuevo Registro
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="nombre">Nombre:</Label>
            <Input type="text" name="nombre" id="nombre" value={form.nombre} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="precio">Precio:</Label>
            <Input type="text" name="precio" id="precio" value={form.precio} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="image_url">Imagen URL:</Label>
            <Input type="text" name="image_url" id="image_url" value={form.image_url} onChange={handleChange} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={insertar}>Insertar</Button>
          <Button color="danger" onClick={cerrarModalInsertar}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AlcoholProfile;
