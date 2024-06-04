import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProjectList from './ProjectList'; // Import the ProjectList component
import './FreelancerDashboard.css'; // Import the CSS file

function FreelancerDashboard() {
    const [email, setEmail] = useState('');

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

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="card-header">
                    <h1>Freelancer Dashboard</h1>
                </div>
                <div className="card-body">
                    <p className="user-info"><strong>Email:</strong> {email}</p>
                    {/* Render the ProjectList component */}
                    <ProjectList />
                </div>
            </div>
        </div>
    );
}

export default FreelancerDashboard;
