import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

/**
 * Business Rule: Create approval records when request is submitted
 * Triggers: After Insert, After Update
 */
BusinessRule({
    name: 'Create Approval Records',
    table: 'x_itaccess_request',
    when: 'after',
    insert: true,
    update: true,
    script: () => {
        // Only create approvals when state changes to pending_approval
        if (current.state.toString() === 'pending_approval' && 
            (current.operation() === 'insert' || current.state.changes())) {
            
            // Get the access type to determine approval requirements
            const accessType = new GlideRecord('x_itaccess_access_type')
            if (accessType.get(current.access_type.toString())) {
                
                // Create manager approval if required
                if (current.manager_approval_required.toString() === 'true') {
                    const requestedFor = new GlideRecord('sys_user')
                    if (requestedFor.get(current.requested_for.toString())) {
                        const manager = requestedFor.getValue('manager')
                        if (manager) {
                            const approval = new GlideRecord('x_itaccess_approval')
                            approval.initialize()
                            approval.setValue('access_request', current.sys_id.toString())
                            approval.setValue('approver', manager)
                            approval.setValue('approval_type', 'manager')
                            approval.setValue('sequence', '1')
                            approval.insert()
                        }
                    }
                }
                
                // Create approval for approval group if specified
                const approvalGroup = accessType.getValue('approval_group')
                if (approvalGroup) {
                    const approval = new GlideRecord('x_itaccess_approval')
                    approval.initialize()
                    approval.setValue('access_request', current.sys_id.toString())
                    approval.setValue('approver', approvalGroup)
                    approval.setValue('approval_type', 'resource_owner')
                    approval.setValue('sequence', '2')
                    approval.insert()
                }
            }
        }
    }
})
