import '@servicenow/sdk/global'
import { ClientScript } from '@servicenow/sdk/core'

/**
 * Client Script: Emergency request warning
 * Type: OnChange
 */
ClientScript({
    name: 'Emergency Request Warning',
    table: 'x_itaccess_request',
    type: 'onChange',
    field: 'is_emergency',
    script: () => {
        const isEmergency = g_form.getValue('is_emergency')
        
        if (isEmergency === 'true') {
            g_form.addInfoMessage('Emergency requests will be prioritized and set to Critical priority.')
            g_form.setValue('priority', '1')
        }
    }
})
