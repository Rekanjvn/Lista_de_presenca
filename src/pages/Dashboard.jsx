import React, { useState, useEffect } from 'react';
import { getStudents, getGrades, getAttendance } from '../utils/storage';
import { calculateClassAverages, formatPercentage } from '../utils/calculations';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [classStats, setClassStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    classAverages: {
      portfolio: 0,
      activities: 0,
      exam: 0,
      final: 0
    },
    passRate: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allStudents = getStudents();
    const allGrades = getGrades();
    const allAttendance = getAttendance();
    
    setStudents(allStudents);
    setGrades(allGrades);
    setAttendance(allAttendance);
    
    // Calculate statistics
    calculateStats(allStudents, allGrades, allAttendance);
  };

  const calculateStats = (students, grades, attendance) => {
    // Calculate class averages for each component
    const averages = calculateClassAverages(grades);
    
    // Calculate attendance rate
    let totalAttendanceRate = 0;
    let studentCount = 0;
    
    students.forEach(student => {
      let presentDays = 0;
      let totalDays = 0;
      
      attendance.forEach(day => {
        const studentRecord = day.students.find(s => s.id === student.id);
        if (studentRecord) {
          totalDays++;
          if (studentRecord.present) {
            presentDays++;
          }
        }
      });
      
      if (totalDays > 0) {
        totalAttendanceRate += (presentDays / totalDays) * 100;
        studentCount++;
      }
    });
    
    // Calculate pass rate
    const studentsWithGrades = students.filter(student => 
      grades.some(g => g.studentId === student.id && g.finalGrade !== null)
    );
    
    const passedStudents = studentsWithGrades.filter(student => {
      const grade = grades.find(g => g.studentId === student.id);
      return grade && grade.finalGrade >= 6;
    });
    
    const passRate = studentsWithGrades.length > 0 
      ? (passedStudents.length / studentsWithGrades.length) * 100 
      : 0;
    
    setClassStats({
      totalStudents: students.length,
      averageAttendance: studentCount > 0 ? totalAttendanceRate / studentCount : 0,
      classAverages: averages,
      passRate: passRate
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total de Alunos</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{classStats.totalStudents}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Média de Presença</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {formatPercentage(classStats.averageAttendance)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Média da Turma</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {classStats.classAverages.final.toFixed(1)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Taxa de Aprovação</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {formatPercentage(classStats.passRate)}
          </p>
        </div>
      </div>
      
      {/* Component Averages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Médias por Componente</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Componente</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Peso</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Média</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">Portfólio</td>
                  <td className="py-3 px-4">20%</td>
                  <td className="py-3 px-4 font-medium">{classStats.classAverages.portfolio.toFixed(1)}</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">Atividades</td>
                  <td className="py-3 px-4">30%</td>
                  <td className="py-3 px-4 font-medium">{classStats.classAverages.activities.toFixed(1)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Prova</td>
                  <td className="py-3 px-4">50%</td>
                  <td className="py-3 px-4 font-medium">{classStats.classAverages.exam.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
          
          {attendance.length === 0 && grades.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Nenhuma atividade registrada.</p>
          ) : (
            <div className="space-y-4">
              {attendance.slice(0, 3).map(day => (
                <div key={day.date} className="flex items-center pb-3 border-b dark:border-gray-700">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Chamada registrada</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(day.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;