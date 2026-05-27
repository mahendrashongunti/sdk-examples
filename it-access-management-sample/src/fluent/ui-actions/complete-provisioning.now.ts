import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'

/**
 * UI Action: Complete Provisioning
 * Allows fulfillment team to mark provisioning as complete
 */
UiAction({
    $id: Now.ID['complete_provisioning'],
    table: 'x_itaccess_request',
    actionName: 'Complete Provisioning',
    name: 'Complete Provisioning',
    active: true,
    showInsert: false,
    showUpdate: true,
    hint: 'Mark access provisioning as complete',
    condition: "current.state == 'in_progress'",
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
        // Create access assignment
        var assignment = new GlideRecord('x_itaccess_assignment');
        assignment.initialize();
        assignment.setValue('user', current.requested_for.toString());
        assignment.setValue('access_type', current.access_type.toString());
        assignment.setValue('access_request', current.sys_id.toString());
        assignment.setValue('granted_by', gs.getUserID());
        assignment.setValue('status', 'active');
        
        // Set expiration date (90 days from now)
        var expirationDate = new GlideDateTime();
        expirationDate.addDaysLocalTime(90);
        assignment.setValue('expiration_date', expirationDate);
        
        assignment.insert();
        
        // Update request state
        current.state = 'completed';
        current.completion_date = new GlideDateTime();
        current.update();
        
        gs.addInfoMessage('Access provisioning completed successfully');
        action.setRedirectURL(current);
    `,
    roles: ['itaccess_fulfiller', 'admin'],
    order: 103,
    showQuery: false,
    showMultipleUpdate: false,
})
