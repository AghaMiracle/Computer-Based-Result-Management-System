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

// Dashboard stats
export const useDashboardStats = () => useApiQuery('dashboard', '/api/admin/dashboard');

// Institutions
export const useInstitutions = (params = '') => useApiQuery(['institutions', params], `/api/admin/institutions?${params}`);

// Users
export const useUsers = (params = '') => useApiQuery(['users', params], `/api/admin/users?${params}`);

// Audit Logs
export const useAuditLogs = (params = '') => useApiQuery(['audit-logs', params], `/api/admin/audit-logs?${params}`);

// Update institution status
export const useUpdateInstitutionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axios.put(`/api/admin/institutions/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institutions'] })
  });
};

// Delete institution
export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/admin/institutions/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institutions'] })
  });
};

export default {
  useApiQuery,
  useApiMutation,
  useDashboardStats,
  useInstitutions,
  useUsers,
  useAuditLogs,
  useUpdateInstitutionStatus,
  useDeleteInstitution
};
