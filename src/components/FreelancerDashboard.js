import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import ProjectList from './ProjectList'; // Import the ProjectList component

function FreelancerDashboard() {
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (token) {
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken);

            const userEmail = decodedToken.sub; // Assuming 'sub' contains the email
            console.log('User email:', userEmail);

            setEmail(userEmail);
        } else {
            console.error('No JWT token found');
        }
    }, []);

    console.log('Email state:', email); // Log the email state

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h1>Freelancer Dashboard</h1>
                </div>
                <div className="card-body">
                    <p className="card-text"><strong>Email:</strong> {email}</p>
                    {/* Render the ProjectList component */}
                    <ProjectList />
                </div>
            </div>
        </div>
    );
}

export default FreelancerDashboard;
