import React from 'react';
import './Page.css';

function Report() {
    return (
        <div className="page">
            <h1>Report</h1>
            <p>Here are your activity reports.</p>
            <ul>
                <li>Total Hours Worked: 150</li>
                <li>Projects Completed: 12</li>
                <li>Pending Tasks: 5</li>
            </ul>
        </div>
    );
}

export default Report;
