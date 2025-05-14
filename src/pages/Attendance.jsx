import React, { useState } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceList from '../components/AttendanceList';
import { formatDate, formatDateForInput, getTodayISO } from '../utils/calculations';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [viewingHistory, setViewingHistory] = useState(false);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleSelectHistoryDate = (date) => {
    setSelectedDate(date);
    setViewingHistory(true);
  };

  const handleBackToToday = () => {
    setSelectedDate(getTodayISO());
    setViewingHistory(false);
  };

  const handleToggleView = () => {
    setViewingHistory(!viewingHistory);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {viewingHistory 
            ? `Chamada - ${formatDate(selectedDate)}` 
            : 'Registro de Presença'}
        </h1>
        
        <div className="flex space-x-2">
          <button
            onClick={handleToggleView}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {viewingHistory ? 'Nova Chamada' : 'Ver Histórico'}
          </button>
          
          {viewingHistory && (
            <button
              onClick={handleBackToToday}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Voltar para Hoje
            </button>
          )}
        </div>
      </div>
      
      {viewingHistory ? (
        <AttendanceList onSelectDate={handleSelectHistoryDate} />
      ) : (
        <AttendanceForm 
          selectedDate={selectedDate} 
          onDateChange={handleDateChange} 
        />
      )}
    </div>
  );
};

export default Attendance;