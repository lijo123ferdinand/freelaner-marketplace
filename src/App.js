// App.js
import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  return (
    <div>
      <h1>Freelancer Marketplace</h1>
      <Login />
      <Signup />
    </div>
  );
};

export default App;
