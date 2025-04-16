import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function PlayerSession ({ token,}) {
  // Collects user input for the login form
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
        <div>
            HELLO
        </div>
    </div>
  )
}

export default PlayerSession;