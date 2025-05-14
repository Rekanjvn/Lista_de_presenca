import React, { useState } from 'react';
import { addStudent } from '../utils/storage';

const StudentForm = ({ onAddStudent, initialData = null, onUpdate = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    name: initialData ? initialData.name : '',
    registration: initialData ? initialData.registration : '',
    email: initialData ? initialData.email : '',
  });
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!formData.registration.trim()) {
      newErrors.registration = 'A matrícula é obrigatória';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (initialData) {
        // Update mode
        onUpdate({ ...initialData, ...formData });
      } else {
        // Add mode
        const newStudent = addStudent(formData);
        onAddStudent(newStudent);
        // Reset form
        setFormData({
          name: '',
          registration: '',
          email: '',
        });
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="registration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Matrícula
        </label>
        <input
          type="text"
          id="registration"
          name="registration"
          value={formData.registration}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${errors.registration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {errors.registration && <p className="text-red-500 text-xs mt-1">{errors.registration}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {initialData ? 'Atualizar' : 'Adicionar'} Aluno
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;