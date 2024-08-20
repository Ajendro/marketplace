import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './Login.css';
import { FaPhone, FaUser, FaLock, FaEnvelope, FaBirthdayCake, FaTransgender, FaImage } from "react-icons/fa";

const Login = () => {
  const [action, setAction] = useState(''); // Controla la vista actual (login o registro)
  const [profilePicture, setProfilePicture] = useState(null); // Estado para almacenar la imagen de perfil
  const navigate = useNavigate(); 

  const registerLink = () => setAction('active');
  const loginLink = () => setAction('');
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch('https://bakent-marketplace.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login Response Data:', data); // Verifica el contenido de la respuesta

        if (data.token) {
          // Guardar el token en localStorage
          localStorage.setItem('authToken', data.token);
          console.log('Token saved in localStorage:', localStorage.getItem('authToken')); // Verifica el token guardado
          alert('Login successful!');
          navigate('/'); // Redirigir a la página principal
        } else {
          alert('Login failed: Token not received');
        }
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred!');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('username', e.target.username.value);
    formData.append('email', e.target.email.value);
    formData.append('phoneNumber', e.target.phoneNumber.value);
    formData.append('fullName', e.target.fullName.value);
    formData.append('birthDate', e.target.birthDate.value);
    formData.append('gender', e.target.gender.value);
    formData.append('password', e.target.password.value);
    formData.append('role', e.target.role.value);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture); // Asegúrate de que este nombre coincida
    }
  
    try {
      const response = await fetch('https://bakent-marketplace.onrender.com/users/userscreate', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Obtiene el texto de la respuesta para depuración
        console.error('Error response text:', errorText);
        alert(`Registration failed: ${errorText || 'Unknown error'}`);
        return;
      }
  
      const data = await response.json();
      alert('Registration successful!');
      setAction(''); // Regresar a la vista de login después del registro exitoso
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred!');
    }
  };

  const handleImageChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  return (
    <div className={`wrapper ${action}`}>
      <div className={`form-box login ${action === 'active' ? 'inactive' : ''}`}>
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="email" name="email" placeholder="Email" required />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input type="password" name="password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="button">Login</button>
          <div className="register-link">
            <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
          </div>
        </form>
      </div>

      <div className={`form-box register ${action === '' ? 'inactive' : ''}`}>
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>
          <div className="input-box">
            <input type="text" name="username" placeholder="Username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="email" name="email" placeholder="Email" required />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input type="password" name="password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input type="text" name="phoneNumber" placeholder="Phone Number" required />
            <FaPhone className="icon" />
          </div>
          <div className="input-box">
            <input type="text" name="fullName" placeholder="Full Name" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="date" name="birthDate" />
            <FaBirthdayCake className="icon" />
          </div>
          <div className="input-box">
            <input type="text" name="gender" placeholder="Gender" />
            <FaTransgender className="icon" />
          </div>
          <div className="input-box">
            <input type="file" name="profilePicture" accept="image/*" onChange={handleImageChange} />
            <FaImage className="icon" />
          </div>
          <div className="input-box">
            <select name="role" required>
              <option value="Vendedor">Vendedor</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              I agree to the terms & conditions
            </label>
          </div>
          <button type="submit" className="button">Register</button>
          <div className="register-link">
            <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
