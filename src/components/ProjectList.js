import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);

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
                        {/* If you want to display additional fields, add them here */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjectList;
