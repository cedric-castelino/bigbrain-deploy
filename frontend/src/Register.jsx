import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button'

function Register({ successJob, token}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const navigate = useNavigate();

  if (token) {
    navigate('/dashboard');
  };

  function checkEmailValidity (event) {
    const emailRegex = /^.+\@.+\..+$/;
    let emailValid = false;
    emailValid = emailRegex.test(event); // check if the email is in the correct form
    return emailValid;
  };

  const register = async () => {

    if (confirmPassword !== password || password === '') {
      alert("Passwords are not the same");
    } else if (!checkEmailValidity(email)) {
      alert("Email isn't correct");
    } else {
        try {
          const response = await axios.post('http://localhost:5005/admin/auth/register', {
            email: email,
            password: password
          })

          const token = response.data.token;
          successJob(token)
          
        } catch (err) {
          alert(err.response.data.error);
        }      
    }


  }

  return (
    <>
      <section className="register-page">
        <h1>Register</h1>
        Email: <input value={email} onChange={e => setEmail(e.target.value)} type="text"/> <br/> 
        password: <input value={password} onChange={e => setPassword(e.target.value)} type="password"/> <br/> 
        password: <input value={confirmPassword} onChange={e => setconfirmPassword(e.target.value)} type="password"/> <br/> 
        <Button onClick={register} variant='primary'>Register</Button>
      </section>
    </>
  )
}

export default Register;