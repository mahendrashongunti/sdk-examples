# IT Access Management - Test Documentation

## Overview
This document outlines the testing strategy and test cases for the IT Access Management System.

## Test Coverage

### 1. Unit Tests

#### Business Rules
- **Set Requested By**: Verify requested_by is auto-populated with current user
- **Create Approvals**: Test approval record creation on state change to pending_approval
- **Auto Provision**: Verify auto-provisioning creates access assignment for approved requests
- **Validate Required Date**: Test date validation and emergency priority setting

#### Client Scripts
- **State Change Handler**: Verify field visibility based on state changes
- **Validate Justification**: Test minimum character validation on submit
- **Emergency Warning**: Verify priority update on emergency flag
- **Load Access Type**: Test access type information display

#### Script Includes
- **AccessManagementUtils**:
  - `hasActiveAccess()` - Verify user access checking
  - `getUserAccessList()` - Test user access retrieval
  - `isExpiringSoon()` - Test expiration date logic
  - `revokeAccess()` - Verify access revocation
  - `extendAccess()` - Test expiration extension

- **ApprovalEngine**:
  - `areAllApprovalsComplete()` - Test approval completion check
  - `isAnyApprovalRejected()` - Verify rejection detection
  - `processApproval()` - Test approval workflow processing
  - `getPendingApprovalsForUser()` - Verify approval list retrieval

### 2. Integration Tests

#### REST API Endpoints
```javascript
// Test: Create Access Request
POST /api/itaccess/v1/requests
Expected: 201 Created with request_id

// Test: Get Request Details
GET /api/itaccess/v1/requests/{id}
Expected: 200 OK with request data

// Test: List Requests with Filters
GET /api/itaccess/v1/requests?state=pending_approval
Expected: 200 OK with filtered results

// Test: Approve Request
PUT /api/itaccess/v1/requests/{id}/approve
Expected: 200 OK, state changed to approved

// Test: Reject Request
PUT /api/itaccess/v1/requests/{id}/reject
Expected: 200 OK, state changed to rejected

// Test: Get User Access
GET /api/itaccess/v1/users/{user_id}/access
Expected: 200 OK with access list

// Test: Revoke Access
DELETE /api/itaccess/v1/assignments/{id}
Expected: 200 OK, status changed to revoked
```

### 3. UI Tests

#### Dashboard Component
- Verify stat cards display correct counts
- Test refresh functionality
- Verify recent requests list populates
- Test access types list display

#### Request List Component
- Test table rendering with data
- Verify filtering by state
- Test approve/reject actions
- Verify pagination if implemented

#### Request Form Component
- Test form validation
- Verify required field enforcement
- Test form submission
- Verify cancel functionality

#### My Access Component
- Test access card display
- Verify expiring soon badge
- Test revoke access functionality

### 4. Security Tests

#### ACL Verification
- **Read Access**: Users can only see their own requests or have approver/admin role
- **Write Access**: Only approvers and admins can modify requests
- **Delete Access**: Only admins can delete records
- **Role Enforcement**: Verify each role has appropriate permissions

### 5. Workflow Tests

#### Complete Request Lifecycle
1. User creates access request (state: draft)
2. User submits for approval (state: pending_approval)
3. Approval records are created
4. Manager approves (approval state: approved)
5. Security approves (approval state: approved)
6. Request state changes to approved
7. Access is auto-provisioned if configured
8. Assignment record created with expiration date
9. User can view active access in "My Access"

#### Rejection Workflow
1. User creates and submits request
2. Approver rejects with reason
3. Request state changes to rejected
4. Rejection reason is stored

#### Revocation Workflow
1. Admin selects active access
2. Admin provides revocation reason
3. Assignment status changes to revoked
4. Revocation details are stored

### 6. Edge Cases

#### Business Logic
- Request with past required date (should fail)
- Emergency request (should set priority to Critical)
- Request with missing required fields (should fail validation)
- Approval by unauthorized user (should fail)
- Auto-provision for non-configured access type (should go to in_progress)

#### API
- Invalid request ID (404 Not Found)
- Missing required fields (400 Bad Request)
- Unauthorized access (401/403)
- Malformed JSON payload (400 Bad Request)

#### UI
- Empty state displays when no data
- Loading states show during API calls
- Error messages display on failures
- Form validation prevents invalid submissions

## Automated Test Framework (ATF) Tests

### Recommended ATF Test Suite

#### Test 1: Create Access Request
```
Test Steps:
1. Impersonate user
2. Open access request form
3. Set access_type field
4. Set business_justification (>20 chars)
5. Set required_date (future date)
6. Submit form
7. Verify record created
8. Verify state is 'draft'
```

#### Test 2: Submit for Approval
```
Test Steps:
1. Create access request
2. Click "Submit for Approval" UI action
3. Verify state changed to 'pending_approval'
4. Verify approval records created
```

#### Test 3: Approve Request
```
Test Steps:
1. Create and submit access request
2. Impersonate approver
3. Open request
4. Click "Approve" UI action
5. Verify state changed to 'approved'
```

#### Test 4: API Integration Test
```
Test Steps:
1. Call REST API to create request
2. Verify response code 201
3. Call REST API to get request
4. Verify response contains correct data
```

## Performance Tests

### Load Tests
- Create 100 concurrent access requests
- Process 50 simultaneous approvals
- Query 1000 access assignments
- API response time should be <2s

### Database Tests
- Verify indexes on foreign keys
- Check query performance on large datasets
- Test concurrent updates

## Test Data Setup

### Prerequisites
```
- Create test users (requester, approver, admin)
- Create test access types (application, network, database)
- Assign appropriate roles to test users
- Create sample approval groups
```

### Sample Test Data
```javascript
// Test User 1: Requester
User: John Doe (john.doe@example.com)
Role: x_itaccess.user

// Test User 2: Approver
User: Jane Smith (jane.smith@example.com)  
Role: x_itaccess.approver

// Test User 3: Admin
User: Admin User (admin@example.com)
Role: x_itaccess.admin

// Test Access Types
1. "Salesforce Access" - Application, Requires Approval
2. "VPN Access" - Network, Auto-Provision
3. "Database Read Access" - Database, Requires Approval
```

## Test Execution

### Manual Testing Checklist
- [ ] Create access request
- [ ] Submit for approval
- [ ] Approve request
- [ ] Reject request
- [ ] View my access
- [ ] Revoke access
- [ ] Test all UI actions
- [ ] Test REST API endpoints
- [ ] Verify security (ACLs)
- [ ] Test dashboard metrics

### Automated Testing
```bash
# Run all ATF tests
Navigate to: Automated Test Framework > Run Test Suite
Select: IT Access Management Test Suite
Click: Run Test Suite
```

## Bug Reporting

### Template
```
Title: [Component] Brief description
Priority: Critical/High/Medium/Low
Steps to Reproduce:
1. Step one
2. Step two
Expected Result: What should happen
Actual Result: What actually happens
Environment: Instance name, browser, version
```

## Test Metrics

### Success Criteria
- 100% of critical paths tested
- 0 critical bugs
- <5 medium/low bugs
- All security tests passed
- API response time <2s
- UI load time <3s

## Continuous Testing

### Pre-Deployment Checklist
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Browser compatibility verified
- [ ] API documentation updated
- [ ] User acceptance testing complete

## Future Test Enhancements

1. **Load Testing**: Implement JMeter or similar for load testing
2. **UI Automation**: Add Selenium tests for end-to-end UI testing
3. **Security Scanning**: Integrate automated security vulnerability scanning
4. **Code Coverage**: Aim for 80%+ code coverage
5. **Regression Suite**: Build comprehensive regression test suite
