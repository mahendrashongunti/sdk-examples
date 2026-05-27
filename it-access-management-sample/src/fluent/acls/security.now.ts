import '@servicenow/sdk/global'
import { Acl, Role } from '@servicenow/sdk/core'

/**
 * Define roles for IT Access Management
 */
export const itAccessUser = Role({
    name: 'x_itaccess.user',
    description: 'Can create and view their own access requests'
})

export const itAccessApprover = Role({
    name: 'x_itaccess.approver',
    description: 'Can approve or reject access requests'
})

export const itAccessFulfiller = Role({
    name: 'x_itaccess.fulfiller',
    description: 'Can fulfill approved access requests'
})

export const itAccessAdmin = Role({
    name: 'x_itaccess.admin',
    description: 'Full administrative access to IT Access Management'
})

/**
 * ACLs for Access Request table
 */
Acl({
    $id: Now.ID['access_request_create'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: [itAccessUser, itAccessAdmin],
    table: 'x_itaccess_request',
})

Acl({
    $id: Now.ID['access_request_read'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    table: 'x_itaccess_request',
    condition: 'requested_by=javascript:gs.getUserID()^ORrequested_for=javascript:gs.getUserID()^ORgs.hasRole("x_itaccess.approver")^ORgs.hasRole("x_itaccess.admin")'
})

Acl({
    $id: Now.ID['access_request_write'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: [itAccessApprover, itAccessAdmin],
    table: 'x_itaccess_request',
})

Acl({
    $id: Now.ID['access_request_delete'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: [itAccessAdmin],
    table: 'x_itaccess_request',
})

/**
 * ACLs for Access Type table
 */
Acl({
    $id: Now.ID['access_type_read'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    roles: [itAccessUser, itAccessApprover, itAccessFulfiller, itAccessAdmin],
    table: 'x_itaccess_access_type',
})

Acl({
    $id: Now.ID['access_type_create'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'create',
    roles: [itAccessAdmin],
    table: 'x_itaccess_access_type',
})

Acl({
    $id: Now.ID['access_type_write'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: [itAccessAdmin],
    table: 'x_itaccess_access_type',
})

/**
 * ACLs for Access Assignment table
 */
Acl({
    $id: Now.ID['access_assignment_read'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'read',
    table: 'x_itaccess_assignment',
    condition: 'user=javascript:gs.getUserID()^ORgs.hasRole("x_itaccess.admin")'
})

Acl({
    $id: Now.ID['access_assignment_write'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'write',
    roles: [itAccessFulfiller, itAccessAdmin],
    table: 'x_itaccess_assignment',
})

Acl({
    $id: Now.ID['access_assignment_delete'],
    localOrExisting: 'Existing',
    type: 'record',
    operation: 'delete',
    roles: [itAccessAdmin],
    table: 'x_itaccess_assignment',
})

/**
 * ACLs for REST API
 */
Acl({
    $id: Now.ID['rest_api_access'],
    name: 'itaccess_v1',
    type: 'rest_endpoint',
    operation: 'execute',
    roles: [itAccessUser, itAccessAdmin],
    securityAttribute: 'user_is_authenticated'
})
