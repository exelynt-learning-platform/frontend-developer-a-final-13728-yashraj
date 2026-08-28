# AGENTS.md

## 1. Project Identity

**Project:** Employee Management System

**Role:** Frontend React.js Developer Assessment

**Target:** 0–1 YOE React.js Developer

**Primary Goal:**
Build a clean, responsive, maintainable Employee Management application that satisfies the assessment requirements without unnecessary over-engineering.

---

# 2. Core Objective

The application must allow users to:

- View employees
- Search employee by ID
- Add employees
- Edit employees
- Delete employees
- Confirm before deletion
- Manage employee form validation
- Fetch country data
- Handle loading, error, empty, and not-found states
- Maintain application/server state correctly
- Use reusable components
- Follow Smart/Dumb component architecture
- Provide meaningful unit tests
- Mock API calls during tests

**Priority rule:**

> Assessment requirements always have higher priority than optional features.

---

# 3. Required Technology

Use:

- React
- TypeScript
- Vite
- Redux Toolkit
- RTK Query for API/data fetching where appropriate
- React Hook Form
- Zod
- Material UI (MUI)
- React Router only where routing is genuinely useful
- Vitest
- React Testing Library
- MSW for API mocking
- ESLint
- Prettier
- Git

Do not introduce additional libraries unless there is a clear technical reason.

---

# 4. Architecture Principles

Follow these principles:

1. Prefer feature-based organization.
2. Keep components small and focused.
3. Separate UI from business logic.
4. Keep API logic outside presentation components.
5. Avoid duplicated state.
6. Avoid unnecessary global state.
7. Prefer composition over large components.
8. Use TypeScript instead of `any`.
9. Keep validation rules centralized.
10. Make important behavior testable.

---

# 5. Smart/Dumb Component Architecture

## Smart Components

Smart components may handle:

- API interaction
- RTK Query hooks
- Business logic
- State coordination
- Form submission orchestration
- Mutation handling

Example:

```text
EmployeesPage
```

## Dumb Components

Dumb components should primarily handle:

- Presentation
- Props
- User interaction
- Callback events

Examples:

```text
EmployeeTable
EmployeeSearch
EmployeeForm
DeleteEmployeeDialog
LoadingState
EmptyState
ErrorState
```

Do not put API calls directly inside purely presentational components.

---

# 6. Recommended Folder Structure

```text
src/
├── app/
│   ├── store.ts
│   ├── hooks.ts
│   └── providers.tsx
│
├── features/
│   ├── employees/
│   │   ├── api/
│   │   │   └── employeeApi.ts
│   │   ├── components/
│   │   │   ├── EmployeeTable.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   ├── EmployeeSearch.tsx
│   │   │   └── DeleteEmployeeDialog.tsx
│   │   ├── pages/
│   │   │   └── EmployeesPage.tsx
│   │   ├── schemas/
│   │   │   └── employeeSchema.ts
│   │   ├── types/
│   │   │   └── employee.types.ts
│   │   └── utils/
│   │
│   └── countries/
│       ├── api/
│       │   └── countryApi.ts
│       └── types/
│
├── components/
│   ├── common/
│   │   ├── LoadingState.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── ConfirmDialog.tsx
│   └── layout/
│
├── routes/
├── lib/
├── styles/
├── tests/
│   ├── handlers/
│   └── setup.ts
│
├── App.tsx
└── main.tsx
```

Do not create folders that have no meaningful responsibility.

---

# 7. Employee Data Requirements

The employee form must contain:

- Name
- Email
- Mobile
- Country
- State
- District

The employee list must display:

- Name
- Email
- Mobile
- Country

Do not invent additional mandatory business fields.

---

# 8. API Requirements

Use the provided MockAPI unless there is a clear reason to replace it.

## Countries

```text
GET /country
```

## Employees

```text
GET /employee
GET /employee/:id
POST /employee
PUT /employee/:id
DELETE /employee/:id
```

Keep the API base URL configurable.

Do not hard-code the full API URL throughout components.

---

# 9. API Architecture

Prefer:

```text
Component
    ↓
RTK Query
    ↓
API Endpoint
    ↓
REST API
```

Do not write repeated `fetch()` calls inside multiple components.

API-related code should be centralized.

---

# 10. Redux Rules

Use Redux Toolkit.

Use RTK Query for server/API state where appropriate.

Do not put every piece of UI state into Redux.

## Prefer local state for:

- Modal open/close
- Temporary UI state
- Simple selected item state where appropriate

## Prefer React Hook Form for:

- Form values
- Form submission
- Field state

## Prefer RTK Query for:

- Employees
- Employee-by-ID requests
- Countries
- Loading states related to requests
- API errors
- Cache management

Avoid duplicated server data in multiple Redux locations.

---

# 11. Employee List Flow

```text
EmployeesPage
    ↓
Request employees
    ↓
Loading
    ↓
API response
    ↓
Success
    ↓
EmployeeTable
```

Handle:

```text
Loading
Success
Empty
Error
```

Never show an empty state when the API request actually failed.

---

# 12. Search Flow

Required behavior:

```text
User enters Employee ID
        ↓
Search
        ↓
GET /employee/:id
        ↓
Loading
        ↓
Result
```

Success:

```text
Show employee
```

Not found:

```text
Show clear "Employee not found" message
```

Error:

```text
Show recoverable error
```

Keep the searched ID visible where useful.

Do not invent an ID format that conflicts with the actual API.

---

# 13. Create Flow

```text
Add Employee
     ↓
EmployeeForm
     ↓
User enters data
     ↓
Client validation
     ↓
POST /employee
     ↓
Loading
     ↓
Success
     ↓
Update/invalidate employee data
     ↓
Success feedback
```

On failure:

```text
Keep useful user input
Show error
Allow retry
```

---

# 14. Edit Flow

```text
Edit employee
     ↓
Load existing employee
     ↓
Pre-populate form
     ↓
User edits
     ↓
Validation
     ↓
PUT /employee/:id
     ↓
Success
     ↓
Update/invalidate employee data
```

The edit form must not behave like a blank create form.

---

# 15. Delete Flow

```text
Delete clicked
     ↓
Confirmation dialog
     ↓
Cancel OR Delete
```

If Delete:

```text
DELETE /employee/:id
     ↓
Loading
     ↓
Success
     ↓
Update/invalidate employee data
     ↓
Success feedback
```

Never delete immediately without confirmation.

Prevent duplicate delete requests while deletion is in progress.

---

# 16. Form Validation

Use:

```text
React Hook Form
        +
Zod
```

Validate:

- Required fields
- Email format
- Appropriate field lengths
- Valid form submission

Show errors near the relevant field.

Do not use AI to determine basic validation rules.

Deterministic validation must remain deterministic.

---

# 17. Country / State / District

The form must contain:

```text
Country
State
District
```

If the Country API does not provide State/District data, do not invent that API behavior.

Use a suitable local/mock data source if necessary.

If State/District depend on Country/State, clear invalid dependent selections when the parent selection changes.

---

# 18. UI States

Every important asynchronous workflow should have an appropriate state.

Required states:

```text
Loading
Success
Empty
Error
Not Found
Validation Error
Delete Confirmation
```

Recommended feedback:

```text
Employee added successfully.
Employee updated successfully.
Employee deleted successfully.
```

Use a non-blocking Snackbar/Toast where appropriate.

---

# 19. Responsive Requirements

The application must work on:

- Desktop
- Tablet
- Mobile

Reference sizes:

```text
Desktop: 1440px
Tablet: 768px
Mobile: 390px
```

Do not simply shrink desktop UI.

On mobile:

- Forms should become single-column.
- Actions should remain usable.
- Inputs should remain readable.
- Tables should use an appropriate responsive strategy.
- Touch targets should be comfortable.
- No horizontal page overflow.

---

# 20. Accessibility

Implement basic accessibility:

- Proper labels
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Accessible dialogs
- Field-associated error messages
- Meaningful button text
- Do not communicate status through color alone

Do not add ARIA attributes unnecessarily. Prefer semantic HTML first.

---

# 21. Testing Requirements

Use:

```text
Vitest
React Testing Library
MSW
```

Tests should focus on user-visible behavior and important application behavior.

Cover:

### Components

- Employee table
- Employee form
- Search
- Delete dialog

### Validation

- Required fields
- Invalid email
- Invalid field length
- Valid submission

### API

- GET success
- GET failure
- POST success/failure
- PUT success/failure
- DELETE success/failure

### Interactions

- Add employee
- Edit employee
- Delete employee
- Cancel deletion
- Search employee
- Employee not found

### UI states

- Loading
- Empty
- Error
- Success

Never depend on the live API during tests.

---

# 22. TypeScript Rules

Avoid:

```ts
any;
```

unless there is a documented technical reason.

Create meaningful types for:

```text
Employee
Country
CreateEmployeeRequest
UpdateEmployeeRequest
API error
Form values
Component props
```

Avoid unnecessary type duplication.

---

# 23. Error Handling

Never expose raw technical errors unnecessarily.

Bad:

```text
500 Internal Server Error
```

Better:

```text
Unable to load employees.
Please try again.
```

Log technical information appropriately during development without exposing unnecessary implementation details to users.

---

# 24. Performance Rules

Do not prematurely optimize.

Prefer:

- Avoid unnecessary API calls
- Use RTK Query caching
- Avoid duplicated state
- Keep components focused
- Avoid unnecessary renders
- Lazy-load only when justified

Do not blindly add:

```text
useMemo
useCallback
React.memo
```

Use them when profiling or component behavior justifies them.

---

# 25. UI Library Rules

Use MUI consistently.

Prefer existing components:

```text
Button
TextField
Select
Dialog
Snackbar
Table
Skeleton
Alert
IconButton
```

Do not mix several UI libraries without a strong reason.

Keep spacing, typography, radius, and interaction states consistent.

---

# 26. AI Coding Rules

AI may assist with:

- Planning
- Boilerplate
- Refactoring
- Test generation
- Debugging
- Documentation
- Edge-case identification

AI-generated code must be reviewed before committing.

Never blindly copy generated code.

Before accepting AI-generated code, verify:

1. Does it satisfy the requirement?
2. Is the TypeScript correct?
3. Is the API behavior correct?
4. Is the state architecture correct?
5. Does it introduce unnecessary complexity?
6. Does it need a test?
7. Does it break an existing feature?

AI must not make architectural decisions without human review.

---

# 27. Optional AI Feature

AI is NOT required.

If an AI feature is added, it should remain a small enhancement.

Preferred example:

```text
Natural-language employee search
```

Example:

```text
"Show employees from India"
```

AI may interpret the request and help filter/search employee data.

AI must NOT replace:

- CRUD logic
- Form validation
- API layer
- Redux state management
- Delete confirmation
- Security/business rules

If the AI feature becomes unreliable or unavailable, the core employee application must continue working.

---

# 28. Features NOT Required

Do not add these unless specifically requested:

- Authentication
- Dashboard
- Reports
- Charts
- Employee profile system
- Complex sidebar
- Roles/RBAC
- Node.js backend
- MongoDB
- AWS
- Docker
- Microservices
- AI chatbot
- Complex animations

Avoid feature creep.

---

# 29. Development Order

Implement in this order:

```text
1. Project setup
2. TypeScript models
3. API configuration
4. Redux/RTK Query
5. Employee list
6. Loading/error/empty states
7. Employee search
8. Employee form
9. Validation
10. Create
11. Edit
12. Delete + confirmation
13. Country/State/District behavior
14. Responsive UI
15. Accessibility
16. Success/error feedback
17. Tests
18. README
19. Lint
20. Test
21. Production build
22. Optional enhancements
```

Do not start with optional features.

---

# 30. Definition of Done

A feature is complete only when:

- It works correctly.
- It is responsive.
- It handles loading.
- It handles errors.
- It handles empty/not-found states where applicable.
- It is properly typed.
- It follows the project architecture.
- It has meaningful tests when behavior is important.
- It does not introduce unnecessary duplication.
- Lint passes.
- Tests pass.
- Production build passes.

Before considering the project complete, run:

```bash
npm run lint
npm run test
npm run build
```

---

# 31. Final Engineering Principle

Build the smallest application that completely satisfies the assessment.

Prioritize:

```text
Correctness
    >
Maintainability
    >
Testability
    >
Accessibility
    >
Performance
    >
Optional features
```

Do not add complexity merely to make the project look advanced.

The project should demonstrate that the developer can take a real frontend requirement and turn it into a reliable React application.
