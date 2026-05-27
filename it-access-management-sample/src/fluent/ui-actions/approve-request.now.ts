import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'

/**
 * UI Action: Approve Request
 * Allows approvers to approve pending requests
 */
UiAction({
    $id: Now.ID['approve_request'],
    table: 'x_itaccess_request',
    actionName: 'Approve',
    name: 'Approve',
    active: true,
    showInsert: false,
    showUpdate: true,
    hint: 'Approve this access request',
    condition: "current.state == 'pending_approval'",
    form: {
        showButton: true,
        showLink: false,
        showContextMenu: true,
        style: 'primary',
    },
    list: {
        showLink: false,
        style: 'primary',
        showButton: true,
        showContextMenu: true,
        showListChoice: true,
        showBannerButton: false,
        showSaveWithFormButton: false,
    },
    script: `
        // Update state to approved
        current.state = 'approved';
        current.approval_date = new GlideDateTime();
        current.approved_by = gs.getUserID();
        current.update();
        
        gs.addInfoMessage('Request approved successfully');
        action.setRedirectURL(current);
    `,
    roles: ['itaccess_approver', 'admin'],
    order: 101,
    showQuery: false,
    showMultipleUpdate: false,
})
