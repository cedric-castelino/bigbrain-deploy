import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';

import Gamecard from '../components/GameCard';
import DeleteModal from '../components/deleteModal';
import CreateGameModal from '../components/CreateGameModal';

function Dashboard({ token }) {
  const defaultImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
  const [games, setGames] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [createPopuUp, setCreatePopUp] = useState(false);
  const [createGameError, setCreateGameError] = useState('');
  const [activeStatus, SetActiveStatus] = useState(false);
  const [sessionPopUp, setSessionPopUp] = useState(false);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {

      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnail(event.target.result); 
      };
      reader.readAsDataURL(selectedFile);
    } 
  };

  useEffect(() => {
    if (!token) {
        navigate('/login');
        return;
    }
    
    getDashboardGames(token);
  }, [token, navigate]);

  const createNewGame = async () => {
    if (name === '' || id === '') {
      setCreateGameError("Game Name or ID cannot be empty");
      return; 
    } 

    const isDuplicate = games.some(game => game.id === id || game.name === name);
    if (isDuplicate) {
      setCreateGameError("Game Name or ID is already taken");
      return; 
    }
    

    const newGame = {
      id: id,
      name: name,
      owner: localStorage.getItem('email'),
      questions: [{}],
      thumbnail: thumbnail || defaultImg
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
      setId('');
      setName('');
      setCreateGameError('');
      return true;
    } catch (err) {
      setCreateGameError(err.response.data.error);
      return false;
    }
  }

  const deleteGame = async (id) => {
    let newGamesArray = []

    games.map(game => {
      if (game.id !== id) {
        newGamesArray.push(game);
      }
    })

    try {
      const response = await axios.put('http://localhost:5005/admin/games', {
        games: newGamesArray
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      getDashboardGames(token);
      setId('');
      setName('');
    } catch (err) {
      alert(err.response.data.error);
    }

  }

  return (
      <div className='m-4'>
        <div className='flex flex-row justify-between'>
          <h1>Dashboard</h1>
          <p className={`p-2 rounded-md text-white ${activeStatus ? "bg-[#29a742]" : "bg-[#db3549]"}`}><b>{activeStatus ? "Session: Active" : "Session: Inactive"}</b></p>
        </div>
        
        <table className='w-full'>
          <tbody>
            <tr className='flex justify-between items-center'>
            <td>
              <Button className="btn btn-primary" onClick={() => setCreatePopUp(true)}>
                Create New Game
              </Button>
              
              <CreateGameModal
                open={createPopuUp}
                onClose={() => {
                  setCreatePopUp(false);
                  setName(''); 
                  setId(''); 
                  setThumbnail(''); 
                  setCreateGameError(''); 
                }}
                id={id}
                setId={setId}
                name={name}
                setName={setName}
                handleFileChange={handleFileChange}
                onCreate={async () => {
                  const success = await createNewGame();
                  if (success) {
                    setCreatePopUp(false); 
                  }
                }}
                error={createGameError}
              />

            </td>

            <td>
              <button type="button" className="btn btn-danger" onClick={() => setDeletePopUp(true)}>Delete</button>
              <DeleteModal open={deletePopUp} onClose={() => setDeletePopUp(false)}>
                {games.map(game => (
                  <div onClick={() => {
                    deleteGame(game.id); 
                    setDeletePopUp(false);
                    }} 
                    key={game.id} 
                    className='bg-gray-200 mt-2 p-2 rounded-md flex justify-center hover:cursor-pointer hover:bg-gray-300'>
                    {game.name}
                  </div>
                ))}
              </DeleteModal>
            </td>
          </tr>
          </tbody>
          
        </table>
        
        

        {games.length === 0 ? (
          <div role="alert" className="alert alert-error mt-6 !bg-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No Games Found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 bg-blue-200">
            {games.map(game => (
              <Gamecard key={game.id}
              game={game}
              activeStatus={activeStatus}
              setActiveStatus={SetActiveStatus}
              sessionPopUp={sessionPopUp}
              setSessionPopUp={setSessionPopUp}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

export default Dashboard