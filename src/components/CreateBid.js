import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // Ensure you have an AuthContext to provide JWT token
import './BidForm.css'; // Optional: Create and import a CSS file for styling

const CreateBid = ({ projectId }) => {
    const { auth } = useContext(AuthContext); // Get auth context for user information and token
    const [amount, setAmount] = useState('');
    const [proposal, setProposal] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
                    id: auth.user.userId
                }
            };

            const response = await axios.post('http://localhost:8089/api/bids', bidData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            setSuccess('Bid created successfully!');
            setAmount('');
            setProposal('');
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
            </form>
        </div>
    );
};

export default CreateBid;
