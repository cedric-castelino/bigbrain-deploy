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
    <>
      <section className="register-page">
        <h1>Login</h1>
        Email: <input value={email} onChange={e => setEmail(e.target.value)} type="text"/> <br/> 
        password: <input value={password} onChange={e => setPassword(e.target.value)} type="text"/> <br/> 
        <Button onClick={login} variant='primary'>Login</Button>
      </section>
    </>
  )
}

export default Login;