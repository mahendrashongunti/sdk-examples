import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Business Rule: Auto-provision access when approved
 * Triggers: After Update
 */
BusinessRule({
    name: 'Auto Provision Access',
    table: 'x_itaccess_request',
    when: 'after',
    update: true,
    script: () => {
        // Check if state changed to approved
        if (current.state.toString() === 'approved' && current.state.changes()) {
            
            // Get access type to check if auto-provision is enabled
            const accessType = new GlideRecord('x_itaccess_access_type')
            if (accessType.get(current.access_type.toString())) {
                
                if (accessType.getValue('auto_provision') === 'true') {
                    // Create access assignment
                    const assignment = new GlideRecord('x_itaccess_assignment')
                    assignment.initialize()
                    assignment.setValue('user', current.requested_for.toString())
                    assignment.setValue('access_type', current.access_type.toString())
                    assignment.setValue('access_request', current.sys_id.toString())
                    assignment.setValue('granted_by', current.approved_by.toString())
                    assignment.setValue('status', 'active')
                    
                    // Set expiration date (90 days from now by default)
                    const expirationDate = new GlideDateTime()
                    expirationDate.addDaysLocalTime(90)
                    assignment.setValue('expiration_date', expirationDate)
                    
                    assignment.insert()
                    
                    // Update request state to completed
                    current.state = 'completed'
                    current.completion_date = new GlideDateTime()
                    current.update()
                    
                    gs.info('Access auto-provisioned for request: ' + current.number)
                } else {
                    // If not auto-provision, set state to in_progress for manual fulfillment
                    current.state = 'in_progress'
                    
                    // Assign to fulfillment group if specified
                    const fulfillmentGroup = accessType.getValue('fulfillment_group')
                    if (fulfillmentGroup) {
                        // Get first member of the fulfillment group
                        const groupMember = new GlideRecord('sys_user_grmember')
                        groupMember.addQuery('group', fulfillmentGroup)
                        groupMember.setLimit(1)
                        groupMember.query()
                        if (groupMember.next()) {
                            current.assigned_to = groupMember.getValue('user')
                        }
                    }
                    current.update()
                }
            }
        }
    }
})
