import React from 'react';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-6">Bienvenue sur notre plateforme !</h1>
      </div>
    </div>
  );
};

export default HomePage;
