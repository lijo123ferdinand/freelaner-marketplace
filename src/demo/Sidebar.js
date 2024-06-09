import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Creative Corner</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/accounting">Accounting</Link></li>
        <li><Link to="/expenses">Expenses</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/work-inquiry">Work Inquiry</Link></li>
        <li><Link to="/contracts">Contracts</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/clients">Clients</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
