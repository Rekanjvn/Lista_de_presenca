import React, { useState, useEffect } from 'react';
import StudentsList from '../components/StudentsList';
import StudentForm from '../components/StudentForm';
import { getStudents, updateStudent } from '../utils/storage';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allStudents = getStudents();
    setStudents(allStudents);
  };

  const handleAddStudent = (newStudent) => {
    loadStudents();
    setShowAddForm(false);
    // Show success notification
    alert(`Aluno ${newStudent.name} adicionado com sucesso!`);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowAddForm(false);
  };

  const handleUpdateStudent = (updatedStudent) => {
    updateStudent(updatedStudent);
    setEditingStudent(null);
    loadStudents();
    // Show success notification
    alert(`Aluno ${updatedStudent.name} atualizado com sucesso!`);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alunos</h1>
        {!showAddForm && !editingStudent && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Adicionar Aluno
          </button>
        )}
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Adicionar Novo Aluno</h2>
          <StudentForm 
            onAddStudent={handleAddStudent} 
            onCancel={() => setShowAddForm(false)} 
          />
        </div>
      )}
      
      {/* Edit Student Form */}
      {editingStudent && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Editar Aluno</h2>
          <StudentForm 
            initialData={editingStudent} 
            onUpdate={handleUpdateStudent}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
      
      {/* Students List */}
      <div>
        <StudentsList onEditStudent={handleEditStudent} />
      </div>
    </div>
  );
};

export default Students;