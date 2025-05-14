import React, { useState, useEffect } from 'react';
import { getStudentGrade, saveGrade } from '../utils/storage';
import { calculateFinalGrade } from '../utils/calculations';

const GradeForm = ({ student, onSave, readOnly = false }) => {
  const [formData, setFormData] = useState({
    portfolio: '',
    activities: '',
    exam: '',
  });
  const [calculatedGrade, setCalculatedGrade] = useState(null);
  const [saved, setSaved] = useState(false);

  // Load existing grades if available
  useEffect(() => {
    if (student) {
      const existingGrade = getStudentGrade(student.id);
      if (existingGrade) {
        setFormData({
          portfolio: existingGrade.portfolio !== null ? existingGrade.portfolio : '',
          activities: existingGrade.activities !== null ? existingGrade.activities : '',
          exam: existingGrade.exam !== null ? existingGrade.exam : '',
        });
        setCalculatedGrade(existingGrade.finalGrade);
      } else {
        setFormData({
          portfolio: '',
          activities: '',
          exam: '',
        });
        setCalculatedGrade(null);
      }
    }
  }, [student]);

  // Calculate final grade whenever input values change
  useEffect(() => {
    if (formData.portfolio !== '' || formData.activities !== '' || formData.exam !== '') {
      const finalGrade = calculateFinalGrade(
        formData.portfolio,
        formData.activities,
        formData.exam
      );
      setCalculatedGrade(finalGrade);
    } else {
      setCalculatedGrade(null);
    }
  }, [formData.portfolio, formData.activities, formData.exam]);

  const handleChange = (e) => {
    if (readOnly) return;

    const { name, value } = e.target;
    // Only allow numbers from 0 to 10 with up to 1 decimal place
    const validValue = value === '' ? '' : Math.max(0, Math.min(10, parseFloat(value) || 0));
    
    setFormData(prev => ({
      ...prev,
      [name]: validValue
    }));
    
    setSaved(false);
  };

  const handleSave = () => {
    if (readOnly) return;
    
    const gradeData = {
      studentId: student.id,
      portfolio: formData.portfolio !== '' ? parseFloat(formData.portfolio) : null,
      activities: formData.activities !== '' ? parseFloat(formData.activities) : null,
      exam: formData.exam !== '' ? parseFloat(formData.exam) : null,
      finalGrade: calculatedGrade
    };

    saveGrade(gradeData);
    onSave && onSave(gradeData);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  if (!student) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">
        {readOnly 
          ? `Notas de ${student.name}`
          : `Inserir Notas - ${student.name}`}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Portfólio (20%)
            </label>
            <input
              type="number"
              name="portfolio"
              min="0"
              max="10"
              step="0.1"
              value={formData.portfolio}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                ${readOnly ? 'opacity-80 cursor-not-allowed' : ''}`}
              placeholder="0-10"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Atividades do Portal (30%)
            </label>
            <input
              type="number"
              name="activities"
              min="0"
              max="10"
              step="0.1"
              value={formData.activities}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                ${readOnly ? 'opacity-80 cursor-not-allowed' : ''}`}
              placeholder="0-10"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prova (50%)
            </label>
            <input
              type="number"
              name="exam"
              min="0"
              max="10"
              step="0.1"
              value={formData.exam}
              onChange={handleChange}
              readOnly={readOnly}
              className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                ${readOnly ? 'opacity-80 cursor-not-allowed' : ''}`}
              placeholder="0-10"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
          <div className="text-center">
            <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Nota Final</h4>
            <div className={`text-3xl font-bold ${
              calculatedGrade === null ? 'text-gray-500' : 
              calculatedGrade >= 6 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {calculatedGrade !== null ? calculatedGrade.toFixed(1) : '-'}
            </div>
            {calculatedGrade !== null && (
              <div className={`mt-2 text-sm font-medium ${
                calculatedGrade >= 6 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {calculatedGrade >= 6 ? 'Aprovado' : 'Reprovado'}
              </div>
            )}
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {saved ? '✓ Salvo!' : 'Salvar Notas'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GradeForm;