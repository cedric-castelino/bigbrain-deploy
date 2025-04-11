import { useNavigate } from 'react-router-dom';

const GameCard = ({ game } ) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/game/${game.id}`);
    };

    return (
        <div>
            <h1>
                Title: {game.name}
            </h1>
            <img 
            src={game.thumbnail} 
            onClick={handleClick}
            alt="image"
            width="80vh"
            height="80vh"/>
            <h1>Number of questions: {game.questions.length}</h1>
            <h1>sum of each individual questions duration</h1>
        </div>
    )
    
}

export default GameCard;