import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, 
    useNavigate
  } from "react-router-dom"

const EditGame = ({ token }) => {
    const { gameId } = useParams(); 
    const [game, setGame] = useState([]);
    const navigate = useNavigate();

    const getDashboardGames = async (token) => {
        const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
        })
        setGame(response.data.games.find(game => game.id === Number(gameId)));
    }

    useEffect(() => {
        getDashboardGames(token);
        console.log(game);
    }, [token]);

    const navigate_to_dashboard = async () => {
        navigate('/dashboard');
    }

    const get_duration = () => {
        duration = 0;

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
                    <button className="btn btn-primary">Edit Game Info</button>
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