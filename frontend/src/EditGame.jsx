import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate} from "react-router-dom"
import CreateGameModal from '../components/CreateGameModal';
import CreateQuestionModal from '../components/CreateQuestionModal';
import DisplayQuestions from '../components/DisplayQuestions';

const EditGame = ({ token }) => {
  const { gameId } = useParams(); 
  const [game, setGame] = useState([]);
  const [games, setGames] = useState([]);
  const [editPopUp, setEditPopUp] = useState(false);
  const [createQPopuUp, setCreateQPopUp] = useState(false);
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [editGameError, seteditGameError] = useState('');
  const [imageError, setimageError] = useState(false);
  const [duration, setDuration] = useState('');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionError, setquestionError] = useState('');
  const [editQuestion, setEditQuestion] = useState(false);
  const [editQuestionID, setEditQuestionID] = useState('');
  const [options, setOptions] = useState([
    { label: 'A', value: '' },
    { label: 'B', value: '' },
  ]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionType, setQuestionType] = useState('');
  const fileInputRef = useRef(null);
  const defaultImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
  const navigate = useNavigate();

  const getGameData = async (token) => {
    const response = await axios.get('http://localhost:5005/admin/games', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    setGames(response.data.games);
    setGame(response.data.games.find(game => game.id === Number(gameId)));
  }

  useEffect(() => {
    getGameData(token);
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

      const isDuplicate = games.some(game => game.name === name);
      if (isDuplicate && name !== game.name) {
        seteditGameError("Game Name is already taken");
        return; 
      }

      if (imageError) {
        seteditGameError("Invalid file type");
        resetFileInput();
        setimageError(false);
        return;
      }
            
      if (name !== '') {
        game.name = name;
      }

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
    
      getGameData(token);
      setName('');
      setThumbnail('');
      resetFileInput();
      seteditGameError('');
      return true;
    } catch (err) {
      seteditGameError(err.response.data.error);
      return false;
    }
  }

  const addQuestion = async () => {
    if (duration === '' || question === '') {
      setquestionError("Question Inputs Cannot be Empty");
      return; 
    }

    if (questionType === '') {
      setquestionError("Question Type Must be Selected");
      return; 
    }

    if (Number(duration) < 0 || Number(duration) > 60) {
      setquestionError("Duration must be between 1 and 60");
      return; 
    }

    if (questionType === 'Single Choice' || questionType === 'Judgement') {
      for (let i = 0; i < answers.length; i++) {
        if (!answers[i]) {
          setquestionError("Question Inputs Cannot be Empty");
          return;
        }
      }

      if (correctAnswer === '') {
        setquestionError("Correct Answer must be Selected");
        return; 
      }
    }

    let sortedCorrectAnswers = []
    if (questionType === 'Multiple Choice') {
      for (let i = 0; i < answers.length; i++) {
        if (!answers[i]) {
          setquestionError("Question Inputs Cannot be Empty");
          return;
        }
      }

      if (correctAnswers.length < 2) {
        setquestionError("Multiple Choice Requires at Least 2 Correct Answers");
        return; 
      }

      sortedCorrectAnswers = [...correctAnswers].sort((a, b) => {
        return a.localeCompare(b);
      });
    }

    const newQuestion = {
      duration: duration,
      correctAnswers: (questionType === 'Single Choice' || questionType === 'Judgement') 
        ? [correctAnswer] 
        : sortedCorrectAnswers,
      question: question,
      answers: answers,
      id: game.questions.length + 1,
      questionType: questionType
    }
    game.questions.push(newQuestion);
      
    games[games.findIndex(g => g.id === game.id)] = game;
    try {
      await axios.put('http://localhost:5005/admin/games', {
        games: games
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      getGameData(token);
      setDuration('');
      setQuestion('');
      
      setquestionError('');
      setQuestionType('');
      setOptions([
        { label: 'A', value: '' },
        { label: 'B', value: '' },
      ]);
      setCorrectAnswer('');
      setCorrectAnswers([]); 
      setAnswers([]);
      return true;
    } catch (err) {
      setquestionError(err.response.data.error);
      return false;
    }
  }

  const editQuestionContent = async (id) => {

    if (Number(duration) < 0 || Number(duration) > 60) {
      setquestionError("Duration must be between 1 and 60");
      return; 
    }

    for (const current_question of game.questions) {
      if (current_question.id === id) {
        if (duration !== '') {
          current_question.duration = duration;
        }
        if (question !== '') {
          current_question.question = question;
        }
        if (optionA !== '') {
          current_question.options.optionA = optionA;
        }
        if (optionB !== '') {
          current_question.options.optionB = optionB;
        }
        if (optionC !== '') {
          current_question.options.optionC = optionC;
        }
        if (optionD !== '') {
          current_question.options.optionD = optionD;
        }
        if (correctAnswer !== '') {
          current_question.correctAnswers[0] = correctAnswer;
        }
      }
    }
      
    games[games.findIndex(g => g.id === game.id)] = game;
    try {
      await axios.put('http://localhost:5005/admin/games', {
        games: games
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      getGameData(token);
      setDuration('');
      setQuestion('');
      setCorrectAnswer('');
      setquestionError('');
      return true;
    } catch (err) {
      console.log(err);
      setquestionError(err.response.data.error);
      return false;
    }
  }

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; 
    }
  }

  const getTotalDuration = (questions) => {
    let totalDuration = 0;
    for (const question of questions) {
      totalDuration += Number(question.duration);
    }

    const minutes = Math.floor(totalDuration / 60);
    const seconds = totalDuration % 60;
    const parts = [];

    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    }
    return parts.join(' and ');
  }

  const checkDefaultThumbnail = (thumbnail) => {
    return thumbnail === defaultImg;
  };

  const deleteQuestion = async (id) => {
    let currentQuestions = game.questions.filter(q => q.id !== id);
    let count = 1
    for (const question of currentQuestions) {
      question.id = count;
      count += 1;
    }

    game.questions = currentQuestions;
    games[games.findIndex(g => g.id === game.id)] = game;

    await axios.put('http://localhost:5005/admin/games', {
      games: games
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
      
    getGameData(token);
  };

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
        <div className='w-full h-full'>
          <div className="hero bg-base-200 bg-white">
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
                            Total Duration: {getTotalDuration(game.questions)}
                </p>
                <div className='join join-vertical sm:join-horizontal gap-2'>
                  <button className="btn btn-primary" onClick={() => setEditPopUp(true)}>Edit Game Info</button>
                  {!checkDefaultThumbnail(game.thumbnail) && (
                    <button className="btn btn-primary" onClick={() => editGame(true)}>Reset Thumbnail</button>
                  )}
                </div>
                <CreateGameModal
                  open={editPopUp}
                  onClose={() => {
                    setEditPopUp(false);
                    setName(''); 
                    setThumbnail(''); 
                    resetFileInput();
                    seteditGameError(''); 
                  }}
                  name={name}
                  setName={setName}
                  handleFileChange={handleFileChange}
                  onCreate={async () => {
                    const success = await editGame(false);
                    if (success) {
                      setEditPopUp(false); 
                    }
                  }}
                  error={editGameError}
                  editing={false}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
          </div>
          <button className="btn btn-primary mt-4" 
            onClick={() => {
              setCreateQPopUp(true);
              setEditQuestion(false);
            }}>Add Question</button>
          <CreateQuestionModal
            open={createQPopuUp}
            onClose={() => {
              setCreateQPopUp(false);
              setQuestionType('');
              setOptions([
                { label: 'A', value: '' },
                { label: 'B', value: '' },
              ]);
              setCorrectAnswer('');
              setCorrectAnswers([]); 
              setQuestion('');
              setDuration('');
              setAnswers([]);
            }}
            onCreate={async () => {
              const success = await addQuestion();
              if (success) {
                setCreateQPopUp(false); 
              }
            }}
            error={questionError}
            duration={duration}
            setDuration={setDuration}
            question={question}
            setQuestion={setQuestion}
            options={options}
            setOptions={setOptions}
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
            correctAnswers={correctAnswers}
            setCorrectAnswers={setCorrectAnswers}
            questionType={questionType}
            setQuestionType={setQuestionType}
            editing={editQuestion}
            onEdit={async () => {
              const success = await editQuestionContent(editQuestionID);
              if (success) {
                setCreateQPopUp(false); 
              }
            }}
            answers={answers}
            setAnswers={setAnswers}
          />
          {game.questions.length === 0 ? (
            <div role="alert" className="alert alert-error mt-6 !bg-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No Questions Found.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 bg-blue-200">
              {game.questions.map(question => (
                <DisplayQuestions key={question.id}
                  question={question}
                  onEdit={() => {
                    setEditQuestion(true);
                    setEditQuestionID(question.id);
                    setCreateQPopUp(true)}}
                  onDelete={() => {deleteQuestion(question.id)}}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditGame;