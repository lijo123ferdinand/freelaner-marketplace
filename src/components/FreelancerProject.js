import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Bar } from 'react-chartjs-2';
import './FreelancerProject.css';

function FreelancerProject() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [email, setEmail] = useState('');
    const [tasks, setTasks] = useState([]); // State to hold tasks for the selected project
    const [projectCompletionPercentage, setProjectCompletionPercentage] = useState({}); // State to hold project completion percentages
    const navigate = useNavigate();
    const [showTaskDetails, setShowTaskDetails] = useState(false); // State to manage task details visibility

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
                const projectsData = response.data;
                const completionPercentages = {};

                // Fetch completion percentage for each project
                for (const project of projectsData) {
                    const completionPercentageResponse = await axios.get(`http://localhost:8089/tasks/project/${project.id}/statusPercentage`);
                    completionPercentages[project.id] = completionPercentageResponse.data;
                }

                setProjects(projectsData);
                setProjectCompletionPercentage(completionPercentages);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [navigate]);

    useEffect(() => {
        // Fetch tasks for the selected project
        const fetchTasks = async () => {
            if (selectedProjectId !== null) {
                try {
                    const response = await axios.get(`http://localhost:8089/tasks/project/${selectedProjectId}`);
                    setTasks(response.data);
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            }
        };

        fetchTasks();
    }, [selectedProjectId]);

    const handleShowProjectDetails = (projectId) => {
        setSelectedProjectId(selectedProjectId === projectId ? null : projectId);
        setShowTaskDetails(false); // Reset task details visibility when project details are toggled
    };

    const handleShowTaskDetails = () => {
        setShowTaskDetails(!showTaskDetails);
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
// Prepare colors for each project
const colors = [
    'rgba(75, 192, 192, 10)',
    'rgba(255, 99, 132, 10)',
    'rgba(54, 162, 235, 10)',
    'rgba(255, 206, 86, 10)',
    'rgba(153, 102, 255, 10)',
    'rgba(255, 159, 64, 10)',
    // Add more colors as needed
];

    // Prepare data for the project completion graph
    const projectCompletionData = {
        labels: projects.map(project => project.title),
        datasets: [
            {
                label: 'Project Completion (%)',
                data: projects.map(project => projectCompletionPercentage[project.id] || 0),
                backgroundColor: colors.slice(0, projects.length),
                borderColor: colors.slice(0, projects.length).map(color => color.replace('0.2', '1')),
                borderWidth: 1,
            },
        ],
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
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
                <button onClick={handleLogout} className="btn-logout-btn">Logout</button>
            </div>
            <div className="main-content">
                <h3>Active Projects</h3>
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
                                    <button onClick={handleShowTaskDetails} className="btn-show-task-details">
                                        {showTaskDetails ? 'Hide Tasks' : 'Show Tasks'}
                                    </button>
                                    {showTaskDetails && (
                                        <ul className="task-list">
                                            {tasks.map(task => (
                                                <li key={task.id} className="task-item">
                                                    <p><strong>Name:</strong> {task.name}</p>
                                                    <p><strong>Description:</strong> {task.description}</p>
                                                    <p><strong>Status:</strong> {task.status}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="project-completion-graph">
                    <h3>Project Completion Graph</h3>
                    <Bar data={projectCompletionData} />
                </div>
            </div>
        </div>
    );
}

export default FreelancerProject;
