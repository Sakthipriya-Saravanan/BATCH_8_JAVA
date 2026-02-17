import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('STUDENT')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error('Please enter your email')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role }),
            })
            if (res.ok) {
                const data = await res.json()
                login(data)
                toast.success(`Welcome, ${data.name}!`)
                navigate(`/${data.role.toLowerCase()}/dashboard`)
            } else {
                // Demo fallback — just login directly
                const demoUser = {
                    userId: Date.now(),
                    name: email.split('@')[0] || 'User',
                    email,
                    role,
                }
                login(demoUser)
                toast.success(`Welcome, ${demoUser.name}! (Demo mode)`)
                navigate(`/${role.toLowerCase()}/dashboard`)
            }
        } catch {
            // Backend not available — demo login
            const demoUser = {
                userId: Date.now(),
                name: email.split('@')[0] || 'User',
                email,
                role,
            }
            login(demoUser)
            toast.success(`Welcome, ${demoUser.name}! (Demo mode)`)
            navigate(`/${role.toLowerCase()}/dashboard`)
        } finally {
            setLoading(false)
        }
    }

    const roles = [
        { value: 'STUDENT', label: 'Student', icon: '🎓', desc: 'Book resources & view schedule' },
        { value: 'STAFF', label: 'Staff / Teacher', icon: '👨‍🏫', desc: 'Manage bookings & approvals' },
        { value: 'ADMIN', label: 'Admin', icon: '🛡️', desc: 'Full system management' },
    ]

    return (
        <div className="login-page">
            {/* Background decoration */}
            <div className="login-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Navbar */}
            <nav className="login-navbar">
                <div className="login-brand">
                    <span className="login-brand-icon">C</span>
                    <div>
                        <div className="login-brand-title">Campus Resource Manager</div>
                        <div className="login-brand-sub">2026 Batch Challenge</div>
                    </div>
                </div>
            </nav>

            {/* Hero + Login Card */}
            <div className="login-container">
                <div className="login-hero">
                    <h1 className="login-hero-title">
                        Smart Campus<br />
                        <span className="gradient-text">Resource Management</span>
                    </h1>
                    <p className="login-hero-desc">
                        Efficiently manage classrooms, labs, and event halls. Book resources,
                        track availability, and streamline campus operations.
                    </p>
                </div>

                <div className="login-card">
                    <div className="login-card-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to continue to your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Role Selection Cards */}
                        <div className="role-selector">
                            <label className="role-label">Select Your Role</label>
                            <div className="role-cards">
                                {roles.map(r => (
                                    <div
                                        key={r.value}
                                        className={`role-card ${role === r.value ? 'active' : ''}`}
                                        onClick={() => setRole(r.value)}
                                    >
                                        <span className="role-card-icon">{r.icon}</span>
                                        <span className="role-card-label">{r.label}</span>
                                        <span className="role-card-desc">{r.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="you@campus.edu"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                                Demo mode — any password works
                            </small>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" />
                            ) : null}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
