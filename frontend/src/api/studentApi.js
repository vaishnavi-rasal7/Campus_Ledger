// ==============================================================
// Campus Ledger - Centralized API Service Layer
// ==============================================================

const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
// Automatically trim trailing slash to prevent double slashes (e.g. //api/students)
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

class ApiError extends Error {
  constructor(message, status = null, validationErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Accept': 'application/json',
  };

  if (options.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // 204 No Content has no body
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message = (isJson && (data.message || data.error)) 
        ? (data.message || data.error) 
        : `Request failed with status ${response.status}`;
      const validationErrors = (isJson && data.validationErrors) ? data.validationErrors : null;
      throw new ApiError(message, response.status, validationErrors);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network failure, offline backend or CORS rejection
    throw new ApiError(
      'Unable to connect to the backend server. Please verify Spring Boot is running on port 8080.',
      0
    );
  }
}

export const studentApi = {
  // Get all students
  getAllStudents: () => request('/api/students'),

  // Get single student by ID
  getStudentById: (id) => request(`/api/students/${id}`),

  // Create new student
  createStudent: (studentData) =>
    request('/api/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  // Update existing student
  updateStudent: (id, studentData) =>
    request(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),

  // Delete student
  deleteStudent: (id) =>
    request(`/api/students/${id}`, {
      method: 'DELETE',
    }),

  // Get department statistics / summaries
  getDepartmentSummaries: () => request('/api/departments'),

  // Get health status
  getHealth: () => request('/api/health'),

  // Base URL getter
  getBaseUrl: () => API_BASE_URL,
};
