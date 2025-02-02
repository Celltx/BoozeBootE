import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registro.css';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost/registro.php', {
        nombre,
        apellidos,
        telefono,
        email,
        password,
        
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        setError('Error al registrar');
      }
    } catch (error) {
      setError('Error al registrar');
    }
  };

  return (
    <div className="registro-container">
      <h2 className="registro-heading">Regístrate</h2>
      <form className="registro-form" onSubmit={handleSubmit}>
        <div className="registro-field">
          <label className="registro-label">Nombre:</label>
          <input
            type="text"
            value={nombre}
            className="registro-input"
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="registro-field">
          <label className="registro-label">Apellidos:</label>
          <input
            type="text"
            value={apellidos}
            className="registro-input"
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
        </div>
        <div className="registro-field">
          <label className="registro-label">Teléfono:</label>
          <input
            type="tel"
            value={telefono}
            className="registro-input"
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <div className="registro-field">
          <label className="registro-label">Email:</label>
          <input
            type="email"
            value={email}
            className="registro-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="registro-field">
          <label className="registro-label">Contraseña:</label>
          <input
            type="password"
            value={password}
            className="registro-input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="registro-field">
          <label className="registro-label">Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            className="registro-input"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="registro-button">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default Registro;
