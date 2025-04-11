import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Gamecard from './GameCard';

function Dashboard({ token }) {
    const [games, setGames] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newGameName, setNewGameName] = useState('');
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

          <button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create New Game'}
          </button>

          {showCreateForm && (
            <div style={{ marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Enter game name"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
              />
            </div>
          )}

          {games.length === 0 ? (
            <p>No games found</p>
          ) : (
            <div className="games-list">
              {games.map(game => (
                <Gamecard key={game.id} game={game}/>
              ))}
            </div>
          )}
        </div>
      );
    }

export default Dashboard