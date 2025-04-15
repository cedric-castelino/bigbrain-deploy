const DisplayQuestions = ({token, question}) => {

    const handleClick = () => {
        navigate(`/game/${game.id}`);
    };

    return (
        <ul className="list bg-base-100 rounded-box shadow-md mt-4 mb-0 !pl-0"> 
            <li className="list-row">
                <div className='join join-vertical gap-2 text-center border-r border-gray-300 pr-4'>
                    <div className="text-3xl font-thin tabular-nums">{question.duration}</div>
                    <div className="text-sm font-thin tabular-nums">{Number(question.duration) === 1 ? 'second' : 'seconds'}</div>
                </div>
                <div className="list-col-grow">
                    <div className="text-lg">{question.question}</div>
                    <div className="input-group mt-2 mb-2">
                        <span className={`rounded-md px-0 sm:!px-4 py-0 text-gray-600 ${
                            question.correctAnswers[0] === 'Option A'
                            ? 'bg-lime-300 text-green-950'
                            : 'bg-rose-200 text-red-950'}`}>
                            Option A
                        </span>
                    </div>
                    <div className="text-xs font-semibold opacity-80 ml-4">{question.options.optionA}</div>
                    <div className="input-group mt-2 mb-2">
                        <span className={`rounded-md px-0 sm:!px-4 py-0 text-gray-600 ${
                            question.correctAnswers[0] === 'Option B'
                            ? 'bg-lime-300 text-green-950'
                            : 'bg-rose-200 text-red-950'}`}>
                            Option B
                        </span>
                    </div>
                    <div className="text-xs font-semibold opacity-80 ml-4">{question.options.optionB}</div>
                    <div className="input-group mt-2 mb-2">
                        <span className={`rounded-md px-0 sm:!px-4 py-0 text-gray-600 ${
                            question.correctAnswers[0] === 'Option C'
                            ? 'bg-lime-300 text-green-950'
                            : 'bg-rose-200 text-red-950'}`}>
                            Option C
                        </span>
                    </div>
                    <div className="text-xs font-semibold opacity-80 ml-4">{question.options.optionC}</div>
                    <div className="input-group mt-2 mb-2">
                        <span className={`rounded-md px-0 sm:!px-4 py-0 text-gray-600 ${
                            question.correctAnswers[0] === 'Option D'
                            ? 'bg-lime-300 text-green-950'
                            : 'bg-rose-200 text-red-950'}`}>
                            Option D
                        </span>
                    </div>
                    <div className="text-xs font-semibold opacity-80 ml-4">{question.options.optionD}</div>
                </div>
                <div className='join join-vertical gap-2 border-l border-gray-300 pl-4'>
                    <button className="btn btn-primary">Edit Question</button>
                    <button type="button" className="btn btn-danger !bg-red-600 hover:!bg-red-900">Delete Question</button>
                </div>
            </li>
            
        </ul> 
    )
    
}

export default DisplayQuestions;