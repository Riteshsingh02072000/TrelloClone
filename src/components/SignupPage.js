// src/components/SignupPage.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { AuthContext } from './AuthContext';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your signup logic here
    // For now, we'll simulate a successful signup and login
    login(); // Update authentication status
    navigate('/dashboard'); // Redirect to dashboard
  };

  return (
    <div className="signup-page">
      <h2>Signup</h2>
      <div className="signup-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
        <p>
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
        <button className="google-signup-button">
          Signup with Google
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
