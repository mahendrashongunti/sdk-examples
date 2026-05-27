import '@servicenow/sdk/global'
import { ClientScript } from '@servicenow/sdk/core'

/**
 * Client Script: Validate business justification
 * Type: OnSubmit
 */
ClientScript({
    name: 'Validate Business Justification',
    table: 'x_itaccess_request',
    type: 'onSubmit',
    script: () => {
        const state = g_form.getValue('state')
        const justification = g_form.getValue('business_justification')
        
        // Require business justification when submitting for approval
        if (state === 'pending_approval' && (!justification || justification.length < 20)) {
            g_form.addErrorMessage('Business justification must be at least 20 characters when submitting for approval')
            return false
        }
        
        return true
    }
})
