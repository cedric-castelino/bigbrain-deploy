import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import { useState } from 'react';

function Dashboard({ token }) {
    const [games, setGames] = useState('');
    const navigate = useNavigate();
    
    if (!token) {
        navigate('/login');
    };


  const getDashboardGames = async () => {
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
    
    return (
        <>
            {

            }
            <Button onClick={getDashboardGames} variant='primary'>Register</Button>
        </>
    )
}

export default Dashboard