import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Session = ({ token, setActiveStatus }) => {
  const linkedSession = useParams();
  const navigate = useNavigate();

  const [localActiveStatus, setLocalActiveStatus] = useState(localStorage.getItem('activeStatus'));
  const [localActiveGameId, setLocalActiveGameId] = useState(localStorage.getItem('activeGameId'));
  const [localSessionId, setLocalSessionId] = useState(localStorage.getItem('sessionId'));
  const [numberOfQuestions, setNumberOfQuestions] = useState(parseInt(localStorage.getItem('NumberOfQuestions')));
  const [currentQuestionPosition, setCurrentQuestionPosition] = useState(parseInt(localStorage.getItem('currentQuestionPosition')));
  const [gameState, setGameState] = useState(localStorage.getItem("gameState"));
  const [hasResults, setHasResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionTimer, setQuestionTimer] = useState(localStorage.getItem("questionTimer"));

  const activeStatus = localStorage.getItem('activeStatus');
  const activeGameId = localStorage.getItem('activeGameId');
  const sessionId = localStorage.getItem('sessionId');
  const localToken = localStorage.getItem('token');
  const localGameState = localStorage.getItem('gameState');
  const localCurrentQuestionPosition = parseInt(localStorage.getItem('currentQuestionPosition'));
  const localNumberOfQuestions = parseInt(localStorage.getItem('NumberOfQuestions'));

  useEffect(() => {
    if (questionTimer <= 0) return;
    
    const intervalId = setInterval(() => {
      setQuestionTimer((prev) => prev - 1);
    }, 1000);
    
    // Cleanup when component unmounts or timer ends
    return () => clearInterval(intervalId);
  }, [questionTimer]);

  useEffect(() => {
    const checkResults = async () => {
      // Only check for results if no active session is running
      if (!activeStatus) {
        const success = await getResults(localToken);
        setHasResults(success);
      }
    };
    checkResults();
  }, [localToken, activeStatus]);  // Re-check when the activeStatus changes

  useEffect(() => {
    setLocalActiveStatus(localStorage.getItem('activeStatus'));
    setLocalActiveGameId(localStorage.getItem('activeGameId'));
    setLocalSessionId(localStorage.getItem('sessionId'));
    setCurrentQuestionPosition(localCurrentQuestionPosition)
    setNumberOfQuestions(localNumberOfQuestions)
    setGameState(localGameState)

  }, []);

  // Update gameState based on currentQuestionPosition
  useEffect(() => {
    if (currentQuestionPosition === -1) {
      setGameState("waitForPlayersJoin");
    } else if (currentQuestionPosition === 0) {
      setGameState("displayQuestions");
    } else if (currentQuestionPosition + 1 > numberOfQuestions) {
      localStorage.removeItem('activeStatus');
      localStorage.removeItem('activeGameId');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('gameState');
      localStorage.removeItem('currentQuestionPosition');
      localStorage.removeItem('localNumberOfQuestions');
      setGameState("results");
    }
  }, [currentQuestionPosition]);

  const renderGameContent = () => {
    if (gameState === "waitForPlayersJoin" && hasResults) {
      setGameState("results");
    }

    switch(gameState) {
    case "waitForPlayersJoin":
      localStorage.setItem('gameState', 'waitForPlayersJoin');
      return (<p>Waiting for players to connect</p>)
    case "displayQuestions":
      localStorage.setItem('gameState', 'displayQuestions');
      return (
        <div>
          <p>Question position: {currentQuestionPosition + 1} / {numberOfQuestions} </p>
          <div>
            {questionTimer > 0
              ? `Duration: ${questionTimer}s`
              : "Question is finished"}

            {questions.length > 0 && currentQuestionPosition >= 0 && currentQuestionPosition < questions.length ? (
              <ul>
                <li>
                                        Question: {questions[currentQuestionPosition].question}
                </li>
                <li>
                                        Option A: {questions[currentQuestionPosition].options.optionA}
                </li>
                <li>
                                        Option B: {questions[currentQuestionPosition].options.optionB || ""}
                </li>
                <li>
                                        Option C: {questions[currentQuestionPosition].options.optionC || ""}
                </li>
                <li>
                                        Option D: {questions[currentQuestionPosition].options.optionD || ""}
                </li>
              </ul>
            ) : (
              <p>Loading questions...</p>
            )}

                                
          </div>
        </div>
      )
    case "results":
      localStorage.setItem('gameState', 'results');
      return (
        <div>
          <p>Results screen</p>
          <h1>data</h1>
          <h1>data</h1>
          <h1>data</h1>
        </div>
                
      )
    }
  }

  const endGameFunctionality = async () => {
    localStorage.removeItem('activeStatus');
    localStorage.removeItem('activeGameId');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('gameState');
    localStorage.removeItem('currentQuestionPosition');
    setLocalActiveStatus(null);
    setLocalActiveGameId(null);
    setLocalSessionId(null);
    setActiveStatus(false);
  }

  const endGameMutate = async (token) => {
    try {
      const response = await axios.post(`http://localhost:5005/admin/game/${activeGameId}/mutate`, {
        mutationType: "END"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      endGameFunctionality()
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  const advanceGame = async (token) => {

    try {
      const response = await axios.post(`http://localhost:5005/admin/game/${activeGameId}/mutate`, {
        mutationType: "ADVANCE"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
            
      getStatus(token);
      const newPosition = response.data.data.position;
      localStorage.setItem('currentQuestionPosition', newPosition.toString())
      setCurrentQuestionPosition(newPosition);
      if (newPosition === numberOfQuestions) {
        endGameFunctionality()
      }
            
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  const getStatus = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5005/admin/session/${sessionId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {  // If you need to send the sessionId as a query parameter
          sessionid: sessionId
        }
      })
      const lngth = response.data.results.questions.length;
      setQuestions(response.data.results.questions)
      setNumberOfQuestions(lngth);
      localStorage.setItem('NumberOfQuestions', lngth.toString());
      if (response && 
                localCurrentQuestionPosition + 1 < lngth && 
                localCurrentQuestionPosition >= -1) {
        setQuestionTimer(response.data.results.questions[localCurrentQuestionPosition + 1].duration);
        localStorage.setItem('questionTimer', response.data.results.questions[localCurrentQuestionPosition + 1].duration)
      }
            
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  const getResults = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5005/admin/session/${linkedSession.sessionId}/results`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {  // If you need to send the sessionId as a query parameter
          sessionid: linkedSession.sessionId
        }
      })
      console.log(response);
      return true;
    } catch (err) {
      alert(err.response.data.error);
      return false;
    }
  }

  const navigate_to_dashboard = async () => {
    navigate('/dashboard');
  }

    
  return (
    <>
      <button onClick={navigate_to_dashboard} className="btn bg-primary hover:!bg-blue-600 text-white absolute top-16 right-6 sm:top-2 sm:right-[8.25rem] sm:btn-lg btn-lg">Dashboard</button>
      {((activeStatus && linkedSession.sessionId === sessionId)) ? (
        <div>
          <div className="flex justify-center mt-2">
            <p className={`p-2 rounded-md text-white !bg-red-600 mr-2 hover:cursor-pointer hover:!bg-red-900 w-auto`}
              onClick={() => {
                endGameMutate(token);
                setGameState("results")
              }}
            >
              <b>End Session</b>
            </p>

            <p className={`${gameState === "results" ? "" : "p-2 rounded-md text-white !bg-green-600 mr-2 hover:cursor-pointer hover:!bg-green-900 w-auto"}`}
              onClick={() => {
                advanceGame(token);
                getStatus(localToken)
              }}
            >
              <b>
                {gameState === "results" 
                  ? "" 
                  : gameState === "waitForPlayersJoin" 
                    ? "Start" 
                    : (gameState === "displayQuestions" && currentQuestionPosition + 1 === numberOfQuestions) 
                      ? "View Results" 
                      : "Next Question"}
              </b>
            </p>
          </div>
          <div>
            {renderGameContent()}
          </div>
        </div>
                
      ) : (
        <div className="flex flex-col items-center mt-3">
          <h1>{renderGameContent()}</h1>
        </div>
      )}
    </>
  );
};

export default Session;