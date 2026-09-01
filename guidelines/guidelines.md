# Klienka CRM - Development & UI/UX Guidelines

This document outlines the core architectural principles, engineering standards, state patterns, and UI/UX conventions for the **Klienka CRM** platform. It serves as the primary technical reference for frontend/backend developers, full-stack engineers, and UI/UX designers contributing to the codebase.

---

## 1. System Architecture & Technology Stack

Klienka CRM is engineered as a full-stack, type-safe Next.js enterprise application optimized for high responsiveness and robust access control.

| Layer | Technology | Primary Responsibilities |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ (App Router) | Server Components, Server Actions, Route Handlers, Nested Layouts |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety, Zod schema inference, Prisma client types |
| **Database & ORM** | PostgreSQL + Prisma ORM | Relational models (Clients, Deals, Handoffs, General Params, Users) |
| **Authentication** | Supabase Auth + Server Actions | Session management, HTTP-only cookies, password updates, route guards |
| **State Management**| Zustand (In-Memory + Hydration) | App layout state (`useAppStore`), TopBar slots (`useContentTopStore`), Client cache |
| **UI Primitives** | Shadcn UI + Radix UI Primitives | Accessible, unstyled dialogs, popovers, tooltips, dropdown menus |
| **Styling Engine** | Tailwind CSS v4 + Design Tokens | Semantic token-based theming, custom scrollbars, CSS variables |
| **Validation** | Zod + React Hook Form | Strict runtime schema parsing across forms and Server Actions |
| **Transitions** | Native View Transitions API | Circular wave theme toggling, animated sidebar drawers |

---

## 2. Role-Based Access Control (RBAC) & User Roles

The CRM supports 4 distinct user roles with strict navigation and functional access controls:

| Role Identifier | Role Label | Permitted Feature Routes |
| :--- | :--- | :--- |
| **`ADMINISTRATOR`** | Administrator | `/dashboard`, `/pipeline`, `/clients`, `/handoff`, `/users`, `/general-params` |
| **`BUSINESS_DEVELOPMENT`** | Business Development | `/dashboard`, `/pipeline`, `/clients` |
| **`PROJECT_MANAGER`** | Project Manager | `/dashboard`, `/pipeline`, `/handoff` |
| **`OPERATIONAL_TEAM`** | Operational Team | `/dashboard`, `/handoff` |

### RBAC Implementation Rules:
- **Server Guard (`lib/auth-guard.ts`)**: Protect Server Actions and route handlers using session inspection and role validation.
- **Client Navigation Guard (`hooks/use-user-role.ts`)**: Filter sidebar menu links dynamically based on the active role.
- **Role Simulator (`<RoleSwitcher />`)**: Available in `ContentTop` and mobile `<Header />` to allow seamless role simulation during QA and development.

---

## 3. Project Directory Architecture

```
klienka-crm/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Unauthenticated layouts & routes (login, register, logout)
│   ├── (web-app)/                    # Authenticated CRM shell (layout with full viewport lock)
│   │   ├── clients/                  # Clients & Leads directory and detail views
│   │   ├── dashboard/                # Analytics & summary KPI widgets
│   │   ├── general-params/           # System parameter configuration
│   │   ├── handoff/                  # Deal-to-project operational handoff pipeline
│   │   ├── pipeline/                 # Sales pipeline Kanban board
│   │   └── users/                    # User & role administration
│   ├── api/                          # REST & webhook route handlers
│   └── globals.css                   # Global CSS tokens, custom scrollbars, view transitions
├── components/
│   ├── ui/                           # Base Shadcn/Radix components (button, dialog, tooltip, etc.)
│   ├── layouts/                      # Layout components (sidebar, header, app-name, theme-toggle)
│   │   ├── sidebar/                  # Sidebar navigation, user card, backdrop, menu items
│   │   └── main-content/             # ContentTop, AutoBreadcrumb, PageContent slots
│   ├── pipeline/                     # Kanban board, deal cards, stage columns
│   ├── clients/                      # Client tables, drawer forms, filter toolbars
│   ├── handoff/                      # Handoff review dialogs and checklist cards
│   ├── profile/                      # User profile & change password dialogs
│   └── providers/                    # Zustand hydrators & theme providers
├── guidelines/                       # Design system, layout anatomy, tokens & skills SSOT
├── hooks/                            # Custom React hooks (useMediaQuery, useUserRole, etc.)
├── lib/                              # Server clients, Prisma instance, auth guards, utils
│   ├── validations/                  # Zod validation schemas (client.ts, user.ts, deal.ts)
│   └── supabase/                     # Supabase client/server cookie session handlers
├── stores/                           # Zustand global store definitions
│   ├── useAppStore.ts                # Sidebar collapse/open state, current simulated user
│   └── useMainContentStore.ts        # Dynamic TopBar breadcrumbs, title, and action slots
└── types/                            # Global TypeScript interfaces and main content types
```

---

## 4. UI/UX Layout Shell Architecture

All authenticated pages render within the viewport-locked shell defined in `app/(web-app)/layout.tsx` (detailed in [layout-anatomy.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/layout-anatomy.md)):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Root Frame: w-screen h-screen p-2 gap-1.5 bg-accent overflow-hidden                 │
│ ┌──────────────────────┐ ┌───────────────────────────────────────────────────────────┐ │
│ │ 2. <Sidebar />       │ │ 3. <main> (flex-1 flex-col gap-1.5 min-w-0 h-full)         │ │
│ │ • Desktop: static    │ │ ┌─────────────────────────────────────────────────────────┐│ │
│ │   w-64 / w-18        │ │ │ 4. <Header /> (Mobile Only, lg:hidden, h-16)            ││ │
│ │ • Mobile: fixed w-72 │ │ └─────────────────────────────────────────────────────────┘│ │
│ │   with <Backdrop />  │ │ ┌─────────────────────────────────────────────────────────┐│ │
│ │ • rounded-2xl border │ │ │ 5. White Box: flex-1 rounded-2xl border bg-background   ││ │
│ │                      │ │ │ ┌─────────────────────────────────────────────────────┐ ││ │
│ │                      │ │ │ │ 5A. <ContentTop /> (h-14, Breadcrumbs + Action Slots│ ││ │
│ │                      │ │ │ ├─────────────────────────────────────────────────────┤ ││ │
│ │                      │ │ │ │ 5B. <PageContent /> (flex-1 overflow-y-auto p-4/6)  │ ││ │
│ │                      │ │ │ └─────────────────────────────────────────────────────┘ ││ │
│ │                      │ │ └─────────────────────────────────────────────────────────┘│ │
│ └──────────────────────┘ └───────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Layout Rules:
1. **Zero Window Scroll**: `overflow-hidden` at the root prevents viewport jank.
2. **Page Content Scroll**: Scrolling happens exclusively inside `<PageContent />` via `overflow-y-auto min-h-0`.
3. **Dynamic Header Injection**: Pages communicate with `<ContentTop />` via `useContentTopStore` (or `<ContentTopSlot />`) to set page titles, custom breadcrumbs, action buttons, and filter bars without prop drilling.
4. **Responsive Breakpoint**: `1024px` (`lg:`) is the master boundary separating desktop (static sidebar, ContentTop theme toggle) from mobile/tablet (drawer sidebar with backdrop, mobile header).

---

## 5. Coding Standards & Best Practices

### 5.1 React Server Components vs. Client Components
- **Default to RSC**: Fetch data, perform auth checks, and assemble static structures in Server Components.
- **Client Components (`"use client"`)**: Isolate to interactive leaves (e.g. buttons, dropdowns, forms, interactive Kanban boards, Zustand state subscribers).
- **Zustand Hydration Pattern**: Always hydrate server-fetched user data into client stores using dedicated hydrator components (e.g., `<UserStoreHydrator />`).

### 5.2 Form Handling & Runtime Validation
- **Schema-First**: Define Zod schemas in `lib/validations/` before writing form components or server actions.
- **Safe Parsing**: Always parse input payloads with `schema.safeParse(data)` in Server Actions before interacting with Prisma.
- **Immediate Visual Feedback**:
  - Show loading spinners inside buttons (`isPending` state with `useTransition`).
  - Render field-level validation errors in `text-xs text-destructive`.
  - Trigger toast notifications (`sonner`) on mutation success or failure.

### 5.3 TypeScript Guidelines
- **Strict Typing**: Never use `any`. Use generics or explicit interfaces.
- **Prisma Model Extension**: Infer types directly from Prisma using `Prisma.ClientGetPayload<...>` or Zod inference `z.infer<typeof schema>`.
- **Component Props**: Export and name all component prop interfaces (e.g., `export interface ClientTableProps { ... }`).

---

## 6. Styling & Design Token Compliance

> [!WARNING]
> **Strict Styling Ban**:
> Do not use raw color classes like `text-gray-900`, `bg-blue-600`, `border-zinc-300`, or raw hex codes.
> Every style must be bound to semantic tokens:

- **Surface / Containers**: `bg-background`, `bg-accent`, `bg-muted`
- **Text**: `text-foreground`, `text-muted-foreground`, `text-accent-foreground`
- **Brand / CTAs**: `bg-primary text-primary-foreground`, `bg-secondary text-secondary-foreground`
- **Borders**: `border-border`, `border-destructive`, `border-success`
- **Corner Radii**: Standardize on `rounded-2xl` (containers), `rounded-xl` (buttons/menu items), `rounded-md` (inputs), `rounded-lg` (cards).

---

## 7. Guidelines Documentation Index

For detailed guidelines on specific facets of the system, consult the companion documents in this directory:

| Document | Purpose & Audience |
| :--- | :--- |
| **[DESIGN.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/DESIGN.md)** | Master design system, color tokens, typography scales, and component specs. |
| **[layout-anatomy.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/layout-anatomy.md)** | Technical layout shell anatomy, sizing, responsive drawer mechanics, and Figma Make instructions. |
| **[token.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/token.md)** | Semantic token roles, light/dark mode mappings, usage frequency, and decision tree. |
| **[styles.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/styles.md)** | 4px spacing scale, Geist typography hierarchy, radius scale, and responsive grid principles. |
| **[skills.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/skills.md)** | Workflows for assembling complex features (Dashboards, Data Tables, Kanban Boards, Modals). |
