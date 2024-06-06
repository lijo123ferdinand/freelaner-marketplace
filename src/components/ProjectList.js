import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateBid from './CreateBid'; // Import the CreateBid component
import './ProjectList.css'; // Import CSS for styling

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortingOption, setSortingOption] = useState('');
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

    // Filter and sort projects when statusFilter or sortingOption changes
    useEffect(() => {
        let sortedProjects = [...projects];

        // Apply status filter
        if (statusFilter) {
            sortedProjects = sortedProjects.filter(project => project.status === statusFilter);
        }

        // Apply sorting option
        if (sortingOption === 'title') {
            sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortingOption === 'description') {
            sortedProjects.sort((a, b) => a.description.localeCompare(b.description));
        } else if (sortingOption === 'status') {
            sortedProjects.sort((a, b) => {
                // Define the sorting order based on project status
                const statusOrder = {
                    'OPEN': 1,
                    'IN_PROGRESS': 2,
                    'COMPLETED': 3
                };
                return statusOrder[a.status] - statusOrder[b.status];
            });
        } // Add more sorting options if needed

        setFilteredProjects(sortedProjects);
    }, [statusFilter, sortingOption, projects]); // Re-run this effect when statusFilter, sortingOption, or projects change

    // Handle change in the status filter dropdown
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Handle change in the sorting dropdown
    const handleSortingChange = (e) => {
        setSortingOption(e.target.value);
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
        <div className="project-list">
            <h2>All Projects</h2>
            <div className="filter-container">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>
                    <option value="">All</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
                {/* Add sorting dropdown */}
                <label htmlFor="sortingOption">Sort by:</label>
                <select id="sortingOption" value={sortingOption} onChange={handleSortingChange}>
                    <option value="">None</option>
                    <option value="title">Title</option>
                    <option value="description">Description</option>
                    <option value="status">Status</option>
                    {/* Add more sorting options if needed */}
                </select>
            </div>
            <ul className="project-items">
                {filteredProjects.map(project => (
                   <li key={project.id} className="project-item">
                   <h3>{project.title}</h3>
                   <p>Description: {project.description}</p>
                   <p>Status: {project.status}</p>
                   {/* Button to create a bid, displayed only if the project status is not "IN_PROGRESS" */}
                   {project.status !== 'IN_PROGRESS' &&  project.status !== 'COMPLETED' && (
                       <button onClick={() => handleBidButtonClick(project.id)} className="btn-create-bid ml-39">Create Bid</button>
                   )}
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
