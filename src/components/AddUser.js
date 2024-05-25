// src/components/AddUser.js
import React, { useState } from 'react';
import { createUser } from '../services/api';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');

  const handleSubmit = (event) => {
    event.preventDefault();
    createUser({ username, password, role }).then(() => {
      setUsername('');
      setPassword('');
      setRole('CLIENT');
    });
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="CLIENT">Client</option>
          <option value="FREELANCER">Freelancer</option>
        </select>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
