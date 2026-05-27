import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'

/**
 * UI Action: Reject Request
 * Allows approvers to reject pending requests
 */
UiAction({
    $id: Now.ID['reject_request'],
    table: 'x_itaccess_request',
    actionName: 'Reject',
    name: 'Reject',
    active: true,
    showInsert: false,
    showUpdate: true,
    hint: 'Reject this access request',
    condition: "current.state == 'pending_approval'",
    form: {
        showButton: true,
        showLink: false,
        showContextMenu: true,
        style: 'destructive',
    },
    list: {
        showLink: false,
        style: 'destructive',
        showButton: true,
        showContextMenu: true,
        showListChoice: true,
        showBannerButton: false,
        showSaveWithFormButton: false,
    },
    client: {
        isClient: true,
        isUi11Compatible: true,
        isUi16Compatible: true,
    },
    workspace: {
        isConfigurableWorkspace: true,
        showFormButtonV2: true,
        showFormMenuButtonV2: true,
        clientScriptV2: `function onClick(g_form) {
            var reason = prompt('Please provide a reason for rejection:');
            if (reason && reason.trim().length > 0) {
                g_form.setValue('rejection_reason', reason);
                g_form.setValue('state', 'rejected');
                g_form.save();
            } else {
                alert('Rejection reason is required');
            }
        }`,
    },
    script: `
        // This script runs on server side for non-client actions
        if (current.rejection_reason && current.rejection_reason.length > 0) {
            current.state = 'rejected';
            current.update();
            gs.addInfoMessage('Request rejected');
        } else {
            gs.addErrorMessage('Rejection reason is required');
        }
    `,
    roles: ['itaccess_approver', 'admin'],
    order: 102,
    showQuery: false,
    showMultipleUpdate: false,
})
