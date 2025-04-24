// Creates a popup for when the user wants to add a new question
function CreateQuestionModal ({open, onClose, onCreate, error, duration, setDuration, question, setQuestion,options, 
  setOptions, correctAnswer, setCorrectAnswer, correctAnswers, setCorrectAnswers, questionType, setQuestionType, editing, onEdit, answers, setAnswers}) {

  const addOption = () => {
    const nextLabel = String.fromCharCode(65 + options.length);
    if (options.length < 6) {
      const newOptions = [...options, { label: nextLabel, value: '' }];
      setOptions(newOptions);
      setAnswers(newOptions.map(opt => opt.value)); // Sync answers
    }
  };


  return (
  // Displays a transparent grey background for the modal
    <div className={`fixed z-50 inset-0 flex flex-col justify-center items-center transition-colors ${open ? "visible bg-black/60" : "invisible"}`}>
      <fieldset className="fieldset w-sm bg-base-200 border border-base-300 p-4 rounded-box bg-white overflow-y-auto max-h-700 overflow-x-hidden">
        {editing ? (<legend className="fieldset-legend text-center text-3xl">Edit Question</legend>):
          <legend className="fieldset-legend text-center text-3xl">Add Question</legend>}
        <label className="fieldset-label text-slate-900">Duration</label>
        <input
          className="p-2 bg-gray-200 rounded-md"
          type="number"
          required placeholder="Duration in Seconds"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <label className="fieldset-label text-slate-900">Question</label>
        <textarea 
          className="textarea w-[335px]"
          type="text"
          placeholder="Displayed Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <label className="fieldset-label text-slate-900">Question Type</label>
        <div className="join join-horizontal gap-2">
        {['Single Choice', 'Multiple Choice', 'Judgement'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setQuestionType(type);
              if (type === 'Judgement') {
                setAnswers(['True', 'False']);
              } else {
                setAnswers(options.map(opt => opt.value));
              }
            }}
            className={`btn !text-xs ${questionType === type ? '!bg-blue-600 text-white' : '!bg-gray-200 text-gray-800'}`}
          >
            {type}
          </button>
        ))}
      </div>
      <hr className="m-2"></hr>
      {questionType === 'Single Choice' && (
        <div className='w-full'>
        {options.map((opt, index) => (
          <div key={opt.label}>
            <div className='join join-horizontal gap-2 h-[20px]'>
              <label className="fieldset-label text-slate-900">Option {opt.label}</label>
              <input
                type="radio"
                name="correctAnswer"
                value={`Option ${opt.label}`}
                className="radio radio-xs"
                onChange={(e) => setCorrectAnswer(e.target.value)}
                checked={correctAnswer === `Option ${opt.label}`}
              />
              <p className="!text-zinc-500">- mark option {opt.label} as correct</p>
            </div>
            <input
              className="p-2 bg-gray-200 rounded-md w-full mt-2 mb-2"
              type="text"
              placeholder={`Answer Displayed as Option ${opt.label}`}
              value={opt.value}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index].value = e.target.value;
                setOptions(newOptions);
                setAnswers(newOptions.map((opt) => opt.value));
              }}
            />
          </div>
        ))}
    
        {options.length < 6 && (
          <button
            type="button"
            className="btn btn-outline btn-sm mt-2 !bg-zinc-200"
            onClick={addOption}
          >
            + Add Answer
          </button>
        )}
      </div>
      )}

      {questionType === 'Judgement' && (
        <div className='join join-vertical gap-2'>
          <label className="fieldset-label text-slate-900">Select the Correct Answer</label>
          {['True', 'False'].map((answer) => (
          <button
            key={answer}
            onClick={() => setCorrectAnswer(answer === 'True' ? 'Option A' : 'Option B')}
            className={`btn !text-xs ${
              correctAnswer === (answer === 'True' ? 'Option A' : 'Option B')
                ? '!bg-green-200 text-gray-950'
                : '!bg-gray-200 text-gray-800'
            }`}
          >
            {answer}
          </button>
        ))}
        </div>
      )}

      {!questionType && (
        <div className="text-sm text-gray-500 italic ml-2">
          Select a question type.
        </div>
      )}
      <hr className="m-2"></hr>


        {/* Only shows when an error has been stored */}
        {error && (
          <div role="alert" className="alert alert-warning mt-2 mb-0 p-1 !pl-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Submits the form to create a new game */}
        {editing ? (<button onClick={onEdit} className="btn btn-primary md:btn-md flex-1 mt-2">Edit Question</button>):
          <button onClick={onCreate} className="btn btn-primary md:btn-md flex-1 mt-2">Add Question</button>}

      </fieldset>
      {/* Exits the modal without creating a new game */}
      <button onClick={onClose} className="btn !bg-red-600 text-white mt-2">Close</button>
    </div>
  )
};

export default CreateQuestionModal;