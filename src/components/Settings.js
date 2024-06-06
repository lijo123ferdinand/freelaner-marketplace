import React from 'react';
import './Page.css';

function Settings() {
    return (
        <div className="page">
            <h1>Settings</h1>
            <p>Here you can configure your settings.</p>
            <ul>
                <li>Change Password</li>
                <li>Notification Preferences</li>
                <li>Account Management</li>
            </ul>
        </div>
    );
}

export default Settings;
