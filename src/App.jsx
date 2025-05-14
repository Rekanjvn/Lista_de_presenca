import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import History from './pages/History';
import { initializeStorage } from './utils/storage';

function App() {
  useEffect(() => {
    // Initialize local storage with default data if needed
    initializeStorage();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900 dark:text-white">
          <Header />
          <main className="container mx-auto p-4 pb-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;