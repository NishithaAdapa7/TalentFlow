import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usersData from '../Data/Login.json';
import '../CSS/LoginPage.css'; // Import the CSS

const LoginPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name) return alert('Please enter your name');

    const user = usersData.find(
      u => u.name.toLowerCase() === name.toLowerCase() && u.role === role
    );

    if (!user) return alert(`No ${role} found with this name`);

    if (user.role === 'admin') navigate('/admin', { state: { name: user.name } });
    else navigate('/user', { state: { name: user.name } });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        {/* Name Input */}
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Role Selection */}
        <div className="input-group">
          <label>Role</label>
          <div className="role-buttons">
            <button
              className={role === 'user' ? 'active' : ''}
              onClick={() => setRole('user')}
            >
              User
            </button>
            <button
              className={role === 'admin' ? 'active' : ''}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
