import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

function PlayerGame ({ token }) {

  // Collects user input for the login form
  const prePopulatedPlayerId = useParams().playerId;
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(prePopulatedPlayerId || '');
  const [gameState, setGameState] = useState('waitForPlayersJoin');

  useEffect(() => {
    // Check immediately on component mount
    checkIfGameStarted();
    
    // Then set up interval to check regularly (every 5 seconds)
    const intervalId = setInterval(checkIfGameStarted, 5000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [playerId]); // Re-run effect if playerId changes


  const checkIfGameStarted = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/play/${playerId}/status`, {
        params: { 
          playerid: playerId
        }
      })
      if (response.data.started === true) {
        setGameState('displayQuestions')
      }
    } catch (err) {
        console.log(err);
    }
  }

  
  const renderGameContent = () => {
    switch(gameState) {
    case "waitForPlayersJoin":
      return (
        <div className="flex flex-col justify-center items-center">
          <h1>Waiting for players to connect</h1>
        </div>
      
    )
    case "displayQuestions":
      return (
        <div className="flex flex-col items-center justify-center">
          <p>
            Game is in progress
          </p>
        </div>
      )
    case "results":
      return (
        <div>
          <p>Results screen</p>
        </div>
                
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
       {renderGameContent()}
    </div>
  )
}

export default PlayerGame;