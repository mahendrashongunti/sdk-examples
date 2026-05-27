import React from 'react'
import { AccessAssignment } from '../types'
import { AccessAssignmentService } from '../services/AccessAssignmentService'
import './MyAccess.css'

interface MyAccessProps {
    assignments: AccessAssignment[]
    onRefresh: () => void
    assignmentService: AccessAssignmentService
}

export default function MyAccess({ assignments, onRefresh, assignmentService }: MyAccessProps) {
    const getValue = (field: any) => {
        return typeof field === 'object' ? field.display_value || field.value : field
    }

    const handleRevoke = async (sysId: string) => {
        const reason = prompt('Please provide a reason for revoking this access:')
        if (!reason) return

        try {
            await assignmentService.revoke(sysId, reason)
            onRefresh()
        } catch (err: any) {
            alert('Failed to revoke access: ' + err.message)
        }
    }

    const isExpiringSoon = (expirationDate: string) => {
        const expDate = new Date(expirationDate)
        const now = new Date()
        const daysUntilExpiration = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilExpiration <= 30 && daysUntilExpiration >= 0
    }

    const activeAssignments = assignments.filter(a => getValue(a.status) === 'active')

    return (
        <div className="my-access">
            <div className="access-header">
                <h2>My Active Access ({activeAssignments.length})</h2>
                <button onClick={onRefresh} className="refresh-button">
                    Refresh
                </button>
            </div>

            {activeAssignments.length === 0 ? (
                <p className="empty-state">You don't have any active access assignments</p>
            ) : (
                <div className="access-grid">
                    {activeAssignments.map((assignment) => {
                        const sysId = getValue(assignment.sys_id)
                        const expirationDate = getValue(assignment.expiration_date)
                        const expiring = isExpiringSoon(expirationDate)

                        return (
                            <div key={sysId} className={`access-card ${expiring ? 'expiring-soon' : ''}`}>
                                <div className="card-header">
                                    <h3>{getValue(assignment.access_type)}</h3>
                                    <span className={`status-badge status-${getValue(assignment.status)}`}>
                                        {getValue(assignment.status)}
                                    </span>
                                </div>

                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">Granted Date:</span>
                                        <span className="value">
                                            {new Date(getValue(assignment.granted_date)).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <span className="label">Expiration Date:</span>
                                        <span className="value">
                                            {new Date(expirationDate).toLocaleDateString()}
                                            {expiring && <span className="expiring-badge">⚠️ Expiring Soon</span>}
                                        </span>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button 
                                        onClick={() => handleRevoke(sysId)} 
                                        className="btn-revoke"
                                    >
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
