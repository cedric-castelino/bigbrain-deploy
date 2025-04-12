
function Modal ({open, onClose, children}) {

    return (
        <div className={`fixed inset-0 flex flex-col justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`} onClick={onClose}>
            <button className="py-1 px-2 border border-neutral-200 rounded-md text-gray-400 bg-white mb-2" onClick={onClose}>
                    close
                </button>
            <div className={`max-h-[70vh] overflow-auto bg-white roudned-lg shadow p-6 transition all max-w-md overflow-auto ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
                <div className="flex flex-col">
                    {children}
                </div>
                
            </div>
        </div>
    )
};

export default Modal;