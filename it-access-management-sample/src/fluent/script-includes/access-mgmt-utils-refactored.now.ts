import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'
import { TableNames, TableColumns } from '../constants/tables'

/**
 * Script Include: Access Management Utility functions (Refactored with Constants)
 * 
 * This is a refactored version demonstrating the use of auto-generated table constants
 * Compare with access-mgmt-utils.now.ts to see the improvements
 */
ScriptInclude({
    name: 'AccessManagementUtilsRefactored',
    script: () => {
        const AccessManagementUtilsRefactored = Class.create()
        
        AccessManagementUtilsRefactored.prototype = {
            initialize: function() {},
            
            /**
             * Check if user has active access to a specific access type
             * 
             * BEFORE: new GlideRecord('x_itaccess_assignment')
             * AFTER:  new GlideRecord(TableNames.ASSIGNMENT)
             */
            hasActiveAccess: function(userId, accessTypeId) {
                const assignment = new GlideRecord(TableNames.ASSIGNMENT)
                assignment.addQuery(TableColumns.ASSIGNMENT.USER, userId)
                assignment.addQuery(TableColumns.ASSIGNMENT.ACCESS_TYPE, accessTypeId)
                assignment.addQuery(TableColumns.ASSIGNMENT.STATUS, 'active')
                assignment.query()
                return assignment.hasNext()
            },
            
            /**
             * Get all active assignments for a user
             * 
             * Benefits of using constants:
             * - Type-safe column names
             * - IDE autocomplete
             * - Refactoring support
             * - Prevents typos
             */
            getUserAccessList: function(userId) {
                const assignments = []
                const gr = new GlideRecord(TableNames.ASSIGNMENT)
                gr.addQuery(TableColumns.ASSIGNMENT.USER, userId)
                gr.addQuery(TableColumns.ASSIGNMENT.STATUS, 'active')
                gr.query()
                
                while (gr.next()) {
                    assignments.push({
                        sys_id: gr.sys_id.toString(),
                        access_type: gr[TableColumns.ASSIGNMENT.ACCESS_TYPE].getDisplayValue(),
                        granted_date: gr[TableColumns.ASSIGNMENT.GRANTED_DATE].toString(),
                        expiration_date: gr[TableColumns.ASSIGNMENT.EXPIRATION_DATE].toString()
                    })
                }
                return assignments
            },
            
            /**
             * Check if access is expiring soon (within 30 days)
             */
            isExpiringSoon: function(assignmentId) {
                const assignment = new GlideRecord(TableNames.ASSIGNMENT)
                if (assignment.get(assignmentId)) {
                    const expiration = new GlideDateTime(assignment[TableColumns.ASSIGNMENT.EXPIRATION_DATE])
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
                const assignment = new GlideRecord(TableNames.ASSIGNMENT)
                if (assignment.get(assignmentId)) {
                    assignment.setValue(TableColumns.ASSIGNMENT.STATUS, 'revoked')
                    assignment.setValue(TableColumns.ASSIGNMENT.REVOKED_DATE, new GlideDateTime())
                    assignment.setValue(TableColumns.ASSIGNMENT.REVOKED_BY, gs.getUserID())
                    assignment.setValue(TableColumns.ASSIGNMENT.REVOCATION_REASON, reason)
                    assignment.update()
                    return true
                }
                return false
            },
            
            /**
             * Extend access expiration
             */
            extendAccess: function(assignmentId, daysToExtend) {
                const assignment = new GlideRecord(TableNames.ASSIGNMENT)
                if (assignment.get(assignmentId)) {
                    const currentExpiration = new GlideDateTime(assignment[TableColumns.ASSIGNMENT.EXPIRATION_DATE])
                    currentExpiration.addDaysLocalTime(daysToExtend)
                    assignment.setValue(TableColumns.ASSIGNMENT.EXPIRATION_DATE, currentExpiration)
                    assignment.update()
                    return true
                }
                return false
            },
            
            type: 'AccessManagementUtilsRefactored'
        }
        
        return AccessManagementUtilsRefactored
    }
})
