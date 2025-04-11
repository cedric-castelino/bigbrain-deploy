import { useState, useEffect } from 'react';
import axios from 'axios';

import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';

import 'bootstrap/dist/css/bootstrap.min.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link, 
  useNavigate
} from "react-router-dom"

function App() {
  const [games, setGames] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, []);

  const successJob = (token) => {
    localStorage.setItem('token', token)
    setToken(token);
    getDashboardGames(token);
    navigate('/dashboard');
  }

  const getDashboardGames = async (token) => {
    try {
        const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
        })
        setGames(response.data.games)
    } catch (err) {
        alert(err.response.data.error);
    }
}
  
  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      localStorage.removeItem('token');
      setToken(null);
      navigate('/login');
    } catch (err) {
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
        <Route path="/register" element={<Register successJob={successJob} token={token}/>} />
        <Route path="/login" element={<Login successJob={successJob} token={token}/>} />
        <Route path="/dashboard" element={<Dashboard token={token} games={games} getGames={getDashboardGames}/>} />
      </Routes>
    </>
  )
}

export default App
