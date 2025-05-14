// Calculate grades and attendance statistics

// Calculate the final grade based on the weighted components
// Portfolio: 20%, Activities: 30%, Exam: 50%
export const calculateFinalGrade = (portfolio, activities, exam) => {
  if (portfolio === null || activities === null || exam === null) {
    return null;
  }
  
  // Ensure values are numbers
  const portfolioValue = Number(portfolio) || 0;
  const activitiesValue = Number(activities) || 0;
  const examValue = Number(exam) || 0;
  
  // Apply weights
  const finalGrade = 
    (portfolioValue * 0.2) + 
    (activitiesValue * 0.3) + 
    (examValue * 0.5);
    
  // Round to 1 decimal place
  return Math.round(finalGrade * 10) / 10;
};

// Format percentage for display
export const formatPercentage = (value) => {
  if (value === null || value === undefined) {
    return '0%';
  }
  return `${Math.round(value)}%`;
};

// Format date for display
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date for input fields
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Get today's date in ISO format
export const getTodayISO = () => {
  const today = new Date();
  return today.toISOString().split('T')[0] + 'T00:00:00.000Z';
};

// Check if student is passing (final grade >= 6)
export const isPassing = (grade) => {
  return grade >= 6.0;
};

// Calculate class average for each component
export const calculateClassAverages = (grades) => {
  if (!grades || grades.length === 0) {
    return {
      portfolio: 0,
      activities: 0,
      exam: 0,
      final: 0
    };
  }
  
  let portfolioSum = 0;
  let activitiesSum = 0;
  let examSum = 0;
  let finalSum = 0;
  let count = 0;
  
  grades.forEach(grade => {
    if (grade.portfolio !== null && grade.activities !== null && grade.exam !== null) {
      portfolioSum += Number(grade.portfolio) || 0;
      activitiesSum += Number(grade.activities) || 0;
      examSum += Number(grade.exam) || 0;
      finalSum += Number(grade.finalGrade) || 0;
      count++;
    }
  });
  
  if (count === 0) {
    return {
      portfolio: 0,
      activities: 0,
      exam: 0,
      final: 0
    };
  }
  
  return {
    portfolio: Math.round((portfolioSum / count) * 10) / 10,
    activities: Math.round((activitiesSum / count) * 10) / 10,
    exam: Math.round((examSum / count) * 10) / 10,
    final: Math.round((finalSum / count) * 10) / 10
  };
};