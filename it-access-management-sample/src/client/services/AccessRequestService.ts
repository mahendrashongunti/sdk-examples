// Extend Window interface to include g_ck property
declare global {
    interface Window {
        g_ck: string
    }
}

export class AccessRequestService {
    private readonly tableName: string

    constructor() {
        this.tableName = 'x_itaccess_request'
    }

    // Return all access requests
    async list(filters?: { state?: string; user?: string }) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,number,requested_for,requested_by,access_type,state,priority,business_justification,requested_date,required_date,is_emergency')
            
            let query = 'ORDERBYDESCrequested_date'
            if (filters?.state) {
                query = `state=${filters.state}^${query}`
            }
            if (filters?.user) {
                query = `requested_for=${filters.user}^${query}`
            }
            searchParams.set('sysparm_query', query)

            const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const { result } = await response.json()
            return result || []
        } catch (error) {
            console.error('Error fetching access requests:', error)
            throw error
        }
    }

    // Get a single access request by sys_id
    async get(sysId: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')

            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            const { result } = await response.json()
            return result
        } catch (error) {
            console.error(`Error fetching access request ${sysId}:`, error)
            throw error
        }
    }

    // Create a new access request
    async create(data: any) {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error('Error creating access request:', error)
            throw error
        }
    }

    // Update an access request
    async update(sysId: string, data: any) {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error updating access request ${sysId}:`, error)
            throw error
        }
    }

    // Delete an access request
    async delete(sysId: string) {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.ok
        } catch (error) {
            console.error(`Error deleting access request ${sysId}:`, error)
            throw error
        }
    }

    // Submit for approval
    async submitForApproval(sysId: string) {
        return this.update(sysId, { state: 'pending_approval' })
    }

    // Approve request
    async approve(sysId: string) {
        return this.update(sysId, { state: 'approved' })
    }

    // Reject request
    async reject(sysId: string, reason: string) {
        return this.update(sysId, { state: 'rejected', rejection_reason: reason })
    }
}
