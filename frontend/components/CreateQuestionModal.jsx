// Creates a popup for when the user wants to add a new question
function CreateQuestionModal ({open, onClose, onCreate, error, duration, setDuration, question, setQuestion,
    optionA, setOptionA, optionB, setOptionB, optionC, setOptionC, optionD, setOptionD, correctAnswer, setcorrectAnswer}) {

    return (
        // Displays a transparent grey background for the modal
        <div className={`fixed z-50 inset-0 flex flex-col justify-center items-center transition-colors ${open ? "visible bg-black/60" : "invisible"}`}>
            <fieldset className="fieldset w-sm bg-base-200 border border-base-300 p-4 rounded-box bg-white">
                <legend className="fieldset-legend text-center text-3xl">Add Question</legend>
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
                    <hr className="m-2"></hr>
                    <div className='join join-horizontal gap-2 h-[20px]'>
                        <label className="fieldset-label text-slate-900">Option A</label>
                        <input type="radio" 
                            name="correctAnswer" 
                            value="Option A" 
                            className="radio radio-xs" 
                            onChange={(e) => setcorrectAnswer(e.target.value)}
                            checked={correctAnswer === 'Option A'}
                        />
                        <p className="!text-zinc-500">- mark option A as correct</p>
                    </div>
                    <input
                        className="p-2 bg-gray-200 rounded-md"
                        type="text"
                        placeholder="Answer Displayed as Option A"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                    />
                    <div className='join join-horizontal gap-2 h-[20px]'>
                        <label className="fieldset-label text-slate-900">Option B</label>
                        <input type="radio" 
                        name="correctAnswer" 
                        value="Option B" 
                        className="radio radio-xs" 
                        onChange={(e) => setcorrectAnswer(e.target.value)}
                        checked={correctAnswer === 'Option B'}/>
                        <p className="!text-zinc-500">- mark option B as correct</p>
                    </div>
                    <input
                        className="p-2 bg-gray-200 rounded-md"
                        type="text"
                        placeholder="Answer Displayed as Option B"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                    />
                    <div className='join join-horizontal gap-2 h-[20px]'>
                        <label className="fieldset-label text-slate-900">Option C</label>
                        <input type="radio" 
                        name="correctAnswer" 
                        value="Option C" 
                        className="radio radio-xs" 
                        onChange={(e) => setcorrectAnswer(e.target.value)}
                        checked={correctAnswer === 'Option C'}/>
                        <p className="!text-zinc-500">- mark option C as correct</p>
                    </div>
                    <input
                        className="p-2 bg-gray-200 rounded-md"
                        type="text"
                        placeholder="Answer Displayed as Option C"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                    />
                    <div className='join join-horizontal gap-2 h-[20px]'>
                        <label className="fieldset-label text-slate-900">Option D</label>
                        <input type="radio" 
                        name="correctAnswer" 
                        value="Option D" 
                        className="radio radio-xs" 
                        onChange={(e) => setcorrectAnswer(e.target.value)}
                        checked={correctAnswer === 'Option D'}/>
                        <p className="!text-zinc-500">- mark option D as correct</p>
                    </div>
                    <input
                        className="p-2 bg-gray-200 rounded-md"
                        type="text"
                        placeholder="Answer Displayed as Option D"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                    />


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
                    <button onClick={onCreate} className="btn btn-primary md:btn-md flex-1 mt-2">Add Question</button>

                  </fieldset>
            {/* Exits the modal without creating a new game */}
            <button onClick={onClose} className="btn !bg-red-600 text-white mt-2">Close</button>
        </div>
    )
};

export default CreateQuestionModal;