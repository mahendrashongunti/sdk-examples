import '@servicenow/sdk/global'
import { ClientScript } from '@servicenow/sdk/core'

/**
 * Client Script: Load access type information
 * Type: OnChange
 */
ClientScript({
    name: 'Load Access Type Info',
    table: 'x_itaccess_request',
    type: 'onChange',
    field: 'access_type',
    script: () => {
        const accessTypeId = g_form.getValue('access_type')
        
        if (accessTypeId) {
            // Fetch access type details
            const ga = new GlideAjax('AccessTypeInfo')
            ga.addParam('sysparm_name', 'getAccessTypeInfo')
            ga.addParam('sysparm_access_type_id', accessTypeId)
            ga.getXML((response) => {
                const answer = response.responseXML.documentElement.getAttribute('answer')
                if (answer) {
                    const info = JSON.parse(answer)
                    
                    // Show info message about SLA and approval requirements
                    if (info.sla_hours) {
                        g_form.addInfoMessage(`Standard SLA for this access: ${info.sla_hours} hours`)
                    }
                    
                    if (info.requires_approval === 'true') {
                        g_form.addInfoMessage('This access type requires approval')
                    }
                    
                    if (info.documentation_url) {
                        g_form.addInfoMessage(`Documentation: ${info.documentation_url}`)
                    }
                }
            })
        }
    }
})
