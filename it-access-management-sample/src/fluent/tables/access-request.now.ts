import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, ReferenceColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

/**
 * IT Access Request Table
 * Main table for tracking access requests from users
 */
export const x_itaccess_request = Table({
    name: 'x_itaccess_request',
    label: 'Access Request',
    schema: {
        number: StringColumn({
            label: 'Request Number',
            maxLength: 40,
            read_only: true,
            default: 'javascript:global.getNextObjNumberPadded();'
        }),
        requested_for: ReferenceColumn({
            label: 'Requested For',
            reference: 'sys_user',
            mandatory: true,
        }),
        requested_by: ReferenceColumn({
            label: 'Requested By',
            reference: 'sys_user',
            mandatory: true,
            default: 'javascript:gs.getUserID();'
        }),
        access_type: ReferenceColumn({
            label: 'Access Type',
            reference: 'x_itaccess_access_type',
            mandatory: true,
        }),
        business_justification: StringColumn({
            label: 'Business Justification',
            maxLength: 4000,
            mandatory: true,
        }),
        state: StringColumn({
            label: 'State',
            maxLength: 40,
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                pending_approval: { label: 'Pending Approval', sequence: 1 },
                approved: { label: 'Approved', sequence: 2 },
                rejected: { label: 'Rejected', sequence: 3 },
                in_progress: { label: 'In Progress', sequence: 4 },
                completed: { label: 'Completed', sequence: 5 },
                cancelled: { label: 'Cancelled', sequence: 6 },
            },
            default: 'draft',
        }),
        priority: IntegerColumn({
            label: 'Priority',
            choices: {
                '1': { label: 'Critical', sequence: 0 },
                '2': { label: 'High', sequence: 1 },
                '3': { label: 'Medium', sequence: 2 },
                '4': { label: 'Low', sequence: 3 },
            },
            default: '3',
        }),
        requested_date: DateTimeColumn({
            label: 'Requested Date',
            default: 'javascript:new GlideDateTime().getDisplayValue();',
        }),
        required_date: DateTimeColumn({
            label: 'Required Date',
            mandatory: true,
        }),
        approval_date: DateTimeColumn({
            label: 'Approval Date',
        }),
        completion_date: DateTimeColumn({
            label: 'Completion Date',
        }),
        approved_by: ReferenceColumn({
            label: 'Approved By',
            reference: 'sys_user',
        }),
        rejection_reason: StringColumn({
            label: 'Rejection Reason',
            maxLength: 4000,
        }),
        assigned_to: ReferenceColumn({
            label: 'Assigned To',
            reference: 'sys_user',
        }),
        work_notes: StringColumn({
            label: 'Work Notes',
            maxLength: 4000,
        }),
        is_emergency: BooleanColumn({
            label: 'Emergency Request',
            default: false,
        }),
        manager_approval_required: BooleanColumn({
            label: 'Manager Approval Required',
            default: true,
        }),
    },
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    auto_number: {
        prefix: 'ACREQ',
        number: 1000,
        number_of_digits: 7
    }
})
