import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Business Rule: Auto-populate requested_by field
 * Triggers: Before Insert
 */
BusinessRule({
    name: 'Set Requested By',
    table: 'x_itaccess_request',
    when: 'before',
    insert: true,
    script: () => {
        // Set requested_by to current user if not already set
        if (!current.requested_by) {
            current.requested_by = gs.getUserID()
        }
        
        // If requested_for is not set, default to current user
        if (!current.requested_for) {
            current.requested_for = gs.getUserID()
        }
    }
})
