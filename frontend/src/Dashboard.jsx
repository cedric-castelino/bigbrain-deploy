import { useNavigate } from 'react-router-dom';

function Dashboard({ token }) {
    const navigate = useNavigate();
    console.log(token)
    if (!token) {
        navigate('/login');
    };
    
    return (
        <>
            Hi
        </>
    )
}

export default Dashboard