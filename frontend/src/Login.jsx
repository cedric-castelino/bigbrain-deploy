import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div data-theme="nord" className="flex items-center justify-center min-h-screen bg-gray-100">
      <fieldset className="fieldset w-xs bg-white border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend text-black">Login</legend>

        <label className="fieldset-label text-black">Email</label>
        <input type="email" className="input" placeholder="Email" />

        <label className="fieldset-label text-black">Password</label>
        <input type="password" className="input" placeholder="Password" />

        <button className="btn btn-neutral mt-4">Login</button>
      </fieldset>
      <br/>
      <>
        <section className="register-page text-black">
          <h1>Login</h1>
          Email: <input value={email} onChange={e => setEmail(e.target.value)} type="text"/> <br/> 
          password: <input value={password} onChange={e => setPassword(e.target.value)} type="text"/> <br/> 
          <Button onClick={login} variant='primary'>Login</Button>
        </section>
      </>


    </div>
  )
}

export default Login;