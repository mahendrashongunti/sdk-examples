import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Business Rule: Validate required date
 * Triggers: Before Insert, Before Update
 */
BusinessRule({
    name: 'Validate Required Date',
    table: 'x_itaccess_request',
    when: 'before',
    insert: true,
    update: true,
    script: () => {
        // Ensure required date is in the future
        if (current.required_date) {
            const requiredDate = new GlideDateTime(current.required_date)
            const now = new GlideDateTime()
            
            if (requiredDate.before(now)) {
                gs.addErrorMessage('Required date must be in the future')
                current.setAbortAction(true)
            }
        }
        
        // Set priority to Critical if it's an emergency request
        if (current.is_emergency.toString() === 'true') {
            current.priority = '1'
        }
    }
})
