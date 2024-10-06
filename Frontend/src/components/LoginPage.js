// src/components/LoginPage.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google'; // Import useGoogleLogin hook

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Handle regular login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const res = await axios.post('https://trelloclone-w4nv.onrender.com/api/auth/login', {
        email,
        password,
      });

      // Save the token in localStorage
      localStorage.setItem('token', res.data.token);
      login(); // Update authentication status
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error(err);
      setError('Invalid Credentials');
    }
  };

  // Initialize Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the access token to your backend for verification
        const res = await axios.post('https://trelloclone-w4nv.onrender.com/api/auth/google', {
          token: tokenResponse.access_token,
        });

        // Save the token in localStorage
        localStorage.setItem('token', res.data.token);
        login(); // Update authentication status
        navigate('/dashboard'); // Redirect to dashboard
      } catch (err) {
        console.error(err);
        setError('Google Login Failed');
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      setError('Google Login Failed');
    },
    flow: 'implicit', // Optional: specify the OAuth 2.0 flow
  });

  return (
    <div className="login-page">
      <h2>Login</h2>
      <div className="login-box">
        {error && <p className="error-message">{error}</p>}
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
        <button className="google-login-button" onClick={() => googleLogin()}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
