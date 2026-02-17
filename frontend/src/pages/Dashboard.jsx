import { useState, useEffect } from 'react'
import { getDashboardStats } from '../api/api'

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalResources: 0,
        totalBookings: 0,
        pendingBookings: 0,
        recentBookings: [],
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const data = await getDashboardStats()
            setStats(data)
        } catch {
            // API not available yet — show zeros
        } finally {
            setLoading(false)
        }
    }

    const cards = [
        { label: 'Total Users', value: stats.totalUsers, variant: 'card-primary', icon: '👥' },
        { label: 'Total Resources', value: stats.totalResources, variant: 'card-secondary', icon: '🏢' },
        { label: 'Total Bookings', value: stats.totalBookings, variant: 'card-success', icon: '📅' },
        { label: 'Pending Bookings', value: stats.pendingBookings, variant: 'card-accent', icon: '⏳' },
    ]

    const statusBadge = (status) => {
        const cls = status === 'APPROVED' ? 'badge-approved' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
        return <span className={`status-badge ${cls}`}>{status}</span>
    }

    return (
        <>
            {/* Stat Cards */}
            <div className="row g-3 mb-4">
                {cards.map((c, i) => (
                    <div className="col-6 col-lg-3" key={i}>
                        <div className={`stat-card ${c.variant}`}>
                            <div className="stat-card-icon">{c.icon}</div>
                            <div className="stat-card-value">{loading ? '—' : c.value}</div>
                            <div className="stat-card-label">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="data-table-wrapper">
                <div className="data-table-header">
                    <span className="data-table-title">Recent Bookings</span>
                </div>

                {/* Desktop Table */}
                <div className="table-responsive desktop-table">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Resource</th>
                                <th>Date</th>
                                <th>Time Slot</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentBookings.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No bookings yet</td></tr>
                            ) : (
                                stats.recentBookings.map(b => (
                                    <tr key={b.id}>
                                        <td>#{b.id}</td>
                                        <td>{b.userName}</td>
                                        <td>{b.resourceName}</td>
                                        <td>{b.bookingDate}</td>
                                        <td>{b.timeSlot}</td>
                                        <td>{statusBadge(b.status)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-card">
                    {stats.recentBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No bookings yet</p>
                    ) : (
                        stats.recentBookings.map(b => (
                            <div className="mobile-card-item" key={b.id}>
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">User</span>
                                    <span className="mobile-card-value">{b.userName}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">Resource</span>
                                    <span className="mobile-card-value">{b.resourceName}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">Date</span>
                                    <span className="mobile-card-value">{b.bookingDate}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">Status</span>
                                    <span className="mobile-card-value">{statusBadge(b.status)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}
