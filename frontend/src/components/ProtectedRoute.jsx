import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRoles, children }) {
    const { auth } = useAuth()

    if (!auth) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        // Redirect to their own dashboard
        const roleHome = `/${auth.role.toLowerCase()}/dashboard`
        return <Navigate to={roleHome} replace />
    }

    return children
}
