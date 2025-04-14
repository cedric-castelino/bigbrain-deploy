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
                    <div>
                        NOTHING HERE
                    </div>
                )
            }
        </>
    );
};

export default Session;