import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import FreelancerDashboard from './components/FreelancerDashboard';
import ProjectList from './components/ProjectList';
import ClientDashboard from './components/ClientDashboard';
import FreelancerProject from './components/FreelancerProject';
import FreelancerBids from './components/FreelancerBids';

const App = () => {
  return (
  

    <Router>
      <div>
        {/* <h1>Freelancer Marketplace</h1> */}
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/freelancer" element={<FreelancerDashboard />} />
          <Route path="/projlist" element={<ProjectList />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/FreelancerProject" element={<FreelancerProject />} />
          <Route path="/FreelancerBids" element={<FreelancerBids />} />




        </Routes>
      </div>
    </Router>

  );
};

export default App;
