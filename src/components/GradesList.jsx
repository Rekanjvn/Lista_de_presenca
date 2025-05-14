import React, { useState, useEffect } from 'react';
import { getStudents, getGrades } from '../utils/storage';
import { calculateClassAverages } from '../utils/calculations';

const GradesList = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [classAverages, setClassAverages] = useState({
    portfolio: 0,
    activities: 0,
    exam: 0,
    final: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allStudents = getStudents();
    const allGrades = getGrades();
    setStudents(allStudents);
    setGrades(allGrades);
    
    // Calculate class averages
    const averages = calculateClassAverages(allGrades);
    setClassAverages(averages);
  };

  // Combine students with their grades
  const studentsWithGrades = students.map(student => {
    const studentGrade = grades.find(grade => grade.studentId === student.id) || {
      portfolio: null,
      activities: null,
      exam: null,
      finalGrade: null
    };
    
    return {
      ...student,
      ...studentGrade
    };
  });

  const filteredStudents = studentsWithGrades.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Class Averages */}
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3">Médias da Turma</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-300">Portfólio</div>
            <div className="text-xl font-bold text-blue-800 dark:text-blue-300">{classAverages.portfolio.toFixed(1)}</div>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <div className="text-sm text-green-800 dark:text-green-300">Atividades</div>
            <div className="text-xl font-bold text-green-800 dark:text-green-300">{classAverages.activities.toFixed(1)}</div>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <div className="text-sm text-purple-800 dark:text-purple-300">Prova</div>
            <div className="text-xl font-bold text-purple-800 dark:text-purple-300">{classAverages.exam.toFixed(1)}</div>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <div className="text-sm text-yellow-800 dark:text-yellow-300">Média Final</div>
            <div className="text-xl font-bold text-yellow-800 dark:text-yellow-300">{classAverages.final.toFixed(1)}</div>
          </div>
        </div>
      </div>

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
                Portfólio (20%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Atividades (30%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Prova (50%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nota Final
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Situação
              </th>
              {onSelectStudent && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.map(student => {
              const isPassing = student.finalGrade !== null && student.finalGrade >= 6;
              
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
                    {student.portfolio !== null ? student.portfolio.toFixed(1) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.activities !== null ? student.activities.toFixed(1) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.exam !== null ? student.exam.toFixed(1) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${student.finalGrade === null ? 'text-gray-500' : 
                      isPassing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {student.finalGrade !== null ? student.finalGrade.toFixed(1) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.finalGrade !== null ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${isPassing 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                        {isPassing ? 'Aprovado' : 'Reprovado'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Pendente
                      </span>
                    )}
                  </td>
                  {onSelectStudent && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => onSelectStudent(student)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Editar Notas
                      </button>
                    </td>
                  )}
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

export default GradesList;