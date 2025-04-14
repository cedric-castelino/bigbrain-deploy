import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Session = ({ token, setActiveStatus }) => {
    const { sessionId } = useParams(); 
    const [localActiveStatus, setLocalActiveStatus] = useState(localStorage.getItem('activeStatus'));
    const [localActiveGameId, setLocalActiveGameId] = useState(localStorage.getItem('activeGameId'));

    const activeStatus = localStorage.getItem('activeStatus');
    const activeGameId = localStorage.getItem('activeGameId');
    const [gameState, setGameState] = useState("START");

    useEffect(() => {
        setLocalActiveStatus(localStorage.getItem('activeStatus'));
        setLocalActiveGameId(localStorage.getItem('activeGameId'));
    }, []);

    const renderGameContent = () => {
        switch(gameState) {
            case "START":
                return (<p>start</p>)
            case "ADVANCE":
                return (<p>advnacing</p>)
            case "END":
                return (<p>results screen</p>)
        }
    }

    const endGameMutate = async (token) => {
        try {
            const response = await axios.post(`http://localhost:5005/admin/game/${activeGameId}/mutate`, {
                mutationType: "END"
            }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
            })
            localStorage.removeItem('activeStatus');
            localStorage.removeItem('activeGameId');
            setLocalActiveStatus(null);
            setLocalActiveGameId(null);
            setActiveStatus(false);
        } catch (err) {
            alert(err.response.data.error);
        }
      }
    
    return (
        <>
            {(activeStatus && activeGameId === sessionId) ? (
                <div>
                    <div className="flex justify-center mt-2">
                        <p className={`p-2 rounded-md text-white !bg-red-600 mr-2 hover:cursor-pointer hover:!bg-red-900 w-auto`}
                            onClick={() => {
                                endGameMutate(token);
                            }}
                            >
                            <b>End Session</b>
                        </p>

                        <p className={`p-2 rounded-md text-white !bg-green-600 mr-2 hover:cursor-pointer hover:!bg-green-900 w-auto`}
                            onClick={() => {
                            }}
                            >
                            <b>Advance</b>
                        </p>
                    </div>
                    <div>
                        {renderGameContent()}
                    </div>
                </div>
                
            ) : (
                <div className="flex flex-col items-center mt-3">
                    <h1>Please wait</h1>
                </div>
            )}
        </>
    );
};

export default Session;