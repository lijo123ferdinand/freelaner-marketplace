import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './FreelancerProject.css';

function FreelancerProject() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
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

        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:8089/api/bids/accepted-projects/user/${decodedToken.userId}`);
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [navigate]);

    const handleShowProjectDetails = (projectId) => {
        setSelectedProjectId(selectedProjectId === projectId ? null : projectId);
    };

    const handleCompleteProject = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8089/api/bids/${projectId}/update-status`, 'COMPLETED', {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            // Refresh the project list
            const updatedProjects = projects.map(project => {
                if (project.id === projectId) {
                    return { ...project, status: 'COMPLETED' };
                }
                return project;
            });
            setProjects(updatedProjects);
        } catch (error) {
            console.error('Error marking project as completed:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="freelancer-project">
            <div className="sidebar">
                <h1>Freelancer Dashboard</h1>
                <p className="user-email"><strong>Freelancer Email:</strong> {email}</p>
                <h2>Navigation</h2>
                <ul>
                    <li><a href="/freelancer">Home</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="/FreelancerBids">My Bids</a></li>
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="#settings">Settings</a></li>
                </ul>
                <button onClick={handleLogout} className="btn-logout-btn">Logout</button>
            </div>
            <div className="main-content">
                <h3>Available Projects</h3>
                <ul className="projects-list">
                    {projects.map(project => (
                        <li key={project.id} className="project-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <strong>{project.title}</strong> - {project.description}
                                </span>
                                <div>
                                    <button onClick={() => handleShowProjectDetails(project.id)} className="btn-show-details">
                                        {selectedProjectId === project.id ? 'Hide Details' : 'Show Details'}
                                    </button>
                                    {project.status !== 'COMPLETED' && (
                                        <button onClick={() => handleCompleteProject(project.id)} className="btn-complete-project">Mark as Completed</button>
                                    )}
                                </div>
                            </div>
                            {selectedProjectId === project.id && (
                                <div className="project-details">
                                    <p><strong>Title:</strong> {project.title}</p>
                                    <p><strong>Description:</strong> {project.description}</p>
                                    <p><strong>Status:</strong> {project.status}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FreelancerProject;
