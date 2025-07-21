// EventActionButton.js
import React from "react";
import { FiPlus } from "react-icons/fi";

const EventActionButton = ({ isJoined, onClick }) => {
  return (
    <div className="mt-8 text-center">
      <button className="flex space-x-3 p-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
        <FiPlus size={20} />Join Event
      </button>
    </div>
  );
};

export default EventActionButton;
