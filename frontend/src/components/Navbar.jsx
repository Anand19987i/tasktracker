import React from 'react';
import { useSelector } from 'react-redux';

const Navbar = ({ username, onButtonClick, buttonLabel }) => {
  const { user } = useSelector(store => store.auth);
  
  return (
    <header className="bg-white px-6 py-4 shadow-md flex justify-between items-center">
      <h2 className="text-lg font-medium text-slate-800 ml-10">Welcome, {user?.name} &#128075;</h2>
      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          + {buttonLabel}
        </button>
      )}
    </header>
  );
};

export default Navbar;
