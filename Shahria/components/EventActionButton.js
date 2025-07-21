// EventActionButton.js
import React from 'react';

const EventActionButton = ({ isJoined, onClick }) => {
  return (
    <div className="mt-8 text-center">
      <button
        onClick={onClick}
        className={`px-6 py-3 text-white font-bold rounded-full shadow-md transform transition-all duration-300 ease-in-out
          ${isJoined
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 hover:from-green-600 hover:to-emerald-700'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 hover:from-blue-600 hover:to-indigo-700'
          }`}
      >
        {isJoined ? '✅ Joined' : '🚀 Join Event'}
      </button>
    </div>
  );
};

export default EventActionButton;
