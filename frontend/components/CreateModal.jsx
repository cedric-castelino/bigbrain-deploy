
import Button from "react-bootstrap/esm/Button";

function CreateModal ({open, onClose, onCreate, id, setId, name, setName, handleFileChange}) {

    return (
        <div className={`fixed inset-0 flex flex-col justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
            
            <div className={`max-h-[70vh] overflow-auto bg-white rounded-lg shadow p-6 transition all max-w-md overflow-auto ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
                <div className="flex flex-col gap-2">
                    <input
                        className="p-2 bg-gray-200 rounded-md"
                        type="text"
                        placeholder="Enter game ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <input
                        className="p-2 bg-gray-200 rounded-md"
                        type="text"
                        placeholder="Enter game name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="p-2 bg-gray-200 rounded-md"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <Button
                        onClick={onCreate}
                        variant="success"
                    >
                        Create Game
                    </Button>
                </div>
                
            </div>

            <Button
                onClick={onClose}
                variant="danger"
                className={`mt-2 transition all ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            >
                Close
            </Button>
        </div>
    )
};

export default CreateModal;