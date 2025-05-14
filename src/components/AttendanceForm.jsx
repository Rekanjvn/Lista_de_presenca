import React, { useState, useEffect } from 'react';
import { getStudents, getAttendanceByDate, saveAttendance } from '../utils/storage';
import { formatDate, formatDateForInput, getTodayISO } from '../utils/calculations';

const AttendanceForm = ({ selectedDate, onDateChange, isViewOnly = false }) => {
  const [date, setDate] = useState(selectedDate || getTodayISO());
  const [students, setStudents] = useState([]);
  const [attendanceRecord, setAttendanceRecord] = useState([]);
  const [saved, setSaved] = useState(false);
  
  // Load students and attendance data
  useEffect(() => {
    const allStudents = getStudents();
    setStudents(allStudents);
    
    // Load attendance for the selected date
    const existingAttendance = getAttendanceByDate(date);
    
    if (existingAttendance) {
      setAttendanceRecord(existingAttendance.students);
    } else {
      // Create new attendance record with all students marked absent
      const newAttendance = allStudents.map(student => ({
        id: student.id,
        present: false
      }));
      setAttendanceRecord(newAttendance);
    }
    
    setSaved(false);
  }, [date]);
  
  const handleDateChange = (e) => {
    const newDate = e.target.value + 'T00:00:00.000Z';
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };
  
  const toggleAttendance = (studentId) => {
    if (isViewOnly) return;
    
    setAttendanceRecord(prev => 
      prev.map(record => 
        record.id === studentId 
          ? { ...record, present: !record.present } 
          : record
      )
    );
    setSaved(false);
  };
  
  const handleSave = () => {
    const attendanceData = {
      date,
      students: attendanceRecord
    };
    
    saveAttendance(attendanceData);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  
  const markAll = (present) => {
    setAttendanceRecord(prev => 
      prev.map(record => ({ ...record, present }))
    );
    setSaved(false);
  };
  
  if (students.length === 0) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p>Não há alunos cadastrados. Adicione alunos primeiro.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-lg font-semibold mb-2 sm:mb-0">Chamada - {formatDate(date)}</h2>
        
        <div className="flex items-center space-x-2">
          <input 
            type="date" 
            value={formatDateForInput(date)} 
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      
      {!isViewOnly && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button 
            onClick={() => markAll(true)} 
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
          >
            Marcar Todos Presentes
          </button>
          <button 
            onClick={() => markAll(false)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            Marcar Todos Ausentes
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Presença
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {students.map(student => {
              const attendanceEntry = attendanceRecord.find(record => record.id === student.id);
              const isPresent = attendanceEntry ? attendanceEntry.present : false;
              
              return (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.registration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => toggleAttendance(student.id)}
                      disabled={isViewOnly}
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        isPresent 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      } ${isViewOnly ? 'opacity-80 cursor-default' : 'cursor-pointer'}`}
                    >
                      {isPresent ? 'Presente' : 'Ausente'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {!isViewOnly && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {saved ? '✓ Salvo!' : 'Salvar Chamada'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceForm;