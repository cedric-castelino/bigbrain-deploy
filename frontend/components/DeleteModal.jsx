import Button from "react-bootstrap/esm/Button";
import React from 'react';

function DeleteModal ({open, onClose, children}) {

  return (
    <div className={`fixed z-50 inset-0 flex flex-col justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
            
      <div className={`max-h-[45vh] overflow-auto bg-white roudned-lg shadow flex justify-center break-words break-all p-6 transition all max-w-md overflow-y-auto ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
        <div className="flex flex-col">
          {children}
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

export default DeleteModal;