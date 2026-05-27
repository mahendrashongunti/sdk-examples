import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'

/**
 * UI Action: Revoke Access
 * Allows administrators to revoke active access
 */
UiAction({
    $id: Now.ID['revoke_access'],
    table: 'x_itaccess_assignment',
    actionName: 'Revoke Access',
    name: 'Revoke Access',
    active: true,
    showInsert: false,
    showUpdate: true,
    hint: 'Revoke this access assignment',
    condition: "current.status == 'active'",
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
            var reason = prompt('Please provide a reason for revoking this access:');
            if (reason && reason.trim().length > 0) {
                g_form.setValue('revocation_reason', reason);
                g_form.setValue('status', 'revoked');
                g_form.setValue('revoked_date', new GlideDateTime().getDisplayValue());
                g_form.setValue('revoked_by', g_user.userID);
                g_form.save();
            } else {
                alert('Revocation reason is required');
            }
        }`,
    },
    script: `
        if (current.revocation_reason && current.revocation_reason.length > 0) {
            current.status = 'revoked';
            current.revoked_date = new GlideDateTime();
            current.revoked_by = gs.getUserID();
            current.update();
            gs.addInfoMessage('Access revoked successfully');
        } else {
            gs.addErrorMessage('Revocation reason is required');
        }
    `,
    roles: ['itaccess_admin', 'admin'],
    order: 200,
    showQuery: false,
    showMultipleUpdate: false,
})
