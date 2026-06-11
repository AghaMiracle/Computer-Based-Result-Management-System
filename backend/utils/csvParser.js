/**
 * CSV Parser Utility
 * Parse CSV/Excel files for bulk student/teacher registration and result upload
 */

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV text
 * @param {string[]} requiredFields - Required column headers
 * @returns {{ data: object[], errors: string[] }}
 */
export const parseCSV = (csvText, requiredFields = []) => {
  const lines = csvText.trim().split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return { data: [], errors: ['CSV must have a header row and at least one data row'] };
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'));
  const errors = [];
  const data = [];

  // Validate required fields
  for (const field of requiredFields) {
    if (!headers.includes(field.toLowerCase())) {
      errors.push(`Missing required column: "${field}"`);
    }
  }
  if (errors.length > 0) return { data, errors };

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
      continue;
    }

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx]?.trim() || '';
    });

    // Validate row is not completely empty
    const hasData = Object.values(row).some(v => v !== '');
    if (hasData) {
      row._rowNumber = i + 1;
      data.push(row);
    }
  }

  return { data, errors };
};

/**
 * Parse a single CSV line handling quoted values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

/**
 * Validate student rows
 */
export const validateStudentRows = (rows) => {
  const errors = [];
  const validRows = [];

  rows.forEach((row) => {
    const rowErrors = [];
    if (!row.first_name) rowErrors.push('first_name is required');
    if (!row.last_name) rowErrors.push('last_name is required');
    if (!row.email) rowErrors.push('email is required');
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      rowErrors.push('invalid email format');
    }

    if (rowErrors.length > 0) {
      errors.push(`Row ${row._rowNumber}: ${rowErrors.join(', ')}`);
    } else {
      validRows.push(row);
    }
  });

  return { validRows, errors };
};

/**
 * Validate result rows
 */
export const validateResultRows = (rows) => {
  const errors = [];
  const validRows = [];

  rows.forEach((row) => {
    const rowErrors = [];
    if (!row.student_id && !row.matric_number) rowErrors.push('student_id or matric_number is required');
    
    const ca = parseFloat(row.ca_score);
    const exam = parseFloat(row.exam_score);
    if (isNaN(ca) || ca < 0) rowErrors.push('invalid ca_score');
    if (isNaN(exam) || exam < 0) rowErrors.push('invalid exam_score');

    if (rowErrors.length > 0) {
      errors.push(`Row ${row._rowNumber}: ${rowErrors.join(', ')}`);
    } else {
      validRows.push({ ...row, ca_score: ca, exam_score: exam });
    }
  });

  return { validRows, errors };
};
