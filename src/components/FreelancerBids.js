import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Fix the import statement
import './FreelancerBids.css'; // Import the CSS file

function FreelancerBids() {
    const [bids, setBids] = useState([]);
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

        const fetchBids = async () => {
            try {
                const response = await axios.get(`http://localhost:8089/api/bids/user/${decodedToken.userId}`);
                setBids(response.data);
            } catch (error) {
                console.error('Error fetching bids:', error);
            }
        };

        fetchBids();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="freelancer-bids">
            <div className="sidebar">
                <h1>Freelancer Dashboard</h1>
                <p className="user-email"><strong>Freelancer Email:</strong> {email}</p>
                <h2>Navigation</h2>
                <ul>
                    <li><a href="/freelancer">Home</a></li>
                    <li><a href="/FreelancerProject" >Projects</a></li>
                    <li><a href="/FreelancerBids" >My Bids</a></li>
                     <li><a href="#profile">Profile</a></li>
                    <li><a href="#settings">Settings</a></li>
                </ul>
                <button onClick={handleLogout} className="btn-logout-btn">Logout</button>
            </div>
            <div className="main-content">
                <h3>My Bids</h3>
                <ul className="bids-list">
                    {bids.map(bid => (
                        <li key={bid.id} className="bid-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <strong>Project:</strong> {bid.project.title} - <strong>Amount:</strong> {bid.amount} - <strong>Proposal:</strong> {bid.proposal}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FreelancerBids;
