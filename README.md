# Employee Management System

Responsive employee management application built with Vite, React, TypeScript, MUI, Redux Toolkit, RTK Query, React Hook Form, and Zod.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the provided MockAPI base URL. The application uses the verified MockAPI contract: employee records contain `id`, `name`, `email`, `mobile`, `country`, `state`, and `district`; country records contain `id` and `country`.

The app includes employee listing, ID search with not-found handling, add/edit forms, delete confirmation, RTK Query cache invalidation, responsive MUI UI states, and local dependent state/district options. The country API does not provide state/district data, so those options are intentionally local rather than inferred from the API.

Tests use MSW and never depend on the live API.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run lint` — run ESLint
- `npm run test` — run Vitest in watch mode
- `npm run test:run` — run tests once
- `npm run build` — type-check and create a production build
- `npm run preview` — preview the production build
