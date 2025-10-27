import React from 'react';
import { useLocation } from 'react-router-dom';

const UserDashboard = () => {
  const location = useLocation();
  const name = location.state?.name || 'User';

  return (
    <div className="min-h-screen flex justify-center items-center bg-yellow-100">
      <h1 className="text-3xl font-bold">
        Welcome {name} to User Dashboard
      </h1>
    </div>
  );
};

export default UserDashboard;
