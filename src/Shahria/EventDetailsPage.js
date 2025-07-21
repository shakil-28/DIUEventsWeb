import React, { useState } from "react";
import EventBanner from "./components/EventBanner";
import EventDescription from "./components/EventDescription";
import EventActionButton from "./components/EventActionButton";

const EventDetailsPage = () => {
  const [isJoined, setIsJoined] = useState(false);

  const eventData = {
    title: "DIU Annual Tech Carnival 2025",
    date: "August 25, 2025",
    imageUrl:
      "https://th.bing.com/th/id/OIP.8uORDGyqgUPtS7nTDom_2QHaCK?w=347&h=102&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    description:
      "Join us at DIU’s most exciting event of the year! Experience cutting-edge technology, workshops, and keynote speakers from around the globe. Network with professionals, students, and innovators!",
    venue: "Daffodil International University Auditorium",
    time: "10:00 AM - 4:00 PM",
  };

  const handleJoinToggle = () => {
    setIsJoined((prev) => !prev);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <EventBanner
        imageUrl={eventData.imageUrl}
        title={eventData.title}
        date={eventData.date}
      />
      <EventDescription
        description={eventData.description}
        venue={eventData.venue}
        time={eventData.time}
      />
      <EventActionButton isJoined={isJoined} onClick={handleJoinToggle} />
    </div>
  );
};

export default EventDetailsPage;
