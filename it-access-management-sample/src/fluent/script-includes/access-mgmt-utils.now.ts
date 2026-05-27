import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * Script Include: Access Management Utility functions
 */
ScriptInclude({
    name: 'AccessManagementUtils',
    script: () => {
        const AccessManagementUtils = Class.create()
        
        AccessManagementUtils.prototype = {
            initialize: function() {},
            
            /**
             * Check if user has active access to a specific access type
             */
            hasActiveAccess: function(userId, accessTypeId) {
                const assignment = new GlideRecord('x_itaccess_assignment')
                assignment.addQuery('user', userId)
                assignment.addQuery('access_type', accessTypeId)
                assignment.addQuery('status', 'active')
                assignment.query()
                return assignment.hasNext()
            },
            
            /**
             * Get all active assignments for a user
             */
            getUserAccessList: function(userId) {
                const assignments = []
                const gr = new GlideRecord('x_itaccess_assignment')
                gr.addQuery('user', userId)
                gr.addQuery('status', 'active')
                gr.query()
                
                while (gr.next()) {
                    assignments.push({
                        sys_id: gr.sys_id.toString(),
                        access_type: gr.access_type.getDisplayValue(),
                        granted_date: gr.granted_date.toString(),
                        expiration_date: gr.expiration_date.toString()
                    })
                }
                return assignments
            },
            
            /**
             * Check if access is expiring soon (within 30 days)
             */
            isExpiringSoon: function(assignmentId) {
                const assignment = new GlideRecord('x_itaccess_assignment')
                if (assignment.get(assignmentId)) {
                    const expiration = new GlideDateTime(assignment.expiration_date)
                    const now = new GlideDateTime()
                    const daysUntilExpiration = gs.dateDiff(now.getDisplayValue(), expiration.getDisplayValue(), true)
                    return daysUntilExpiration <= 30 && daysUntilExpiration >= 0
                }
                return false
            },
            
            /**
             * Revoke access
             */
            revokeAccess: function(assignmentId, reason) {
                const assignment = new GlideRecord('x_itaccess_assignment')
                if (assignment.get(assignmentId)) {
                    assignment.setValue('status', 'revoked')
                    assignment.setValue('revoked_date', new GlideDateTime())
                    assignment.setValue('revoked_by', gs.getUserID())
                    assignment.setValue('revocation_reason', reason)
                    assignment.update()
                    return true
                }
                return false
            },
            
            /**
             * Extend access expiration
             */
            extendAccess: function(assignmentId, daysToExtend) {
                const assignment = new GlideRecord('x_itaccess_assignment')
                if (assignment.get(assignmentId)) {
                    const currentExpiration = new GlideDateTime(assignment.expiration_date)
                    currentExpiration.addDaysLocalTime(daysToExtend)
                    assignment.setValue('expiration_date', currentExpiration)
                    assignment.update()
                    return true
                }
                return false
            },
            
            type: 'AccessManagementUtils'
        }
        
        return AccessManagementUtils
    }
})
