import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Resources from './pages/Resources'
import Bookings from './pages/Bookings'
import StudentDashboard from './pages/StudentDashboard'
import StudentResources from './pages/StudentResources'
import StudentBookings from './pages/StudentBookings'
import StaffDashboard from './pages/StaffDashboard'
import StaffBookings from './pages/StaffBookings'
import StaffApprovals from './pages/StaffApprovals'
import StaffResources from './pages/StaffResources'
import './App.css'

function AppRoutes() {
    const { auth } = useAuth()

    const getDefaultRedirect = () => {
        if (!auth) return '/login'
        return `/${auth.role.toLowerCase()}/dashboard`
    }

    return (
        <Layout>
            <Routes>
                <Route path="/login" element={auth ? <Navigate to={getDefaultRedirect()} replace /> : <Login />} />
                <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>} />
                <Route path="/admin/resources" element={<ProtectedRoute allowedRoles={['ADMIN']}><Resources /></ProtectedRoute>} />
                <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><Bookings /></ProtectedRoute>} />

                {/* Student Routes */}
                <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/resources" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentResources /></ProtectedRoute>} />
                <Route path="/student/bookings" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentBookings /></ProtectedRoute>} />

                {/* Staff Routes */}
                <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffDashboard /></ProtectedRoute>} />
                <Route path="/staff/resources" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffResources /></ProtectedRoute>} />
                <Route path="/staff/bookings" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffBookings /></ProtectedRoute>} />
                <Route path="/staff/approvals" element={<ProtectedRoute allowedRoles={['STAFF']}><StaffApprovals /></ProtectedRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
            </Routes>
        </Layout>
    )
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    )
}

export default App
