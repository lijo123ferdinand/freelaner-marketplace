import React, { useState, useEffect } from 'react';
import axios from 'axios';


function ClientDashboard() {
    const [userId, setUserId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        status: 'OPEN',
        user: {
            id: null
        }
    });

    useEffect(() => {
        // Function to fetch user details and get the user ID
        const fetchUserDetails = async () => {
            try {
                // Fetch user details from the API
                const response = await axios.get('http://localhost:8089/api/users');
                // Extract the user ID from the response data
                const userIdFromResponse = response.data.id;
                // Set the user ID state
                setUserId(userIdFromResponse);
                // Set the user ID in the newProject state
                setNewProject(prevState => ({
                    ...prevState,
                    user: {
                        id: userIdFromResponse
                    }
                }));
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        // Call the fetchUserDetails function when the component mounts
        fetchUserDetails();
    }, []); // Empty dependency array to run the effect only once when the component mounts

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Post new project data to the API
            await axios.post('http://localhost:8089/api/projects', newProject);
            // Fetch updated project list
            const response = await axios.get('http://localhost:8089/api/projects');
            setProjects(response.data);
            // Clear form fields
            setNewProject({
                title: '',
                description: '',
                status: 'OPEN',
                user: {
                    id: userId
                }
            });
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div>
            <h2>Client Dashboard</h2>
            <h3>Create New Project</h3>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" name="title" value={newProject.title} onChange={handleChange} required />
                <label>Description:</label>
                <textarea name="description" value={newProject.description} onChange={handleChange} required />
                <label>Status:</label>
                <select name="status" value={newProject.status} onChange={handleChange}>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
                <button type="submit">Create Project</button>
            </form>
            <h3>Projects</h3>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        {project.title} - Status: {project.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClientDashboard;
