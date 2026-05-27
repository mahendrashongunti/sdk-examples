import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

/**
 * Access Assignment Table
 * Tracks active access assignments to users
 */
export const x_itaccess_assignment = Table({
    name: 'x_itaccess_assignment',
    label: 'Access Assignment',
    schema: {
        user: ReferenceColumn({
            label: 'User',
            reference: 'sys_user',
            mandatory: true,
        }),
        access_type: ReferenceColumn({
            label: 'Access Type',
            reference: 'x_itaccess_access_type',
            mandatory: true,
        }),
        access_request: ReferenceColumn({
            label: 'Access Request',
            reference: 'x_itaccess_request',
        }),
        granted_date: DateTimeColumn({
            label: 'Granted Date',
            default: 'javascript:new GlideDateTime().getDisplayValue();',
        }),
        expiration_date: DateTimeColumn({
            label: 'Expiration Date',
        }),
        granted_by: ReferenceColumn({
            label: 'Granted By',
            reference: 'sys_user',
        }),
        status: StringColumn({
            label: 'Status',
            maxLength: 40,
            choices: {
                active: { label: 'Active', sequence: 0 },
                expired: { label: 'Expired', sequence: 1 },
                revoked: { label: 'Revoked', sequence: 2 },
                suspended: { label: 'Suspended', sequence: 3 },
            },
            default: 'active',
        }),
        revoked_date: DateTimeColumn({
            label: 'Revoked Date',
        }),
        revoked_by: ReferenceColumn({
            label: 'Revoked By',
            reference: 'sys_user',
        }),
        revocation_reason: StringColumn({
            label: 'Revocation Reason',
            maxLength: 4000,
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 4000,
        }),
        auto_renewed: BooleanColumn({
            label: 'Auto Renewed',
            default: false,
        }),
        last_reviewed_date: DateTimeColumn({
            label: 'Last Reviewed Date',
        }),
        reviewed_by: ReferenceColumn({
            label: 'Reviewed By',
            reference: 'sys_user',
        }),
    },
    accessible_from: 'public',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
})
