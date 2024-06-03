import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

function ClientDashboard() {
    const { auth } = useContext(AuthContext); // Get auth context
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        status: 'OPEN',
        user: {
            id: auth?.user?.userId // Use user ID from auth context
        }
    });

    useEffect(() => {
        // Function to fetch user projects
        const fetchProjects = async () => {
            try {
                // Fetch projects for the logged-in user
                const response = await axios.get(`http://localhost:8089/api/projects/user/${auth.user.userId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                // Set projects state
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        // Call the fetchProjects function when the component mounts
        if (auth?.user?.userId) {
            fetchProjects();
        }
    }, [auth]); // Dependency on auth to refetch when auth changes

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
            await axios.post('http://localhost:8089/api/projects', newProject, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            // Fetch updated project list
            const response = await axios.get(`http://localhost:8089/api/projects/user/${auth.user.userId}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            setProjects(response.data);
            // Clear form fields
            setNewProject({
                title: '',
                description: '',
                status: 'OPEN',
                user: {
                    id: auth.user.userId
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
