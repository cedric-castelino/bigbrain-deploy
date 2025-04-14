import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Session = ({ token, setActiveStatus }) => {
    const linkedSession = useParams();

    const [localActiveStatus, setLocalActiveStatus] = useState(localStorage.getItem('activeStatus'));
    const [localActiveGameId, setLocalActiveGameId] = useState(localStorage.getItem('activeGameId'));
    const [localSessionId, setLocalSessionId] = useState(localStorage.getItem('sessionId'));
    const [numberOfQuestions, setNumberOfQuestions] = useState(null);
    const [currentQuestionPosition, setCurrentQuestionPosition] = useState(-1);
    const [gameState, setGameState] = useState("waitForPlayersJoin");
    const [hasResults, setHasResults] = useState(false);

    const activeStatus = localStorage.getItem('activeStatus');
    const activeGameId = localStorage.getItem('activeGameId');
    const sessionId = localStorage.getItem('sessionId');
    const localToken = localStorage.getItem('token')

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

        if (sessionId && localToken) {
            getStatus(localToken);
        }

    }, []);

    // Update gameState based on currentQuestionPosition
    useEffect(() => {
        if (currentQuestionPosition === -1) {
            setGameState("waitForPlayersJoin");
        } else if (currentQuestionPosition === 0) {
            setGameState("displayQuestions");
        } else if (currentQuestionPosition + 1 > numberOfQuestions) {
            localStorage.removeItem('activeStatus')
            localStorage.removeItem('activeGameId')
            localStorage.removeItem('sessionId')
            setGameState("results");
        }
    }, [currentQuestionPosition]);

    const renderGameContent = () => {
        if (gameState === "waitForPlayersJoin" && hasResults) {
            setGameState("results")
        }

        switch(gameState) {
            case "waitForPlayersJoin":
                return (<p>Waiting for players to connect</p>)
            case "displayQuestions":
                return (
                    <div>
                        <p>Question position: {currentQuestionPosition + 1} / {numberOfQuestions} </p>
                        <p>TIMER</p>
                    </div>
                )
            case "results":
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
            setNumberOfQuestions(response.data.results.questions.length)
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
    
    return (
        <>
            {((activeStatus && linkedSession.sessionId === sessionId)) ? (
                <div>
                    <div className="flex justify-center mt-2">
                        <p className={`p-2 rounded-md text-white !bg-red-600 mr-2 hover:cursor-pointer hover:!bg-red-900 w-auto`}
                            onClick={() => {
                                endGameMutate(token);
                            }}
                        >
                            <b>End Session</b>
                        </p>

                        <p className={`${gameState === "results" ? "" : "p-2 rounded-md text-white !bg-green-600 mr-2 hover:cursor-pointer hover:!bg-green-900 w-auto"}`}
                            onClick={() => {
                                advanceGame(token);
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