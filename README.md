# Employee Management System

Responsive employee directory application built with React, TypeScript, Vite, Material UI, Redux Toolkit, RTK Query, React Hook Form, and Zod.

The application is intentionally focused on the employee-management assessment: it provides the required employee CRUD workflows, ID search, validation, asynchronous states, responsive UI, and automated tests without adding unrelated product features.

## ✨ Features

- View employees in a responsive MUI table.
- Search for an employee by numeric employee ID.
- Show employee found, not-found, loading, and recoverable error states.
- Add employees through a reusable validated form.
- Edit employees with existing values pre-populated.
- Delete employees only after explicit confirmation.
- Prevent duplicate delete requests while deletion is processing.
- Display success feedback for add, update, and delete operations.
- Retry employee-list, search, country, save, and delete failures where applicable.
- Paginate employee records with 5, 10, 20, or all rows per page.
- Sort Name, Email, Mobile, and Country within the selected page.
- Display country flags when matching country data includes a flag URL.
- Normalize human-readable display values and show `Not available` for invalid or missing values.
- Use responsive single-column form layouts on small screens.
- Provide accessible labels, button names, dialogs, status feedback, tooltips, and semantic search-result markup.

## 🧰 Technology

### Application

- React 19
- TypeScript
- Vite
- Material UI and MUI icons
- Redux Toolkit and RTK Query
- React Hook Form
- Zod

### Development and testing

- Vitest
- React Testing Library
- `@testing-library/user-event`
- MSW for API mocking
- ESLint with TypeScript and React plugins
- Prettier

## 🚀 Getting started

### Prerequisites

Install a current supported Node.js version and npm before running the project.

### Install dependencies

```bash
npm install
```

### Configure the API

Create a local environment file from the committed example:

```bash
copy .env.example .env
```

On macOS or Linux, use:

```bash
cp .env.example .env
```

Set the API base URL in `.env`:

```env
VITE_API_BASE_URL=https://669b3f09276e45187d34eb4e.mockapi.io/api/v1
```

The application fails clearly at startup when `VITE_API_BASE_URL` is missing outside tests; tests use a local-only fallback because all API calls are intercepted by MSW. The local `.env` file is ignored by Git; `.env.example` is the committed configuration template.

### Start development

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

## 🔌 API contract

The API base URL is configured only through `VITE_API_BASE_URL`. API access is centralized in `src/features/employees/api/employeeApi.ts` and uses RTK Query.

| Operation       | Method   | Endpoint        |
| --------------- | -------- | --------------- |
| List employees  | `GET`    | `/employee`     |
| Find employee   | `GET`    | `/employee/:id` |
| Create employee | `POST`   | `/employee`     |
| Update employee | `PUT`    | `/employee/:id` |
| Delete employee | `DELETE` | `/employee/:id` |
| List countries  | `GET`    | `/country`      |

### Employee fields

The application uses these employee fields:

```text
id, name, email, mobile, country, state, district
```

The remote service may return additional fields such as `emailId`, `countryId`, `avatar`, or `createdAt`; they are optional in the application type and are not required for the employee workflow.

### Country and location data

Country options are loaded from `GET /country`. The country response does not provide State/District data, so State and District are intentionally manual form fields rather than invented API-backed dependent selectors.

## 🏗️ Architecture

The project follows a feature-oriented structure with a clear page/container and presentational-component boundary:

```text
src/
├── app/
│   └── store.ts                         Redux and RTK Query store setup
├── components/
│   └── common/
│       └── AsyncState.tsx               Shared loading and error UI
├── features/
│   └── employees/
│       ├── api/                         RTK Query endpoints and API tests
│       ├── components/                  Presentational employee components
│       ├── pages/                       EmployeesPage page orchestration
│       ├── schemas/                     Zod form schema and tests
│       ├── types/                       Employee and Country types
│       └── utils/                       Shared employee display formatting
├── lib/                                 Shared API error utilities
├── styles/                              Centralized MUI theme
├── tests/                               MSW setup and handlers
├── App.tsx                              Root composition entry point
└── main.tsx                             React, Redux, theme, and CSS providers
```

`EmployeesPage` owns RTK Query hooks, workflow state, mutation orchestration, and page-level layout. Components such as `EmployeeTable`, `EmployeeForm`, `EmployeeSearch`, and `DeleteEmployeeDialog` communicate through typed props and callbacks rather than making API requests directly.

## ✅ Validation and error handling

The shared Add/Edit form uses React Hook Form with `zodResolver(employeeSchema)`.

Validation includes:

- Required Name, Email, Mobile, Country, State, and District fields.
- Valid email format and lowercase email requirement.
- Ten-digit mobile number requirement.
- Name capitalization, character, and length rules.
- State/District character and 2–80 character length rules.
- Field-level messages displayed beside the relevant control.

Errors are differentiated where the workflow requires it:

- Loading and API errors show recoverable feedback.
- Employee ID `404` responses show a not-found state.
- Save failures keep the form available for retry.
- Delete failures keep the confirmation dialog available for retry.
- Technical error details are converted to safe user-facing messages.

## 🧪 Testing

Tests focus on user-visible behavior and important application behavior. MSW prevents tests from depending on the live API.

Coverage includes:

- Employee table rendering, pagination, sorting, formatting, and edge cases.
- Employee search input validation and numeric ID behavior.
- Search success, not-found, error, and retry flows.
- Add and Edit validation, success, failure, retained form state, and retry.
- Delete confirmation, cancel, success, failure, retry, and duplicate-request protection.
- Employee and Country API success/failure behavior.
- Shared error-message normalization and async-state retry UI.

Run the test suite once:

```bash
npm run test:run
```

The repository currently has 38 automated tests. This number can change as the implementation evolves. No exact coverage percentage or 100% coverage claim is made here because a generated coverage report is not part of the current project scripts.

## 📜 Available scripts

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the Vite development server.            |
| `npm run build`        | Type-check and create the production build.   |
| `npm run preview`      | Preview the production build locally.         |
| `npm run lint`         | Run ESLint.                                   |
| `npm run format`       | Format supported project files with Prettier. |
| `npm run format:check` | Check formatting without modifying files.     |
| `npm run test`         | Run Vitest in watch mode.                     |
| `npm run test:run`     | Run Vitest once.                              |

## 🔍 Recommended verification

Before submitting changes, run:

```bash
npm run format:check
npm run lint
npx tsc -b
npm run test:run
npm run build
git diff --check
```

The current implementation has been verified with these checks. Vite may report chunk sizes during builds if bundling changes; the current configuration splits major MUI and state dependencies to keep generated chunks below the warning threshold.

## 🔒 Scope and limitations

- Authentication, authorization, dashboards, reports, charts, routing, and backend services are outside the assessment scope.
- Advanced employee filtering is not implemented because the required search workflow is employee-ID search; advanced filtering is an optional enhancement.
- State and District are manual fields because the supplied Country API does not provide dependent location data.
- The application uses the configured MockAPI service; production deployment, authentication, and service-level guarantees are not provided by this repository.

## 📚 Project guidance

`AGENTS.md` contains the repository’s implementation standards, including architecture, API, validation, testing, accessibility, responsive-design, and scope guidance. Changes should remain focused, typed, testable, and limited to the requested requirement.

# frontend-developer-a-final-13728-yashraj
