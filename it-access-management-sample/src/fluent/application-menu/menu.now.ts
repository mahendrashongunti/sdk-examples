import '@servicenow/sdk/global'
import { ApplicationMenu } from '@servicenow/sdk/core'

/**
 * IT Access Management Application Menu
 */
ApplicationMenu({
    $id: Now.ID['itaccess_menu'],
    title: 'IT Access Management',
    hint: 'Manage IT access requests and assignments',
    category: '850dc9a4c3e98300d4d32b4c0ae64f72', // Custom Applications category
    order: 100,
    roles: ['x_itaccess.user', 'x_itaccess.approver', 'x_itaccess.admin'],
    modules: [
        {
            $id: Now.ID['itaccess_dashboard'],
            title: 'Dashboard',
            hint: 'IT Access Management Dashboard',
            order: 10,
            link_type: 'DIRECT',
            uri: 'x_itaccess_dashboard.do',
            roles: ['x_itaccess.user', 'x_itaccess.approver', 'x_itaccess.admin'],
        },
        {
            $id: Now.ID['itaccess_my_requests'],
            title: 'My Requests',
            hint: 'View my access requests',
            order: 20,
            link_type: 'LIST',
            query: 'requested_by=javascript:gs.getUserID()',
            table: 'x_itaccess_request',
            view_name: 'Default view',
            roles: ['x_itaccess.user'],
        },
        {
            $id: Now.ID['itaccess_pending_approvals'],
            title: 'Pending Approvals',
            hint: 'Access requests pending approval',
            order: 30,
            link_type: 'LIST',
            query: 'state=pending_approval',
            table: 'x_itaccess_request',
            view_name: 'Default view',
            roles: ['x_itaccess.approver', 'x_itaccess.admin'],
        },
        {
            $id: Now.ID['itaccess_all_requests'],
            title: 'All Requests',
            hint: 'View all access requests',
            order: 40,
            link_type: 'LIST',
            table: 'x_itaccess_request',
            view_name: 'Default view',
            roles: ['x_itaccess.approver', 'x_itaccess.admin'],
        },
        {
            $id: Now.ID['itaccess_my_access'],
            title: 'My Access',
            hint: 'View my active access assignments',
            order: 50,
            link_type: 'LIST',
            query: 'user=javascript:gs.getUserID()^status=active',
            table: 'x_itaccess_assignment',
            view_name: 'Default view',
            roles: ['x_itaccess.user'],
        },
        {
            $id: Now.ID['itaccess_all_assignments'],
            title: 'All Assignments',
            hint: 'View all access assignments',
            order: 60,
            link_type: 'LIST',
            table: 'x_itaccess_assignment',
            view_name: 'Default view',
            roles: ['x_itaccess.admin'],
        },
        {
            $id: Now.ID['itaccess_types'],
            title: 'Access Types',
            hint: 'Configure access types',
            order: 70,
            link_type: 'LIST',
            table: 'x_itaccess_access_type',
            view_name: 'Default view',
            roles: ['x_itaccess.admin'],
        },
        {
            $id: Now.ID['itaccess_create_request'],
            title: 'Create New Request',
            hint: 'Create a new access request',
            order: 80,
            link_type: 'NEW',
            table: 'x_itaccess_request',
            roles: ['x_itaccess.user'],
        },
    ]
})
