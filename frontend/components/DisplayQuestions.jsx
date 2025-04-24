const DisplayQuestions = ({question, onEdit, onDelete}) => {

  const getOptionLabel = (index) => `Option ${String.fromCharCode(65 + index)}`;
  const getOptionClass = (label) => {
    return question.correctAnswers.includes(label)
      ? 'bg-lime-300 text-green-950'
      : 'bg-rose-200 text-red-950';
  };

  return (
    <ul className="list bg-base-100 rounded-box shadow-md mt-4 mb-0 !pl-0"> 
      <li className="list-row">
      <div className="flex flex-col justify-between h-full text-center border-r border-gray-300 pr-4">
        <div>
          <div className="text-3xl font-thin tabular-nums">{question.duration}</div>
          <div className="text-sm font-thin tabular-nums">
            {Number(question.duration) === 1 ? 'second' : 'seconds'}
          </div>
        </div>
        <div>
          <div className="text-3xl font-thin tabular-nums">{question.points}</div>
          <div className="text-sm font-thin tabular-nums">
            {Number(question.points) === 1 ? 'point' : 'points'}
          </div>
        </div>
      </div>
        <div className="list-col-grow">
          <div className="text-lg">{question.question}</div>

          {question.answers.map((answerText, index) => {
            const label = getOptionLabel(index);
            return (
              <div key={label}>
                <div className="input-group mt-2 mb-1">
                  <span className={`rounded-md px-0 sm:!px-4 py-0 text-gray-600 ${getOptionClass(label)}`}>
                    {label}
                  </span>
                </div>
                <div className="text-xs font-semibold opacity-80 ml-4">{answerText}</div>
              </div>
            );
          })}
        </div>
        <div className='join join-vertical gap-2 border-l border-gray-300 pl-4'>
          <button onClick={onEdit} className="btn btn-primary">Edit Question</button>
          <button type="button" onClick={onDelete} className="btn btn-danger !bg-red-600 hover:!bg-red-900">Delete Question</button>
        </div>
      </li>
            
    </ul> 
  )
    
}

export default DisplayQuestions;