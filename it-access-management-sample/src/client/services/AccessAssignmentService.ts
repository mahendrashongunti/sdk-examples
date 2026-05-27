export class AccessAssignmentService {
    private readonly tableName: string

    constructor() {
        this.tableName = 'x_itaccess_assignment'
    }

    // Return all active assignments
    async list(userId?: string) {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,user,access_type,granted_date,expiration_date,status')
            
            let query = 'ORDERBYDESCgranted_date'
            if (userId) {
                query = `user=${userId}^${query}`
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
            console.error('Error fetching access assignments:', error)
            throw error
        }
    }

    // Revoke access
    async revoke(sysId: string, reason: string) {
        try {
            const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-UserToken': window.g_ck,
                },
                body: JSON.stringify({ 
                    status: 'revoked',
                    revocation_reason: reason
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `HTTP error ${response.status}`)
            }

            return response.json()
        } catch (error) {
            console.error(`Error revoking access ${sysId}:`, error)
            throw error
        }
    }
}
