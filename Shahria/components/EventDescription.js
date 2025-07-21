import React from 'react';

const EventDescription = ({ description, venue, time }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">About This Event</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-4 text-sm text-gray-500">
        <p><strong>📍 Venue:</strong> {venue}</p>
        <p><strong>⏰ Time:</strong> {time}</p>
      </div>
    </>
  );
};

export default EventDescription;