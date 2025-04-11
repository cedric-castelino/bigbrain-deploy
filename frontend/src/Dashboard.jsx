import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { useState } from 'react';

function Dashboard({ token, games, getGames }) {
    const navigate = useNavigate();
    
    if (!token) {
        navigate('/login');
    } else {
        getGames(token)
    };

    return (
        <div>
          <h1>Dashboard</h1>
          {games.length === 0 ? (
            <p>No games found</p>
          ) : (
            <div className="games-list">
              {games.map(game => (
                <div key={game.id} className="game-item">
                  {game.name} 
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

export default Dashboard