import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './BidForm.css'; // Optional: Create and import a CSS file for styling

const CreateBid = ({ projectId, onClose }) => {
    const [amount, setAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState(null); // Initialize userId state

    useEffect(() => {
        // Decode token and set userId once when component mounts
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken && decodedToken.userId) {
                    setUserId(decodedToken.userId);
                } else {
                    throw new Error('Invalid userId');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setError('Error decoding token. Please try again.');
            }
        } else {
            setError('Token not found in localStorage');
        }
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bidData = {
                amount: parseFloat(amount),
                proposal: proposal,
                project: {
                    id: projectId
                },
                user: {
                    id: userId // Use userId obtained from token decoding
                }
            };

            const response = await axios.post('http://localhost:8089/api/bids', bidData);

            setSuccess('Bid created successfully!');
            setAmount('');
            setProposal('');
            onClose(); // Close the form after successful submission
        } catch (error) {
            console.error('Error creating bid:', error);
            setError('Error creating bid. Please try again.');
        }
    };

    return (
        <div className="bid-form-container">
            <h2>Create New Bid</h2>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Amount:</label>
                <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <label>Proposal:</label>
                <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    required
                />
                <button type="submit">Submit Bid</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateBid;
