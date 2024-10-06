// src/components/LoginPage.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { AuthContext } from './AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your login logic here
    // For now, we'll simulate a successful login
    login(); // Update authentication status
    navigate('/dashboard'); // Redirect to dashboard
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="signup-link">
            Signup
          </Link>
        </p>
        <button className="google-login-button">
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
