import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProjectList from './ProjectList'; // Import the ProjectList component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './FreelancerDashboard.css'; // Import the CSS file

function FreelancerDashboard() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.email; // Assuming 'email' is the field containing the email
                setEmail(userEmail);
            } catch (error) {
                console.error('Error decoding token:', error);
                // Handle error decoding token
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h1>Freelancer Dashboard</h1>
                <p className="user-info"><strong>Email:</strong> {email}</p>
               
                    <ul>
                    <li><a href="#home">Projects</a></li>
                    <li><a href="#projects">Settings</a></li>
                    <li><a href="#bids">Report</a></li>
                    <li><a href="#profile">Profile</a></li>
                </ul>
                {/* </div> */}
                <button onClick={handleLogout} className="btn-logout-btn">Logout</button>
            </div>
            <div className="dashboard-content">
                {/* Render the ProjectList component */}
                <ProjectList />
            </div>
        </div>
    );
}

export default FreelancerDashboard;
