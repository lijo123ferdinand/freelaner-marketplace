// AddProject.js
import React, { useState } from 'react';
import axios from 'axios';

const AddProject = () => {
  // State variables to store the project title and description
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send a POST request to the backend API to add the project
      await axios.post('http://localhost:8080/api/projects', { title, description, status: 'OPEN' });
      // If the request is successful, display a success message and clear the form
      alert('Project added successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      // If an error occurs during the request, log the error and display an error message
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
    }
  };

  // Render the form for adding a new project
  return (
    <div>
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit}>
        {/* Input field for project title */}
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        {/* Textarea for project description */}
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        {/* Submit button to add the project */}
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
