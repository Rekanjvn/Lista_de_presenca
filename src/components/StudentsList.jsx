import React, { useState, useEffect } from 'react';
import { getStudents, removeStudent, calculateStudentAttendance } from '../utils/storage';
import { formatPercentage } from '../utils/calculations';

const StudentsList = ({ onEditStudent, onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allStudents = getStudents();
    setStudents(allStudents);
  };

  const handleRemoveStudent = (studentId) => {
    if (confirmDelete === studentId) {
      removeStudent(studentId);
      loadStudents();
      setConfirmDelete(null);
    } else {
      setConfirmDelete(studentId);
      
      // Reset confirmation after a timeout
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (students.length === 0) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">Não há alunos cadastrados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <input
          type="text"
          placeholder="Pesquisar alunos..."
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
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                E-mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Presença
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.map(student => {
              const attendancePercentage = calculateStudentAttendance(student.id);
              
              return (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.registration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${attendancePercentage >= 75 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                      {formatPercentage(attendancePercentage)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {onSelectStudent && (
                        <button 
                          onClick={() => onSelectStudent(student)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Selecionar
                        </button>
                      )}
                      
                      {onEditStudent && (
                        <button 
                          onClick={() => onEditStudent(student)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          Editar
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleRemoveStudent(student.id)}
                        className={`${confirmDelete === student.id 
                          ? 'text-red-700 font-bold dark:text-red-500' 
                          : 'text-red-600 dark:text-red-400'} hover:text-red-900 dark:hover:text-red-300`}
                      >
                        {confirmDelete === student.id ? 'Confirmar?' : 'Remover'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredStudents.length === 0 && (
        <div className="text-center p-6">
          <p className="text-gray-500 dark:text-gray-400">Nenhum aluno encontrado com o termo de pesquisa.</p>
        </div>
      )}
    </div>
  );
};

export default StudentsList;