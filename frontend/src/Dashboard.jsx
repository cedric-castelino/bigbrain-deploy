import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';

import Gamecard from '../components/GameCard';

function Dashboard({ token }) {
  const [games, setGames] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const createNewGame = async () => {
    const isDuplicate = games.some(game => game.id === id || game.name === name);

    if (isDuplicate) {
      alert("Game id or game name is already taken");
      return; 
    }

    const newGame = {
      id: id,
      name: name,
      owner: localStorage.getItem('email'),
      questions: [{}]
    };

    games.push(newGame)

    try {
      const response = await axios.put('http://localhost:5005/admin/games', {
        games: games
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      getDashboardGames(token);
      setShowCreateForm(false);
      setId('');
      setName('');
    } catch (err) {
      alert(err.response.data.error);
    }
  }

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
              placeholder="Enter game ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter game name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="file"
              value={file}
              onChange={(e) => setFile(e.target.value)}
            />
            <Button onClick={createNewGame} variant='primary'>Create Game</Button>
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