import { useState, useEffect } from 'react'
import { getBookings, createBooking, updateBookingStatus, getUsers, getResources } from '../api/api'
import { toast } from 'react-toastify'
import CustomModal from '../components/CustomModal'

const TIME_SLOTS = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00',
]

const emptyForm = { userId: '', resourceId: '', bookingDate: '', timeSlot: '' }

export default function Bookings() {
    const [bookings, setBookings] = useState([])
    const [users, setUsers] = useState([])
    const [resources, setResources] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)
    const [userSearch, setUserSearch] = useState('')
    const [resourceSearch, setResourceSearch] = useState('')

    useEffect(() => {
        loadBookings()
        loadFormData()
    }, [])

    const loadBookings = async () => {
        try {
            const data = await getBookings()
            setBookings(data)
        } catch { /* API not available */ }
    }

    const loadFormData = async () => {
        try {
            const [u, r] = await Promise.all([getUsers(), getResources()])
            setUsers(u)
            setResources(r)
        } catch { /* API not available */ }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createBooking(form)
            toast.success('Booking created successfully')
            setShowModal(false)
            setForm(emptyForm)
            loadBookings()
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error(err.response.data.message || 'Resource already booked for this date and time slot.')
            } else {
                toast.error(err.response?.data?.message || 'Failed to create booking')
            }
        } finally {
            setLoading(false)
        }
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

    const exportCSV = () => {
        const headers = ['ID', 'User', 'Email', 'Resource', 'Type', 'Date', 'Time Slot', 'Status']
        const rows = bookings.map(b => [b.id, b.userName, b.userEmail, b.resourceName, b.resourceType, b.bookingDate, b.timeSlot, b.status])
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'bookings_export.csv'
        a.click()
        URL.revokeObjectURL(url)
        toast.success('CSV exported successfully')
    }

    const statusBadge = (status) => {
        const cls = status === 'APPROVED' ? 'badge-approved' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
        return <span className={`status-badge ${cls}`}>{status}</span>
    }

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
    const filteredResources = resources.filter(r => r.name.toLowerCase().includes(resourceSearch.toLowerCase()))

    return (
        <>
            <div className="data-table-wrapper">
                <div className="data-table-header">
                    <span className="data-table-title">Bookings ({bookings.length})</span>
                    <div className="data-table-actions">
                        <button className="btn-ghost" onClick={exportCSV}>📥 Export CSV</button>
                        <button className="btn btn-primary-custom" onClick={() => { setForm(emptyForm); setShowModal(true) }}>+ New Booking</button>
                    </div>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No bookings found</td></tr>
                            ) : bookings.map(b => (
                                <tr key={b.id}>
                                    <td>#{b.id}</td>
                                    <td>
                                        <div>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{b.userName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div style={{ color: 'var(--text-primary)' }}>{b.resourceName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.resourceType}</div>
                                        </div>
                                    </td>
                                    <td>{b.bookingDate}</td>
                                    <td>{b.timeSlot}</td>
                                    <td>{statusBadge(b.status)}</td>
                                    <td>
                                        {b.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button className="btn-success-sm" onClick={() => handleStatusChange(b.id, 'APPROVED')}>Approve</button>
                                                <button className="btn-danger-sm" onClick={() => handleStatusChange(b.id, 'REJECTED')}>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-card">
                    {bookings.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No bookings found</p>
                    ) : bookings.map(b => (
                        <div className="mobile-card-item" key={b.id}>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">User</span>
                                <span className="mobile-card-value" style={{ fontWeight: 600 }}>{b.userName}</span>
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
                                <span className="mobile-card-label">Time</span>
                                <span className="mobile-card-value">{b.timeSlot}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Status</span>
                                <span className="mobile-card-value">{statusBadge(b.status)}</span>
                            </div>
                            {b.status === 'PENDING' && (
                                <div className="mobile-card-actions">
                                    <button className="btn-success-sm" style={{ flex: 1 }} onClick={() => handleStatusChange(b.id, 'APPROVED')}>Approve</button>
                                    <button className="btn-danger-sm" style={{ flex: 1 }} onClick={() => handleStatusChange(b.id, 'REJECTED')}>Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Booking Modal */}
            <CustomModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="New Booking"
                footer={
                    <>
                        <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn btn-primary-custom" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Creating...' : 'Create Booking'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Searchable User Select */}
                        <div className="col-md-6">
                            <label className="form-label">User *</label>
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Search user..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                style={{ fontSize: '12px', padding: '6px 10px' }}
                            />
                            <select className="form-select" required value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} size="4" style={{ maxHeight: '120px' }}>
                                <option value="">Select user</option>
                                {filteredUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>

                        {/* Searchable Resource Select */}
                        <div className="col-md-6">
                            <label className="form-label">Resource *</label>
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Search resource..."
                                value={resourceSearch}
                                onChange={e => setResourceSearch(e.target.value)}
                                style={{ fontSize: '12px', padding: '6px 10px' }}
                            />
                            <select className="form-select" required value={form.resourceId} onChange={e => setForm({ ...form, resourceId: e.target.value })} size="4" style={{ maxHeight: '120px' }}>
                                <option value="">Select resource</option>
                                {filteredResources.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Booking Date *</label>
                            <input type="date" className="form-control" required value={form.bookingDate} onChange={e => setForm({ ...form, bookingDate: e.target.value })} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Time Slot *</label>
                            <select className="form-select" required value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}>
                                <option value="">Select time slot</option>
                                {TIME_SLOTS.map(ts => (
                                    <option key={ts} value={ts}>{ts}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </CustomModal>
        </>
    )
}
