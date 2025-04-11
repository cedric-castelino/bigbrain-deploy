import { useParams } from "react-router-dom";

const EditGame = ({ token }) => {
    const { gameId } = useParams(); 

    return (
        <div>
            {gameId}
        </div>
    );
};

export default EditGame;