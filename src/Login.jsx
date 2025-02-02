import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [timer, setTimer] = useState(120); //tiempo en s
  const [canResend, setCanResend] = useState(false); // Estado para permitir reenviar el código
  const navigate = useNavigate();

  // Efecto para manejar el cronómetro
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true); // Habilitar reenvío cuando el tiempo llegue a 0
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/login.php', { email, password });
      if (response.data.success) {
        const loggedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setIsLoggedIn(true);
        setIsAdmin(loggedUser.email === 'administrador@gmail.com');

        if (loggedUser.email === 'administrador@gmail.com') {
          navigate('/admin-profile');
        } else {
          // Enviar código de verificación
          const verificationResponse = await axios.post('http://localhost/sendVerificationCode.php', { email });
          if (verificationResponse.data.success) {
            setIsVerificationStep(true);
            setUserCode(verificationResponse.data.code); // Guardar el código enviado
            setTimer(120); // Reiniciar el cronómetro
            setCanResend(false); // Deshabilitar el reenvío
          } else {
            setError('Error al enviar el código de verificación');
          }
        }
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (verificationCode === userCode) {
      navigate('/');
    } else {
      setError('Código incorrecto');
    }
  };

  const handleResendCode = async () => {
    try {
      const verificationResponse = await axios.post('http://localhost/sendVerificationCode.php', { email });
      if (verificationResponse.data.success) {
        setUserCode(verificationResponse.data.code); // Actualizar el código enviado
        setTimer(120); // Reiniciar el cronómetro
        setCanResend(false); // Deshabilitar el botón de reenviar
        setError('');
      } else {
        setError('Error al reenviar el código de verificación');
      }
    } catch (error) {
      setError('Error al reenviar el código');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="login-container">
      <img src="src/img/logo2.png" alt="Logo" className="login-logo" />
      <h2 className="login-heading">{isVerificationStep ? 'Verificación' : 'Iniciar Sesión'}</h2>
      {!isVerificationStep ? (
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
      ) : (
        <form onSubmit={handleVerificationSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Código de Verificación:</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <p className="timer">Tiempo restante: {formatTime(timer)}</p>
          {canResend && (
            <button type="button" onClick={handleResendCode} className="resend-button">
              Reenviar código
            </button>
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">Verificar</button>
        </form>
      )}
      <p>
        ¿No tienes una cuenta? <a href="/Registro">Regístrate aquí</a>
      </p>
    </div>
  );
};

export default Login;
