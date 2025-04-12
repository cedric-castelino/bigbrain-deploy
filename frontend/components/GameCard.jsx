import { useNavigate } from 'react-router-dom';

const GameCard = ({ game } ) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/game/${game.id}`);
    };

    return (
        <div className='bg-gray-100 rounded-lg shadow p-4 hover:cursor-pointer' onClick={handleClick}>
            <h1>
                Title: {game.name}
            </h1>
            <img 
            src={game.thumbnail} 
            alt="image"
            width="80vh"
            height="80vh"/>
            <h1>Number of questions: {game.questions.length}</h1>
            <h1>sum of each question: </h1>
        </div>
    )
    
}

export default GameCard;