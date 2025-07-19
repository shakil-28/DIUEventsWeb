import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase/config";

export function UpcommingEvents() {

    await [upCommintEvents, setUpcomming ]

    useEffect(() => {
        async function fetchTopEvents() {
        try {
            const eventRef = collection(db, 'events');
            const eventQuery = query(eventRef, where('startingTime', '>=', new Date()), orderBy('startingTime'), limit(10)
);
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
    <div>


    </div>
  );
}