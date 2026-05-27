import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core'

/**
 * Approval Table
 * Tracks approval workflow for access requests
 */
export const x_itaccess_approval = Table({
    name: 'x_itaccess_approval',
    label: 'Access Approval',
    schema: {
        access_request: ReferenceColumn({
            label: 'Access Request',
            reference: 'x_itaccess_request',
            mandatory: true,
        }),
        approver: ReferenceColumn({
            label: 'Approver',
            reference: 'sys_user',
            mandatory: true,
        }),
        approval_type: StringColumn({
            label: 'Approval Type',
            maxLength: 40,
            choices: {
                manager: { label: 'Manager Approval', sequence: 0 },
                security: { label: 'Security Approval', sequence: 1 },
                resource_owner: { label: 'Resource Owner', sequence: 2 },
                compliance: { label: 'Compliance Approval', sequence: 3 },
            },
            default: 'manager',
        }),
        state: StringColumn({
            label: 'State',
            maxLength: 40,
            choices: {
                pending: { label: 'Pending', sequence: 0 },
                approved: { label: 'Approved', sequence: 1 },
                rejected: { label: 'Rejected', sequence: 2 },
                cancelled: { label: 'Cancelled', sequence: 3 },
            },
            default: 'pending',
        }),
        requested_date: DateTimeColumn({
            label: 'Requested Date',
            default: 'javascript:new GlideDateTime().getDisplayValue();',
        }),
        approval_date: DateTimeColumn({
            label: 'Approval Date',
        }),
        comments: StringColumn({
            label: 'Comments',
            maxLength: 4000,
        }),
        sequence: StringColumn({
            label: 'Approval Sequence',
            maxLength: 10,
            default: '1',
        }),
    },
    accessible_from: 'public',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
})
