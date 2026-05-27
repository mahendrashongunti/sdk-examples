export interface AccessRequest {
    sys_id: string | { value: string; display_value: string }
    number: string | { value: string; display_value: string }
    requested_for: string | { value: string; display_value: string }
    requested_by: string | { value: string; display_value: string }
    access_type: string | { value: string; display_value: string }
    state: string | { value: string; display_value: string }
    priority: string | { value: string; display_value: string }
    business_justification: string | { value: string; display_value: string }
    requested_date: string | { value: string; display_value: string }
    required_date: string | { value: string; display_value: string }
    is_emergency: boolean | { value: string; display_value: string }
}

export interface AccessType {
    sys_id: string | { value: string; display_value: string }
    name: string | { value: string; display_value: string }
    description: string | { value: string; display_value: string }
    category: string | { value: string; display_value: string }
    requires_approval: boolean | { value: string; display_value: string }
    sla_hours: number | { value: string; display_value: string }
    active: boolean | { value: string; display_value: string }
}

export interface AccessAssignment {
    sys_id: string | { value: string; display_value: string }
    user: string | { value: string; display_value: string }
    access_type: string | { value: string; display_value: string }
    granted_date: string | { value: string; display_value: string }
    expiration_date: string | { value: string; display_value: string }
    status: string | { value: string; display_value: string }
}

export interface Approval {
    sys_id: string | { value: string; display_value: string }
    access_request: string | { value: string; display_value: string }
    approver: string | { value: string; display_value: string }
    approval_type: string | { value: string; display_value: string }
    state: string | { value: string; display_value: string }
    requested_date: string | { value: string; display_value: string }
}
