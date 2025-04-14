import { useParams } from "react-router-dom";

const Session = ({ token }) => {
    const { sessionId } = useParams(); 

    const activeStatus = localStorage.getItem('activeStatus');
    const activeGameId = localStorage.getItem('activeGameId');
    
    return (
        <>
            {

                (activeStatus && activeGameId === sessionId) ? (
                    <div>
                        {sessionId}
                    </div>
                ) : (
                    <div className="flex flex-col items-center mt-3">
                        <h1>No game session has been started for this gameID</h1>
                    </div>
                )
            }
        </>
    );
};

export default Session;