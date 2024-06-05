import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import Swal from 'sweetalert2';
import './Auth.css'; // Import the CSS file

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8089/api/users/signup', { username, email, password, role });
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: 'Redirecting to login...',
        timer: 2000, // Display alert for 2 seconds
        showConfirmButton: false
      }).then(() => {
        navigate('/login');
      });
      console.log('Signup successful:', response.data);
    } catch (error) {
      console.error('Signup failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: 'Please try again.',
      });
    }
  };

  return (
    <div className="signup-page"> {/* Apply the signup-page class */}
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
        <p>Already signed up? <Link to="/login">Go to login</Link></p> {/* Add the login link */}
      </div>
    </div>
  );
};

export default Signup;
