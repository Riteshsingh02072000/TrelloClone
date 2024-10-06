import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import  AuthProvider  from './components/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientId = '1008128593733-8imhmu89203kj8krchi7t73iudbkd5gp.apps.googleusercontent.com';


// import { AuthProvider } from './components/AuthContext'; // Import AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
