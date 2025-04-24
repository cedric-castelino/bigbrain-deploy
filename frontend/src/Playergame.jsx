import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

function PlayerGame ({ token }) {

  // Collects user input for the login form
  const prePopulatedPlayerId = useParams().playerId;
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(prePopulatedPlayerId || '');
  const [gameState, setGameState] = useState('waitForPlayersJoin');
  const [question, setQuestion] = useState('');

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
        setGameState('displayQuestions');
        getQuestion();
      }
    } catch (err) {
        console.log(err);
    }
  }

  const getQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/play/${playerId}/question`, {
        params: { 
          playerid: playerId
        }
      })
      setQuestion(response.data.question);
      console.log(response.data)
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

          The question text
          A video or image depending on whether it exists.
          A countdown with how many seconds remain until you can't answer anymore.
          A selection of single, multiple or judgement answers, that are clickable.


          The answer shall be sent to the server immediately after each user interaction. If further selections are modified, more requests are sent
          When the timer hits 0, the answer/results of that particular question are displayed
          The answer screen remains visible until the admin advances the game question onto the next question.
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