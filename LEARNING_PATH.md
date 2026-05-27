# ServiceNow SDK Learning Path

## Overview
This repository contains comprehensive examples for learning the ServiceNow SDK and Fluent language. The SDK allows you to build ServiceNow applications using TypeScript with type safety and modern development practices.

## Prerequisites
- Node.js v20+
- pnpm v9+
- Basic understanding of TypeScript/JavaScript
- Access to a ServiceNow instance

## Setup
```bash
git clone https://github.com/ServiceNow/sdk-examples
pnpm install
```

---

## 🎯 Learning Path

### **Phase 1: Foundation (Start Here)**

#### 1. **Hello World Sample**
📁 [hello-world-sample](./hello-world-sample/README.md)

**Purpose:** Get familiar with SDK setup and basic configuration

**What you'll learn:**
- SDK project structure
- Basic configuration with `now.config.json`
- How to create a simple table using the fluent API
- Build and deployment workflow

**Key Concepts:**
- ServiceNow SDK project initialization
- Fluent API introduction
- Table creation with columns (String, Integer, DateTime)

---

#### 2. **Table Sample**
📁 [table-sample](./table-sample/README.md)

**Purpose:** Deep dive into table creation and schema design

**What you'll learn:**
- Creating tables with various column types
- Extending existing tables
- Adding custom columns
- Creating table indexes for performance
- Table relationships

**Files to explore:**
- `table-simple.now.ts` - Basic table structure
- `table-extends.now.ts` - Extending base tables
- `table-custom-column.now.ts` - Custom column types
- `table-index.now.ts` - Performance optimization with indexes

---

#### 3. **Record Sample**
📁 [record-sample](./record-sample/README.md)

**Purpose:** Learn low-level record manipulation

**What you'll learn:**
- Direct record API for CRUD operations
- Accessing and setting field values
- Working with any table dynamically
- Low-level data operations

**Key Concepts:**
- Record API as the foundation for data manipulation
- Field-level access and updates
- Dynamic table interaction

---

### **Phase 2: Business Logic**

#### 4. **Business Rule Sample**
📁 [businessrule-sample](./businessrule-sample/README.md)

**Purpose:** Implement server-side business logic

**What you'll learn:**
- Creating business rules
- When conditions (before/after, insert/update/delete)
- Server-side data validation
- Automated workflows

**Use Cases:**
- Data validation before saving
- Automatic field calculations
- Cascading updates
- Audit trail creation

---

#### 5. **Client Script Sample**
📁 [clientscript-sample](./clientscript-sample/README.md)

**Purpose:** Add client-side interactivity

**What you'll learn:**
- Client-side form validation
- Field interactions (onChange, onLoad, onSubmit)
- User experience enhancement
- Client-side business logic

**Key Difference:** Runs in the browser vs server (Business Rules)

---

#### 6. **Script Include Sample**
📁 [script-include-sample](./script-include-sample/README.md)

**Purpose:** Create reusable server-side code libraries

**What you'll learn:**
- Creating reusable functions
- Type definitions for script includes
- Using `Now.include` for dependencies
- Server-side typing with tsconfig
- Dependency management with `now-sdk dependencies`

**Best Practice:** Centralize common logic for reuse across business rules, REST APIs, etc.

---

### **Phase 3: User Interface**

#### 7. **UI Action Sample**
📁 [uiaction-sample](./uiaction-sample/README.md)

**Purpose:** Add custom buttons and actions

**What you'll learn:**
- Creating custom buttons on forms and lists
- Client and server-side UI actions
- Conditional button visibility
- Action handling

---

#### 8. **List Sample**
📁 [list-sample](./list-sample/README.md)

**Purpose:** Customize list views

**What you'll learn:**
- Creating custom list layouts
- Configuring list columns
- List controls and filters

---

#### 9. **UI Page Sample**
📁 [uipage-sample](./uipage-sample/README.md)

**Purpose:** Build custom UI pages

**What you'll learn:**
- Creating custom pages
- Basic UI page structure
- Integration with ServiceNow

---

### **Phase 4: Modern Frontend Frameworks**

#### 10. **React UI Page (TypeScript) Sample**
📁 [react-ui-page-ts-sample](./react-ui-page-ts-sample/README.md)

**Purpose:** Build modern UIs with React and TypeScript

**What you'll learn:**
- React component development in ServiceNow
- TypeScript integration
- Modern frontend patterns
- Component lifecycle

**Recommended:** Start here for frontend development

---

#### 11. **Vue/Svelte/SolidJS UI Page Samples**
📁 [vue-ui-page-sample](./vue-ui-page-sample/README.md) | [svelte-ui-page-sample](./svelte-ui-page-sample/README.md) | [solidjs-ui-page-sample](./solidjs-ui-page-sample/README.md)

**Purpose:** Explore alternative frontend frameworks

**What you'll learn:**
- Framework choice flexibility
- Comparative framework approaches
- Modern reactive patterns

**Note:** Pick one based on your preference or team standards

---

### **Phase 5: Integration & APIs**

#### 12. **REST API Sample**
📁 [restapi-sample](./restapi-sample/README.md)

**Purpose:** Create custom APIs

**What you'll learn:**
- Scripted REST API creation
- HTTP methods (GET, POST, PUT, DELETE)
- Request/response handling
- API versioning
- Integration with external systems

**Use Cases:**
- Mobile app backends
- Third-party integrations
- Webhook endpoints

---

#### 13. **Script Action Sample**
📁 [scriptaction-sample](./scriptaction-sample/README.md)

**Purpose:** Create automated actions

**What you'll learn:**
- Background script execution
- Scheduled actions
- Event-driven automation

---

### **Phase 6: Advanced Features**

#### 14. **ACL Sample**
📁 [acl-sample](./acl-sample/README.md)

**Purpose:** Implement security and access control

**What you'll learn:**
- Access Control Lists
- Role-based permissions
- Field-level security
- Conditional access rules

**Critical:** Security should be implemented early in real applications

---

#### 15. **Application Menu Sample**
📁 [applicationmenu-sample](./applicationmenu-sample/README.md)

**Purpose:** Organize application navigation

**What you'll learn:**
- Creating application menus
- Module organization
- Navigation structure
- User experience design

---

#### 16. **Service Catalog Sample**
📁 [service-catalog-sample](./service-catalog-sample/README.md)

**Purpose:** Build service catalog items

**What you'll learn:**
- Catalog item creation
- Variable sets
- Workflow integration
- Request fulfillment

**Use Cases:**
- IT service requests
- HR onboarding
- Asset requests

---

#### 17. **Service Portal Sample**
📁 [service-portal-sample](./service-portal-sample/README.md)

**Purpose:** Create custom portals

**What you'll learn:**
- Service Portal widgets
- Portal pages
- User-facing portals
- Widget dependencies

**Use Cases:**
- Employee self-service
- Customer portals
- Knowledge bases

---

#### 18. **Flow Sample**
📁 [flow-sample](./flow-sample/README.md)

**Purpose:** Visual workflow automation

**What you'll learn:**
- Flow Designer integration
- Flow actions
- Flow triggers
- Process automation

---

#### 19. **Dependencies Sample**
📁 [dependencies-sample](./dependencies-sample/README.md)

**Purpose:** Manage external table references

**What you'll learn:**
- Referencing tables from other apps/scopes
- Using `now.config.json` for dependencies
- Fetching external table definitions
- Cross-scope development

**Important:** Essential for complex multi-app environments

---

### **Phase 7: Testing & Quality**

#### 20. **Automated Test Framework (ATF) Sample**
📁 [test-atf-sample](./test-atf-sample/README.md)

**Purpose:** Write automated tests

**What you'll learn:**
- Creating ATF tests
- Test automation
- Quality assurance
- Regression prevention

**Best Practice:** Write tests as you develop, not after

---

## 📚 Recommended Learning Sequence

### Beginner Path (2-3 weeks)
1. Hello World → 2. Table → 3. Record → 4. Business Rule → 5. Client Script → 7. UI Action

### Intermediate Path (3-4 weeks)
6. Script Include → 8. List → 12. REST API → 14. ACL → 15. Application Menu → 20. ATF

### Advanced Path (4-6 weeks)
10. React UI Page → 16. Service Catalog → 17. Service Portal → 18. Flow → 19. Dependencies

### Full Stack Development Path
Combine: Table → Record → Business Rule → Script Include → REST API → React UI Page → ATF

---

## 🛠️ How to Use Each Example

For each sample:
1. Navigate to the sample directory: `cd <sample-name>`
2. Review the README.md file
3. Examine the `src/fluent/` directory for code
4. Check `now.config.json` for configuration
5. Run `pnpm install` (if not done globally)
6. Run `pnpm run build` to compile
7. Deploy to your ServiceNow instance

---

## 💡 Key Concepts Throughout

### Fluent API
- Type-safe API design
- Chainable method calls
- IntelliSense support
- Compile-time validation

### Project Structure
- `src/fluent/` - Your application code
- `src/fluent/generated/` - Auto-generated types and definitions
- `now.config.json` - SDK configuration
- `package.json` - Dependencies

### Build & Deploy
- TypeScript compilation to ServiceNow-compatible code
- Automated deployment to instances
- Source control integration

---

## 🎓 Tips for Learning

1. **Start Small:** Don't skip Hello World and Table samples
2. **Build Incrementally:** Create a simple app and add features as you learn
3. **Read the Docs:** Each README links to official documentation
4. **Experiment:** Modify examples to understand behavior
5. **Type Safety:** Pay attention to TypeScript errors - they prevent runtime issues
6. **Test Early:** Use ATF sample to learn testing patterns
7. **Security First:** Review ACL sample before production deployments

---

## 🚀 Suggested First Project

**Build a Simple Task Management App:**
1. Create a custom table (Table sample)
2. Add business rules for validation (Business Rule sample)
3. Add client scripts for UX (Client Script sample)
4. Create a REST API (REST API sample)
5. Build a React UI (React UI Page sample)
6. Add tests (ATF sample)

This will give you hands-on experience with the most common SDK features!

---

## 📖 Additional Resources

- [ServiceNow SDK Documentation](https://docs.servicenow.com/csh?topicname=servicenow-sdk.html)
- Official API documentation linked in each sample's README
- ServiceNow Developer Portal for instance setup

---

## Next Steps

1. Set up your development environment
2. Start with Hello World sample
3. Work through Phase 1 in order
4. Build small projects to reinforce learning
5. Gradually move to advanced topics based on your needs
