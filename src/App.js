import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import FreelancerDashboard from './components/FreelancerDashboard';
import ProjectList from './components/ProjectList';
import ClientDashboard from './components/ClientDashboard';
import { AuthProvider } from './components/AuthContext';

const App = () => {
  return (
    <AuthProvider>

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


        </Routes>
      </div>
    </Router>
    </AuthProvider>

  );
};

export default App;
