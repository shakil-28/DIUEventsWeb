import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { collection, limit, orderBy, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export function TopEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchTopEvents() {
      try {
        const eventRef = collection(db, 'events');
        const eventQuery = query(eventRef, orderBy('reactCount', 'desc'), limit(5));
        const eventSnapshot = await getDocs(eventQuery);
        const topEvents = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(topEvents);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTopEvents();
  }, []);

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-3">
        <h3 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 text-left'>Top Events</h3>

        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop={events.length >= 2}
            breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            className="relative"
        >
            {events.map(event => (
                <SwiperSlide key={event.id}>
                <div className="bg-slate-100 dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md text-center h-full flex flex-col">
                    <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-2">{event.location}</p>
                    <p className="py-4 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(event.startingTime.seconds * 1000).toLocaleString()}
                    </p>
                </div>
                </SwiperSlide>
            ))}





    </Swiper>

    </div>
  );
}
