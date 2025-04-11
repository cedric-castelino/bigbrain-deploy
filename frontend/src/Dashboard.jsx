import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react';

function Dashboard({ token }) {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    
    const getDashboardGames = async (token) => {
        try {
            const response = await axios.get('http://localhost:5005/admin/games', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
            })
            setGames(response.data.games)
        } catch (err) {
            alert(err.response.data.error);
        }
    }

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        
        getDashboardGames(token);
    }, [token, navigate]);

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