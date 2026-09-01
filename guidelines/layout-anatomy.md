# Klienka CRM - App Layout Anatomy (Figma Make Kit)

This document breaks down the core application shell found in `app/(web-app)/layout.tsx` and its constituent layout components. It serves as a direct guide for Junior Programmers to understand the structural code and for **Figma Make** (or AI Agents) to accurately recreate the layout, colors, spacing, and responsive behaviors in Figma.

> [!IMPORTANT]
> **Figma Token Library Mandatory Rule**: 
> AI Agents and Designers MUST ALWAYS check the Token Library (`guidelines/token.md`) and bound Figma Color/Radius Variables first before building or styling frames.
> - **NEVER** hardcode raw hex values (e.g., `#FFFFFF`, `#1E293B`, `#F5F5F5`) or create detached ad-hoc styles.
> - **ALWAYS** bind properties directly to the semantic token variables (`background`, `accent`, `border`, `foreground`, `muted`, `muted-foreground`, `primary`, `primary-foreground`).
> - Ensure all dimensions strictly conform to the layout anatomy specifications below.

---

## 🎨 Global Design System & Token Reference

| Attribute | Light Mode Token / Value | Dark Mode Token / Value | Figma Token Variable Binding | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **App Canvas / Frame** | `--accent` (`neutral-100`) | `--accent` (`neutral-900`) | `Color/accent` | Outermost backdrop surrounding white boxes |
| **Card / Box Background** | `--background` (`#ffffff`) | `--background` (`neutral-950`) | `Color/background` | Primary elevated container surface |
| **Structural Border** | `--border` (`neutral-200`) | `--border` (`neutral-800`) | `Color/border` | 1px solid stroke on cards, headers, & sidebars |
| **Primary Text** | `--foreground` (`neutral-900`) | `--foreground` (`#ffffff`) | `Color/foreground` | High contrast text & headers |
| **Secondary Text** | `--muted-foreground` (`neutral-500`) | `--muted-foreground` (`neutral-400`) | `Color/muted-foreground` | Navigation labels, subtitles, breadcrumb items |
| **Active Nav Item** | `--primary` (`blue-700`) + `--primary-foreground` (`blue-50`) | `--primary` (`blue-900`) + `--primary-foreground` (`blue-100`) | `Color/primary` + `Color/primary-foreground` | Highlight for current active route |
| **Nav Hover State** | `--accent` (`neutral-100`) + `--foreground` | `--accent` (`neutral-900`) + `--foreground` | `Color/accent` + `Color/foreground` | Subtle hover fill on interactive items |
| **Scrollbar Track / Thumb** | `neutral-100` / `neutral-300` | `neutral-800` / `neutral-700` | `Color/scrollbar-track` / `thumb` | Thin scrollbar (`w-1 h-0.5 rounded-full`) |
| **Corner Radii** | Outer Containers: `rounded-2xl` (`18px`), Inner Items: `rounded-xl` (`14px`), Sub-blocks: `rounded-lg` (`10px`) | Scaled from `--radius: 0.625rem` (`10px`) | `Radius/2xl` (18px), `Radius/xl` (14px), `Radius/lg` (10px) | Strict 4px base radius scaling |

---

## 📐 Detailed Layout Sections & Anatomy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Root Container (w-screen h-screen p-2 gap-1.5 bg-accent)                            │
│ ┌──────────────────────┐ ┌───────────────────────────────────────────────────────────┐ │
│ │ 2. <Sidebar />       │ │ 3. <main> (flex-1 flex-col gap-1.5)                        │ │
│ │                      │ │ ┌─────────────────────────────────────────────────────────┐│ │
│ │ • Header (h-14)      │ │ │ 4. <Header /> (Mobile Only, lg:hidden, h-16)            ││ │
│ │ • Navigation (flex-1)│ │ └─────────────────────────────────────────────────────────┘│ │
│ │ • UserInfo (bottom)  │ │ ┌─────────────────────────────────────────────────────────┐│ │
│ │                      │ │ │ 5. Content Container ("The White Box", flex-1 rounded-2xl)││ │
│ │                      │ │ │ ┌─────────────────────────────────────────────────────┐ ││ │
│ │                      │ │ │ │ 5A. <ContentTop /> (h-14, Breadcrumb + Actions)     │ ││ │
│ │                      │ │ │ ├─────────────────────────────────────────────────────┤ ││ │
│ │                      │ │ │ │ 5B. <PageContent /> (flex-1 overflow-y-auto p-4/6)  │ ││ │
│ │                      │ │ │ └─────────────────────────────────────────────────────┘ ││ │
│ │                      │ │ └─────────────────────────────────────────────────────────┘│ │
│ └──────────────────────┘ └───────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The Root Container (`w-screen h-screen`)

The outermost viewport layer wrapping the entire application interface.

- **HTML Structure**: `<div className="w-screen h-screen p-2 flex gap-1.5 bg-accent overflow-hidden">`
- **Color & Style**:
  - **Background**: `bg-accent` (Figma Token: `Color/accent`).
  - **Borders & Shadows**: None (acts as the canvas floor).
- **Padding & Spacing**:
  - **Padding**: `8px` (`p-2`) uniform on all 4 viewport edges.
  - **Item Spacing (Gap)**: `6px` (`gap-1.5`) between Sidebar and Main column.
- **Behavior**:
  - **Viewport Lock**: Width `100vw`, Height `100vh`, strictly `overflow-hidden`. Window-level scrolling is completely disabled; scrolling only occurs inside designated scroll containers.
- **Figma Setup & Token Checklist**:
  - Auto Layout: `Horizontal`. Width: `1440px` (or `100vw`), Height: `900px` (or `100vh`).
  - Padding: `8px` all sides. Gap: `6px`.
  - **Token Binding**: Fill $\rightarrow$ `Color/accent`. Clip content: `true`.

---

## 2. The Sidebar Component (`<Sidebar />`)

Dedicated vertical navigation drawer/column located on the left side of the Root Container.

### Structural Anatomy
1. **Header Top (`h-14` / 56px)**: App branding logo/title + Expand/Collapse toggle trigger.
2. **Navigation Area (`flex-1 overflow-y-auto`)**: Categorized menu links (`Mainflow` and `Setting`).
3. **User Info Footer (`shrink-0`)**: Profile badge, active role, avatar, and dropdown menu.

### Dimensions, Colors & Padding

| State | Positioning & Width | Background & Border (Figma Tokens) | Inner Padding & Sizing |
| :--- | :--- | :--- | :--- |
| **Desktop Expanded** (`isSidebarExpand = true`) | `lg:static lg:w-64` (`256px`), `h-full` | Fill: `Color/background`<br>Stroke: `Color/border`<br>Radius: `Radius/2xl` (`18px`) | Header: `px-4 h-14`. Nav: `px-2 py-4 gap-1`. User card: `p-2.5 m-2`. |
| **Desktop Collapsed** (`isSidebarExpand = false`) | `lg:static lg:w-18` (`72px` / `4.5rem`), `h-full` | Fill: `Color/background`<br>Stroke: `Color/border`<br>Radius: `Radius/2xl` (`18px`) | Menu items center-aligned: `w-10 h-10 mx-auto px-0`. Section titles show `•••`. |
| **Mobile / Tablet** (`< 1024px`) | `fixed top-2 bottom-2 left-2 z-50 w-72 max-w-[calc(100vw-1rem)] shadow-2xl` | Fill: `Color/background`<br>Stroke: `Color/border`<br>Radius: `Radius/2xl` (`18px`) | Backed by `<Backdrop />` overlay (`fixed inset-0 bg-black/50 backdrop-blur-xs z-40`). |

### Menu Item Styles & States (`<MenuItem />`)
- **Height & Radius**: `h-10` (`40px`), Radius: `Radius/xl` (`14px`).
- **Active Route**: 
  - Fill: `Color/primary`
  - Text: `Color/primary-foreground` (`font-semibold`)
  - Effect: `shadow-2xs`
- **Inactive / Default**: 
  - Text: `Color/muted-foreground` (`font-medium`)
- **Hover State**: 
  - Fill: `Color/accent`
  - Text: `Color/foreground` (Smooth transition `duration-200`)
- **Collapsed Tooltip**: When collapsed, hover displays a floating Shadcn Tooltip on the right (`side="right" sideOffset={8}`) with `Color/popover` fill and `Color/popover-foreground` text.

### Behavior & Responsive Transitions
- **Desktop Toggle**: Clicking the sidebar trigger (`PanelLeftClose` / `PanelLeftOpen`) smoothly expands/collapses width between `256px` (`lg:w-64`) and `72px` (`lg:w-18`) with `transition-all duration-300 ease-in-out`.
- **Mobile Drawer**: Off-canvas by default (`-translate-x-[calc(100%+1rem)]`). When opened (`isSidebarOpen = true`), slides in to `translate-x-0`.
- **Auto-Close on Navigate**: Selecting any menu item on mobile immediately closes the sidebar drawer.
- **Scroll Behavior**: Middle nav section scrolls independently (`overflow-y-auto`) if links overflow vertical space.

---

## 3. The Main Column (`<main>`)

The right-hand flexible column occupying all remaining horizontal viewport space.

- **HTML Structure**: `<main className="flex flex-1 flex-col gap-1.5 min-w-0 h-full overflow-hidden">`
- **Dimensions & Resizing**:
  - **Width**: `Fill container` (`flex-1`, `min-w-0` to avoid flex child overflow bugs).
  - **Height**: `Fill container` (`h-full`).
- **Padding & Spacing**:
  - **Padding**: `0px` (outer padding provided by Root Container).
  - **Gap**: `6px` (`gap-1.5`) between Mobile Header and Content Container.
- **Auto Layout (Figma)**: `Vertical` direction, Gap: `6px`, Resizing: `Fill` horizontal & `Fill` vertical.

---

## 4. The Mobile / Tablet Portrait Header (`<Header />`)

A compact top navigation bar used exclusively on mobile and tablet screens.

- **HTML Structure**: `<header className="h-16 px-4 bg-background rounded-2xl border border-border flex items-center justify-between gap-3 lg:hidden shrink-0">`
- **Visibility**: Visible only on screen widths below `1024px` (`lg:hidden`).
- **Color & Style (Figma Tokens)**:
  - **Background Fill**: `Color/background`.
  - **Stroke / Border**: `1px solid Color/border`.
  - **Border Radius**: `Radius/2xl` (`18px`).
- **Dimensions & Padding**:
  - **Height**: Fixed `64px` (`h-16`).
  - **Padding**: Horizontal `16px` (`px-4`), Vertical `0px` (centered).
- **Contents & Behavior**:
  - **Left**: Hamburger Menu Button (`ButtonOpen`, opens mobile sidebar) + Logo & App Title (`Color/primary`).
  - **Right**: Role Simulator Switcher + Theme Toggle Button (Dark/Light).

---

## 5. The Content Container ("The White Box")

The primary surface framing all page-specific interfaces, data tables, and forms.

- **HTML Structure**: `<div className="flex-1 bg-background rounded-2xl border border-border flex flex-col min-h-0 overflow-hidden shadow-xs">`
- **Color & Style (Figma Tokens)**:
  - **Background Fill**: `Color/background`.
  - **Stroke / Border**: `1px solid Color/border`.
  - **Border Radius**: `Radius/2xl` (`18px`).
  - **Shadow**: `shadow-xs` subtle elevation.
- **Dimensions & Resizing**:
  - **Width / Height**: `Fill container` horizontally & vertically (`flex-1`, `min-h-0`).
  - **Clipping**: `overflow-hidden` ensures all nested headers and scrollable tables respect the 18px rounded corner radius.

---

### 5A. Top Bar (`<ContentTop />`)

The sticky desktop & tablet landscape header bar sitting at the top of the White Box.

- **HTML Structure**: `<header className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border bg-background/95 backdrop-blur-xs shrink-0 gap-4">`
- **Color & Style (Figma Tokens)**:
  - **Background Fill**: `Color/background` at 95% opacity with glassmorphic `backdrop-blur-xs`.
  - **Stroke / Border**: Bottom stroke `1px solid Color/border` (`border-b`).
- **Dimensions & Padding**:
  - **Height**: Fixed `56px` (`h-14`), `shrink-0` (never collapses).
  - **Padding**: Horizontal `16px` on mobile, `24px` on tablet/desktop (`px-4 sm:px-6`).
- **Internal Anatomy**:
  - **Left Section (`flex-1 flex items-center gap-3 min-w-0`)**:
    - Page Title (`text-base font-semibold Color/foreground truncate`) OR dynamic `<AutoBreadcrumb />`.
    - Optional `extraContent` slot (e.g. search bars, date range pickers, tab filters).
  - **Right Section (`shrink-0 flex items-center gap-2`)**:
    - Page Action Buttons (e.g. `+ Add New Client`, `Export CSV`).
    - Role Simulator Switcher dropdown.
    - Theme Toggle button (`hidden lg:flex`).

---

### 5B. Page Content Area (`<PageContent />`)

The main dynamic viewport where children pages (Dashboard, Pipeline Kanban, Data Tables) render and scroll.

- **HTML Structure**: `<div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6">`
- **Color & Style**: Transparent (inherits parent `Color/background`).
- **Dimensions & Resizing**:
  - **Height**: `flex-1 min-h-0` (takes 100% of remaining height below `ContentTop`).
- **Padding Configurations**:
  - **Default Padding**: `p-4 sm:p-6` (`16px` mobile / `24px` desktop).
  - **No-Padding Mode (`noPadding={true}`)**: `p-0` (used for full-bleed Kanban boards, maps, or edge-to-edge tables).
  - **Custom Padding**: Fully configurable via `useContentTopStore` state or props.
- **Scroll Behavior**:
  - **Internal Scroll**: Vertical scroll is handled strictly here (`overflow-y-auto`).
  - **Scrollbar Style**: Subtle custom scrollbars (`w-1 h-0.5`, rounded thumb `Color/scrollbar-thumb`, track `Color/scrollbar-track`).

---

## 📱 Summary Checklist for Responsive Behavior & Breakpoints

| Feature | Mobile (`< 640px`) | Tablet Portrait (`640px - 1023px`) | Desktop (`>= 1024px`, `lg:`) |
| :--- | :--- | :--- | :--- |
| **Sidebar** | Hidden drawer (`w-72 fixed z-50`) + Backdrop | Hidden drawer (`w-72 fixed z-50`) + Backdrop | Static column (`w-64` expanded / `w-18` collapsed) |
| **Mobile Header** | Visible (`h-16 px-4`) with hamburger | Visible (`h-16 px-4`) with hamburger | Completely hidden (`lg:hidden`) |
| **ContentTop** | Visible inside White Box (`px-4 h-14`) | Visible inside White Box (`px-6 h-14`) | Visible inside White Box (`px-6 h-14`) |
| **Theme Toggle** | Inside Mobile Header | Inside Mobile Header | Inside ContentTop right slot |
| **Content Padding** | `16px` (`p-4`) | `24px` (`p-6`) | `24px` (`p-6`) |
| **Window Scroll** | Locked (`overflow-hidden`) | Locked (`overflow-hidden`) | Locked (`overflow-hidden`) |

---

## 🎯 Direct Figma Make & AI Prompting Checklist

When prompting Figma Make or an AI Layout Designer to construct or update a layout:

### 1. Mandatory Token Library Verification Step
- [ ] **Check `guidelines/token.md` first**: Confirm the role of each element before picking colors.
- [ ] **Bind to Variables**: Never use unlinked hex colors. Attach every fill and stroke to its corresponding Figma variable (e.g. `Color/background`, `Color/accent`, `Color/border`, `Color/primary`).
- [ ] **Radius Alignment**: Bind all corner radii to `Radius/2xl` (18px), `Radius/xl` (14px), or `Radius/lg` (10px).

### 2. Layout Structure Steps
1. **Root Frame**: Create a Frame of `1440x900px`, fill `Color/accent`, padding `8px`, gap `6px`, horizontal auto-layout. Clip content: `true`.
2. **Sidebar Frame**: Left column, `256px` width, fill `Color/background`, stroke `1px solid Color/border`, radius `Radius/2xl` (18px).
   - Header: `56px` height with logo + collapse trigger icon.
   - Menu items: `40px` height, `Radius/xl` (14px) radius, active item fill `Color/primary` + text `Color/primary-foreground`.
   - User profile badge: `Color/accent` fill, radius `Radius/lg` (10px) with avatar + role at bottom.
3. **Main Column**: Auto-layout vertical, `Fill container` width and height, gap `6px`.
4. **White Card**: Fill `Color/background`, stroke `1px solid Color/border`, radius `Radius/2xl` (18px), shadow `shadow-xs`, `Fill container` width and height.
5. **ContentTop Bar**: Inside White Card, `56px` height, horizontal padding `24px` (`px-6`), bottom stroke `1px solid Color/border`, Breadcrumb/Title left (`Color/foreground`), Action buttons right.
6. **Page Viewport**: Inside White Card below ContentTop, `Fill container` width and height, `24px` padding (`p-6`), ready for dashboard widgets or tables.

