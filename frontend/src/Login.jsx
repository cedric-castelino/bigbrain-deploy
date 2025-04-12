import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button'



function Login ({ successJob, token,}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      if (token) {
          navigate('/dashboard');
      }
    }, [token, navigate]);
  


  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
        email: email,
        password: password
      })

      const token = response.data.token;
      successJob(token, email, password)
      
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div data-theme="nord" className="flex items-center justify-center min-h-screen bg-blue-200">
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend text-center text-3xl">Login</legend>
        
        <label className="fieldset-label">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="input" placeholder="Email" />
        
        <label className="fieldset-label">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="input" placeholder="Password" />
      
        <button onClick={login} className="btn btn-primary md:btn-md flex-1 mt-3">Login</button>
        <div className="flex gap-x-1 w-full mt-4"> 
          Dont have an account? <Link to="/register">Register</Link>
        </div>
      </fieldset>
    </div>
  )
}

export default Login;