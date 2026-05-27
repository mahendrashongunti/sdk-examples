import '@servicenow/sdk/global'
import { ClientScript } from '@servicenow/sdk/core'

/**
 * Client Script: Show/hide fields based on state
 * Type: OnChange
 */
ClientScript({
    name: 'State Change Handler',
    table: 'x_itaccess_request',
    type: 'onChange',
    field: 'state',
    script: () => {
        const state = g_form.getValue('state')
        
        // Show/hide rejection reason based on state
        if (state === 'rejected') {
            g_form.setMandatory('rejection_reason', true)
            g_form.setVisible('rejection_reason', true)
        } else {
            g_form.setMandatory('rejection_reason', false)
            g_form.setVisible('rejection_reason', false)
        }
        
        // Show/hide assigned_to based on state
        if (state === 'in_progress') {
            g_form.setVisible('assigned_to', true)
            g_form.setMandatory('assigned_to', true)
        } else {
            g_form.setVisible('assigned_to', false)
            g_form.setMandatory('assigned_to', false)
        }
        
        // Show work_notes for in_progress and completed states
        if (state === 'in_progress' || state === 'completed') {
            g_form.setVisible('work_notes', true)
        } else {
            g_form.setVisible('work_notes', false)
        }
    }
})
