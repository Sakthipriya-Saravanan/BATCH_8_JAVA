import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBookings, createBooking, getResources } from '../api/api'
import { toast } from 'react-toastify'
import CustomModal from '../components/CustomModal'

const TIME_SLOTS = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00',
]

export default function StudentBookings() {
    const { auth } = useAuth()
    const [bookings, setBookings] = useState([])
    const [resources, setResources] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ resourceId: '', bookingDate: '', timeSlot: '' })
    const [loading, setLoading] = useState(false)
    const [resourceSearch, setResourceSearch] = useState('')

    useEffect(() => { loadData() }, [])

    const loadData = async () => {
        try {
            const [b, r] = await Promise.all([getBookings(auth.userId), getResources()])
            setBookings(b)
            setResources(r.filter(res => res.status === 'AVAILABLE'))
        } catch { /* */ }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createBooking({ ...form, userId: auth.userId })
            toast.success('Booking created! Waiting for approval.')
            setShowModal(false)
            setForm({ resourceId: '', bookingDate: '', timeSlot: '' })
            loadData()
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

    const statusBadge = (status) => {
        const cls = status === 'APPROVED' ? 'badge-approved' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
        return <span className={`status-badge ${cls}`}>{status}</span>
    }

    const filteredResources = resources.filter(r => r.name.toLowerCase().includes(resourceSearch.toLowerCase()))

    return (
        <>
            <div className="data-table-wrapper">
                <div className="data-table-header">
                    <span className="data-table-title">My Bookings ({bookings.length})</span>
                    <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>+ New Booking</button>
                </div>
                <div className="table-responsive desktop-table">
                    <table className="data-table">
                        <thead><tr><th>Resource</th><th>Date</th><th>Time Slot</th><th>Status</th></tr></thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No bookings yet. Create your first booking!</td></tr>
                            ) : bookings.map(b => (
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
                    {bookings.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No bookings yet</p>
                    ) : bookings.map(b => (
                        <div className="mobile-card-item" key={b.id}>
                            <div className="mobile-card-row"><span className="mobile-card-label">Resource</span><span className="mobile-card-value">{b.resourceName}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Date</span><span className="mobile-card-value">{b.bookingDate}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Time</span><span className="mobile-card-value">{b.timeSlot}</span></div>
                            <div className="mobile-card-row"><span className="mobile-card-label">Status</span><span className="mobile-card-value">{statusBadge(b.status)}</span></div>
                        </div>
                    ))}
                </div>
            </div>

            <CustomModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Booking"
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
                        <div className="col-12">
                            <label className="form-label">Resource *</label>
                            <input type="text" className="form-control mb-1" placeholder="Search resource..." value={resourceSearch} onChange={e => setResourceSearch(e.target.value)} style={{ fontSize: '12px', padding: '6px 10px' }} />
                            <select className="form-select" required value={form.resourceId} onChange={e => setForm({ ...form, resourceId: e.target.value })} size="4" style={{ maxHeight: '120px' }}>
                                <option value="">Select resource</option>
                                {filteredResources.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.type}, capacity: {r.capacity})</option>
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
                                {TIME_SLOTS.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                            </select>
                        </div>
                    </div>
                </form>
            </CustomModal>
        </>
    )
}
