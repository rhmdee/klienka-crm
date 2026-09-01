# Klienka CRM - Token Guidelines (Figma Make Kit)

This document provides guidance on how to use design tokens in the Klienka CRM project. It teaches Figma Make the available tokens, their semantic meaning, and how to apply them correctly based on context.

## 1. Naming Pattern

Our token naming convention relies on **Semantic Roles** rather than raw color values. This allows the system to seamlessly switch between Light and Dark modes.

Tokens are structured as follows:
- **Base Role**: `[role]` (e.g., `primary`, `secondary`, `destructive`)
- **Text/Content on Base Role**: `[role]-foreground` (e.g., `primary-foreground`, `destructive-foreground`)
- **Backgrounds**: `background` (main app background), `muted` (subtle background)
- **Borders**: `border` (default), `border-[role]` (e.g., `border-destructive`)

## 2. Semantic Purpose

Tokens are categorized by their intended meaning:

- **Neutral/Structural**: 
  - `background`: The primary canvas of the application.
  - `foreground`: Primary text color (high contrast).
  - `muted`: Secondary, low-emphasis backgrounds (e.g., disabled states, subtle panel backgrounds).
  - `muted-foreground`: Secondary text (e.g., captions, placeholder text).
  - `border`: Default border color for separating structural elements.
- **Brand/Action**:
  - `primary`: The main brand color used for primary actions, active states, and emphasis (Blue tones).
  - `secondary`: Used for alternative prominent actions or specific data groupings (Green tones).
  - `accent`: Used for hover states on neutral elements or subtle highlights.
- **Feedback/Status**:
  - `destructive`: Errors, deletion warnings, or critical system failures (Red tones).
  - `warning`: Cautionary actions or pending statuses (Orange tones).
  - `success`: Completed actions or positive statuses (Green tones).
  - `info`: General information or neutral statuses (Blue tones).

## 3. Usage Frequency

To help decide which token to use, understand their frequency in a typical layout:

- **High Frequency (Defaults)**: `background`, `foreground`, `border`. *Use these for 80% of the UI structure.*
- **Medium Frequency**: `primary` (Main buttons), `muted`, `muted-foreground` (Secondary information).
- **Low Frequency (Edge Cases)**: `destructive`, `warning`, `success`. *Only use these when specific feedback or status must be conveyed.*

## 4. Decision Tree

Follow this quick lookup when selecting a token for a new element:

1. **Are you styling a background?**
   - Is it the main page? $\rightarrow$ `background`
   - Is it a prominent Call-to-Action button? $\rightarrow$ `primary`
   - Is it a subtle secondary panel or hover state? $\rightarrow$ `muted` or `accent`
2. **Are you styling text?**
   - Is it a heading or main body text? $\rightarrow$ `foreground`
   - Is it a subtitle, placeholder, or caption? $\rightarrow$ `muted-foreground`
   - Is it text *inside* a primary button? $\rightarrow$ `primary-foreground`
3. **Are you styling a border?**
   - Is it a standard card or input border? $\rightarrow$ `border`
   - Is it highlighting an error? $\rightarrow$ `border-destructive`

## 5. Examples (Correct vs. Incorrect)

### Text Colors
- ✅ **Correct**: Applying `muted-foreground` to a timestamp below a notification.
- ❌ **Incorrect**: Applying `background` to text to make it "invisible" (Use opacity or hide the layer instead).
- ❌ **Incorrect**: Applying `foreground` to text inside a primary button (The contrast will fail; use `primary-foreground`).

### Backgrounds
- ✅ **Correct**: Using `accent` for a table row when hovered.
- ❌ **Incorrect**: Using `primary` as the background for an entire sidebar (It will overwhelm the user; use `background` or `muted`).

### Feedback States
- ✅ **Correct**: A "Delete Client" button background is `destructive` and its text is `destructive-foreground`.
- ❌ **Incorrect**: A "Cancel" button is styled as `destructive` (Cancel is a neutral action, it should be a ghost or outline button using `accent` on hover).
