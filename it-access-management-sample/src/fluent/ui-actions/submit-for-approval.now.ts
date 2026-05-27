import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'

/**
 * UI Action: Submit for Approval
 * Allows users to submit draft requests for approval
 */
UiAction({
    $id: Now.ID['submit_for_approval'],
    table: 'x_itaccess_request',
    actionName: 'Submit for Approval',
    name: 'Submit for Approval',
    active: true,
    showInsert: false,
    showUpdate: true,
    hint: 'Submit this request for approval',
    condition: "current.state == 'draft'",
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
        // Validate required fields
        if (!current.business_justification || current.business_justification.length < 20) {
            gs.addErrorMessage('Business justification must be at least 20 characters');
            return;
        }
        
        if (!current.required_date) {
            gs.addErrorMessage('Required date must be specified');
            return;
        }
        
        // Update state to pending approval
        current.state = 'pending_approval';
        current.update();
        
        gs.addInfoMessage('Request submitted for approval');
        action.setRedirectURL(current);
    `,
    order: 100,
    showQuery: false,
    showMultipleUpdate: false,
})
