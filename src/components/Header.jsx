import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const location = useLocation();
  
  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/students', label: 'Alunos' },
    { path: '/attendance', label: 'Chamada' },
    { path: '/grades', label: 'Notas' },
    { path: '/history', label: 'Histórico' }
  ];

  return (
    <header className="bg-white shadow-md dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            BusinessLink
          </h1>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
        
        <nav className="flex overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`px-4 py-2 mr-2 whitespace-nowrap rounded-md transition-colors duration-200
                ${location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;