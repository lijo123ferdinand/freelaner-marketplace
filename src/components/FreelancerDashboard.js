import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import './FreelancerDashboard.css';

function FreelancerDashboard() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.email;
                setEmail(userEmail);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleCreateProjectClick = () => {
        navigate('/projlist');
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h1>Freelancer Dashboard</h1>
                <p className="user-info"><strong>Email:</strong> {email}</p>
                <ul>
                    <li><Link to="/FreelancerProject">Allocated Projects</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/report">Report</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
            <div className="main-content">
                <header className="header">
                    <div className="header-item">
                        <button onClick={handleCreateProjectClick} className="btn-create-project">View Projects</button>
                    </div>
                    <div className="header-item">
                        <span>Welcome, {email}</span>
                    </div>
                </header>
                <div className="content">
                    <div className="section">
                        <h2>Weekly Work Hours</h2>
                        <div className="progress-circle">75%</div>
                    </div>
                    <div className="section">
                        <h2>Completed Tasks</h2>
                        <div className="completed-tasks">12/50</div>
                    </div>
                    <div className="section">
                        <h2>Performance: Hours Per Day</h2>
                        <div className="progress-circle">45%</div>
                    </div>
                    <div className="section">
                        <h2>Overall Project Progress</h2>
                        <div className="project-progress">25.7%</div>
                    </div>
                    <div className="section">
                        <h2>Upcoming Deadlines</h2>
                        <div className="calendar">
                            <ul>
                                <li>Project A - Deadline: July 10</li>
                                <li>Project B - Deadline: July 15</li>
                                <li>Project C - Deadline: July 20</li>
                                <li>Project D - Deadline: July 25</li>
                                <li>Project E - Deadline: July 30</li>
                                </ul>
                        </div>
                    </div>
                    <div className="section">
                        <h2>Task List</h2>
                        <div className="task-list">
                            <ul>
                                <li>Task 1</li>
                                <li>Task 2</li>
                                <li>Task 3</li>
                                <li>Task 4</li>
                                <li>Task 5</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FreelancerDashboard;
