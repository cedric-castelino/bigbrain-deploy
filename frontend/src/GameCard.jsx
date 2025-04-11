import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { useState } from 'react';


const GameCard = ({ game } ) => {
    console.log(game)
    return(
        <div>
            <h1>
                {game.name}
            </h1>
            <h1>
                {game.thumbnail}
            </h1>
        </div>
    )
    
}

export default GameCard;