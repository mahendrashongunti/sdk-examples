# IT Access Management System

A comprehensive, enterprise-grade IT Access Management System built with ServiceNow SDK. This full-stack smart application demonstrates best practices for building ServiceNow applications using modern technologies.

## 🎯 Features

### Core Functionality
- **Access Request Management**: Create, track, and manage IT access requests
- **Approval Workflow**: Multi-level approval process with automatic routing
- **Access Assignment**: Track active access assignments with expiration dates
- **Access Types**: Configurable catalog of available access types
- **Role-Based Security**: Comprehensive ACL implementation
- **Modern UI**: React-based dashboard with TypeScript
- **REST API**: Full RESTful API for external integrations
- **Automation**: Business rules for workflow automation

### Key Components

#### 📊 Data Model
- **Access Request Table** (`x_itaccess_request`)
  - Tracks all access requests with full lifecycle
  - Includes priority, emergency flags, and approval tracking
  
- **Access Type Table** (`x_itaccess_access_type`)
  - Catalog of available access types (applications, servers, databases, etc.)
  - Configuration for SLA, approval requirements, and auto-provisioning
  
- **Access Assignment Table** (`x_itaccess_assignment`)
  - Tracks active access with expiration dates
  - Supports revocation and access reviews
  
- **Approval Table** (`x_itaccess_approval`)
  - Multi-level approval workflow tracking

#### ⚙️ Business Logic
- **Business Rules**: Automated workflow management
  - Auto-populate requested_by field
  - Create approval records on submission
  - Auto-provision access when approved
  - Validate required dates
  
- **Client Scripts**: Enhanced user experience
  - Dynamic form field visibility
  - Business justification validation
  - Emergency request warnings
  - Access type information display
  
- **Script Includes**: Reusable server-side functions
  - AccessManagementUtils: Core access management operations
  - ApprovalEngine: Approval workflow processing

#### 🎨 User Interface
- **UI Actions**: Context-sensitive buttons
  - Submit for Approval
  - Approve/Reject
  - Complete Provisioning
  - Revoke Access
  
- **React Dashboard**: Modern, responsive web interface
  - Dashboard with key metrics and recent activity
  - Request list with filtering and search
  - Request form with validation
  - My Access view for user self-service
  
#### 🔌 Integration
- **REST API** (`/api/itaccess/v1`)
  - `POST /requests` - Create new access request
  - `GET /requests/{id}` - Get request details
  - `GET /requests` - List requests with filters
  - `GET /users/{id}/access` - Get user's active access
  - `PUT /requests/{id}/approve` - Approve request
  - `PUT /requests/{id}/reject` - Reject request
  - `DELETE /assignments/{id}` - Revoke access

#### 🔒 Security
- **Roles**:
  - `x_itaccess.user` - Create and view own requests
  - `x_itaccess.approver` - Approve/reject requests
  - `x_itaccess.fulfiller` - Fulfill approved requests
  - `x_itaccess.admin` - Full administrative access
  
- **ACLs**: Comprehensive security for all tables and operations

#### 📱 Application Menu
- Dashboard
- My Requests
- Pending Approvals
- All Requests
- My Access
- All Assignments
- Access Types (Admin)
- Create New Request

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- pnpm v9+
- ServiceNow instance (PDI or higher)

### Installation

1. Clone the repository:
```bash
cd it-access-management-sample
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure your ServiceNow instance in `now.config.json`

4. Build the application:
```bash
pnpm run build
```

5. Deploy to ServiceNow:
```bash
pnpm run deploy
```

## 📁 Project Structure

```
it-access-management-sample/
├── src/
│   ├── fluent/              # Server-side ServiceNow code
│   │   ├── tables/          # Table definitions
│   │   ├── business-rules/  # Business rule automation
│   │   ├── client-scripts/  # Client-side form logic
│   │   ├── script-includes/ # Reusable server functions
│   │   ├── ui-actions/      # Custom buttons
│   │   ├── rest-api/        # REST API endpoints
│   │   ├── ui-pages/        # UI page configurations
│   │   ├── acls/            # Security access controls
│   │   └── application-menu/# Navigation menu
│   └── client/              # React frontend application
│       ├── components/      # React components
│       ├── services/        # API service classes
│       └── types/           # TypeScript interfaces
├── package.json
├── now.config.json
└── README.md
```

## 💻 Usage

### For End Users
1. Navigate to **IT Access Management > Dashboard**
2. Click **"+ New Access Request"**
3. Select the access type you need
4. Provide business justification (minimum 20 characters)
5. Set required date
6. Click **"Create Request"** to save as draft
7. Click **"Submit for Approval"** when ready

### For Approvers
1. Navigate to **IT Access Management > Pending Approvals**
2. Review request details
3. Click **"Approve"** or **"Reject"**
4. For rejection, provide a reason

### For Administrators
1. Navigate to **IT Access Management > Access Types**
2. Configure available access types
3. Set approval requirements and SLA
4. Configure auto-provisioning if applicable
5. Monitor all requests and assignments

## 🔧 Configuration

### Adding New Access Types
1. Navigate to **IT Access Management > Access Types**
2. Click **"New"**
3. Fill in:
   - Name and description
   - Category (application, network, database, etc.)
   - Risk level
   - Approval requirements
   - SLA hours
   - Fulfillment group
4. Save

### Configuring Approvals
Edit business rules in `src/fluent/business-rules/create-approvals.now.ts` to customize approval routing logic.

### Customizing UI
The React dashboard can be customized by editing components in `src/client/components/`.

## 🔗 API Integration

### Example: Create Access Request via API

```bash
curl -X POST https://instance.service-now.com/api/itaccess/v1/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic <credentials>" \
  -d '{
    "requested_for": "user_sys_id",
    "access_type": "access_type_sys_id",
    "business_justification": "Need access to complete project deliverables",
    "required_date": "2024-12-31",
    "priority": "2"
  }'
```

### Example: Get User's Active Access

```bash
curl -X GET https://instance.service-now.com/api/itaccess/v1/users/{user_id}/access \
  -H "Authorization: Basic <credentials>"
```

## 🎓 Learning Objectives

This sample demonstrates:
- ✅ Complex table relationships and data modeling
- ✅ Business rule automation and workflow
- ✅ Client-side scripting and form validation
- ✅ Reusable script includes
- ✅ UI actions and custom buttons
- ✅ Modern React with TypeScript integration
- ✅ RESTful API development
- ✅ Comprehensive security with ACLs
- ✅ Application menu and navigation
- ✅ Full-stack application architecture

## 🛠️ Technology Stack

- **Backend**: ServiceNow Fluent API, GlideRecord, GlideDateTime
- **Frontend**: React 19, TypeScript
- **Build Tools**: ServiceNow SDK, pnpm
- **API**: RESTful endpoints with JSON
- **Security**: Role-based access control (RBAC)

## 📚 Additional Resources

- [ServiceNow SDK Documentation](https://docs.servicenow.com/csh?topicname=servicenow-sdk.html)
- [Fluent API Reference](https://docs.servicenow.com/csh?topicname=fluent-api.html)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

This is a sample application for learning purposes. Feel free to extend and customize based on your requirements.

## 📄 License

ISC License

## ✨ Highlights

This application showcases enterprise-level patterns:
- **Separation of Concerns**: Clear separation between UI, business logic, and data
- **Reusability**: Script includes and services for code reuse
- **Security First**: Comprehensive ACLs and role-based access
- **User Experience**: Modern, responsive UI with real-time feedback
- **Integration Ready**: Full REST API for external systems
- **Maintainability**: Well-structured code with TypeScript types
- **Scalability**: Designed for growth with configurable access types

Perfect for learning ServiceNow SDK and building production-ready applications!
