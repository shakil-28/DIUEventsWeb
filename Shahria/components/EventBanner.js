import React from 'react';

const EventBanner = ({ imageUrl, title, date, likeCount }) => {
  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-[400px]">
      <img
        src={imageUrl}
        alt={title}
        className="object-cover object-center w-full h-full rounded-xl shadow-lg"
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        <p className="text-gray-300 text-sm">{date}</p>
        <div className="absolute bottom-4 right-4 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
          ❤️ {likeCount} Likes
        </div>
      </div>
    </div>
  );
};

export default EventBanner;