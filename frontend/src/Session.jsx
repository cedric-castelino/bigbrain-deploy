import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Session = ({ token, setActiveStatus }) => {
  const linkedSession = useParams();
  const navigate = useNavigate();

  const [localActiveStatus, setLocalActiveStatus] = useState(localStorage.getItem('activeStatus'));
  const [localSessionId, setLocalSessionId] = useState(localStorage.getItem('sessionId'));
  const [numberOfQuestions, setNumberOfQuestions] = useState(parseInt(localStorage.getItem('NumberOfQuestions')));
  const [currentQuestionPosition, setCurrentQuestionPosition] = useState(parseInt(localStorage.getItem('currentQuestionPosition')));
  const [gameState, setGameState] = useState(localStorage.getItem("gameState"));
  const [hasResults, setHasResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionTimer, setQuestionTimer] = useState(localStorage.getItem("questionTimer"));

  const activeStatus = localStorage.getItem('activeStatus');
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
      return (
        <div className="flex flex-col justify-center items-center">
          <h1>Waiting for players to connect</h1>
        </div>
      
    )
    case "displayQuestions":
      localStorage.setItem('gameState', 'displayQuestions');
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-4 bg-white rounded-[20px] p-4 border-solid border-2 border-blue-300" >
          {questionTimer > 0
                ? <h1>{`Duration: ${questionTimer}s`}</h1>
                : <h1 className="">Question is finished</h1>}
                <h1 className="">Question position: {currentQuestionPosition + 1} / {numberOfQuestions} </h1>
          </div>

          <div className="flex flex-col items-center justify-center">            
            {questions.length > 0 && currentQuestionPosition >= 0 && currentQuestionPosition < questions.length ? (
                <div className="flex flex-row gap-5">
                  <div>
                    <h1 className="bg-white rounded-[20px] p-4 mt-3">Question: {questions[currentQuestionPosition].question}</h1>
                    <ul className="flex flex-col justify-center items-center">


                      <li className="bg-white m-2 p-3 rounded-md">
                                              Option A: {questions[currentQuestionPosition].options.optionA}
                      </li>
                      <li className="bg-white m-2 p-3 rounded-md">
                                              Option B: {questions[currentQuestionPosition].options.optionB || ""}
                      </li>
                      <li className="bg-white m-2 p-3 rounded-md">
                                              Option C: {questions[currentQuestionPosition].options.optionC || ""}
                      </li>
                      <li className="bg-white m-2 p-3 rounded-md">
                                              Option D: {questions[currentQuestionPosition].options.optionD || ""}
                      </li>
                    </ul>
                  </div>
                
              </div>

              
            ) : (
              <p>Loading questions...</p>
            )}

                                
          </div>
        </div>
      )
    case "results":
      localStorage.setItem('gameState', 'results');
      return (
        <div className="flex flex-col justify-center items-center">
          <h1>Results for session: {linkedSession.sessionId}</h1>
          <h1>table of up to top 5 users and their scores</h1>
          <h1>a bar/line chart showing breakdown of what percentage of people (yaxis) got questions (xaxis) correct</h1>
          <h1>a chart showing the average response/answer time for each questions</h1>
        </div>
                
      )
    }
  }

  const endGameFunctionality = async () => {
    localStorage.removeItem('activeStatus');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('gameState');
    localStorage.removeItem('currentQuestionPosition');
    setLocalActiveStatus(null);
    setLocalSessionId(null);
    setActiveStatus(false);
  }

  const endGameMutate = async (token) => {
    try {
      let activeGameId = false;

      const getGameIdResponse = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      let games = getGameIdResponse.data.games
      
      activeGameId = games.find(game => game.active !== 0);

      const response = await axios.post(`http://localhost:5005/admin/game/${activeGameId.id}/mutate`, {
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

    let activeGameId = false;

      const getGameIdResponse = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      let games = getGameIdResponse.data.games
      
      activeGameId = games.find(game => game.active !== 0);

    try {
      const response = await axios.post(`http://localhost:5005/admin/game/${activeGameId.id}/mutate`, {
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