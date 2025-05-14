import React, { useState, useEffect } from 'react';
import { getStudents, getAttendance } from '../utils/storage';
import { formatDate } from '../utils/calculations';

const AttendanceList = ({ onSelectDate }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allStudents = getStudents();
    const allAttendance = getAttendance();
    
    setStudents(allStudents);
    setAttendanceData(allAttendance.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const getAttendanceStats = (attendanceRecord) => {
    const totalStudents = attendanceRecord.students.length;
    if (totalStudents === 0) return { present: 0, absent: 0, percentage: 0 };
    
    const presentCount = attendanceRecord.students.filter(s => s.present).length;
    const absentCount = totalStudents - presentCount;
    const percentage = (presentCount / totalStudents) * 100;
    
    return {
      present: presentCount,
      absent: absentCount,
      percentage: percentage
    };
  };

  const filteredAttendance = attendanceData.filter(record => 
    formatDate(record.date).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (attendanceData.length === 0) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Nenhum registro de chamada encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <input
          type="text"
          placeholder="Pesquisar por data..."
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Presentes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ausentes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Taxa de Presença
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAttendance.map(record => {
              const stats = getAttendanceStats(record);
              
              return (
                <tr key={record.date}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {stats.present}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {stats.absent}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${stats.percentage >= 75 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                      {Math.round(stats.percentage)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onSelectDate(record.date)}
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
      {filteredAttendance.length === 0 && (
        <div className="text-center p-6">
          <p className="text-gray-500 dark:text-gray-400">Nenhum registro encontrado com o termo de pesquisa.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;