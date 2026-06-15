/**
 * Admin API
 *
 * Centralised module for every backend call made by the admin panel.
 * All functions return the `data` field from the API response so callers
 * never have to unwrap `res.data.data` themselves.
 *
 * The underlying axios instance (./axios.js) handles:
 *   - Attaching the Bearer token on every request
 *   - Transparent access-token refresh on 401
 *   - Redirecting to /login when the refresh token is expired
 */

import axios from './axios.js';

// ─────────────────────────────────────────────
// Auth  (/api/auth/*)
// ─────────────────────────────────────────────

export const authApi = {
  /**
   * POST /api/auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {{ user, accessToken, refreshToken }}
   */
  login: (credentials) =>
    axios.post('/api/auth/login', credentials).then((r) => r.data.data),

  /**
   * POST /api/auth/logout
   */
  logout: () =>
    axios.post('/api/auth/logout').then((r) => r.data),

  /**
   * GET /api/auth/me
   * @returns {User}
   */
  getMe: () =>
    axios.get('/api/auth/me').then((r) => r.data.data),

  /**
   * PUT /api/auth/change-password
   * @param {{ currentPassword: string, newPassword: string }} payload
   */
  changePassword: (payload) =>
    axios.put('/api/auth/change-password', payload).then((r) => r.data),
};

// ─────────────────────────────────────────────
// Admin — Dashboard  (/api/admin/*)
// ─────────────────────────────────────────────

export const adminApi = {
  /**
   * GET /api/admin/dashboard
   * @returns {{ stats, recentActivity, userDistribution, monthlyRegistrations, institutionsByType }}
   */
  getDashboard: () =>
    axios.get('/api/admin/dashboard').then((r) => r.data.data),

  // ── Institutions ──────────────────────────

  /**
   * GET /api/admin/institutions
   * @param {{ page?, limit?, status?, type?, search? }} params
   * @returns {{ data: Institution[], pagination }}
   */
  getInstitutions: (params = {}) =>
    axios.get('/api/admin/institutions', { params }).then((r) => r.data),

  /**
   * PUT /api/admin/institutions/:id/status
   * @param {string} id
   * @param {'active'|'suspended'|'rejected'} status
   * @returns {Institution}
   */
  updateInstitutionStatus: (id, status) =>
    axios.put(`/api/admin/institutions/${id}/status`, { status }).then((r) => r.data.data),

  /**
   * DELETE /api/admin/institutions/:id
   * Removes the institution and ALL related data. Irreversible — confirm with the user first.
   */
  deleteInstitution: (id) =>
    axios.delete(`/api/admin/institutions/${id}`).then((r) => r.data),

  // ── Users ─────────────────────────────────

  /**
   * GET /api/admin/users
   * @param {{ page?, limit?, role?, search?, institutionId? }} params
   * @returns {{ data: User[], pagination }}
   */
  getUsers: (params = {}) =>
    axios.get('/api/admin/users', { params }).then((r) => r.data),

  // ── Audit Logs ────────────────────────────

  /**
   * GET /api/admin/audit-logs
   * @param {{ page?, limit?, action?, userId?, startDate?, endDate? }} params
   * @returns {{ data: AuditLog[], pagination }}
   */
  getAuditLogs: (params = {}) =>
    axios.get('/api/admin/audit-logs', { params }).then((r) => r.data),

  // ── Settings ──────────────────────────────

  /**
   * PUT /api/admin/settings
   * @param {object} settings
   * @returns {object} saved settings
   */
  updateSettings: (settings) =>
    axios.put('/api/admin/settings', settings).then((r) => r.data.data),
};
