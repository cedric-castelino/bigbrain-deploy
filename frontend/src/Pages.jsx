import { useState, useEffect } from 'react';
import axios from 'axios';

import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import EditGame from './EditGame';

import 'bootstrap/dist/css/bootstrap.min.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link, 
  useNavigate
} from "react-router-dom"

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, []);

  useEffect(() => {
    // Check if we're at the root path
    if (window.location.pathname === '/') {
      navigate('/login');
    }
  }, [navigate]);

  const successJob = (token, email, password) => {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
    localStorage.setItem('password', password)
    setToken(token);
    navigate('/dashboard');
  }
  
  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      setToken(null);
      navigate('/login');
    } catch (err) {
      alert(err.response.data.error);
    }

  }

  return (
    <div className="min-h-screen bg-blue-200">
      {token ? (
        <>
          <button onClick={logout}>Logout</button>
        </>
      ) : null
    }
      <Routes>
        <Route path="/register" element={<Register successJob={successJob} token={token}/>} />
        <Route path="/login" element={<Login successJob={successJob} token={token}/>} />
        <Route path="/dashboard" element={<Dashboard token={token}/>} />
        <Route path="/game/:gameId" element={<EditGame token={token} />} />
      </Routes>
    </div>
  )
}

export default App
