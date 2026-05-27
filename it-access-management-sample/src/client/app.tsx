import React, { useState, useEffect, useMemo } from 'react'
import { AccessRequestService } from './services/AccessRequestService'
import { AccessTypeService } from './services/AccessTypeService'
import { AccessAssignmentService } from './services/AccessAssignmentService'
import RequestList from './components/RequestList'
import RequestForm from './components/RequestForm'
import Dashboard from './components/Dashboard'
import MyAccess from './components/MyAccess'
import './app.css'

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [requests, setRequests] = useState([])
    const [accessTypes, setAccessTypes] = useState([])
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')

    const requestService = useMemo(() => new AccessRequestService(), [])
    const typeService = useMemo(() => new AccessTypeService(), [])
    const assignmentService = useMemo(() => new AccessAssignmentService(), [])

    const refreshData = async () => {
        try {
            setLoading(true)
            setError(null)
            const [requestsData, typesData, assignmentsData] = await Promise.all([
                requestService.list(filter !== 'all' ? { state: filter } : {}),
                typeService.list(),
                assignmentService.list()
            ])
            setRequests(requestsData)
            setAccessTypes(typesData)
            setAssignments(assignmentsData)
        } catch (err: any) {
            setError('Failed to load data: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void refreshData()
    }, [filter])

    const handleCreateClick = () => {
        setSelectedRequest(null)
        setShowForm(true)
    }

    const handleEditClick = (request: any) => {
        setSelectedRequest(request)
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
        setSelectedRequest(null)
    }

    const handleFormSubmit = async (formData: any) => {
        setLoading(true)
        try {
            if (selectedRequest) {
                const sysId =
                    typeof selectedRequest.sys_id === 'object'
                        ? selectedRequest.sys_id.value
                        : selectedRequest.sys_id
                await requestService.update(sysId, formData)
            } else {
                await requestService.create(formData)
            }
            setShowForm(false)
            await refreshData()
        } catch (err: any) {
            setError('Failed to save request: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (sysId: string) => {
        setLoading(true)
        try {
            await requestService.approve(sysId)
            await refreshData()
        } catch (err: any) {
            setError('Failed to approve request: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async (sysId: string) => {
        const reason = prompt('Please provide a rejection reason:')
        if (!reason) return
        
        setLoading(true)
        try {
            await requestService.reject(sysId, reason)
            await refreshData()
        } catch (err: any) {
            setError('Failed to reject request: ' + (err.message || 'Unknown error'))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="access-mgmt-app">
            <header className="app-header">
                <h1>🔐 IT Access Management</h1>
                <button className="create-button" onClick={handleCreateClick}>
                    + New Access Request
                </button>
            </header>

            <nav className="app-nav">
                <button 
                    className={activeTab === 'dashboard' ? 'active' : ''} 
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button 
                    className={activeTab === 'requests' ? 'active' : ''} 
                    onClick={() => setActiveTab('requests')}
                >
                    All Requests
                </button>
                <button 
                    className={activeTab === 'myaccess' ? 'active' : ''} 
                    onClick={() => setActiveTab('myaccess')}
                >
                    My Access
                </button>
            </nav>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {activeTab === 'dashboard' && (
                        <Dashboard 
                            requests={requests} 
                            accessTypes={accessTypes}
                            assignments={assignments}
                            onRefresh={refreshData}
                        />
                    )}
                    {activeTab === 'requests' && (
                        <>
                            <div className="filter-bar">
                                <label>Filter by state:</label>
                                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="draft">Draft</option>
                                    <option value="pending_approval">Pending Approval</option>
                                    <option value="approved">Approved</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <RequestList
                                requests={requests}
                                onEdit={handleEditClick}
                                onRefresh={refreshData}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        </>
                    )}
                    {activeTab === 'myaccess' && (
                        <MyAccess 
                            assignments={assignments}
                            onRefresh={refreshData}
                            assignmentService={assignmentService}
                        />
                    )}
                </>
            )}

            {showForm && (
                <RequestForm 
                    request={selectedRequest} 
                    accessTypes={accessTypes}
                    onSubmit={handleFormSubmit} 
                    onCancel={handleFormClose} 
                />
            )}
        </div>
    )
}
