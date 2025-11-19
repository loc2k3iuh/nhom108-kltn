// src/pages/NotAuthenticated.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthenticated: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/user/login'); // Go back to login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-500">Please log in to continue!</h1>
      <button
        onClick={handleRedirect}
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300"
      >
        Go back to login
      </button>
    </div>
  );
};

export default NotAuthenticated;
