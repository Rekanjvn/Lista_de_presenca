import React, { useState, useEffect } from 'react';
import GradesList from '../components/GradesList';
import GradeForm from '../components/GradeForm';
import { getStudents, getStudentGrade } from '../utils/storage';

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewingGradeReport, setViewingGradeReport] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allStudents = getStudents();
    setStudents(allStudents);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setViewingGradeReport(true);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setViewingGradeReport(false);
  };

  const handleGradeSaved = () => {
    // Reload data to reflect the changes
    loadStudents();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {viewingGradeReport && selectedStudent 
            ? `Notas - ${selectedStudent.name}` 
            : 'Gerenciamento de Notas'}
        </h1>
        
        {viewingGradeReport && (
          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ← Voltar para Lista
          </button>
        )}
      </div>
      
      {viewingGradeReport && selectedStudent ? (
        <GradeForm 
          student={selectedStudent}
          onSave={handleGradeSaved}
        />
      ) : (
        <GradesList onSelectStudent={handleSelectStudent} />
      )}
    </div>
  );
};

export default Grades;