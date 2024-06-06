import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './ClientDashboard.css';

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
    const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
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
            setShowCreateProjectForm(false);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleShowBids = async (projectId) => {
        if (selectedProjectId === projectId) {
            setSelectedProjectId(null); // Hide bids if already selected
            setBids([]);
        } else {
            try {
                const response = await axios.get(`http://localhost:8089/api/bids/project/${projectId}`);
                setBids(response.data);
                setSelectedProjectId(projectId); // Show bids for the selected project
            } catch (error) {
                console.error('Error fetching bids:', error);
            }
        }
    };

    const handleAcceptBid = async (projectId, bidId) => {
        try {
            await axios.put(`http://localhost:8089/api/bids/${projectId}/update-status`, 'IN_PROGRESS', {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            const response = await axios.get(`http://localhost:8089/api/projects/user/${newProject.user.id}`);
            setProjects(response.data);
            setSelectedProjectId(null);
            setBids([]);
            await axios.put(`http://localhost:8089/api/bids/${bidId}/accept`);
        } catch (error) {
            console.error('Error accepting bid:', error);
        }
    };

    const handleRemoveProject = async (projectId) => {
        try {
            // Call the endpoint to delete bids related to the project
            await axios.delete(`http://localhost:8089/api/bids/project/${projectId}`);
            
            // Call the endpoint to delete the project itself
            await axios.delete(`http://localhost:8089/api/projects/${projectId}`);
            
            // Update the state to remove the deleted project
            const updatedProjects = projects.filter(project => project.id !== projectId);
            setProjects(updatedProjects);
        } catch (error) {
            console.error('Error removing project:', error);
        }
    };
    

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="client-dashboard">
            <div className="client-dashboard-sidebar">
                <h1>Client Dashboard</h1>
                <p className="user-email"><strong>Client Email:</strong> {email}</p>
                <h2>Navigation</h2>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#bids">Bids</a></li>
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="#settings">Settings</a></li>
                </ul>
                <h2>Client Dashboard</h2>
                <button onClick={handleLogout} className="btn-logout-btn">Logout</button>
            </div>
            <div className="main-content">
                <button onClick={() => setShowCreateProjectForm(!showCreateProjectForm)} className="btn-toggle-form">
                    {showCreateProjectForm ? "Hide Create Project Form" : "Show Create Project Form"}
                </button>
                {showCreateProjectForm && (
                    <div className="create-project-form">
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
                            <button type="submit" className="btn-submit-project">Create Project</button>
                        </form>
                    </div>
                )}
                <h3>Projects</h3>
                <ul className="projects-list">
                    {projects.map(project => (
                        <li key={project.id} className="project-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <strong>{project.title}</strong> - Status: {project.status}
                                </span>
                                <div>
                                    <button onClick={() => handleShowBids(project.id)} className="btn-show-bids">
                                        {selectedProjectId === project.id ? 'Hide Bids' : 'Show Bids'}
                                    </button>
                                    <button onClick={() => handleRemoveProject(project.id)} className="btn-remove-project" style={{ marginLeft: '10px' }}>Remove Project</button>
                                </div>
                            </div>
                            {selectedProjectId === project.id && (
                                <ul className="bids-list">
                                    {bids.length > 0 ? (
                                        bids.map(bid => (
                                            <li key={bid.id} className="bid-item">
                                                <span><strong>{bid.user.name}</strong> ({bid.user.email}) - {bid.amount} - {bid.proposal}</span>
                                                {project.status !== 'IN_PROGRESS' && (
                                                    <button onClick={() => handleAcceptBid(project.id, bid.id)} className="btn btn-success ml-2">Accept Bid</button>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="bid-item no-bids">No bids available</li>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ClientDashboard;
