import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import  AuthProvider  from './components/AuthContext';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;


// import { AuthProvider } from './components/AuthContext'; // Import AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
