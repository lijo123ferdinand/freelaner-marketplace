import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateBid from './CreateBid'; // Import the CreateBid component
import './ProjectList.css'; // Import CSS for styling

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [isCreateBidOpen, setIsCreateBidOpen] = useState(false);

    useEffect(() => {
        // Function to fetch all projects
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8089/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        // Call the fetchProjects function
        fetchProjects();
    }, []); // Empty dependency array to run the effect only once when the component mounts

    // Filter projects by status when the statusFilter state changes
    useEffect(() => {
        if (statusFilter) {
            const fetchFilteredProjects = async () => {
                try {
                    const response = await axios.get(`http://localhost:8089/api/projects/status/${statusFilter}`);
                    setFilteredProjects(response.data);
                } catch (error) {
                    console.error('Error fetching filtered projects:', error);
                }
            };

            // Call the fetchFilteredProjects function to get projects by status
            fetchFilteredProjects();
        } else {
            // If no status filter is selected, display all projects
            setFilteredProjects(projects);
        }
    }, [statusFilter, projects]); // Re-run this effect when statusFilter or projects change

    // Handle change in the status filter dropdown
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Handle click event for creating a bid
    const handleBidButtonClick = (projectId) => {
        setSelectedProjectId(projectId);
        setIsCreateBidOpen(true); // Open the bid creation modal
    };

    // Close the bid creation modal
    const handleCloseBidModal = () => {
        setIsCreateBidOpen(false);
        setSelectedProjectId(null);
    };

    return (
        <div>
            <h2>All Projects</h2>
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>
                <option value="">All</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
            </select>
            <ul>
                {filteredProjects.map(project => (
                    <li key={project.id}>
                        <h3>{project.title}</h3>
                        <p>Description: {project.description}</p>
                        <p>Status: {project.status}</p>
                        {/* Button to create a bid */}
                        <button onClick={() => handleBidButtonClick(project.id)}>Create Bid</button>
                        {/* If you want to display additional fields, add them here */}
                    </li>
                ))}
            </ul>
            {/* Render the CreateBid component as a modal */}
            {isCreateBidOpen && (
                <div className="bid-modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={handleCloseBidModal}>Close</button>
                        <CreateBid projectId={selectedProjectId} onClose={handleCloseBidModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectList;
