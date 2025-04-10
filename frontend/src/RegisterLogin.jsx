import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterLogin ({ successJob, token, name}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (token) {
    navigate('/dashboard');
  };


  const fn = async () => {
    try {
      const response = await axios.post(`http://localhost:5005/admin/auth/${name}`, {
        email: email,
        password: password
      })

      const token = response.data.token;
      successJob(token)
      
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  console.log(name)

  return (
    <>
        <h1>{name}</h1>
        Email: <input value={email} onChange={e => setEmail(e.target.value)} type="text"/> <br/> 
        password: <input value={password} onChange={e => setPassword(e.target.value)} type="text"/> <br/> 
        <button onClick={fn}>{name}</button>
    </>
  )
}

export default RegisterLogin;