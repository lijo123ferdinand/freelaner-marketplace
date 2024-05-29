import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8089/api/users/signup', { username, email, password, role });
      setSuccessMessage('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
      console.log('Signup successful:', response.data);
    } catch (error) {
      console.error('Signup failed:', error);
      setSuccessMessage('Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="CLIENT">Client</option>
          <option value="FREELANCER">Freelancer</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default Signup;
