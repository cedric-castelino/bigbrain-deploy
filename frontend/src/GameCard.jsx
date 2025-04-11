import { useNavigate } from 'react-router-dom';

const GameCard = ({ game } ) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/game/${game.id}`);
    };

    return (
        <div>
            <h1>
                {game.name}
            </h1>
            <img 
            src={game.thumbnail} 
            onClick={handleClick}
            alt="image"
            width="80vh"
            height="80vh"/>
        </div>
    )
    
}

export default GameCard;