import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// Internal Components
import Navbar from "@/components/Navbar"; // New import
import Dashboard from "@/components/Dashboard";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/path/to/your/image.jpg')", fontFamily: 'Poppins, sans-serif' }}>
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
