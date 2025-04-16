import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

function Playergame ({ token }) {

  // Collects user input for the login form
  const prePopulatedSessionId = useParams().sessionId;
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(prePopulatedSessionId || '');
  const [name, setName] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
        <form className='flex flex-col gap-3'>
            <label type="text" className='mr-4'>Session ID</label>
            <input value={sessionId} onChange={e => setSessionId(e.target.value)} type='number' className='bg-white'></input>
            <label type="text" className='mr-4'>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} type='text' className='bg-white'></input>
            <button className=' btn btn-primary'>
                Join
            </button>
        </form>
    </div>
  )
}

export default Playergame;