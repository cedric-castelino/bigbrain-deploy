import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import axios from 'axios';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const register = async () => {
    const response = await axios.post('http://localhost:5005/admin/auth/register', {
        email: email,
        password: password
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log(response)
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

export default App
