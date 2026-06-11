import crypto from 'crypto';

/**
 * Generate a secure random password
 * Format: Xxxx@1234 (Capital letter + lowercase + special char + numbers)
 */
export const generatePassword = (length = 10) => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@#$!';
  
  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  const allChars = upper + lower + numbers;
  for (let i = 2; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Generate a unique matric number
 * Format: INST/YEAR/DEPT/NUMBER
 */
export const generateMatricNumber = (institutionCode, departmentCode, year, sequence) => {
  const paddedSeq = String(sequence).padStart(4, '0');
  return `${institutionCode}/${year}/${departmentCode}/${paddedSeq}`;
};

/**
 * Generate a unique student ID
 */
export const generateStudentId = () => {
  return `STD${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};
