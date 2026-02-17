import { useState, useEffect } from 'react'
import { getResources } from '../api/api'

export default function StudentResources() {
    const [resources, setResources] = useState([])
    const [typeFilter, setTypeFilter] = useState('')

    useEffect(() => { loadResources() }, [])

    const loadResources = async () => {
        try { setResources(await getResources()) } catch { /* */ }
    }

    const filtered = resources.filter(r => {
        if (typeFilter && r.type !== typeFilter) return false
        return r.status === 'AVAILABLE'
    })

    const typeBadge = (type) => <span className={`status-badge badge-${type.toLowerCase()}`}>{type.replace('_', ' ')}</span>

    return (
        <div className="data-table-wrapper">
            <div className="data-table-header">
                <span className="data-table-title">Available Resources ({filtered.length})</span>
                <div className="data-table-actions">
                    <select className="form-select filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="LAB">Lab</option>
                        <option value="CLASSROOM">Classroom</option>
                        <option value="EVENT_HALL">Event Hall</option>
                    </select>
                </div>
            </div>
            <div className="table-responsive desktop-table">
                <table className="data-table">
                    <thead><tr><th>Name</th><th>Type</th><th>Capacity</th></tr></thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No available resources</td></tr>
                        ) : filtered.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</td>
                                <td>{typeBadge(r.type)}</td>
                                <td>{r.capacity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mobile-card">
                {filtered.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No available resources</p>
                ) : filtered.map(r => (
                    <div className="mobile-card-item" key={r.id}>
                        <div className="mobile-card-row"><span className="mobile-card-label">Name</span><span className="mobile-card-value" style={{ fontWeight: 600 }}>{r.name}</span></div>
                        <div className="mobile-card-row"><span className="mobile-card-label">Type</span><span className="mobile-card-value">{typeBadge(r.type)}</span></div>
                        <div className="mobile-card-row"><span className="mobile-card-label">Capacity</span><span className="mobile-card-value">{r.capacity}</span></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
