import { NavBar } from '../components/NavBar'
import { TopEvents } from '../components/TopEvents'
import { signOut } from "firebase/auth";
import { auth } from '../firebase/auth';
import { useNavigate } from "react-router-dom";


export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
        .then(() => {
            navigate('/login');
        })
        .catch(err => {
            console.error(err);
        });
    };



  return (
    <div className='flex-col space-y-4 dark:bg-slate-900'>
        <NavBar />
        <TopEvents />

        <button onClick={handleLogout} className="btn-logout">
            Logout
        </button>
    </div>
  );
}