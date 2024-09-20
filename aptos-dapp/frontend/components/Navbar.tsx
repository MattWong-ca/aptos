import React from 'react';
import { Link } from 'react-router-dom';
import { WalletSelector } from './WalletSelector';
import { Home, ShoppingBag, Trophy, Users } from 'lucide-react';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const routes = [
    { path: '/dashboard', name: 'Dashboard', icon: <Home size={18} /> },
    { path: '/gamestore', name: 'Game Store', icon: <ShoppingBag size={18} /> },
    { path: '/leaderboard', name: 'Leaderboard', icon: <Trophy size={18} /> },
    { path: '/challenge', name: 'Challenge a Friend', icon: <Users size={18} /> },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#004aad] flex items-center px-4 z-20 justify-between">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white z-30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <WalletSelector/>
      </nav>
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-10`}>
        <div className="p-4 pt-20"> {/* Added padding-top to account for navbar */}
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2 p-1">Lingocaster</h2>
          <ul>
            {routes.map((route) => (
              <li key={route.path} className="mb-2">
                <Link 
                  to={route.path} 
                  className="flex items-center p-2 rounded-md text-gray-700 hover:bg-blue-50 transition-all duration-200 ease-in-out"
                >
                  <span className="mr-3 text-gray-500 group-hover:text-blue-500 transition-colors duration-200">{route.icon}</span>
                  <span className="font-medium">{route.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;