import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// ===== Users =====
export const getUsers = (status) =>
    api.get('/api/users', { params: status ? { status } : {} }).then(r => r.data);

export const getUserById = (id) =>
    api.get(`/api/users/${id}`).then(r => r.data);

export const createUser = (data) =>
    api.post('/api/users', data).then(r => r.data);

export const updateUser = (id, data) =>
    api.put(`/api/users/${id}`, data).then(r => r.data);

export const deleteUser = (id) =>
    api.delete(`/api/users/${id}`);

// ===== Resources =====
export const getResources = () =>
    api.get('/api/resources').then(r => r.data);

export const createResource = (data) =>
    api.post('/api/resources', data).then(r => r.data);

export const updateResource = (id, data) =>
    api.put(`/api/resources/${id}`, data).then(r => r.data);

export const deleteResource = (id) =>
    api.delete(`/api/resources/${id}`);

// ===== Bookings =====
export const getBookings = (userId) =>
    api.get('/api/bookings', { params: userId ? { userId } : {} }).then(r => r.data);

export const createBooking = (data) =>
    api.post('/api/bookings', data).then(r => r.data);

export const updateBookingStatus = (id, status) =>
    api.put(`/api/bookings/${id}/status`, { status }).then(r => r.data);

// ===== Dashboard =====
export const getDashboardStats = () =>
    api.get('/api/dashboard').then(r => r.data);

export default api;
