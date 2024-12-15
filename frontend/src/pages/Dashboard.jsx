import React from 'react';
import Header from '../components/Header';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold">Heureux de vous revoir !</h1>
      </div>
    </div>
  );
};

export default Dashboard;
