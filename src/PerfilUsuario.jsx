import React, { useState, useEffect } from 'react';
import './PerfilUsuario.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const PerfilUsuario = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user.imagen_fondo) {
      setBackgroundImage(`http://localhost/${user.imagen_fondo}`);
    }
    if (user.imagen_perfil) {
      setProfileImage(`http://localhost/${user.imagen_perfil}`);
    }
  }, [user]);

  const handleBackgroundChange = (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('userId', user.id);
    formData.append('type', 'background');

    axios.post('http://localhost/upload.php', formData)
      .then(response => {
        setBackgroundImage(`http://localhost/${response.data.filePath}`);
        alert('Imagen de fondo actualizada correctamente.');
        // Actualiza la información
        user.imagen_fondo = response.data.filePath;
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
      });
  };

  const handleProfileChange = (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('userId', user.id);
    formData.append('type', 'profile');

    axios.post('http://localhost/upload.php', formData)
      .then(response => {
        setProfileImage(`http://localhost/${response.data.filePath}`);
        alert('Imagen de perfil actualizada correctamente.');
        // Actualiza la información al localStorage
        user.imagen_perfil = response.data.filePath;
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
      });
  };

  return (
    <div className="profile-container">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage || 'https://via.placeholder.com/1000x250'})` }}>
        <label htmlFor="background-upload" className="background-upload-label">
          <i className="fas fa-camera"></i> Cambiar fondo
        </label>
        <input id="background-upload" type="file" accept="image/*" onChange={handleBackgroundChange} style={{ display: 'none' }} />
      </div>
      <div className="profile-image">
        <img src={profileImage || 'https://via.placeholder.com/150'} alt="Profile" />
        <label htmlFor="profile-upload" className="profile-upload-label">
          <i className="fas fa-camera"></i>
        </label>
        <input id="profile-upload" type="file" accept="image/*" onChange={handleProfileChange} style={{ display: 'none' }} />
      </div>
      {user && (
        <div className="user-info">
          <h1>{`${user.nombre} ${user.apellidos}`}</h1>
          <p><i className="fas fa-phone"></i> {user.telefono}</p>
          <p><i className="fas fa-envelope"></i> {user.email}</p>
          <p><i className="fas fa-check"></i> Registro: Exitoso</p>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
