import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import './Page.css';

function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userName = decodedToken.sub;  // Assuming 'sub' is the name
                const userEmail = decodedToken.email;
                setName(userName);
                setEmail(userEmail);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    return (
        <div className="page">
            <h1>Profile</h1>
            <p>Hi {name}.</p>
            <div className="profile-image-container">
                <img src="./icons8-administrator-male-48.png" alt="Profile" className="profile-image" />
            </div>
            <ul>
                <li>Name: {name}</li>
                <li>Email: {email}</li>
                <li>Member Since: January 2020</li>
            </ul>
        </div>
    );
}

export default Profile;
