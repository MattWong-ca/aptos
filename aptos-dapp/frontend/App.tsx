import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// Internal Components
import Navbar from "@/components/Navbar"; // New import
import Dashboard from "@/components/Dashboard";
import Challenge from './components/Challenge';
import Gamestore from './components/Gamestore';
import Leaderboard from './components/Leaderboard';
import Mint from './components/Mint';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/test.png')", fontFamily: 'Poppins, sans-serif' }}>
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/gamestore" element={<Gamestore />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/challenge" element={<Challenge />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
