import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

function PlayerGame ({ token }) {

  // Collects user input for the login form
  const prePopulatedSessionId = useParams().sessionId;
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(prePopulatedSessionId || '');
  const [name, setName] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
        PLEASE WAIT
    </div>
  )
}

export default PlayerGame;