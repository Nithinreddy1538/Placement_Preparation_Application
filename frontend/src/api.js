const API_BASE = (typeof window !== 'undefined' && window.location)
  ? (window.location.port === '5173' ? '/api' : `http://${window.location.hostname || '127.0.0.1'}:8000/api`)
  : 'http://127.0.0.1:8000/api';

/**
 * Helper to handle fetch responses and errors
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data === 'object') {
        errorMsg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v)}`)
          .join('\n');
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // COURSES
  getCourses: async () => {
    const res = await fetch(`${API_BASE}/courses/`);
    return handleResponse(res);
  },

  getCourse: async (id) => {
    const res = await fetch(`${API_BASE}/courses/${id}/`);
    return handleResponse(res);
  },

  createCourse: async (courseData) => {
    const res = await fetch(`${API_BASE}/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    return handleResponse(res);
  },

  updateCourse: async (id, courseData) => {
    const res = await fetch(`${API_BASE}/courses/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    return handleResponse(res);
  },

  deleteCourse: async (id) => {
    const res = await fetch(`${API_BASE}/courses/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  getStats: async () => {
    const res = await fetch(`${API_BASE}/courses/stats/`);
    return handleResponse(res);
  },

  // TOPICS
  getTopics: async (courseId = null) => {
    const url = courseId ? `${API_BASE}/topics/?course=${courseId}` : `${API_BASE}/topics/`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  createTopic: async (topicData) => {
    const res = await fetch(`${API_BASE}/topics/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });
    return handleResponse(res);
  },

  updateTopic: async (id, topicData) => {
    const res = await fetch(`${API_BASE}/topics/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });
    return handleResponse(res);
  },

  deleteTopic: async (id) => {
    const res = await fetch(`${API_BASE}/topics/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // QUESTIONS / QUIZ
  getQuestions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.course && filters.course !== 'All') {
      params.append('course', filters.course);
    }
    if (filters.topic && filters.topic !== 'All') {
      params.append('topic', filters.topic);
    }
    if (filters.difficulty && filters.difficulty !== 'All') {
      params.append('difficulty', filters.difficulty);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const qs = params.toString();
    const url = `${API_BASE}/questions/${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  getQuestion: async (id) => {
    const res = await fetch(`${API_BASE}/questions/${id}/`);
    return handleResponse(res);
  },

  createQuestion: async (questionData) => {
    const res = await fetch(`${API_BASE}/questions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
    });
    return handleResponse(res);
  },

  updateQuestion: async (id, questionData) => {
    const res = await fetch(`${API_BASE}/questions/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questionData),
    });
    return handleResponse(res);
  },

  deleteQuestion: async (id) => {
    const res = await fetch(`${API_BASE}/questions/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // STUDY MATERIALS & NOTES
  getMaterials: async (filters = {}) => {
    const params = new URLSearchParams();
    if (typeof filters === 'string' || typeof filters === 'number') {
      params.append('course', filters);
    } else {
      if (filters.course && filters.course !== 'All') params.append('course', filters.course);
      if (filters.topic && filters.topic !== 'All') params.append('topic', filters.topic);
      if (filters.search) params.append('search', filters.search);
    }
    const qs = params.toString();
    const url = `${API_BASE}/materials/${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  uploadMaterial: async (data) => {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_BASE}/materials/`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateMaterial: async (id, data) => {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_BASE}/materials/${id}/`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteMaterial: async (id) => {
    const res = await fetch(`${API_BASE}/materials/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  getMaterialPdfUrl: (id) => {
    return `${API_BASE}/materials/${id}/export_pdf/`;
  },

  // TEST RESULTS
  submitTestResult: async (resultData) => {
    const res = await fetch(`${API_BASE}/test-results/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultData),
    });
    return handleResponse(res);
  },

  getTestResults: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.course) params.append('course', filters.course);
    if (filters.topic) params.append('topic', filters.topic);
    const qs = params.toString();
    const url = `${API_BASE}/test-results/${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  getTestResult: async (id) => {
    const res = await fetch(`${API_BASE}/test-results/${id}/`);
    return handleResponse(res);
  },

  // SUPER ADMIN AUTHENTICATION
  loginSuperAdmin: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  logoutSuperAdmin: async () => {
    const res = await fetch(`${API_BASE}/auth/logout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  checkAdminStatus: async () => {
    const res = await fetch(`${API_BASE}/auth/status/`);
    return handleResponse(res);
  },
};

export default api;
