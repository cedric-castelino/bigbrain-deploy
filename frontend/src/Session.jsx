import { useParams } from "react-router-dom";
import { useState } from "react";

const Session = ({ token, setActiveStatus, endGameMutate }) => {
    const { sessionId } = useParams(); 

    const activeStatus = localStorage.getItem('activeStatus');
    const activeGameId = localStorage.getItem('activeGameId');
    const [gameState, setGameState] = useState("START");

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
    
    return (
        <>
            {(activeStatus && activeGameId === sessionId) && (
                <div className="flex justify-center mt-2">
                    <p className={`p-2 rounded-md text-white !bg-red-600 mr-2 hover:cursor-pointer hover:!bg-red-900 w-auto`}
                        onClick={() => {
                            setActiveStatus(false);
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
                
            )}
{

            (activeStatus && activeGameId === sessionId) ? (
                <div>
                    {renderGameContent()}
                </div>
            ) : (
                <div className="flex flex-col items-center mt-3">
                    <h1>Please wait</h1>
                </div>
            )
            }
        </>
    );
};

export default Session;