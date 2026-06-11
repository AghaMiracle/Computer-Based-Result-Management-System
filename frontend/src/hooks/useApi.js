import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';

// Generic fetch hook
export const useApiQuery = (key, url, options = {}) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
    ...options
  });
};

// Generic mutation hook
export const useApiMutation = (url, method = 'post', options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios[method](url, data);
      return response.data;
    },
    onSuccess: () => {
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
      }
    },
    ...options
  });
};

// ========== Institution API Hooks ==========
export const useInstitutionDashboard = () => useApiQuery('inst-dashboard', '/api/institution/dashboard');
export const useStudents = (params = '') => useApiQuery(['students', params], `/api/institution/students?${params}`);
export const useTeachers = (params = '') => useApiQuery(['teachers', params], `/api/institution/teachers?${params}`);
export const useDepartments = () => useApiQuery('departments', '/api/institution/departments');
export const useCourses = (params = '') => useApiQuery(['courses', params], `/api/institution/courses?${params}`);
export const useSessions = () => useApiQuery('sessions', '/api/institution/sessions');
export const useGradingScales = () => useApiQuery('grading-scales', '/api/institution/grading-scales');
export const usePendingResults = () => useApiQuery('pending-results', '/api/institution/results?status=submitted');

// ========== Teacher API Hooks ==========
export const useTeacherDashboard = () => useApiQuery('teacher-dashboard', '/api/teacher/dashboard');
export const useMyCourses = () => useApiQuery('my-courses', '/api/teacher/courses');
export const useCourseResults = (courseId) => useApiQuery(['course-results', courseId], `/api/teacher/results/${courseId}`, { enabled: !!courseId });
export const useCourseAnalytics = (courseId) => useApiQuery(['course-analytics', courseId], `/api/teacher/analytics/${courseId}`, { enabled: !!courseId });

// ========== Student API Hooks ==========
export const useStudentDashboard = () => useApiQuery('student-dashboard', '/api/student/dashboard');
export const useMyResults = (params = '') => useApiQuery(['my-results', params], `/api/student/results?${params}`);
export const useMyTranscript = () => useApiQuery('transcript', '/api/student/transcript');
export const useAvailableCourses = () => useApiQuery('available-courses', '/api/student/courses/available');
export const useMyNotifications = () => useApiQuery('notifications', '/api/student/notifications');
export const useMyProfile = () => useApiQuery('profile', '/api/student/profile');

export default {
  useApiQuery,
  useApiMutation,
  useInstitutionDashboard,
  useStudents,
  useTeachers,
  useDepartments,
  useCourses,
  useSessions,
  useGradingScales,
  usePendingResults,
  useTeacherDashboard,
  useMyCourses,
  useCourseResults,
  useCourseAnalytics,
  useStudentDashboard,
  useMyResults,
  useMyTranscript,
  useAvailableCourses,
  useMyNotifications,
  useMyProfile
};
