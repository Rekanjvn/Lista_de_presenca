// Initialize and manage LocalStorage for the application

// Student example structure
/*
{
  id: string,
  name: string,
  registration: string,
  email: string,
  createdAt: Date ISO string,
}
*/

// Attendance example structure
/*
{
  date: Date ISO string,
  students: [
    {
      id: string (studentId),
      present: boolean,
    }
  ]
}
*/

// Grades example structure
/*
{
  studentId: string,
  portfolio: number (0-10),
  activities: number (0-10),
  exam: number (0-10),
  finalGrade: number (calculated),
  updatedAt: Date ISO string,
}
*/

const STORAGE_KEYS = {
  STUDENTS: 'classroom_students',
  ATTENDANCE: 'classroom_attendance',
  GRADES: 'classroom_grades',
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.GRADES)) {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify([]));
  }
};

// Student CRUD operations
export const getStudents = () => {
  const students = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return students ? JSON.parse(students) : [];
};

export const addStudent = (student) => {
  const students = getStudents();
  const newStudent = {
    ...student,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return newStudent;
};

export const updateStudent = (updatedStudent) => {
  const students = getStudents();
  const index = students.findIndex(student => student.id === updatedStudent.id);
  
  if (index !== -1) {
    students[index] = {
      ...students[index],
      ...updatedStudent,
    };
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return students[index];
  }
  return null;
};

export const removeStudent = (studentId) => {
  const students = getStudents();
  const filteredStudents = students.filter(student => student.id !== studentId);
  
  // Also remove student from attendance and grades
  const attendance = getAttendance();
  attendance.forEach(day => {
    day.students = day.students.filter(s => s.id !== studentId);
  });
  
  const grades = getGrades();
  const filteredGrades = grades.filter(grade => grade.studentId !== studentId);
  
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filteredStudents));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(filteredGrades));
  
  return true;
};

// Attendance operations
export const getAttendance = () => {
  const attendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return attendance ? JSON.parse(attendance) : [];
};

export const getAttendanceByDate = (date) => {
  const attendance = getAttendance();
  return attendance.find(day => day.date.split('T')[0] === date.split('T')[0]);
};

export const saveAttendance = (attendanceData) => {
  const attendance = getAttendance();
  const existingIndex = attendance.findIndex(
    day => day.date.split('T')[0] === attendanceData.date.split('T')[0]
  );
  
  if (existingIndex !== -1) {
    attendance[existingIndex] = attendanceData;
  } else {
    attendance.push(attendanceData);
  }
  
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  return attendanceData;
};

// Grades operations
export const getGrades = () => {
  const grades = localStorage.getItem(STORAGE_KEYS.GRADES);
  return grades ? JSON.parse(grades) : [];
};

export const getStudentGrade = (studentId) => {
  const grades = getGrades();
  return grades.find(grade => grade.studentId === studentId) || null;
};

export const saveGrade = (gradeData) => {
  const grades = getGrades();
  const existingIndex = grades.findIndex(grade => grade.studentId === gradeData.studentId);
  
  if (existingIndex !== -1) {
    grades[existingIndex] = {
      ...grades[existingIndex],
      ...gradeData,
      updatedAt: new Date().toISOString()
    };
  } else {
    grades.push({
      ...gradeData,
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  return gradeData;
};

// Attendance statistics
export const calculateStudentAttendance = (studentId) => {
  const attendance = getAttendance();
  
  if (attendance.length === 0) {
    return 100; // No classes recorded yet
  }
  
  let totalDays = 0;
  let presentDays = 0;
  
  attendance.forEach(day => {
    const studentAttendance = day.students.find(s => s.id === studentId);
    if (studentAttendance) {
      totalDays++;
      if (studentAttendance.present) {
        presentDays++;
      }
    }
  });
  
  if (totalDays === 0) {
    return 100; // Student not yet registered for any classes
  }
  
  return (presentDays / totalDays) * 100;
};