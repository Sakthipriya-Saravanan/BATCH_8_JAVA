import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuConfig = {
    ADMIN: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/resources', label: 'Resources', icon: '🏢' },
        { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    ],
    STUDENT: [
        { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/student/resources', label: 'Resources', icon: '🏢' },
        { path: '/student/bookings', label: 'My Bookings', icon: '📅' },
    ],
    STAFF: [
        { path: '/staff/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/staff/resources', label: 'Resources', icon: '🏢' },
        { path: '/staff/bookings', label: 'My Bookings', icon: '📅' },
        { path: '/staff/approvals', label: 'Approvals', icon: '✅' },
    ],
}

const roleBadgeColors = {
    ADMIN: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
    STAFF: { bg: 'rgba(14,165,233,0.15)', color: '#0ea5e9' },
    STUDENT: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
}

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { auth, logout } = useAuth()
    const navigate = useNavigate()

    if (!auth) return children

    const navItems = menuConfig[auth.role] || menuConfig.STUDENT
    const badgeStyle = roleBadgeColors[auth.role] || roleBadgeColors.STUDENT

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            {sidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">C</div>
                    <div className="sidebar-brand-text">
                        CampusRM
                        <small>Resource Management</small>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="sidebar-label">Menu</div>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
                    <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
                        <span className="sidebar-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <header className="top-navbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="navbar-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        ☰
                    </button>
                    <span className="navbar-title">Campus Resource Manager</span>
                </div>
                <div className="navbar-actions">
                    <span
                        style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: badgeStyle.bg,
                            color: badgeStyle.color,
                        }}
                    >
                        {auth.role}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                        {auth.name}
                    </span>
                </div>
            </header>

            <main className="main-content">
                <div className="page-content">
                    {children}
                </div>
            </main>
        </>
    )
}
