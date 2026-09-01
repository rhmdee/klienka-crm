# Klienka CRM - Style Guidelines (Figma Make Kit)

This document teaches Figma Make what styles are available in the Klienka CRM design system and how to apply them correctly. It focuses strictly on visual patterns, spacing scales, and layout principles.

## 1. Layout Principles

- **Grid System**: Use a flexible 12-column grid structure for desktop and a 4-column grid for mobile.
- **Container Widths**:
  - Maximum width for the main content area: `1280px` (`max-w-7xl`).
  - Standard modal/dialog width: `425px` (`sm:max-w-[425px]`).
- **Standard Padding**: Main page layouts should maintain a minimum horizontal padding of `16px` on mobile and `32px` on desktop.

## 2. Spacing Scale

Our spacing system is based on a strict **4px base unit**. You must strictly adhere to this scale for padding, margins, and gaps.

- **4px** (`p-1`, `gap-1`): Micro-adjustments, spacing between tightly grouped icons and text.
- **8px** (`p-2`, `gap-2`): Default spacing within small components (e.g., inside buttons, between list items).
- **16px** (`p-4`, `gap-4`): Default spacing between discrete components or standard inner padding for small cards.
- **24px** (`p-6`, `gap-6`): Standard inner padding for primary cards, modals, and major sections.
- **32px** (`p-8`, `gap-8`): Spacing between major page sections or distinct layout blocks.
- **48px** (`p-12`, `gap-12`): Large page-level spacing (e.g., hero section padding, page headers).
- **64px** (`p-16`, `gap-16`): Maximum vertical breathing room.

## 3. Typography Hierarchy

We use the **Geist** font family. The hierarchy is mapped below with specific sizes, weights, and line heights.

- **H1 (Page Titles)**: Size: `36px` (`text-4xl`), Weight: `Bold (700)`, Line-height: `40px`.
- **H2 (Section Titles)**: Size: `30px` (`text-3xl`), Weight: `Semibold (600)`, Line-height: `36px`.
- **H3 (Card/Modal Titles)**: Size: `24px` (`text-2xl`), Weight: `Semibold (600)`, Line-height: `32px`.
- **H4 (Subsections)**: Size: `20px` (`text-xl`), Weight: `Medium (500)`, Line-height: `28px`.
- **Body (Base text)**: Size: `16px` (`text-base`), Weight: `Regular (400)`, Line-height: `24px`.
- **Small/Caption**: Size: `14px` (`text-sm`), Weight: `Regular (400)`, Line-height: `20px`.
- **Micro (Badges)**: Size: `12px` (`text-xs`), Weight: `Medium (500)`, Line-height: `16px`.

## 4. Border Radius System

We use a rounded but professional aesthetic based on a base `--radius` of `10px`.

- **Cards, Modals & Drawers**: `10px` (`rounded-lg`).
- **Standard Buttons, Inputs & Dropdowns**: `8px` (`rounded-md`).
- **Small Elements (Badges, Checkboxes)**: `6px` (`rounded-sm`).
- **Avatars & Icons Backgrounds**: Fully rounded `9999px` (`rounded-full`).

## 5. Responsive Behavior

- **Stacking Logic**: Stack complex data components horizontally on desktop (side-by-side) and vertically on mobile screens.
- **Navigation**: Desktop uses a fixed Sidebar layout (`w-64`), while mobile relies on a hidden bottom-sheet (Drawer) or Hamburger menu.
- **Data Tables & Kanban**: On mobile devices, Data Tables must be horizontally scrollable to prevent breaking the viewport layout. Kanban columns stack vertically or use horizontal swipe instead of shrinking column width.
