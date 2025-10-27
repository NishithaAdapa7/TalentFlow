import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminNavbar from '../Admin/AdminComponents/NavBar';
import JobCards from '../Admin/AdminComponents/JobCard';

const AdminDashboard = () => {
  const location = useLocation();
  const name = location.state?.name || 'Admin';

  return (
    <div>
        <AdminNavbar adminName={name} />
        <div style={{ height: '55px' }}></div> {/* spacer */}
        <JobCards/>
    </div>
    
  );
};

export default AdminDashboard;
