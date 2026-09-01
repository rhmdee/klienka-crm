# Klienka CRM - Design Skills (Figma Make Kit)

This document defines specific "Skills" (patterns and workflows) for Figma Make. Use these instructions to assemble components into complex, consistent layouts that match the Klienka CRM architecture.

## Skill 1: Designing a Dashboard Layout

**Goal**: Create a high-level overview page with summary statistics and recent activities.

**Steps**:
1. **Container Setup**: Start with a main frame (Desktop: `1280px` max-width, `32px` padding. Mobile: `100%` width, `16px` padding).
2. **Page Header**: Insert a typography `H1` or `H2` for the page title (e.g., "Dashboard"). Add a global date picker or filter on the far right using a ghost or outline button.
3. **Stat Cards (Top Row)**: 
   - Create a grid. On desktop, use 4 columns; on mobile, use 1 or 2 columns.
   - Insert standard `Cards` (`10px` radius, `border`, `bg-background`).
   - Inside each card: A small muted title (`muted-foreground`), a large prominent number (`H2`), and a small trend indicator (e.g., "+20% this month" in `success` or `muted-foreground` color).
4. **Data Visualization / Tables (Bottom Row)**:
   - Create larger cards spanning 2 or more columns.
   - Use these for bar charts or a "Recent Activities" list.

## Skill 2: Designing a Data Table

**Goal**: Display lists of entities (Clients, Invoices, Handoffs) efficiently.

**Steps**:
1. **Header Toolbar**: 
   - Left side: A search input (with a magnifying glass icon, `border`, `rounded-md`).
   - Right side: Action buttons (e.g., "Export" in outline, "Add New" in `primary`).
2. **Table Container**: A full-width frame with a 1px `border` and `rounded-lg` corners.
3. **Table Header Row**: 
   - Background: `muted`.
   - Text: `14px`, `Medium`, `muted-foreground`.
4. **Table Body Rows**:
   - Background: `background`.
   - Hover state: `accent`.
   - Border-bottom: 1px `border` between rows (except the last row).
   - Far right column: An ellipsis (...) icon button (ghost style) for a dropdown action menu.
5. **Pagination (Footer)**: Place "Previous" and "Next" outline buttons below the table, aligned to the right.

## Skill 3: Designing a Kanban Board (Pipeline)

**Goal**: Visualize the sales pipeline and deal stages.

**Steps**:
1. **Layout**: A horizontal scrolling container (ensure it doesn't wrap to the next line on small screens).
2. **Columns (Stages)**:
   - Width: Fixed at around `320px` to `350px`.
   - Spacing: `16px` gap between columns.
   - Column Header: Stage Name (`H4` or `Semibold`) and a badge showing the number of deals.
   - Column Background: Keep transparent or use a very subtle `muted` fill.
3. **Cards (Deals)**:
   - Background: `background`, Border: 1px `border`, Radius: `10px`.
   - Padding: `16px`.
   - Content: Deal title (`Foreground`, `Medium`), Client Name (`muted-foreground`), Value (e.g., "Rp 50.000.000" in `Semibold`), and priority badges.
   - Spacing: `12px` gap between cards vertically.

## Skill 4: Designing Forms & Modals (Drawers)

**Goal**: Create interfaces for data entry (e.g., "Add New Client").

**Steps**:
1. **Container**: Use a right-side Drawer (Slide-over) for complex forms, or a centered Modal (`max-w-[425px]`) for simple, quick inputs.
2. **Header**: Title (`H3`) and a subtle "X" close button (`ghost`) in the top right.
3. **Form Fields Layout**:
   - Stack fields vertically with a `24px` gap.
   - Label: `14px`, `Medium`, `foreground`. Placed above the input.
   - Input/Select: `40px` height, `border`, `rounded-md`.
   - Helper Text: `12px`, `muted-foreground`. Placed below the input.
4. **Footer Actions**:
   - Fixed at the bottom of the modal/drawer.
   - Background: `background` with a top `border`.
   - Buttons aligned to the right: "Cancel" (Outline) and "Submit" (Primary).

## Using these Skills
When an agent is prompted with *"Create a Pipeline view"*, it should automatically look up **Skill 3 (Kanban Board)** and apply the layout, column widths, and card structures defined above, utilizing the tokens from `token.md` and spacing from `styles.md`.
