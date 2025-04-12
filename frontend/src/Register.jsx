import { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button'

function Register({ successJob, token }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [error, setError] = useState(''); 
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
    setError('');

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      setError("Input fields cannot be empty");
    } else if (confirmPassword !== password) {
      setError("Passwords are not the same");
    } else if (!checkEmailValidity(email)) {
      setError("Invalid email entered");
    } else {
        try {
          const response = await axios.post('http://localhost:5005/admin/auth/register', {
            email: email,
            password: password,
            name: name
          })

          const token = response.data.token;
          successJob(token, email, password)
          
        } catch (err) {
          setError(err.response.data.error);
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

        <label className="fieldset-label">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyPress} type="name" className="input" placeholder="Name" />
        
        <label className="fieldset-label">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyPress} type="email" className="input" placeholder="Email" />
        
        <label className="fieldset-label">Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyPress} type="password" className="input" placeholder="Password" />

        <label className="fieldset-label">Confirm Password</label>
        <input value={confirmPassword} onChange={e => setconfirmPassword(e.target.value)} onKeyDown={handleKeyPress} type="password" className="input" placeholder="Confirm Password" />

        {error && (
          <div role="alert" className="alert alert-warning mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button onClick={register} className="btn btn-primary md:btn-md flex-1 mt-2">Register</button>
        <div className="flex gap-x-1 w-full mt-3"> 
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </fieldset>
    </div>
    
  )
}

export default Register;