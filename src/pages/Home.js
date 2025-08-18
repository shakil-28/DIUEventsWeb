import { NavBar } from '../components/NavBar';
import TopEvents from '../components/TopEvents'; // default export
import { signOut } from "firebase/auth";
import { auth } from '../firebase/config';
import { useNavigate } from "react-router-dom";
import HeroSection from '../components/HeroSection';
import ClubsPreview from '../components/ClubPreview';
import UpcomingEvents from '../components/UpcommingEvents';
import FeaturedClubs from '../components/FeaturedClubs';
import Footer from '../components/Footer';

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => navigate('/login'))
            .catch(err => console.error(err));
    };

    return (
        <div className='flex-col space-y-4 dark:bg-slate-900'>
            <NavBar />
            <HeroSection />
            <TopEvents />
            <ClubsPreview />
            <UpcomingEvents />
            <FeaturedClubs />
            <Footer />

            <button onClick={handleLogout} className="btn-logout">
                Logout
            </button>
        </div>
    );
}
