import './App.css';
import LoginPage from './components/LoginPage';
import { NavBar } from './components/NavBar';
import { TopEvents } from './components/TopEvents';





function App() {

  return (
    <div className='flex-col space-y-2 dark:bg-slate-900'>
      <NavBar />
      <TopEvents />
      <LoginPage />
    </div>

  );
}

export default App;
