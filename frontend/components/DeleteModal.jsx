
function DeleteModal ({open, onClose, children}) {

    return (
        <div className={`fixed inset-0 flex flex-col justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
            
            <div className={`max-h-[45vh] overflow-auto bg-white roudned-lg shadow p-6 transition all max-w-md overflow-auto ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
                <div className="flex flex-col">
                    {children}
                </div>
            </div>
            <button className="py-1 px-2 border border-neutral-200 rounded-md text-gray-400 bg-white mt-2" onClick={onClose}>
                    close
            </button>
        </div>
    )
};

export default DeleteModal;