import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookings, getResources } from '../api/api'

export default function StaffDashboard() {
    const { auth } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({ myBookings: 0, pending: 0, resources: 0 })
    const [recentBookings, setRecentBookings] = useState([])

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        try {
            const [bookings, resources] = await Promise.all([
                getBookings(auth.userId),
                getResources(),
            ])
            setStats({
                myBookings: bookings.length,
                pending: bookings.filter(b => b.status === 'PENDING').length,
                resources: resources.length,
            })
            setRecentBookings(bookings.slice(-5).reverse())
        } catch { /* */ }
    }

    const statusBadge = (status) => {
        const cls = status === 'APPROVED' ? 'badge-approved' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
        return <span className={`status-badge ${cls}`}>{status}</span>
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h5 style={{ fontWeight: 700, margin: 0 }}>Welcome, {auth.name} 👋</h5>
                <button className="btn btn-primary-custom" onClick={() => navigate('/staff/bookings')}>+ New Booking</button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-6 col-lg-4">
                    <div className="stat-card card-primary">
                        <div className="stat-card-icon">📅</div>
                        <div className="stat-card-value">{stats.myBookings}</div>
                        <div className="stat-card-label">My Bookings</div>
                    </div>
                </div>
                <div className="col-6 col-lg-4">
                    <div className="stat-card card-accent">
                        <div className="stat-card-icon">⏳</div>
                        <div className="stat-card-value">{stats.pending}</div>
                        <div className="stat-card-label">Pending</div>
                    </div>
                </div>
                <div className="col-6 col-lg-4">
                    <div className="stat-card card-secondary">
                        <div className="stat-card-icon">🏢</div>
                        <div className="stat-card-value">{stats.resources}</div>
                        <div className="stat-card-label">Resources</div>
                    </div>
                </div>
            </div>

            <div className="data-table-wrapper">
                <div className="data-table-header">
                    <span className="data-table-title">Recent Bookings</span>
                </div>
                <div className="table-responsive desktop-table">
                    <table className="data-table">
                        <thead><tr><th>Resource</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                        <tbody>
                            {recentBookings.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No bookings yet</td></tr>
                            ) : recentBookings.map(b => (
                                <tr key={b.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{b.resourceName}</td>
                                    <td>{b.bookingDate}</td>
                                    <td>{b.timeSlot}</td>
                                    <td>{statusBadge(b.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mobile-card">
                    {recentBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No bookings yet</p>
                    ) : recentBookings.map(b => (
                        <div className="mobile-card-item" key={b.id}>
                            <div className="mobile-card-row"><span className="mobile-card-label">Resource</span><span className="mobile-card-value">{b.resourceName}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Date</span><span className="mobile-card-value">{b.bookingDate}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Status</span><span className="mobile-card-value">{statusBadge(b.status)}</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
