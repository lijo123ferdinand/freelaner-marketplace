import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  // Make sure to install jwt-decode
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8089/api/users/login', { email, password });
      const token = response.data;

      // Decode the JWT token to get user information
      const decodedToken = jwtDecode(token);

      // Redirect based on user role
      if (decodedToken.role === 'CLIENT') {
        navigate('/client-dashboard');
      } else if (decodedToken.role === 'FREELANCER') {
        navigate('/freelancer');
      } else {
        // Handle unexpected role
        setError('Invalid role');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email" // Use type="email" for email input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

export default Login;
