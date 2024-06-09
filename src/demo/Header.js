import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <h1>Hi Sohidur Rahman</h1>
      <p>This is your Freelance Team dashboard overview</p>
      <div className="search">
        <input type="text" placeholder="Type to search" />
      </div>
      <div className="user-info">
        <span>Sohidur Rahman</span>
      </div>
    </div>
  );
};

export default Header;
