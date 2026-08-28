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
- RTK Query for API/data fetching
- React Hook Form
- Zod
- Material UI (MUI)
- React Router only if routing becomes genuinely necessary
- Vitest
- React Testing Library
- MSW for API mocking
- ESLint
- Prettier
- Git

Use stable versions available at implementation time.

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
11. Prefer simple solutions over unnecessary abstraction.
12. Do not over-engineer a 0–1 YOE assessment project.

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

If React Router is not actually required, do not create unnecessary route infrastructure.

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

Use RTK Query for server state, caching, request status, and cache invalidation where appropriate.

---

# 10. Redux Rules

Use Redux Toolkit.

Use RTK Query for server/API state.

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
- Request loading states
- API errors
- Cache management

Avoid duplicating server data in multiple Redux locations.

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

Use the same reusable EmployeeForm for Create and Edit.

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

Validation must be deterministic and handled by application code.

Do not use AI to determine or execute basic validation logic.

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

Document any necessary data-source decision.

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

Prefer semantic HTML first.

Do not add ARIA attributes unnecessarily.

---

# 21. Testing Requirements

Use:

```text
Vitest
React Testing Library
MSW
```

Tests should focus on user-visible behavior and important application behavior.

## Components

- Employee table
- Employee form
- Search
- Delete dialog

## Validation

- Required fields
- Invalid email
- Invalid field length
- Valid submission

## API

- GET success
- GET failure
- POST success/failure
- PUT success/failure
- DELETE success/failure

## Interactions

- Add employee
- Edit employee
- Delete employee
- Cancel deletion
- Search employee
- Employee not found

## UI states

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

Do not use TypeScript merely to add types everywhere. Types should improve correctness and maintainability.

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

Differentiate:

```text
Not Found
Validation Error
Network/API Error
```

Do not convert every failure into the same user message.

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

Use them only when component behavior or profiling justifies them.

Do not sacrifice readability for micro-optimizations.

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

Use a small centralized theme for visual consistency where appropriate.

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

AI is a development assistant only.

**Do not integrate AI functionality into the Employee Management application.**

AI-generated code must be reviewed before committing.

Never blindly copy generated code.

Before accepting AI-generated code, verify:

1. Does it satisfy the assessment requirement?
2. Is the TypeScript correct?
3. Is the API behavior correct?
4. Is the state architecture correct?
5. Does it introduce unnecessary complexity?
6. Does it need a test?
7. Does it break an existing feature?
8. Does it follow this `AGENTS.md` file?
9. Does it introduce an unnecessary dependency?

AI must not make architectural decisions without human review.

When asking an AI coding agent to modify the project:

- Give one meaningful task at a time.
- Explain the relevant requirement.
- Ask it to inspect existing code before changing it.
- Do not ask it to rewrite the entire project unnecessarily.
- Review the diff after every significant change.
- Run tests, lint, and build after meaningful changes.

The human developer remains responsible for the final code.

---

# 27. Features NOT Required

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
- AI integration
- Complex animations

Avoid feature creep.

---

# 28. Project Setup and Initialization

The project must use:

```text
Vite
React
TypeScript
```

Do not replace Vite with Create React App or another build tool.

Use stable versions available at implementation time.

Avoid unnecessary version changes after project initialization.

---

# 29. Initial Project Creation

Create the project using the Vite React TypeScript template.

Expected flow:

```text
Create Vite project
      ↓
Select React
      ↓
Select TypeScript
      ↓
Install dependencies
      ↓
Start development server
      ↓
Verify application
```

The initial project must successfully run before adding application features.

---

# 30. Dependency Installation

Install only dependencies required by the project.

Core:

```text
React
React DOM
Redux Toolkit
React Redux
React Hook Form
Zod
MUI
```

React Router should be installed only if routing is genuinely required.

Development/testing:

```text
Vitest
React Testing Library
MSW
ESLint
Prettier
```

Do not install a package merely because it is popular.

Every additional dependency must have a clear technical purpose.

---

# 31. Project Configuration Order

Configure in this order:

```text
1. Verify Vite + React + TypeScript
2. Configure ESLint
3. Configure Prettier
4. Configure environment variables
5. Configure MUI/theme
6. Configure Redux store
7. Configure RTK Query
8. Configure React Router only if required
9. Configure Vitest
10. Configure React Testing Library
11. Configure MSW
12. Create application folders
```

Do not build feature functionality before the foundation is stable.

---

# 32. Environment Configuration

The API base URL must not be hard-coded throughout the application.

Use:

```text
VITE_API_BASE_URL
```

Recommended files:

```text
.env
.env.example
```

Do not commit secrets or private credentials.

The provided MockAPI URL is not a secret, but keeping it configurable improves maintainability.

---

# 33. NPM Scripts

Provide working scripts for:

```text
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

Where useful:

```text
npm run test:run
```

Document the scripts in the README.

---

# 34. Initial Verification Gate

Before implementing Employee Management functionality, verify:

```text
✓ Vite starts successfully
✓ React renders successfully
✓ TypeScript compilation works
✓ ESLint works
✓ Production build works
✓ Test runner works
```

Minimum verification:

```bash
npm run dev
npm run lint
npm run build
npm run test
```

Do not proceed to feature implementation if the foundation is broken.

---

# 35. Git Initialization

Initialize Git before substantial feature development.

Recommended initial commits:

```text
chore: initialize React TypeScript Vite project
chore: configure development tooling
chore: configure testing environment
```

Use small, meaningful commits.

Avoid meaningless messages such as:

```text
final
changes
working
update
```

---

# 36. Setup Completion Criteria

Project setup is complete only when:

```text
✓ React + TypeScript + Vite project runs
✓ Required dependencies are installed
✓ Folder structure is created
✓ API configuration exists
✓ Redux foundation exists
✓ Testing foundation exists
✓ Lint passes
✓ Build passes
✓ Test runner passes
✓ Git repository is initialized
```

Only after these checks should Employee Management features be implemented.

---

# 37. Implementation Sequence

After setup is verified, continue in this exact order:

```text
1. Define Employee and Country types
2. Inspect actual API response structures
3. Configure API base query
4. Create employee API endpoints
5. Create country API endpoint
6. Configure RTK Query tags/cache strategy
7. Build EmployeesPage
8. Build EmployeeTable
9. Implement employee list GET
10. Implement loading/error/empty states
11. Build EmployeeSearch
12. Implement employee-by-ID search
13. Implement not-found state
14. Build reusable EmployeeForm
15. Implement Zod validation
16. Implement Country/State/District fields
17. Implement Create
18. Implement Edit + pre-population
19. Implement Delete + confirmation
20. Implement success/error feedback
21. Implement responsive behavior
22. Implement accessibility
23. Write tests
24. Mock API requests with MSW
25. Run lint/tests/build
26. Review architecture and remove unnecessary code
27. Update README
28. Deploy only after local verification
29. Consider optional enhancements only after all requirements pass
```

---

# 38. API Contract Verification Rule

Before writing API-dependent logic, inspect the actual response from the provided API.

Do not assume:

```text
Employee fields
Country fields
State data
District data
ID format
Error response format
```

If the real API response differs from assumptions, adapt the implementation to the actual contract and document the decision.

Do not invent API behavior.

---

# 39. Development Workflow

Work on one meaningful feature at a time.

For each feature:

```text
Requirement
    ↓
Inspect existing code
    ↓
Implementation
    ↓
Test
    ↓
Manual verification
    ↓
Lint
    ↓
Review diff
    ↓
Commit
```

Do not implement multiple unrelated features simultaneously.

After significant changes, verify that existing functionality still works.

---

# 40. Scope Protection During Development

If a proposed feature is not required by the assessment, classify it as:

```text
MUST
GOOD TO HAVE
OPTIONAL
```

Do not implement OPTIONAL features while any MUST requirement is incomplete.

The project must remain a focused Employee Management System.

---

# 41. First Coding Milestone

The first coding milestone after setup is:

```text
Vite + React + TypeScript
        ↓
MUI
        ↓
Redux Toolkit / RTK Query
        ↓
API configuration
        ↓
Employee + Country types
        ↓
Employee GET endpoint
        ↓
Employee List screen
```

At this milestone, the application should be able to:

```text
Start
  ↓
Fetch employees
  ↓
Show loading
  ↓
Show employees
  ↓
Show empty state
  ↓
Show API error
```

Do not implement Create/Edit/Delete before the read/list flow is stable.

---

# 42. Engineering Gate Before CRUD

Before starting POST/PUT/DELETE, verify:

```text
✓ API layer works
✓ Types match actual API responses
✓ RTK Query is configured correctly
✓ Employee list renders correctly
✓ Loading works
✓ Empty works
✓ Error works
✓ Responsive list works
✓ Basic tests work
```

Only then continue to Create, Edit, and Delete.

---

# 43. UI Structure

The application should use a clean, professional admin-style layout focused only on Employee Management.

## Main Layout

```text
App
│
├── Header
│   ├── Application title
│   └── Optional user/context area
│
└── Main Content
    │
    └── Employees Page
        ├── Page title
        ├── Employee ID Search
        ├── Add Employee action
        └── Employee List/Table
            ├── Name
            ├── Email
            ├── Mobile
            ├── Country
            └── Actions
                ├── Edit
                └── Delete
```

Do NOT add a permanent sidebar unless a real product requirement requires multiple application modules.

Do NOT add Dashboard, Reports, Settings, Analytics, or unrelated navigation.

---

# 44. Required Screens and UI States

The application should visually support:

```text
1. Employee List - Default
2. Employee List - Loading
3. Employee List - Empty
4. Employee List - API Error
5. Employee Search - Employee Found
6. Employee Search - Employee Not Found
7. Add Employee - Default
8. Add Employee - Validation Errors
9. Add Employee - Submitting
10. Add Employee - API Error
11. Edit Employee - Prefilled
12. Edit Employee - Validation Errors
13. Edit Employee - Saving
14. Edit Employee - API Error
15. Delete Confirmation
16. Delete - Processing
17. Delete - API Error
18. Success Feedback
```

Every state must have clear visual and interaction behavior.

---

# 45. Employee List UI

The Employee List is the primary screen.

Recommended hierarchy:

```text
Employees
    │
    ├── Search employee by ID
    ├── Add Employee
    └── Employee Table
```

Table columns:

```text
Name | Email | Mobile | Country | Actions
```

Actions:

```text
Edit
Delete
```

The table should support:

- Clear column hierarchy
- Readable spacing
- Row hover state
- Keyboard focus state
- Disabled state where appropriate
- Responsive behavior

Do not add unnecessary columns.

---

# 46. Add/Edit Form UI

Use one reusable EmployeeForm for both Create and Edit.

```text
EmployeeForm
│
├── Name
├── Email
├── Mobile
├── Country
├── State
├── District
│
└── Actions
    ├── Cancel
    └── Add Employee / Save Changes
```

Create mode:

```text
Title: Add Employee
Primary action: Add Employee
```

Edit mode:

```text
Title: Edit Employee
Primary action: Save Changes
```

Edit mode must receive existing employee data and pre-populate the form.

Do not create two separate forms with duplicated logic.

---

# 47. Form Layout

Desktop:

```text
┌─────────────────────────────────────────┐
│ Add Employee                            │
│                                         │
│ Name             Email                  │
│ [____________]   [____________]         │
│                                         │
│ Mobile           Country                │
│ [____________]   [ Select ▼ ]           │
│                                         │
│ State            District               │
│ [ Select ▼ ]     [ Select ▼ ]           │
│                                         │
│              [Cancel] [Add Employee]    │
└─────────────────────────────────────────┘
```

Mobile:

```text
Add Employee

Name
[________________]

Email
[________________]

Mobile
[________________]

Country
[________________]

State
[________________]

District
[________________]

[Cancel]
[Add Employee]
```

The form must remain usable without horizontal scrolling.

---

# 48. Delete Confirmation UI

Deleting an employee must require explicit confirmation.

```text
┌─────────────────────────────────┐
│ Delete Employee?                │
│                                 │
│ Are you sure you want to delete │
│ John Doe?                       │
│                                 │
│ [Cancel]          [Delete]      │
└─────────────────────────────────┘
```

The Delete action must be visually identifiable as destructive.

While deletion is processing:

```text
Delete → Loading → Disabled
```

Prevent duplicate DELETE requests.

---

# 49. Search UI Flow

Search is specifically based on Employee ID.

```text
[ Employee ID ] [Search]
       │
       ▼
GET /employee/:id
       │
  ┌────┼────┐
  ▼    ▼    ▼
Found NotFound Error
```

### Found

Display the employee information clearly.

### Not Found

Display:

```text
Employee not found.

No employee matches this ID.

[Clear Search]
```

### Error

Display:

```text
Unable to search employee.

[Retry]
```

Do not treat an API error as "Employee not found."

---

# 50. UI State Behavior

## Loading

Show skeleton/progress UI rather than a blank page.

## Empty

API succeeded but there are no employees.

```text
No employees found.
[Add Employee]
```

## Error

API request failed.

```text
Unable to load employees.
[Retry]
```

## Not Found

Specific employee search returned no employee.

```text
Employee not found.
```

## Success

Use non-blocking feedback:

```text
Employee added successfully.
Employee updated successfully.
Employee deleted successfully.
```

---

# 51. Interaction Workflow

## Application startup

```text
Application starts
      ↓
EmployeesPage
      ↓
Fetch employees + countries
      ↓
Loading
      ↓
API response
      ↓
Success / Empty / Error
```

## Create

```text
Click Add Employee
      ↓
Open EmployeeForm
      ↓
Enter data
      ↓
Validate
      ↓
POST
      ↓
Loading
      ↓
Success
      ↓
Refresh/invalidate employee data
      ↓
Show success feedback
```

## Edit

```text
Click Edit
      ↓
Load employee
      ↓
Pre-populate EmployeeForm
      ↓
Modify data
      ↓
Validate
      ↓
PUT
      ↓
Success
      ↓
Refresh/invalidate employee data
```

## Delete

```text
Click Delete
      ↓
Confirmation dialog
      ↓
Cancel OR Confirm
      ↓
DELETE
      ↓
Success
      ↓
Refresh/invalidate employee data
```

## Search

```text
Enter Employee ID
      ↓
Search
      ↓
GET /employee/:id
      ↓
Found / Not Found / Error
```

---

# 52. UI Component Hierarchy

Recommended structure:

```text
EmployeesPage
│
├── PageHeader
├── EmployeeSearch
├── EmployeeTable
│   └── EmployeeRow
├── EmployeeForm
│   ├── FormField
│   ├── CountrySelect
│   ├── StateSelect
│   └── DistrictSelect
├── DeleteEmployeeDialog
├── LoadingState
├── EmptyState
├── ErrorState
└── SuccessSnackbar
```

Use reusable components where behavior or presentation is genuinely shared.

Do not create tiny components solely to increase component count.

---

# 53. UI Design Principles

The UI should be:

- Clean
- Professional
- Simple
- Responsive
- Accessible
- Consistent
- Easy to scan
- Suitable for an internal employee-management application

Use:

- Consistent spacing
- Clear typography hierarchy
- Consistent button hierarchy
- Clear form labels
- Clear validation messages
- Consistent interaction states
- Adequate whitespace

Avoid:

- Excessive gradients
- Excessive animations
- Decorative elements without purpose
- Unnecessary cards
- Excessive colors
- Complex navigation

---

# 54. Responsive Strategy

Desktop:

```text
Table-first layout
Two-column form where appropriate
```

Tablet:

```text
Reduced spacing
Responsive table/form
```

Mobile:

```text
Single-column form
Full-width primary actions
Compact employee list/table
No page-level horizontal overflow
```

Do not simply scale down the desktop design.

---

# 55. UX Priority

When making UI decisions, use this priority:

```text
Requirement correctness
        ↓
Usability
        ↓
Accessibility
        ↓
Responsive behavior
        ↓
Visual consistency
        ↓
Visual enhancement
```

A visually impressive feature that makes the required workflow harder to use should not be added.

---

# 56. UI vs Business Logic Boundary

UI components should communicate user intent.

Example:

```text
EmployeeTable
     ↓
onDelete(employee)
     ↓
EmployeesPage
     ↓
Delete mutation
```

The table should not directly contain API implementation.

Similarly:

```text
EmployeeForm
     ↓
onSubmit(formData)
     ↓
Parent/business logic
     ↓
API mutation
```

Keep presentation and business logic appropriately separated.

---

# 57. Optional UI Enhancements

Only after all assessment requirements are complete, tested, and stable, consider:

- Pagination if the API/data size justifies it
- Sorting if useful
- Improved filtering
- Employee count

Optional enhancements must not interfere with the required assessment workflow.

---

# 58. Explicit Scope Rule

This project is an Employee Management assessment, not a full enterprise HR platform.

Do not add features merely because they look impressive.

Every additional feature must answer:

1. What user problem does it solve?
2. Why is it relevant to employee management?
3. Does it improve the assessment?
4. Does it justify the additional complexity?
5. Can it be tested and maintained?

If the answer is unclear, do not add the feature.

---

# 59. Final Engineering Principle

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

---

# 60. Final Verification

Before submission, verify:

```text
✓ All assessment requirements implemented
✓ All CRUD operations work
✓ Search works
✓ Edit pre-populates correctly
✓ Delete confirmation works
✓ Validation works
✓ Loading states work
✓ Error states work
✓ Empty state works
✓ Not-found state works
✓ Responsive UI works
✓ Accessibility basics work
✓ API calls are centralized
✓ Redux/RTK Query works correctly
✓ Tests pass
✓ API calls are mocked in tests
✓ ESLint passes
✓ Production build passes
✓ README is complete
✓ No unnecessary features or dependencies remain
```

Final commands:

```bash
npm run lint
npm run test
npm run build
```

The application is ready for submission only after all required checks pass.

## 61. Verified MockAPI Contract (2026-08-28)

The supplied API was inspected before implementing API-dependent logic. Employee records currently expose `id`, `name`, `email`, `mobile`, `country`, `state`, and `district`, plus unrelated `emailId`, `countryId`, `avatar`, and `createdAt` fields. Country records expose `id`, `country`, `flag`, and `createdAt`. The country endpoint does not expose state/district data; the application must keep those dependent options in a clearly documented local/mock source.

## 62. Implemented UI Visual Standards (2026-08-28)

The application uses a restrained, professional visual system through the centralized MUI theme and existing components.

- Use the theme palette as the source of truth: teal primary actions, slate secondary text, dark slate primary text, light neutral page background, white surfaces, and a restrained red error color.
- Use the existing Inter/system font stack. Do not add a new font dependency without a clear product requirement and a reliable loading strategy.
- Use the established heading hierarchy and avoid arbitrary font sizes. Page titles use `h4`; section titles use `h6`; small uppercase context labels use `overline` with the primary color.
- Use `textTransform: none` for buttons, consistent 40px control height, 8px button radius, and MUI states for hover, focus, disabled, error, and loading behavior.
- Prefer outlined Paper surfaces for grouped content and keep elevation limited to purposeful floating elements such as the fixed attribution.
- Keep spacing based on the MUI spacing scale. Use responsive Stack/Grid layouts; forms become one column on small screens and must not cause page-level horizontal overflow.
- Use semantic labels and content hierarchy before adding decorative UI. Search results use labeled fields and preserve technically meaningful formats: title case for human-readable names/locations, lowercase email, and unchanged IDs/mobile values.
- Keep destructive actions visually distinct with the error palette and require confirmation. Do not use color alone to communicate status.
- Any future visual change must be applied consistently across list, search, form, dialog, feedback, and attribution surfaces and must not add an unrelated design pattern.
