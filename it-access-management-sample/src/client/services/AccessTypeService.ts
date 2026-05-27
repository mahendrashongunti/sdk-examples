export class AccessTypeService {
    private readonly tableName: string

    constructor() {
        this.tableName = 'x_itaccess_access_type'
    }

    // Return all active access types
    async list() {
        try {
            const searchParams = new URLSearchParams()
            searchParams.set('sysparm_display_value', 'all')
            searchParams.set('sysparm_fields', 'sys_id,name,description,category,requires_approval,sla_hours,active,risk_level')
            searchParams.set('sysparm_query', 'active=true^ORDERBYname')

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
            console.error('Error fetching access types:', error)
            throw error
        }
    }
}
