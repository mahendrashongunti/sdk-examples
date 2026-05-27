import '@servicenow/sdk/global'
import { Table, StringColumn, BooleanColumn, ReferenceColumn, IntegerColumn } from '@servicenow/sdk/core'

/**
 * IT Access Type/Resource Table
 * Defines different types of access that can be requested
 */
export const x_itaccess_access_type = Table({
    name: 'x_itaccess_access_type',
    label: 'Access Type',
    schema: {
        name: StringColumn({
            label: 'Access Name',
            maxLength: 100,
            mandatory: true,
            unique: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 4000,
        }),
        category: StringColumn({
            label: 'Category',
            maxLength: 40,
            choices: {
                application: { label: 'Application Access', sequence: 0 },
                network: { label: 'Network Access', sequence: 1 },
                database: { label: 'Database Access', sequence: 2 },
                server: { label: 'Server Access', sequence: 3 },
                cloud: { label: 'Cloud Service', sequence: 4 },
                physical: { label: 'Physical Access', sequence: 5 },
                other: { label: 'Other', sequence: 6 },
            },
            default: 'application',
        }),
        requires_approval: BooleanColumn({
            label: 'Requires Approval',
            default: true,
        }),
        auto_provision: BooleanColumn({
            label: 'Auto Provision',
            default: false,
        }),
        approval_group: ReferenceColumn({
            label: 'Approval Group',
            reference: 'sys_user_group',
        }),
        fulfillment_group: ReferenceColumn({
            label: 'Fulfillment Group',
            reference: 'sys_user_group',
        }),
        active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
        sla_hours: IntegerColumn({
            label: 'SLA (hours)',
            default: 24,
        }),
        risk_level: StringColumn({
            label: 'Risk Level',
            maxLength: 20,
            choices: {
                low: { label: 'Low', sequence: 0 },
                medium: { label: 'Medium', sequence: 1 },
                high: { label: 'High', sequence: 2 },
                critical: { label: 'Critical', sequence: 3 },
            },
            default: 'medium',
        }),
        documentation_url: StringColumn({
            label: 'Documentation URL',
            maxLength: 255,
        }),
        cost_per_user: IntegerColumn({
            label: 'Cost per User (USD)',
            default: 0,
        }),
    },
    accessible_from: 'public',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
})
