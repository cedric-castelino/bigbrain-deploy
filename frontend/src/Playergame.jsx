import { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

function PlayerGame ({ token }) {

  const prePopulatedPlayerId = useParams().playerId;
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(prePopulatedPlayerId || '');
  const [gameState, setGameState] = useState('waitForPlayersJoin');
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionTimer, setQuestionTimer] = useState(-1);

  const currentQuestionIdRef = useRef(localStorage.getItem('currentQuestionId') || null);

  // Countdown timer
  useEffect(() => {
    if (questionTimer <= 0) return;

    const intervalId = setInterval(() => {
      setQuestionTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [questionTimer]);

  // Check for game status every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (localStorage.getItem('activeStatus') === 'true') {
        checkIfGameStarted();
      }
    }, 10);
  
    return () => clearInterval(intervalId);
  }, [playerId]);

  useEffect(() => {
    const checkResults = async () => {
      // Only check for results if no active session is running
      if (!localStorage.getItem('activeStatus')) {
        const success = await getResults(token);
        if (success === true) {
          setGameState("results")
        }
      }
    };
    checkResults();
  }, [token, localStorage.getItem('activeStatus')]);  // Re-check when the activeStatus changes

  const checkIfGameStarted = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/play/${playerId}/status`);
      if (response.data.started === true) {
        setGameState('displayQuestions');

        const questionRes = await axios.get(`http://localhost:5005/play/${playerId}/question`);
        const newQuestion = questionRes.data.question;
        const newId = newQuestion.id;

        if (newId !== currentQuestionIdRef.current) {
          currentQuestionIdRef.current = newId;
          localStorage.setItem('currentQuestionId', newId);

          setQuestion(newQuestion);
          setQuestionType(newQuestion.questionType);
          setQuestionTimer(newQuestion.duration);
        }
      } 
    } catch (err) {
      console.log(err);
    }
  };

  
  const getResults = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5005/play/${playerId}/results`, {
      })
      return true;
    } catch (err) {
      alert(err.response.data.error);
      return false;
    }
  }

  const renderQuestion = () => {
    switch (questionType) {
      case "Judgement":
        return(
        <>
          <h1>Question: {question.question}</h1>
          <p>Time remaining: {questionTimer} seconds</p>
          <div className="flex gap-4 mt-4">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => {}}
            >
              True
            </button>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => {}}
            >
              False
            </button>
          </div>
        </>
      );
      case "Single Choice":
        return(
        <>
          <button>Option A</button>
          <button>Option B</button>
        </>
      )
      case "Multiple Choice":
        return(
        <>
          
        </>
      )
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
          {renderQuestion()}
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
      <div className="bg-white p-8 rounded-lg shadow-md">
        {renderGameContent()}
      </div>
    </div>
  );
}

export default PlayerGame;