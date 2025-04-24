import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

function PlayerJoin ({ token }) {

  // Collects user input for the login form
  const prePopulatedSessionId = useParams().sessionId;
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(prePopulatedSessionId || '');
  const [name, setName] = useState('');
  const [joinGameError, setJoinGameError] = useState('');

  const errorCheck = async (name) => {
    if (sessionId === '') {
      setJoinGameError("Session name cannot be empty");
      return; 
    } else if (name === '') {
      setJoinGameError("Game Name cannot be empty");
    } else {
      try {
        setJoinGameError("");
        const response = await axios.post(`http://localhost:5005/play/join/${sessionId}`, {
          name: name
        })
        const playerId = response.data.playerId
        navigate(`/playergame/${playerId}`)
      } catch (err) {
        console.log(err)
      }
        
    }
  }

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
      <form className='flex flex-col gap-3 w-[30vh]' onSubmit={(e) => {e.preventDefault(); errorCheck(name)}}>
        <label type="text" className='mr-4'><b>Session ID</b></label>
        <input value={sessionId} onChange={e => setSessionId(e.target.value)} type='number' className='bg-white rounded-md'></input>
        <label type="text" className='mr-4'><b>Name</b></label>
        <input value={name} onChange={e => setName(e.target.value)} type='text' className='bg-white rounded-md'></input>
        <button className=' btn btn-primary' onClick={() => errorCheck}>
                Join
        </button>
            
        {joinGameError && (
          <div role="alert" className="alert alert-warning mt-2 mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{joinGameError}</span>
          </div>
        )}
      </form>


    </div>
  )
}

export default PlayerJoin;