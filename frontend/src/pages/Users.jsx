import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../api/api'
import { toast } from 'react-toastify'
import CustomModal from '../components/CustomModal'

const emptyForm = { name: '', email: '', phone: '', role: 'STUDENT', status: 'ACTIVE' }

export default function Users() {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)

    useEffect(() => { loadUsers() }, [statusFilter])

    const loadUsers = async () => {
        try {
            const data = await getUsers(statusFilter || undefined)
            setUsers(data)
        } catch { /* API not available */ }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (editing) {
                await updateUser(editing.id, form)
                toast.success('User updated successfully')
            } else {
                await createUser(form)
                toast.success('User created successfully')
            }
            setShowModal(false)
            setEditing(null)
            setForm(emptyForm)
            loadUsers()
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.details?.email || 'Something went wrong'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const openEdit = (user) => {
        setEditing(user)
        setForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, status: user.status })
        setShowModal(true)
    }

    const openCreate = () => {
        setEditing(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const confirmDelete = async () => {
        try {
            await deleteUser(deleteTarget.id)
            toast.success('User deleted successfully')
            setShowDeleteModal(false)
            setDeleteTarget(null)
            loadUsers()
        } catch {
            toast.error('Failed to delete user')
        }
    }

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    const roleBadge = (role) => <span className={`status-badge badge-${role.toLowerCase()}`}>{role}</span>
    const statusBadge = (status) => <span className={`status-badge badge-${status.toLowerCase()}`}>{status}</span>

    return (
        <>
            <div className="data-table-wrapper">
                <div className="data-table-header">
                    <span className="data-table-title">Users ({filtered.length})</span>
                    <div className="data-table-actions">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <select className="form-select filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                        <button className="btn btn-primary-custom" onClick={openCreate}>+ Add User</button>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="table-responsive desktop-table">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No users found</td></tr>
                            ) : filtered.map(u => (
                                <tr key={u.id}>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || '—'}</td>
                                    <td>{roleBadge(u.role)}</td>
                                    <td>{statusBadge(u.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn-ghost" onClick={() => openEdit(u)} style={{ padding: '4px 10px', fontSize: '12px' }}>Edit</button>
                                            <button className="btn-danger-sm" onClick={() => { setDeleteTarget(u); setShowDeleteModal(true) }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-card">
                    {filtered.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No users found</p>
                    ) : filtered.map(u => (
                        <div className="mobile-card-item" key={u.id}>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Name</span>
                                <span className="mobile-card-value" style={{ fontWeight: 600 }}>{u.name}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Email</span>
                                <span className="mobile-card-value">{u.email}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Role</span>
                                <span className="mobile-card-value">{roleBadge(u.role)}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Status</span>
                                <span className="mobile-card-value">{statusBadge(u.status)}</span>
                            </div>
                            <div className="mobile-card-actions">
                                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => openEdit(u)}>Edit</button>
                                <button className="btn-danger-sm" style={{ flex: 1 }} onClick={() => { setDeleteTarget(u); setShowDeleteModal(true) }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <CustomModal
                show={showModal}
                onClose={() => { setShowModal(false); setEditing(null) }}
                title={editing ? 'Edit User' : 'Add New User'}
                footer={
                    <>
                        <button className="btn-ghost" onClick={() => { setShowModal(false); setEditing(null) }}>Cancel</button>
                        <button className="btn btn-primary-custom" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : (editing ? 'Update User' : 'Create User')}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Full Name *</label>
                            <input type="text" className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Email *</label>
                            <input type="email" className="form-control" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Phone</label>
                            <input type="text" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Role *</label>
                            <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                <option value="STUDENT">Student</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Status *</label>
                            <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                </form>
            </CustomModal>

            {/* Delete Confirmation */}
            <CustomModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Confirm Delete"
                footer={
                    <>
                        <button className="btn-ghost" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="btn-danger-sm" style={{ padding: '8px 20px' }} onClick={confirmDelete}>Delete User</button>
                    </>
                }
            >
                <div className="delete-confirm-text">
                    Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
                </div>
            </CustomModal>
        </>
    )
}
