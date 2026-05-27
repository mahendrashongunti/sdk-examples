import React from 'react'
import { AccessRequest, AccessType, AccessAssignment } from '../types'
import './Dashboard.css'

interface DashboardProps {
    requests: AccessRequest[]
    accessTypes: AccessType[]
    assignments: AccessAssignment[]
    onRefresh: () => void
}

export default function Dashboard({ requests, accessTypes, assignments, onRefresh }: DashboardProps) {
    const getValue = (field: any) => {
        return typeof field === 'object' ? field.display_value || field.value : field
    }

    const pendingCount = requests.filter(r => getValue(r.state) === 'pending_approval').length
    const approvedCount = requests.filter(r => getValue(r.state) === 'approved').length
    const activeAccessCount = assignments.filter(a => getValue(a.status) === 'active').length
    const emergencyCount = requests.filter(r => getValue(r.is_emergency) === true || getValue(r.is_emergency) === 'true').length

    const recentRequests = requests.slice(0, 5)

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Dashboard Overview</h2>
                <button onClick={onRefresh} className="refresh-button">
                    Refresh
                </button>
            </div>

            <div className="stat-cards">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>Total Requests</h3>
                        <p className="stat-value">{requests.length}</p>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>Pending Approval</h3>
                        <p className="stat-value">{pendingCount}</p>
                    </div>
                </div>

                <div className="stat-card approved">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>Approved</h3>
                        <p className="stat-value">{approvedCount}</p>
                    </div>
                </div>

                <div className="stat-card active">
                    <div className="stat-icon">🔓</div>
                    <div className="stat-info">
                        <h3>Active Access</h3>
                        <p className="stat-value">{activeAccessCount}</p>
                    </div>
                </div>

                <div className="stat-card emergency">
                    <div className="stat-icon">🚨</div>
                    <div className="stat-info">
                        <h3>Emergency Requests</h3>
                        <p className="stat-value">{emergencyCount}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Access Types</h3>
                        <p className="stat-value">{accessTypes.length}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section">
                    <h3>Recent Requests</h3>
                    {recentRequests.length === 0 ? (
                        <p className="empty-state">No recent requests</p>
                    ) : (
                        <ul className="recent-list">
                            {recentRequests.map((request) => (
                                <li key={getValue(request.sys_id)}>
                                    <span className="request-number">{getValue(request.number)}</span>
                                    <span className="request-type">{getValue(request.access_type)}</span>
                                    <span className={`state-badge state-${getValue(request.state)}`}>
                                        {getValue(request.state).replace(/_/g, ' ')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="section">
                    <h3>Available Access Types</h3>
                    {accessTypes.length === 0 ? (
                        <p className="empty-state">No access types available</p>
                    ) : (
                        <ul className="access-types-list">
                            {accessTypes.slice(0, 10).map((type) => (
                                <li key={getValue(type.sys_id)}>
                                    <div className="type-header">
                                        <strong>{getValue(type.name)}</strong>
                                        <span className="category-badge">{getValue(type.category)}</span>
                                    </div>
                                    <p className="type-description">{getValue(type.description) || 'No description available'}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
