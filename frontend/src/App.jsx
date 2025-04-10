import { useState } from 'react';
import axios from 'axios';

import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom"

function App() {

  const token = localStorage.getItem('token');

  
  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      localStorage.removeItem('token')
      navigate('/login')
    } catch (err) {
      alert(err.response.data.error);
    }

  }

  return (
    <Router>
      {token ? (
        <>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/register">Register</Link>
          &nbsp;|&nbsp;
          <Link to="/login">Login</Link>
        </>
      )
    }
      <hr />
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  )
}

export default App
