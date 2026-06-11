/**
 * Calculate semester GPA
 * @param {Array} results - Array of result objects with gradePoint and course.creditUnits
 * @returns {number} GPA rounded to 2 decimal places
 */
export const calculateSemesterGPA = (results) => {
  if (!results || results.length === 0) return 0;

  let totalQualityPoints = 0;
  let totalCreditUnits = 0;

  results.forEach(result => {
    const creditUnits = result.courseId?.creditUnits || result.creditUnits || 0;
    const gradePoint = result.gradePoint || 0;
    
    totalQualityPoints += gradePoint * creditUnits;
    totalCreditUnits += creditUnits;
  });

  if (totalCreditUnits === 0) return 0;
  return Math.round((totalQualityPoints / totalCreditUnits) * 100) / 100;
};

/**
 * Calculate cumulative GPA (CGPA) across all semesters
 * @param {Array} allResults - All results across all semesters
 * @returns {Object} { cgpa, totalCreditUnits, classification }
 */
export const calculateCGPA = (allResults) => {
  if (!allResults || allResults.length === 0) {
    return { cgpa: 0, totalCreditUnits: 0, classification: 'N/A' };
  }

  let totalQualityPoints = 0;
  let totalCreditUnits = 0;

  allResults.forEach(result => {
    const creditUnits = result.courseId?.creditUnits || result.creditUnits || 0;
    const gradePoint = result.gradePoint || 0;
    totalQualityPoints += gradePoint * creditUnits;
    totalCreditUnits += creditUnits;
  });

  const cgpa = totalCreditUnits > 0
    ? Math.round((totalQualityPoints / totalCreditUnits) * 100) / 100
    : 0;

  return { cgpa, totalCreditUnits, classification: getClassification(cgpa) };
};

/**
 * Get grade classification based on CGPA
 * @param {number} cgpa 
 * @returns {string} Classification
 */
export const getClassification = (cgpa) => {
  if (cgpa >= 4.5) return 'First Class';
  if (cgpa >= 3.5) return 'Second Class Upper';
  if (cgpa >= 2.5) return 'Second Class Lower';
  if (cgpa >= 1.5) return 'Third Class';
  if (cgpa >= 1.0) return 'Pass';
  return 'Fail';
};
