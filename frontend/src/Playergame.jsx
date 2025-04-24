import { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';

function PlayerGame ({ token }) {

  const prePopulatedPlayerId = useParams().playerId;
  const navigate = useNavigate();
  const [playerId, setPlayerId] = useState(prePopulatedPlayerId || '');
  const [gameState, setGameState] = useState('waitForPlayersJoin');
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionTimer, setQuestionTimer] = useState(-1);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);

  const currentQuestionIdRef = useRef(localStorage.getItem('currentQuestionId') || null);

  const indexToOption = (index) => {
    return `Option ${String.fromCharCode(65 + index)}`; // 65 is ASCII for 'A'
  };

  useEffect(() => {
    if (selectedIndices.length > 0 && !buttonsDisabled) {
      putPlayerAnswer();
    }
  }, [selectedIndices]);

  // Countdown timer
  useEffect(() => {
    if (questionTimer <= 0) return;

    const intervalId = setInterval(() => {
      setQuestionTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [questionTimer]);

  // Handle when timer reaches zero
  useEffect(() => {
    if (questionTimer === 0) {
      setButtonsDisabled(true);

      const getAnswers = async () => {
        try {
          const response = await axios.get(`http://localhost:5005/play/${playerId}/answer`);
          const answerString = response.data.answers.join(', ');
          setCorrectAnswer(answerString);
        } catch (err) {
          console.error("Failed to fetch answers:", err);
        }
      };

      getAnswers();
    }
  }, [questionTimer]);

  // Check for game status every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (localStorage.getItem('activeStatus') === 'true') {
        checkIfGameStarted();
      }
      const checkResults = async () => {
        // Only check for results if no active session is running
        if (!localStorage.getItem('activeStatus')) {
          const success = await getResults(token);
          if (success === true) {
            setGameState("results")
          }
        }
      };
      checkResults();

    }, 10);
  
    return () => clearInterval(intervalId);
    
  }, [playerId]);


  const checkIfGameStarted = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/play/${playerId}/status`);
      if (response.data.started === true) {
        setGameState('displayQuestions');

        const questionRes = await axios.get(`http://localhost:5005/play/${playerId}/question`);
        const newQuestion = questionRes.data.question;
        const newId = newQuestion.id;

        if (newId !== currentQuestionIdRef.current) {
          currentQuestionIdRef.current = newId;
          localStorage.setItem('currentQuestionId', newId);

          setQuestion(newQuestion);
          setQuestionType(newQuestion.questionType);
          setQuestionTimer(newQuestion.duration);
          setButtonsDisabled(false); // Reset button state for new question
          setSelectedIndices([]); // Clear selections for new question
          setCorrectAnswer([])

        }
      } 
    } catch (err) {
      console.log(err);
    }
  };

  
  const getResults = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5005/play/${playerId}/results`, {
      })
      return true;
    } catch (err) {
      alert(err.response.data.error);
      return false;
    }
  }

  const putPlayerAnswer = async () => {
    try {

      let newAnswersArary = [];

      selectedIndices.forEach(index => {
        newAnswersArary.push(indexToOption(index))
      });

      const response = await axios.put(`http://localhost:5005/play/${playerId}/answer`, {
        answers: newAnswersArary
      });
  } catch (err) {
      console.log(err)
  }
  }

  const renderQuestion = () => {
    switch (questionType) {
      case "Judgement":
        return (
          <>
            <h1 className="text-xl font-bold mb-2 max-w-md">Question: {question.question}</h1>
            <p className="mb-4">Time remaining: {questionTimer <= 0 ? "Time's up!" : `${questionTimer} seconds`}</p>
            <p>points: {question.points }</p>
            {question.attachmentType === 'image' && question.attachment && (
              <>
                <div className="text-sm font-semibold mt-6"></div>
                <img
                  src={question.attachment}
                  alt="Question attachment"
                  className="shadow-2xl rounded-lg w-full sm:w-[20%] mt-2"
                />
              </>
            )}
            {question.attachmentType === 'youtube' && question.attachment && (
              <>
                <div className="text-sm font-semibold mt-6"></div>
                <iframe
                  className="mt-2 mb-6 w-full sm:w-[85%] md:w-[70%] lg:w-[100%] xl:w-[100%] h-[125px] sm:h-[150px] md:h-[200px] lg:h-[100%] xl:h-[100%]"
                  src={question.attachment}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </>
            )}

            {correctAnswer && correctAnswer.length > 0 && (
              <p>The correct answer is: {correctAnswer}</p>
            )}
            <div className="flex gap-4 mt-4 max-w-md justify-center">
              {["True", "False"].map((answer, index) => {
                const isSelected = selectedIndices.length === 1 && selectedIndices[0] === index;

                const handleSelect = () => {
                  if (!buttonsDisabled) {
                    setSelectedIndices([index]);
                  }
                };

                return (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded text-white transition-colors duration-200 w-24 ${
                      buttonsDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    } ${isSelected ? (index === 0 ? 'bg-green-800' : 'bg-red-800') : (index === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600')}`}
                    onClick={() => {
                      handleSelect();
                    }}
                    disabled={buttonsDisabled}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          </>
        );
      case "Single Choice":
        return (
          <>
            <h1 className="text-xl font-bold mb-2 max-w-md">Question: {question.question}</h1>
            <p className="mb-4">Time remaining: {questionTimer <= 0 ? "Time's up!" : `${questionTimer} seconds`}</p>
            <p>points: {question.points }</p>
            {question.attachmentType === 'image' && question.attachment && (
              <>
                <div className="text-sm font-semibold mt-6"></div>
                <img
                  src={question.attachment}
                  alt="Question attachment"
                  className="shadow-2xl rounded-lg w-full sm:w-[20%] mt-2"
                />
              </>
            )}
            {question.attachmentType === 'youtube' && question.attachment && (
              <>
                <div className="text-sm font-semibold mt-6"></div>
                <iframe
                  className="mt-2 mb-6 w-full sm:w-[85%] md:w-[70%] lg:w-[55%] xl:w-[40%] h-[125px] sm:h-[150px] md:h-[200px] lg:h-[350px] xl:h-[400px]"
                  src={question.attachment}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </>
            )}
            {correctAnswer && correctAnswer.length > 0 && (
              <p>The correct answer is: {correctAnswer}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-4 max-w-md justify-center">
  
              {
                question.answers.map((answer, index) => {
                  const isSelected = selectedIndices.length === 1 && selectedIndices[0] === index;

                  const handleSelect = () => {
                    if (!buttonsDisabled) {
                      setSelectedIndices([index]); // Only one selected at a time
                    }
                  };

                  return (
                    <button 
                      key={index}
                      className={`px-4 py-2 rounded w-full sm:w-auto text-white transition-colors duration-200 ${
                        buttonsDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      } ${isSelected ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                      onClick={() => {
                        handleSelect(); 
                      }}
                      disabled={buttonsDisabled}
                    >
                      {answer}
                    </button>
                  );
                })
              }
            </div>
          </>
        );
        case "Multiple Choice":
          return (
            <>
              <h1 className="text-xl font-bold mb-2 max-w-md">Question: {question.question}</h1>
              <p className="mb-4">Time remaining: {questionTimer <= 0 ? "Time's up!" : `${questionTimer} seconds`}</p>
              <p>points: {question.points }</p>
              {question.attachmentType === 'image' && question.attachment && (
                <>
                  <div className="text-sm font-semibold mt-6"></div>
                  <img
                    src={question.attachment}
                    alt="Question attachment"
                    className="shadow-2xl rounded-lg w-full sm:w-[20%] mt-2"
                  />
                </>
              )}
              {question.attachmentType === 'youtube' && question.attachment && (
                <>
                  <div className="text-sm font-semibold mt-6"></div>
                  <iframe
                    className="mt-2 mb-6 w-full sm:w-[85%] md:w-[70%] lg:w-[55%] xl:w-[40%] h-[125px] sm:h-[150px] md:h-[200px] lg:h-[350px] xl:h-[400px]"
                    src={question.attachment}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </>
              )}
              {correctAnswer && correctAnswer.length > 0 && (
                <p>The correct answer is: {correctAnswer}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 max-w-md justify-center">
                {
                  question.answers.map((answer, index) => {
                    const isSelected = selectedIndices.includes(index);
        
                    const toggleSelection = () => {
                      if (buttonsDisabled) return;
        
                      setSelectedIndices(prev =>
                        isSelected
                          ? prev.filter(i => i !== index)  // Deselect
                          : [...prev, index]              // Select
                      );
                    };
        
                    return (
                      <button
                        key={index}
                        className={`px-4 py-2 rounded w-full sm:w-auto text-white transition-colors duration-200 ${
                          buttonsDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        } ${isSelected ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                        onClick={() => {
                          toggleSelection(); 
                        }}
                        disabled={buttonsDisabled}
                      >
                        {answer}
                      </button>
                    );
                  })
                }
              </div>
            </>
          );
    }
  }
  
  const renderGameContent = () => {
    switch(gameState) {
    case "waitForPlayersJoin":
      return (
        <div className="flex flex-col justify-center items-center">
          <h1>Waiting for players to connect</h1>
        </div>
      
    )
    case "displayQuestions":
      return (
        <div className="flex flex-col items-center justify-center">
          {renderQuestion()}
        </div>
      )
    case "results":
      return (
        <div>
          <p>Results screen</p>
        </div>
                
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
        {renderGameContent()}
      </div>
    </div>
  );
}

export default PlayerGame;