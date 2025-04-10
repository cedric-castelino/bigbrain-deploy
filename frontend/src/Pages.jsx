import { useState, useEffect } from 'react';
import axios from 'axios';

import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';

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

  const successJob = (token) => {
    localStorage.setItem('token', token)
    setToken(token);
    navigate('/dashboard')
  }
  
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
      console.log(err)
      alert(err.response.data.error);
    }

  }

  return (
    <>
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
        <Route path="/register" element={<Register successJob={successJob}/>} />
        <Route path="/login" element={<Login successJob={successJob}/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  )
}

export default App
