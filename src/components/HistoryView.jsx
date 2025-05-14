import React, { useState, useEffect } from 'react';
import { getAttendance, getStudents } from '../utils/storage';
import { formatDate } from '../utils/calculations';
import AttendanceForm from './AttendanceForm';

const HistoryView = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allAttendance = getAttendance();
    // Sort by date (newest first)
    const sortedAttendance = allAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAttendanceHistory(sortedAttendance);
    
    const allStudents = getStudents();
    setStudents(allStudents);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleBackToList = () => {
    setSelectedDate(null);
  };

  // If a date is selected, show the attendance form in view-only mode
  if (selectedDate) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Histórico de Chamada - {formatDate(selectedDate)}
          </h2>
          <button
            onClick={handleBackToList}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ← Voltar para Lista
          </button>
        </div>
        <AttendanceForm selectedDate={selectedDate} isViewOnly={true} />
      </div>
    );
  }

  // If no date is selected, show the list of attendance history
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Histórico de Chamadas</h2>
      
      {attendanceHistory.length === 0 ? (
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum registro de chamada encontrado.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Alunos Presentes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Alunos Ausentes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {attendanceHistory.map(record => {
                  const presentCount = record.students.filter(s => s.present).length;
                  const absentCount = record.students.length - presentCount;
                  
                  return (
                    <tr key={record.date}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatDate(record.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400">
                        {presentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-red-600 dark:text-red-400">
                        {absentCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleSelectDate(record.date)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;