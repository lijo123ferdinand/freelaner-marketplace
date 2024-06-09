import React from 'react';
import { Line } from 'react-chartjs-2';
import EmployeeRegion from './EmployeeRegion';

const data = {
  labels: ['Sep 1', 'Sep 2', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7', 'Sep 8', 'Sep 9', 'Sep 10', 'Sep 11', 'Sep 12'],
  datasets: [
    {
      label: 'Task Progress',
      data: [45, 55, 50, 48, 45, 40, 35, 38, 40, 45, 47, 50],
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};

const DashboardContent = () => {
  return (
    <div className="dashboard-content">
      <div className="metrics">
        <div className="metric">
          <span>13,596</span>
          <p>This Month Revenue</p>
        </div>
        <div className="metric">
          <span>+16</span>
          <p>Project Accepted</p>
        </div>
        <div className="metric">
          <span>92.8%</span>
          <p>Delivered On Time</p>
        </div>
        <div className="metric">
          <span>1h 00m</span>
          <p>Responded On Time</p>
        </div>
      </div>
      <div className="chart">
        <Line data={data} />
      </div>
      <EmployeeRegion />
    </div>
  );
};

export default DashboardContent;
