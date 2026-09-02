# Klienka CRM - Design System Guidelines

This document serves as the **Single Source of Truth (SSOT)** for the **Klienka CRM** design system. It establishes visual standards, design tokens, component anatomy, motion principles, and implementation rules for both software engineers and the **Figma Make Kit** (AI Layout Agents and UI/UX Designers).

> [!IMPORTANT]
> **Mandatory Token Binding Rule**:
> - **NEVER** use raw, unlinked hex colors (e.g., `#FFFFFF`, `#171717`, `#2563EB`) or arbitrary Tailwind colors (e.g., `bg-blue-600`, `text-gray-500`).
> - **ALWAYS** bind styles directly to semantic tokens (e.g., `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`).
> - Cross-reference [token.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/token.md) for semantic roles and [layout-anatomy.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/layout-anatomy.md) for structural viewport layout specifications.

---

## 1. Design System Foundations

Klienka CRM delivers a high-density, professional, and accessible SaaS interface tailored for business development, project management, and operational workflows. The aesthetic balances crisp functional minimalism with modern micro-interactions and smooth theme transitions.

### Key Pillars:
1. **Semantic Theming**: Dynamic Light and Dark modes driven by CSS variables and Figma local variables.
2. **Strict Spacing Scale**: Base 4px increment unit (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
3. **Viewport-Locked Shell**: Outermost window scroll is disabled; internal scroll containers handle data density.
4. **Accessible Contrast**: WCAG AA compliant text and interactive state contrasts in both themes.

---

## 2. Color Palette & Token Reference

Tokens represent functional roles rather than literal color names, ensuring seamless mode switching.

### 2.1 Theme Tokens Matrix

| Semantic Token | Tailwind Class | Light Mode (Default) | Dark Mode (`.dark`) | Figma Variable | Primary Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`background`** | `bg-background` | `#ffffff` (White) | `neutral-950` (`#0a0a0a`) | `Color/background` | Main surface of cards, content box, modals |
| **`foreground`** | `text-foreground` | `neutral-900` (`#171717`) | `#ffffff` (White) | `Color/foreground` | Primary text, titles, high-contrast icons |
| **`accent`** | `bg-accent` | `neutral-100` (`#f5f5f5`) | `neutral-900` (`#171717`) | `Color/accent` | Outermost canvas frame, row hover, user badge |
| **`accent-foreground`**| `text-accent-foreground`| `neutral-700` (`#404040`) | `neutral-300` (`#d4d4d4`) | `Color/accent-foreground` | Text on accent surfaces |
| **`border`** | `border-border` | `neutral-200` (`#e5e5e5`) | `neutral-800` (`#262626`) | `Color/border` | 1px structural borders, dividers, inputs |
| **`muted`** | `bg-muted` | `neutral-200` (`#e5e5e5`) | `neutral-800` (`#262626`) | `Color/muted` | Disabled elements, table header backgrounds |
| **`muted-foreground`** | `text-muted-foreground` | `neutral-500` (`#737373`) | `neutral-400` (`#a3a3a3`) | `Color/muted-foreground` | Captions, placeholders, inactive nav links |
| **`primary`** | `bg-primary` | `blue-700` (`#1d4ed8`) | `blue-900` (`#1e3a8a`) | `Color/primary` | Main CTAs, active navigation pill |
| **`primary-foreground`**| `text-primary-foreground`| `blue-50` (`#eff6ff`) | `blue-100` (`#dbeafe`) | `Color/primary-foreground`| Text/icons on primary buttons and active pills |
| **`secondary`** | `bg-secondary` | `green-700` (`#15803d`) | `green-800` (`#166534`) | `Color/secondary` | Secondary brand actions, alternative badges |
| **`secondary-foreground`**| `text-secondary-foreground`| `green-50` (`#f0fdf4`) | `green-100` (`#dcfce7`) | `Color/secondary-foreground`| Text on secondary elements |

### 2.2 Status & Feedback Tokens

| Role | Fill Token (`bg-*`) | Text Token (`text-*`) | Border Token (`border-*`) | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Destructive** | `destructive` (`red-600` / `red-700`) | `on-destructive` (`red-50` / `red-100`) | `border-destructive` (`red-200` / `red-400`) | Deletions, critical alerts, validation errors |
| **Warning** | `warning` (`orange-600` / `orange-700`) | `on-warning` (`orange-50` / `orange-100`)| `border-warning` (`orange-200` / `orange-400`) | Pending stages, expirations, cautionary states |
| **Success** | `success` (`green-600` / `green-700`) | `on-success` (`green-50` / `green-100`) | `border-success` (`green-200` / `green-400`) | Completed handoffs, won deals, saved updates |
| **Info** | `info` (`blue-600` / `blue-700`) | `on-info` (`blue-50` / `blue-100`) | `border-info` (`blue-200` / `blue-400`) | Neutral notices, active tags, tips |

### 2.3 Data Visualization & Charts Palette

Reserved exclusively for CRM charts, funnel distributions, and metric graphs:
- **`chart-1`**: Lime (`lime-200` Light / `lime-700` Dark)
- **`chart-2`**: Pink (`pink-200` Light / `pink-700` Dark)
- **`chart-3`**: Stone (`stone-300` Light / `stone-700` Dark)
- **`chart-4`**: Orange (`orange-200` Light / `orange-700` Dark)
- **`chart-5`**: Violet (`violet-200` Light / `violet-700` Dark)

---

## 3. Typography Hierarchy

We use the **Geist** font family (`Geist Sans` for UI copy and `Geist Mono` for codes, timestamps, and currency values).

| Level | Size | Weight | Line Height | Tailwind Class | Semantic Use |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `36px` (`2.25rem`) | Bold (`700`) | `40px` | `text-4xl font-bold tracking-tight` | Auth screen headings, Hero titles |
| **Section / H2** | `30px` (`1.875rem`)| Semibold (`600`) | `36px` | `text-3xl font-semibold` | Page-level metrics, major section headers |
| **Modal / H3** | `24px` (`1.5rem`) | Semibold (`600`) | `32px` | `text-2xl font-semibold` | Dialog titles, drawer headers, card groups |
| **Card / H4** | `20px` (`1.25rem`) | Medium (`500`) | `28px` | `text-xl font-medium` | Kanban column headers, widget titles |
| **Subtitle / H5** | `18px` (`1.125rem`)| Medium (`500`) | `24px` | `text-lg font-medium` | Top bar page title, subsection titles |
| **Body (Base)** | `16px` (`1.0rem`) | Regular (`400`) | `24px` | `text-base font-normal` | Primary data content, paragraph text |
| **Small / UI** | `14px` (`0.875rem`)| Regular / Medium | `20px` | `text-sm font-normal / font-medium` | Form labels, navigation links, table cells |
| **Micro / Caption**| `12px` (`0.75rem`) | Medium (`500`) | `16px` | `text-xs font-medium` | Badges, timestamps, helper validation text |
| **Nano / Overline**| `10px` (`0.625rem`)| Bold (`700`) | `14px` | `text-[10px] font-bold uppercase tracking-wider` | Sidebar section headers (`Mainflow`, `Setting`) |

---

## 4. Spacing Scale & Layout Grid

Spacing adheres strictly to a **4px base unit**:

| Spacing Token | Pixels | Tailwind Equiv. | Standard Application |
| :--- | :--- | :--- | :--- |
| **Micro-1** | `4px` | `p-1`, `gap-1` | Spacing between icon and adjacent text label |
| **Micro-2** | `6px` | `p-1.5`, `gap-1.5` | Layout shell gap (Sidebar to Main Column) |
| **Base-1** | `8px` | `p-2`, `gap-2` | Outer frame padding (`p-2`), button inner gap |
| **Base-2** | `12px` | `p-3`, `gap-3` | Spacing between cards in a vertical list |
| **Base-3** | `16px` | `p-4`, `gap-4` | Mobile content padding, table cell padding, card inner padding |
| **Medium-1** | `24px` | `p-6`, `gap-6` | Desktop content padding (`sm:p-6`), modal body padding |
| **Medium-2** | `32px` | `p-8`, `gap-8` | Section-level spacing in settings pages |
| **Large-1** | `48px` | `p-12`, `gap-12`| Empty state containers, auth page outer vertical spacing |

---

## 5. Border Radius System

Derived from the base token `--radius: 0.625rem` (`10px`):

| Token | Calculated Radius | Tailwind Class | Applied Components |
| :--- | :--- | :--- | :--- |
| **`--radius-sm`** | `6px` | `rounded-sm` | Checkboxes, mini status badges, tags |
| **`--radius-md`** | `8px` | `rounded-md` | Standard form inputs, dropdown select triggers |
| **`--radius-lg`** | `10px` | `rounded-lg` / `--radius` | Modals, stat summary cards, user info badge |
| **`--radius-xl`** | `14px` | `rounded-xl` | Navigation menu items (`<MenuItem />`), icon buttons |
| **`--radius-2xl`** | `18px` | `rounded-2xl` | Outermost White Box, Sidebar container, Mobile Header |
| **`--radius-full`** | `9999px` | `rounded-full` | Avatars, pill badges, scrollbar thumb |

---

## 6. Layout Shell Architecture

The CRM uses a **Full Viewport Frame Shell** (refer to [layout-anatomy.md](file:///d:/Working/GITHUB/klienka/klienka-crm/guidelines/layout-anatomy.md) for complete technical breakdowns):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Outer Canvas: w-screen h-screen p-2 gap-1.5 bg-accent overflow-hidden                  │
│ ┌──────────────────────┐ ┌───────────────────────────────────────────────────────────┐ │
│ │ <Sidebar />          │ │ <main> (flex-1 flex-col gap-1.5 min-w-0 h-full)            │ │
│ │ • Desktop: w-64/w-18 │ │ ┌─────────────────────────────────────────────────────────┐│ │
│ │ • Mobile: fixed w-72 │ │ │ <Header /> (Mobile Only, lg:hidden, h-16)               ││ │
│ │ • Radius: rounded-2xl│ │ └─────────────────────────────────────────────────────────┘│ │
│ │ • Fill: bg-background│ │ ┌─────────────────────────────────────────────────────────┐│ │
│ │                      │ │ │ Content Container ("The White Box", rounded-2xl border) ││ │
│ │                      │ │ │ ┌─────────────────────────────────────────────────────┐ ││ │
│ │                      │ │ │ │ <ContentTop /> (h-14, Breadcrumb + Action Slots)    │ ││ │
│ │                      │ │ │ ├─────────────────────────────────────────────────────┤ ││ │
│ │                      │ │ │ │ <PageContent /> (flex-1 overflow-y-auto p-4 sm:p-6) │ ││ │
│ │                      │ │ │ └─────────────────────────────────────────────────────┘ ││ │
│ │                      │ │ └─────────────────────────────────────────────────────────┘│ │
│ └──────────────────────┘ └───────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Component Styling Guidelines

### 7.1 Buttons (`<Button />`)
- **Primary**: `bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90`.
- **Secondary**: `bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90`.
- **Outline**: `border border-border bg-background hover:bg-accent hover:text-foreground`.
- **Ghost**: `hover:bg-accent hover:text-foreground text-foreground`.
- **Destructive**: `bg-destructive text-on-destructive hover:bg-destructive/90`.
- **Sizes**:
  - `default`: `h-10 px-4 py-2 text-sm rounded-xl`
  - `sm`: `h-8 px-3 text-xs rounded-lg`
  - `lg`: `h-12 px-6 text-base rounded-xl`
  - `icon`: `size-10 rounded-xl`
  - `icon-sm`: `size-8 rounded-lg`

### 7.2 Form Controls & Inputs
- **Input / Select**: `h-10 px-3 bg-background border border-border rounded-md text-sm placeholder:text-muted-foreground`.
- **Focus State**: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.
- **Error State**: `border-destructive text-destructive focus-visible:ring-destructive`.
- **Labels**: `text-sm font-medium text-foreground mb-1.5 block`.
- **Helper / Error Text**: `text-xs text-muted-foreground (or text-destructive) mt-1`.

### 7.3 Data Tables
- **Container**: `border border-border rounded-xl bg-background overflow-hidden`.
- **Header Row (`<th>`)**: `bg-muted/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider h-10 px-4 text-left`.
- **Body Row (`<tr>`)**: `border-b border-border transition-colors hover:bg-accent/60 h-12 px-4`.
- **Responsive Mobile**: Wrap tables in an `overflow-x-auto` container to allow horizontal scrolling without breaking the viewport.

### 7.4 Modals, Dialogs & Drawers
- **Backdrop Overlay**: `fixed inset-0 bg-black/50 backdrop-blur-xs z-50`.
- **Centered Dialog**: `max-w-lg w-full bg-background border border-border rounded-2xl shadow-xl p-6`.
- **Slide-over Drawer**: `fixed top-2 bottom-2 right-2 w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl p-6`.

---

## 8. Motion & Transitions

- **Theme Transition**: Circular wave expansion across root using the View Transitions API (`0.7s cubic-bezier(0.4, 0, 0.2, 1)`).
- **Sidebar Expand/Collapse**: Width morphing between `256px` (`lg:w-64`) and `72px` (`lg:w-18`) with `transition-all duration-300 ease-in-out`.
- **Mobile Drawer**: Slide transition `translate-x-0` vs `-translate-x-[calc(100%+1rem)]` (`duration-300 ease-in-out`).
- **Interactive Hover**: `transition-colors duration-150 ease-in-out`.

---

## 9. Figma Make Kit Setup Checklist

When generating or auditing Figma assets:
1. **Color Variables**: Ensure all 11 core roles + 4 feedback roles + 5 chart colors exist in Local Variables for both `Light` and `Dark` modes.
2. **Dimension Variables**: Create variables for `Radius/sm` (6px), `Radius/md` (8px), `Radius/lg` (10px), `Radius/xl` (14px), and `Radius/2xl` (18px).
3. **Auto-Layout Exclusivity**: Build all components and layouts using Auto-Layout with strict 4px/6px/8px increments.
4. **No Detached Styles**: Every layer must be linked to a named token variable.

