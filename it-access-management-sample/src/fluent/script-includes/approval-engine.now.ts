import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

/**
 * Script Include: Approval Engine
 */
ScriptInclude({
    name: 'ApprovalEngine',
    script: () => {
        const ApprovalEngine = Class.create()
        
        ApprovalEngine.prototype = {
            initialize: function() {},
            
            /**
             * Check if all required approvals are complete
             */
            areAllApprovalsComplete: function(requestId) {
                const approval = new GlideRecord('x_itaccess_approval')
                approval.addQuery('access_request', requestId)
                approval.addQuery('state', 'pending')
                approval.query()
                return !approval.hasNext()
            },
            
            /**
             * Check if any approval is rejected
             */
            isAnyApprovalRejected: function(requestId) {
                const approval = new GlideRecord('x_itaccess_approval')
                approval.addQuery('access_request', requestId)
                approval.addQuery('state', 'rejected')
                approval.query()
                return approval.hasNext()
            },
            
            /**
             * Process approval decision
             */
            processApproval: function(approvalId, decision, comments) {
                const approval = new GlideRecord('x_itaccess_approval')
                if (!approval.get(approvalId)) {
                    return { success: false, message: 'Approval not found' }
                }
                
                if (approval.state.toString() !== 'pending') {
                    return { success: false, message: 'Approval already processed' }
                }
                
                // Update approval record
                approval.setValue('state', decision)
                approval.setValue('approval_date', new GlideDateTime())
                approval.setValue('comments', comments)
                approval.update()
                
                // Get the access request
                const requestId = approval.access_request.toString()
                const request = new GlideRecord('x_itaccess_request')
                if (!request.get(requestId)) {
                    return { success: false, message: 'Access request not found' }
                }
                
                // Check if approval was rejected
                if (decision === 'rejected') {
                    request.setValue('state', 'rejected')
                    request.setValue('rejection_reason', comments)
                    request.update()
                    return { success: true, message: 'Request rejected' }
                }
                
                // Check if all approvals are complete
                if (this.areAllApprovalsComplete(requestId)) {
                    request.setValue('state', 'approved')
                    request.setValue('approval_date', new GlideDateTime())
                    request.setValue('approved_by', gs.getUserID())
                    request.update()
                    return { success: true, message: 'Request approved' }
                }
                
                return { success: true, message: 'Approval recorded, waiting for other approvals' }
            },
            
            /**
             * Get pending approvals for a user
             */
            getPendingApprovalsForUser: function(userId) {
                const approvals = []
                const gr = new GlideRecord('x_itaccess_approval')
                gr.addQuery('approver', userId)
                gr.addQuery('state', 'pending')
                gr.query()
                
                while (gr.next()) {
                    const request = new GlideRecord('x_itaccess_request')
                    if (request.get(gr.access_request.toString())) {
                        approvals.push({
                            approval_id: gr.sys_id.toString(),
                            request_number: request.number.toString(),
                            requested_for: request.requested_for.getDisplayValue(),
                            access_type: request.access_type.getDisplayValue(),
                            requested_date: request.requested_date.toString(),
                            business_justification: request.business_justification.toString()
                        })
                    }
                }
                return approvals
            },
            
            type: 'ApprovalEngine'
        }
        
        return ApprovalEngine
    }
})
