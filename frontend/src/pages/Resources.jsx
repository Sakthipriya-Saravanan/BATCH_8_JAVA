import { useState, useEffect } from 'react'
import { getResources, createResource, updateResource, deleteResource } from '../api/api'
import { toast } from 'react-toastify'
import CustomModal from '../components/CustomModal'

const emptyForm = { name: '', type: 'LAB', capacity: '', status: 'AVAILABLE' }

export default function Resources() {
    const [resources, setResources] = useState([])
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [loading, setLoading] = useState(false)

    useEffect(() => { loadResources() }, [])

    const loadResources = async () => {
        try {
            const data = await getResources()
            setResources(data)
        } catch { /* API not available */ }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = { ...form, capacity: parseInt(form.capacity) }
            if (editing) {
                await updateResource(editing.id, payload)
                toast.success('Resource updated successfully')
            } else {
                await createResource(payload)
                toast.success('Resource created successfully')
            }
            setShowModal(false)
            setEditing(null)
            setForm(emptyForm)
            loadResources()
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const openEdit = (r) => {
        setEditing(r)
        setForm({ name: r.name, type: r.type, capacity: r.capacity.toString(), status: r.status })
        setShowModal(true)
    }

    const openCreate = () => {
        setEditing(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const confirmDelete = async () => {
        try {
            await deleteResource(deleteTarget.id)
            toast.success('Resource deleted successfully')
            setShowDeleteModal(false)
            setDeleteTarget(null)
            loadResources()
        } catch {
            toast.error('Failed to delete resource')
        }
    }

    const filtered = resources.filter(r => {
        if (typeFilter && r.type !== typeFilter) return false
        if (statusFilter && r.status !== statusFilter) return false
        return true
    })

    const typeBadge = (type) => <span className={`status-badge badge-${type.toLowerCase()}`}>{type.replace('_', ' ')}</span>
    const statusBadge = (status) => <span className={`status-badge badge-${status.toLowerCase()}`}>{status}</span>

    return (
        <>
            <div className="data-table-wrapper">
                <div className="data-table-header">
                    <span className="data-table-title">Resources ({filtered.length})</span>
                    <div className="data-table-actions">
                        <select className="form-select filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                            <option value="">All Types</option>
                            <option value="LAB">Lab</option>
                            <option value="CLASSROOM">Classroom</option>
                            <option value="EVENT_HALL">Event Hall</option>
                        </select>
                        <select className="form-select filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                        <button className="btn btn-primary-custom" onClick={openCreate}>+ Add Resource</button>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="table-responsive desktop-table">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No resources found</td></tr>
                            ) : filtered.map(r => (
                                <tr key={r.id}>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.name}</td>
                                    <td>{typeBadge(r.type)}</td>
                                    <td>{r.capacity}</td>
                                    <td>{statusBadge(r.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn-ghost" onClick={() => openEdit(r)} style={{ padding: '4px 10px', fontSize: '12px' }}>Edit</button>
                                            <button className="btn-danger-sm" onClick={() => { setDeleteTarget(r); setShowDeleteModal(true) }}>Delete</button>
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
                        <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No resources found</p>
                    ) : filtered.map(r => (
                        <div className="mobile-card-item" key={r.id}>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Name</span>
                                <span className="mobile-card-value" style={{ fontWeight: 600 }}>{r.name}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Type</span>
                                <span className="mobile-card-value">{typeBadge(r.type)}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Capacity</span>
                                <span className="mobile-card-value">{r.capacity}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Status</span>
                                <span className="mobile-card-value">{statusBadge(r.status)}</span>
                            </div>
                            <div className="mobile-card-actions">
                                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => openEdit(r)}>Edit</button>
                                <button className="btn-danger-sm" style={{ flex: 1 }} onClick={() => { setDeleteTarget(r); setShowDeleteModal(true) }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <CustomModal
                show={showModal}
                onClose={() => { setShowModal(false); setEditing(null) }}
                title={editing ? 'Edit Resource' : 'Add New Resource'}
                footer={
                    <>
                        <button className="btn-ghost" onClick={() => { setShowModal(false); setEditing(null) }}>Cancel</button>
                        <button className="btn btn-primary-custom" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : (editing ? 'Update' : 'Create Resource')}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Resource Name *</label>
                            <input type="text" className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Physics Lab A" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Type *</label>
                            <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="LAB">Lab</option>
                                <option value="CLASSROOM">Classroom</option>
                                <option value="EVENT_HALL">Event Hall</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Capacity *</label>
                            <input type="number" className="form-control" required min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="50" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Status *</label>
                            <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="AVAILABLE">Available</option>
                                <option value="UNAVAILABLE">Unavailable</option>
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
                        <button className="btn-danger-sm" style={{ padding: '8px 20px' }} onClick={confirmDelete}>Delete Resource</button>
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
