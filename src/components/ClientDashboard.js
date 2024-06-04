import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
function ClientDashboard() {
    const [projects, setProjects] = useState([]);
    const [bids, setBids] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        status: 'OPEN',
        user: {
            id: null
        }
    });

    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        setNewProject(prevState => ({
            ...prevState,
            user: {
                id: decodedToken.userId
            }
        }));

        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:8089/api/projects/user/${decodedToken.userId}`);
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [navigate]);

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
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8089/api/projects', newProject);
            const response = await axios.get(`http://localhost:8089/api/projects/user/${newProject.user.id}`);
            setProjects(response.data);
            setNewProject({
                title: '',
                description: '',
                status: 'OPEN',
                user: {
                    id: newProject.user.id
                }
            });
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleShowBids = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:8089/api/bids/project/${projectId}`);
            setBids(response.data);
            setSelectedProjectId(projectId);
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    };

    const handleAcceptBid = async (projectId) => {
        try {
            await axios.put(`http://localhost:8089/api/bids/${projectId}/update-status`, {
                status: 'IN_PROGRESS'
            });
            const response = await axios.get(`http://localhost:8089/api/projects/user/${newProject.user.id}`);
            setProjects(response.data);
            setSelectedProjectId(null);
            setBids([]);
        } catch (error) {
            console.error('Error accepting bid:', error);
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
                        <button onClick={() => handleShowBids(project.id)}>Show Bids</button>
                        {selectedProjectId === project.id && (
                            <ul>
                                {bids.length > 0 ? (
                                    bids.map(bid => (
                                        <li key={bid.id}>
                                            {bid.amount} - {bid.proposal}
                                            <button onClick={() => handleAcceptBid(project.id)}>Accept Bid</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No bids available</li>
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClientDashboard;
