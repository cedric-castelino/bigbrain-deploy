import { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button'

function Register({ successJob, token }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Move your navigation logic here
    if (token) {
        navigate('/dashboard');
    }
  }, [token, navigate]); // Include dependencies

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
          successJob(token, email, password)
          
        } catch (err) {
          alert(err.response.data.error);
        }      
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      register();
    }
  }

  return (
    <div data-theme="nord" className="flex items-center justify-center min-h-screen bg-blue-200">
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend text-center text-3xl">Register</legend>
        
        <label className="fieldset-label">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyPress} type="email" className="input" placeholder="Email" />
        
        <label className="fieldset-label">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyPress} type="password" className="input" placeholder="Password" />

        <label className="fieldset-label">Confirm Password</label>
        <input value={confirmPassword} onChange={e => setconfirmPassword(e.target.value)} onKeyDown={handleKeyPress} type="password" className="input" placeholder="Confirm Password" />
      
        <button onClick={register} className="btn btn-primary md:btn-md flex-1 mt-3">Register</button>
        <div className="flex gap-x-1 w-full mt-3"> 
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </fieldset>
    </div>
    
  )
}

export default Register;