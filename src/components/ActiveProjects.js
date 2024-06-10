import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Line, Doughnut } from 'react-chartjs-2';
import './ActiveProjects.css';
import { Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ActiveProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([{ name: '', description: '' }]);
  const [projectCompletionPercentage, setProjectCompletionPercentage] = useState(0);

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8089/api/projects/user/${userId}`)
      .then(response => {
        const inProgressProjects = response.data.filter(project => project.status === "IN_PROGRESS");
        setProjects(inProgressProjects);
        if (inProgressProjects.length > 0) {
          const firstProject = inProgressProjects[0];
          axios.get(`http://localhost:8089/tasks/project/${firstProject.id}/statusPercentage`)
            .then(response => setProjectCompletionPercentage(response.data))
            .catch(error => console.error(error));
        }
      })
      .catch(error => console.error(error));
  }, [userId]);

  useEffect(() => {
    if (selectedProject) {
      axios.get(`http://localhost:8089/tasks/project/${selectedProject.id}`)
        .then(response => setTasks(response.data))
        .catch(error => console.error(error));
    }
  }, [selectedProject]);

  const handleProjectDetailsClick = (project) => {
    setSelectedProject(project);
    axios.get(`http://localhost:8089/tasks/project/${project.id}/statusPercentage`)
      .then(response => setProjectCompletionPercentage(response.data))
      .catch(error => console.error(error));
  };

  const handleNewTaskChange = (index, field, value) => {
    const updatedTasks = [...newTasks];
    updatedTasks[index][field] = value;
    setNewTasks(updatedTasks);
  };

  const handleAddTaskField = () => {
    setNewTasks([...newTasks, { name: '', description: '' }]);
  };

  const handleCreateTasks = () => {
    const tasksWithStatus = newTasks.map(task => ({ ...task, status: 'IN_PROGRESS' }));
    
    axios.post(`http://localhost:8089/tasks/project/${selectedProject.id}`, tasksWithStatus)
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  };

  const handleUpdateTaskStatus = (taskId, status) => {
    axios.put(`http://localhost:8089/tasks/${taskId}/status`, status, {
      headers: { 'Content-Type': 'text/plain' }
    })
      .then(response => {
        const updatedTasks = tasks.map(task => task.id === taskId ? response.data : task);
        setTasks(updatedTasks);
        checkAndUpdateProjectStatus(updatedTasks, selectedProject.id);
        const completedTasks = updatedTasks.filter(task => task.status === 'COMPLETED');
        const newCompletionPercentage = (completedTasks.length / updatedTasks.length) * 100;
        setProjectCompletionPercentage(newCompletionPercentage);
      })
      .catch(error => console.error(error));
  };
  
  const checkAndUpdateProjectStatus = (updatedTasks, projectId) => {
    const allTasksCompleted = updatedTasks.every(task => task.status === 'COMPLETED');
    if (allTasksCompleted) {
      axios.put(`http://localhost:8089/api/bids/${projectId}/update-status`, 'COMPLETED', {
        headers: { 'Content-Type': 'text/plain' }
      })
        .then(response => {
          setProjects(projects.map(project => project.id === projectId ? response.data : project));
        })
        .catch(error => console.error(error));
    }
  };

  const projectCompletionData = {
    labels: projects.map(project => project.title),
    datasets: [
      {
        label: 'Project Completion (%)',
        data: projects.map(project => {
          return project.id === selectedProject?.id ? projectCompletionPercentage : 0;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const projectCompletionChartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Project Completion',
        data: [projectCompletionPercentage, 100 - projectCompletionPercentage],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="client-dashboard">
      <div className="client-dashboard-sidebar">
        <h2>Active Projects</h2>
        <ul>
          <li><a href="/client-dashboard">Home</a></li>
          <li><a href="active-projects">Active projects</a></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/report">Report</Link></li>
        </ul>
        <button onClick={handleLogout} className="btn-logout-btn">Logout</button>
      </div>
      <div className="main-content">
        <div className="row">
          <div className="col">
            <h2 style={{ textAlign: 'left' }}>Projects</h2>
            {projects.length === 0 ? (
              <p>No active projects</p>
            ) : (
              <ul className="project-list">
                {projects.map(project => (
  <li key={project.id} className="project-item">
    <div className="project-details">
      <span>{project.title} - {project.status}</span>
      <button className="btn btn-primary btn-sm view-details-btn" onClick={() => handleProjectDetailsClick(project)}>View Details</button>
    </div>
  </li>
))}

              </ul>
            )}
          </div>
          <div className="col">
            {selectedProject && (
              <div>
                <h2><strong>Tasks for Project :</strong> {selectedProject.title}</h2>
                <ul className="project-list">
                  
                {tasks.map(task => (
  <li key={task.id} className="project-item">
    <div className="task-details">
      <span>{task.name} - {task.status}</span>
      <button onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')} className="btn btn-success btn-sm">Mark as Completed</button>
    </div>
  </li>
))}

                </ul>
                <h3>Create New Tasks</h3>
                {newTasks.map((task, index) => (
                  <div key={index} className="mb-3">
                    <input
                      type="text"
                      placeholder="Task Name"
                      value={task.name}
                      onChange={e => handleNewTaskChange(index, 'name', e.target.value)}
                      className="form-control mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Task Description"
                      value={task.description}
                      onChange={e => handleNewTaskChange(index, 'description', e.target.value)}
                      className="form-control mb-1"
                    />
                  </div>
                ))}
                <button onClick={handleAddTaskField} style={{ marginRight: '10px' }} className="btn btn-primary mb-3">Add Another Task</button>
                <button onClick={handleCreateTasks} className="btn btn-success mb-3">Create Tasks</button>
              </div>
            )}
          </div>
        </div>
        <div className="row mt-5">
          <div className="col">
            <h2 style={{ textAlign: 'left' }}>Project Status</h2>
            <div className="project-graph">
              <Doughnut data={projectCompletionChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveProjects;
