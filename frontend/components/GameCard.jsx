import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StartSessionModal from './StartSessionModal';
import { useEffect, useState } from 'react';

const GameCard = ({
    token,
    game, 
    activeStatus, 
    setActiveStatus, 
    sessionPopUp, 
    setSessionPopUp,
    selectedGameId,
    setSelectedGameId
    }) => {

    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState('');


    useEffect(() => {
        const storedActiveStatus = localStorage.getItem('activeStatus') === 'true';
        const storedActiveGameId = localStorage.getItem('activeGameId');
        const storedSessionId = localStorage.getItem('sessionId');
        
        // Update state if there's an active game in localStorage
        if (storedActiveStatus) {
            setActiveStatus(true);
            setSelectedGameId(Number(storedActiveGameId));
            setSessionId(storedSessionId)
        }
    }, [setActiveStatus, setSelectedGameId]);

    const handleClick = () => {
        navigate(`/game/${game.id}`);
    };

    const startGameMutate = async (token) => {
        try {
            setActiveStatus(true);
            setSelectedGameId(game.id);

            const response = await axios.post(`http://localhost:5005/admin/game/${game.id}/mutate`, {
                mutationType: "START"
            }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
            })

            const newSessionId = response.data.data.sessionId;
            localStorage.setItem('activeStatus', 'true');
            localStorage.setItem('activeGameId', game.id.toString());
            localStorage.setItem('sessionId', newSessionId);
            localStorage.setItem('gameState', 'waitForPlayersJoin');
            localStorage.setItem('currentQuestionPosition', -1);
            localStorage.setItem('NumberOfQuestions', -1);

            setSessionId(newSessionId);
        
            // Now show the modal after everything is ready
            setSessionPopUp(true);
        } catch (err) {
            alert(err.response.data.error);
        }
    }

    return (
        <div className="card bg-base-100 w-100 shadow-sm mt-6">
            <figure className="px-10 pt-10 mb-0">
                <img
                src={game.thumbnail} 
                alt="Shoes"
                className="rounded-xl border-2 border-black w-[100%]" />
            </figure>
            <div className="card-body items-center text-center flex flex-col justify-between">
                <h2 className="card-title text-center flex justify-center break-words break-all">{game.name}</h2>
                <div className="input-group justify-center mt-auto mb-0">
                    <span className="bg-base-200 text-gray-600 rounded-l-md px-4 py-2">Number of Questions</span>
                    <span className="bg-base-100 text-black rounded-r-md px-4 py-2 border border-l-0">{game.questions.length}</span>
                </div>
                <div className="input-group justify-center mt-2 mb-2">
                    <span className="bg-base-200 text-gray-600 rounded-l-md px-4 py-2">Total Duration</span>
                    <span className="bg-base-100 text-black rounded-r-md px-4 py-2 border border-l-0">?</span>
                </div>
                <div className="card-actions">
                    <button onClick={handleClick} className="btn btn-primary mt-auto">Edit Game</button>
                    
                    {!activeStatus && (
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                startGameMutate(token);
                            }}>
                            Start Game
                        </button>
                    )}
                    
                    {/* Always render the modal, controlled by open prop */}
                        <StartSessionModal 
                            open={selectedGameId === game.id && sessionPopUp} 
                            onClose={() => setSessionPopUp(false)} 
                            className='flex flex-row justify-center items-center'
                        >
                            <div>
                                <p>
                                    SessionID: {`${sessionId}`}    
                                </p>
                                <p className='btn btn-soft btn-primary w-[20vh]'
                                onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/session/${sessionId}`)}}>
                                    Copy Link
                                </p>
                            </div>
                        </StartSessionModal>
                </div>
            </div>
        </div>
        
    )
    
}

export default GameCard;