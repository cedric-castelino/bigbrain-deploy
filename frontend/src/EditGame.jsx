import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, 
    useNavigate
  } from "react-router-dom"
import CreateGameModal from '../components/CreateGameModal';

const EditGame = ({ token }) => {
    const { gameId } = useParams(); 
    const [game, setGame] = useState([]);
    const [games, setGames] = useState([]);
    const [createPopuUp, setCreatePopUp] = useState(false);
    const [name, setName] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [createGameError, setCreateGameError] = useState('');
    const [imageError, setimageError] = useState(false);
    const fileInputRef = useRef(null);
    const defaultImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    const navigate = useNavigate();

    const getDashboardGames = async (token) => {
        const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
        })
        setGames(response.data.games);
        setGame(response.data.games.find(game => game.id === Number(gameId)));
    }

    useEffect(() => {
        getDashboardGames(token);
        console.log(game);
    }, [token]);

    const navigate_to_dashboard = async () => {
        navigate('/dashboard');
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!validImageTypes.includes(selectedFile.type)) {
                setimageError(true);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setThumbnail(event.target.result); 
            };
            reader.readAsDataURL(selectedFile);
        } 
    };

    const editGame = async (reset) => {
        if (!reset) {
            if (name === '') {
                setCreateGameError("Game Name cannot be empty");
                return; 
            } 
              
            const isDuplicate = games.some(game => game.name === name);
            if (isDuplicate && name !== game.name) {
                setCreateGameError("Game Name is already taken");
                return; 
            }

            if (imageError) {
                setCreateGameError("Invalid file type");
                resetFileInput();
                setimageError(false);
                return;
            }
  
            game.name = name;
            if (thumbnail) {
                game.thumbnail = thumbnail;
            }
      
            games[games.findIndex(g => g.id === game.id)] = game;
        } else {
            game.thumbnail = defaultImg;
        }

        try {
          await axios.put('http://localhost:5005/admin/games', {
            games: games
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          getDashboardGames(token);
          setName('');
          setThumbnail('');
          resetFileInput();
          setCreateGameError('');
          return true;
        } catch (err) {
          setCreateGameError(err.response.data.error);
          return false;
        }
    }

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null; 
        }
    }

    return (
        <div className='m-4'>
            <h1 className="!mb-16 sm:!mb-4">Edit Game</h1>
            <button onClick={navigate_to_dashboard} className="btn bg-primary hover:!bg-blue-600 text-white absolute top-16 right-6 sm:top-2 sm:right-[8.25rem] sm:btn-lg btn-lg">Dashboard</button>
            {game.length === 0 ? (
                <div className='join join-vertical lg:join-horizontal'>
                    <legend className="text-3xl">Loading</legend>
                    <span className="ml-3 loading loading-spinner loading-sm"></span>
                </div>
            ) : (
            
            <div className="hero bg-base-200">
                <div className='join join-vertical sm:join-horizontal w-full'>
                  <img
                    src={game.thumbnail}
                    className="rounded-lg shadow-2xl w-[20%] m-6 mr-0" />
                  <div className="p-6">
                    <h1 className="text-5xl font-bold">{game.name}</h1>
                    <p className="py-0 mb-2">
                      Number of Questions: {game.questions.length}
                    </p>
                    <p className="py-0">
                      Total Duration: ?
                    </p>
                    <div className='join join-vertical sm:join-horizontal gap-2'>
                        <button className="btn btn-primary" onClick={() => setCreatePopUp(true)}>Edit Game Info</button>
                        <button className="btn btn-primary" onClick={() => editGame(true)}>Reset Thumbnail</button>
                    </div>
                    <CreateGameModal
                        open={createPopuUp}
                        onClose={() => {
                        setCreatePopUp(false);
                        setName(''); 
                        setThumbnail(''); 
                        resetFileInput();
                        setCreateGameError(''); 
                        }}
                        name={name}
                        setName={setName}
                        handleFileChange={handleFileChange}
                        onCreate={async () => {
                        const success = await editGame(false);
                        if (success) {
                            setCreatePopUp(false); 
                        }
                        }}
                        error={createGameError}
                        editing={false}
                        fileInputRef={fileInputRef}
                    />
                  </div>
                </div>
            </div>
            )}
            <td className='flex gap-2 mt-3'>
                <button className="btn btn-primary">Add Question</button>
                <button type="button" className="btn btn-danger !bg-red-600 hover:!bg-red-900">Delete Question</button>
            </td>
        </div>
    );
};

export default EditGame;