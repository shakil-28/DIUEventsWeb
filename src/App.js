import './App.css';
import { NavBar } from './components/NavBar';
import { TopEvents } from './components/TopEvents';

function App() {

  return (
    <div className='flex-col space-y-2 dark:bg-slate-900'>
      <NavBar />
      <TopEvents />

    </div>

  );
}

export default App;
