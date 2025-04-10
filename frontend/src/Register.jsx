import { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const register = async () => {
      try {
        const response = await axios.post('http://localhost:5005/admin/auth/register', {
          email: email,
          password: password
        })
  
        const token = response.data.token;
        localStorage.setItem('token', token)
        console.log(token);
        navigate('/dashboard')
        
      } catch (err) {
        alert(err.response.data.error);
      }
  
    }
  
    return (
      <>
        <section className="register-page">
          <h1>Register</h1>
          Email: <input value={email} onChange={e => setEmail(e.target.value)} type="text"/> <br/> 
          password: <input value={password} onChange={e => setPassword(e.target.value)} type="text"/> <br/> 
          <button onClick={register}>Register</button>
        </section>
      </>
    )
  }

export default Register;