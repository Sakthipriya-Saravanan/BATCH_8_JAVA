import { useState, useEffect } from 'react'
import { getBookings, updateBookingStatus } from '../api/api'
import { toast } from 'react-toastify'

export default function StaffApprovals() {
    const [bookings, setBookings] = useState([])

    useEffect(() => { loadBookings() }, [])

    const loadBookings = async () => {
        try {
            // Get all bookings (staff can see all for approval purposes)
            const data = await getBookings()
            setBookings(data)
        } catch { /* */ }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateBookingStatus(id, status)
            toast.success(`Booking ${status.toLowerCase()} successfully`)
            loadBookings()
        } catch {
            toast.error('Failed to update booking status')
        }
    }

    const statusBadge = (status) => {
        const cls = status === 'APPROVED' ? 'badge-approved' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
        return <span className={`status-badge ${cls}`}>{status}</span>
    }

    const pendingBookings = bookings.filter(b => b.status === 'PENDING')
    const processedBookings = bookings.filter(b => b.status !== 'PENDING')

    return (
        <>
            {/* Pending Approvals */}
            <div className="data-table-wrapper mb-4">
                <div className="data-table-header">
                    <span className="data-table-title">Pending Approvals ({pendingBookings.length})</span>
                </div>
                <div className="table-responsive desktop-table">
                    <table className="data-table">
                        <thead><tr><th>User</th><th>Resource</th><th>Date</th><th>Time</th><th>Actions</th></tr></thead>
                        <tbody>
                            {pendingBookings.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No pending approvals</td></tr>
                            ) : pendingBookings.map(b => (
                                <tr key={b.id}>
                                    <td>
                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{b.userName}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                                    </td>
                                    <td>{b.resourceName}</td>
                                    <td>{b.bookingDate}</td>
                                    <td>{b.timeSlot}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn-success-sm" onClick={() => handleStatusChange(b.id, 'APPROVED')}>Approve</button>
                                            <button className="btn-danger-sm" onClick={() => handleStatusChange(b.id, 'REJECTED')}>Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mobile-card">
                    {pendingBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No pending approvals</p>
                    ) : pendingBookings.map(b => (
                        <div className="mobile-card-item" key={b.id}>
                            <div className="mobile-card-row"><span className="mobile-card-label">User</span><span className="mobile-card-value">{b.userName}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Resource</span><span className="mobile-card-value">{b.resourceName}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Date</span><span className="mobile-card-value">{b.bookingDate}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Time</span><span className="mobile-card-value">{b.timeSlot}</span></div>
                            <div className="mobile-card-actions">
                                <button className="btn-success-sm" style={{ flex: 1 }} onClick={() => handleStatusChange(b.id, 'APPROVED')}>Approve</button>
                                <button className="btn-danger-sm" style={{ flex: 1 }} onClick={() => handleStatusChange(b.id, 'REJECTED')}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Processed Bookings */}
            <div className="data-table-wrapper">
                <div className="data-table-header">
                    <span className="data-table-title">Processed ({processedBookings.length})</span>
                </div>
                <div className="table-responsive desktop-table">
                    <table className="data-table">
                        <thead><tr><th>User</th><th>Resource</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                        <tbody>
                            {processedBookings.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No processed bookings</td></tr>
                            ) : processedBookings.map(b => (
                                <tr key={b.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{b.userName}</td>
                                    <td>{b.resourceName}</td>
                                    <td>{b.bookingDate}</td>
                                    <td>{b.timeSlot}</td>
                                    <td>{statusBadge(b.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mobile-card">
                    {processedBookings.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No processed bookings</p>
                    ) : processedBookings.map(b => (
                        <div className="mobile-card-item" key={b.id}>
                            <div className="mobile-card-row"><span className="mobile-card-label">User</span><span className="mobile-card-value">{b.userName}</span></div>
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
