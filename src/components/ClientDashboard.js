import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
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
            setSelectedProjectId(null);
            setBids([]);
        } else {
            try {
                const response = await axios.get(`http://localhost:8089/api/bids/project/${projectId}`);
                setBids(response.data);
                setSelectedProjectId(projectId);
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
            await axios.delete(`http://localhost:8089/api/bids/project/${projectId}`);
            await axios.delete(`http://localhost:8089/api/projects/${projectId}`);
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

    const projectStatusData = {
        labels: ['Open', 'In Progress', 'Completed'],
        datasets: [
            {
                label: 'Project Status',
                data: [
                    projects.filter(project => project.status === 'OPEN').length,
                    projects.filter(project => project.status === 'IN_PROGRESS').length,
                    projects.filter(project => project.status === 'COMPLETED').length
                ],
                backgroundColor: ['#007bff', '#ffc107', '#28a745'],
            },
        ],
    };

    const bidsPerProjectData = {
        labels: projects.map(project => project.title),
        datasets: [
            {
                label: 'Bids per Project',
                data: projects.map(project => bids.filter(bid => bid.project.id === project.id).length),
                backgroundColor: '#007bff',
            },
        ],
    };

    return (
        <div className="client-dashboard">
            <div className="client-dashboard-sidebar">
                <h1><strong>Client Dashboard</strong></h1>
                <p className="user-email"><strong>Client Email:</strong> {email}</p>
                <h2>Navigation</h2>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="active-projects">Active projects</a></li>
                    <li><a href="#bids">Bids</a></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/report">Report</Link></li>
                </ul>
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
                <Bar data={projectStatusData} />
                {/* <h3>Bids per Project</h3>
                <Pie data={bidsPerProjectData} /> */}
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
