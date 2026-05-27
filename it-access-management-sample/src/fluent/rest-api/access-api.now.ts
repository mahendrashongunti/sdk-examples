import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'

/**
 * REST API for IT Access Management
 * Provides endpoints for external systems to integrate with access management
 * /api/itaccess/v1
 */

RestApi({
    $id: Now.ID['itaccess-api'],
    name: 'IT Access Management API',
    service_id: 'itaccess_v1',
    consumes: 'application/json',
    routes: [
        {
            $id: Now.ID['itaccess-api-create-request'],
            name: 'create_request',
            method: 'POST',
            relative_path: '/requests',
            script: script`
              (function process(request, response) {
                try {
                    var reqbody = request.body.dataString;
                    var parser = new global.JSON();
                    var data = parser.decode(reqbody);
                    
                    // Validate required fields
                    if (!data.requested_for || !data.access_type || !data.business_justification) {
                        response.setStatus(400);
                        response.setBody({
                            error: 'Missing required fields: requested_for, access_type, business_justification'
                        });
                        return;
                    }
                    
                    // Create access request
                    var gr = new GlideRecord('x_itaccess_request');
                    gr.initialize();
                    gr.setValue('requested_for', data.requested_for);
                    gr.setValue('requested_by', data.requested_by || gs.getUserID());
                    gr.setValue('access_type', data.access_type);
                    gr.setValue('business_justification', data.business_justification);
                    gr.setValue('required_date', data.required_date);
                    gr.setValue('priority', data.priority || '3');
                    gr.setValue('is_emergency', data.is_emergency || false);
                    
                    var sysId = gr.insert();
                    
                    if (sysId) {
                        response.setStatus(201);
                        response.setBody({
                            success: true,
                            request_id: sysId,
                            request_number: gr.number.toString(),
                            message: 'Access request created successfully'
                        });
                    } else {
                        response.setStatus(500);
                        response.setBody({
                            error: 'Failed to create access request'
                        });
                    }
                } catch (e) {
                    response.setStatus(500);
                    response.setBody({
                        error: 'Internal server error: ' + e.message
                    });
                }
              })(request, response)
            `,
        },
        {
            $id: Now.ID['itaccess-api-get-request'],
            name: 'get_request',
            method: 'GET',
            relative_path: '/requests/{request_id}',
            script: script`
              (function process(request, response) {
                try {
                    var requestId = request.pathParams.request_id;
                    
                    var gr = new GlideRecord('x_itaccess_request');
                    if (gr.get(requestId)) {
                        response.setBody({
                            request_id: gr.sys_id.toString(),
                            number: gr.number.toString(),
                            requested_for: gr.requested_for.getDisplayValue(),
                            requested_by: gr.requested_by.getDisplayValue(),
                            access_type: gr.access_type.getDisplayValue(),
                            state: gr.state.toString(),
                            priority: gr.priority.toString(),
                            business_justification: gr.business_justification.toString(),
                            requested_date: gr.requested_date.toString(),
                            required_date: gr.required_date.toString(),
                            approval_date: gr.approval_date.toString(),
                            completion_date: gr.completion_date.toString()
                        });
                    } else {
                        response.setStatus(404);
                        response.setBody({
                            error: 'Request not found'
                        });
                    }
                } catch (e) {
                    response.setStatus(500);
                    response.setBody({
                        error: 'Internal server error: ' + e.message
                    });
                }
              })(request, response)
            `,
        },
        {
            $id: Now.ID['itaccess-api-list-requests'],
            name: 'list_requests',
            method: 'GET',
            relative_path: '/requests',
            script: script`
              (function process(request, response) {
                try {
                    var userId = request.queryParams.user_id;
                    var state = request.queryParams.state;
                    var limit = request.queryParams.limit || 100;
                    
                    var gr = new GlideRecord('x_itaccess_request');
                    
                    if (userId) {
                        gr.addQuery('requested_for', userId);
                    }
                    if (state) {
                        gr.addQuery('state', state);
                    }
                    
                    gr.setLimit(limit);
                    gr.orderByDesc('sys_created_on');
                    gr.query();
                    
                    var requests = [];
                    while (gr.next()) {
                        requests.push({
                            request_id: gr.sys_id.toString(),
                            number: gr.number.toString(),
                            requested_for: gr.requested_for.getDisplayValue(),
                            access_type: gr.access_type.getDisplayValue(),
                            state: gr.state.toString(),
                            priority: gr.priority.toString(),
                            requested_date: gr.requested_date.toString()
                        });
                    }
                    
                    response.setBody({
                        count: requests.length,
                        requests: requests
                    });
                } catch (e) {
                    response.setStatus(500);
                    response.setBody({
                        error: 'Internal server error: ' + e.message
                    });
                }
              })(request, response)
            `,
        },
        {
            $id: Now.ID['itaccess-api-get-user-access'],
            name: 'get_user_access',
            method: 'GET',
            relative_path: '/users/{user_id}/access',
            script: script`
              (function process(request, response) {
                try {
                    var userId = request.pathParams.user_id;
                    
                    var gr = new GlideRecord('x_itaccess_assignment');
                    gr.addQuery('user', userId);
                    gr.addQuery('status', 'active');
                    gr.query();
                    
                    var assignments = [];
                    while (gr.next()) {
                        assignments.push({
                            assignment_id: gr.sys_id.toString(),
                            access_type: gr.access_type.getDisplayValue(),
                            granted_date: gr.granted_date.toString(),
                            expiration_date: gr.expiration_date.toString(),
                            status: gr.status.toString()
                        });
                    }
                    
                    response.setBody({
                        user_id: userId,
                        access_count: assignments.length,
                        access_list: assignments
                    });
                } catch (e) {
                    response.setStatus(500);
                    response.setBody({
                        error: 'Internal server error: ' + e.message
                    });
                }
              })(request, response)
            `,
        },
        {
            $id: Now.ID['itaccess-api-approve-request'],
            name: 'approve_request',
            method: 'PUT',
            relative_path: '/requests/{request_id}/approve',
            script: script`
              (function process(request, response) {
                try {
                    var requestId = request.pathParams.request_id;
                    var reqbody = request.body.dataString;
                    var parser = new global.JSON();
                    var data = parser.decode(reqbody);
                    
                    var gr = new GlideRecord('x_itaccess_request');
                    if (!gr.get(requestId)) {
                        response.setStatus(404);
                        response.setBody({
                            error: 'Request not found'
                        });
                        return;
                    }
                    
                    if (gr.state.toString() !== 'pending_approval') {
                        response.setStatus(400);
                        response.setBody({
                            error: 'Request is not in pending_approval state'
                        });
                        return;
                    }
                    
                    gr.setValue('state', 'approved');
                    gr.setValue('approval_date', new GlideDateTime());
                    gr.setValue('approved_by', gs.getUserID());
                    gr.update();
                    
                    response.setBody({
                        success: true,
                        message: 'Request approved successfully',
                        request_id: requestId,
                        state: 'approved'
                    });
                } catch (e) {
                    response.setStatus(500);
                    response.setBody({
                        error: 'Internal server error: ' + e.message
                    });
                }
              })(request, response)
            `,
        },
        {
            $id: Now.ID['itaccess-api-reject-request'],
            name: 'reject_request',
            method: 'PUT',
            relative_path: '/requests/{request_id}/reject',
            script: script`
              (function process(request, response) {
                try {
                    var requestId = request.pathParams.request_id;
                    var reqbody = request.body.dataString;
                    var parser = new global.JSON();
                    var data = parser.decode(reqbody);
                    
                    if (!data.rejection_reason) {
                        response.setStatus(400);
                        response.setBody({
                            error: 'rejection_reason is required'
                        });
                        return;
                    }
                    
                    var gr = new GlideRecord('x_itaccess_request');
                    if (!gr.get(requestId)) {
                        response.setStatus(404);
                        response.setBody({
                            error: 'Request not found'
                        });
                        return;
                    }
                    
                    if (gr.state.toString() !== 'pending_approval') {
                        response.setStatus(400);
                        response.setBody({
                            error: 'Request is not in pending_approval state'
                        });
                        return;
                    }
                    
                    gr.setValue('state', 'rejected');
                    gr.setValue('rejection_reason', data.rejection_reason);
                    gr.update();
                    
                    response.setBody({
                        success: true,
                        message: 'Request rejected',
                        request_id: requestId,
                        state: 'rejected'
                    });
                } catch (e) {
                    response.setStatus(500);
                    response.setBody({
                        error: 'Internal server error: ' + e.message
                    });
                }
              })(request, response)
            `,
        },
        {
            $id: Now.ID['itaccess-api-revoke-access'],
            name: 'revoke_access',
            method: 'DELETE',
            relative_path: '/assignments/{assignment_id}',
            script: script`
              (function process(request, response) {
                try {
                    var assignmentId = request.pathParams.assignment_id;
                    var reqbody = request.body.dataString;
                    var parser = new global.JSON();
                    var data = parser.decode(reqbody);
                    
                    var gr = new GlideRecord('x_itaccess_assignment');
                    if (!gr.get(assignmentId)) {
                        response.setStatus(404);
                        response.setBody({
                            error: 'Assignment not found'
                        });
                        return;
                    }
                    
                    gr.setValue('status', 'revoked');
                    gr.setValue('revoked_date', new GlideDateTime());
                    gr.setValue('revoked_by', gs.getUserID());
                    gr.setValue('revocation_reason', data.reason || 'Revoked via API');
                    gr.update();
                    
                    response.setBody({
                        success: true,
                        message: 'Access revoked successfully',
                        assignment_id: assignmentId
                    });
                } catch (e) {
                    response.setStatus(500);
                    response.setBody({
                        error: 'Internal server error: ' + e.message
                    });
                }
              })(request, response)
            `,
        },
    ],
})
