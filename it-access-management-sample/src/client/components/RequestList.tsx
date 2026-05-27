import React from 'react'
import { AccessRequest } from '../types'
import './RequestList.css'

interface RequestListProps {
    requests: AccessRequest[]
    onEdit: (request: AccessRequest) => void
    onRefresh: () => void
    onApprove: (sysId: string) => void
    onReject: (sysId: string) => void
}

export default function RequestList({ requests, onEdit, onRefresh, onApprove, onReject }: RequestListProps) {
    const getValue = (field: any) => {
        return typeof field === 'object' ? field.display_value || field.value : field
    }

    const getStateClass = (state: string) => {
        const stateMap: Record<string, string> = {
            draft: 'state-draft',
            pending_approval: 'state-pending',
            approved: 'state-approved',
            rejected: 'state-rejected',
            in_progress: 'state-progress',
            completed: 'state-completed'
        }
        return stateMap[state] || ''
    }

    const getPriorityClass = (priority: string) => {
        const priorityMap: Record<string, string> = {
            '1': 'priority-critical',
            '2': 'priority-high',
            '3': 'priority-medium',
            '4': 'priority-low'
        }
        return priorityMap[priority] || ''
    }

    return (
        <div className="request-list">
            <div className="list-header">
                <h2>Access Requests ({requests.length})</h2>
                <button onClick={onRefresh} className="refresh-button">
                    Refresh
                </button>
            </div>

            {requests.length === 0 ? (
                <p className="empty-state">No access requests found</p>
            ) : (
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Requested For</th>
                            <th>Access Type</th>
                            <th>Priority</th>
                            <th>State</th>
                            <th>Requested Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => {
                            const sysId = getValue(request.sys_id)
                            const state = getValue(request.state)
                            const priority = getValue(request.priority)
                            
                            return (
                                <tr key={sysId}>
                                    <td>
                                        <span className="request-number">{getValue(request.number)}</span>
                                    </td>
                                    <td>{getValue(request.requested_for)}</td>
                                    <td>{getValue(request.access_type)}</td>
                                    <td>
                                        <span className={`priority-badge ${getPriorityClass(priority)}`}>
                                            {getValue(request.priority)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`state-badge ${getStateClass(state)}`}>
                                            {state.replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{new Date(getValue(request.requested_date)).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button onClick={() => onEdit(request)} className="btn-view">
                                            View
                                        </button>
                                        {state === 'pending_approval' && (
                                            <>
                                                <button 
                                                    onClick={() => onApprove(sysId)} 
                                                    className="btn-approve"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => onReject(sysId)} 
                                                    className="btn-reject"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}
