# Design System Strategy: Neural Archive

## 1. Overview & Creative North Star
**The Creative North Star: "The Synthetic Overseer"**

This design system moves away from the "standard admin dashboard" by embracing a high-tech, editorial aesthetic inspired by advanced data-visualization and tactical command centers. We are not just building an "Orders Management" tool; we are building the *Neural Archive*—a precise, cold, and hyper-efficient interface for 'Overlord Toys'.

The layout breaks the traditional grid through **intentional asymmetry**. Primary data visualizations should feel like they are floating in deep space, utilizing overlapping glass containers and high-contrast typography scales. We prioritize "breathing room" (negative space) over crowded data tables to ensure every action feels deliberate and premium.

---

### 2. Colors & Surface Philosophy
The palette is rooted in the deep void of `#06151a`. It is designed to minimize eye strain while highlighting critical "synthetic" energy through cyan accents.

*   **The "No-Line" Rule:** We do not use solid 1px borders to separate major sections. Division is achieved through **Surface Layering**. A section of `surface-container-low` sitting atop the `background` creates a natural, sophisticated boundary that a line cannot replicate.
*   **The Glass & Gradient Rule:** To embody the 'Neural Archive' aesthetic, primary CTAs and active states must use the signature **Cyan Linear Gradient** (from `#6ff7e8` to `#1f7ea1` at 135 degrees). Floating UI elements should use `surface-container` with a `backdrop-blur` of 12px–20px and 40% opacity to create a "frosted tech" feel.
*   **Surface Hierarchy:**
    *   **Level 0 (Base):** `surface` (#06151a) – The infinite void.
    *   **Level 1 (Sections):** `surface-container-low` (#0e1e23) – Large layout blocks.
    *   **Level 2 (Cards):** `surface-container-high` (#1d2c32) – Individual order items/stats.
    *   **Level 3 (Pop-overs):** `surface-bright` (#2c3c41) – Tooltips and menus.

---

### 3. Typography
We use a high-contrast pairing to balance "Humanist" legibility with "Industrial" authority.

*   **Display & Headlines (Poppins):** Poppins provides the geometric precision required for an "Overlord" persona. Use `headline-lg` for order totals and `display-sm` for hero metrics. The tracking (letter-spacing) for all-caps labels should be increased by 5% to enhance the "archival" feel.
*   **Body & UI (Inter):** Inter is our workhorse for data. Use `body-md` for order descriptions and `label-sm` for technical metadata.
*   **Color Assignment:** All primary text must use `#EAFAF8` (mapped to `on-surface`). Secondary metadata uses `on-surface-variant` (#bbcac6) to create clear information hierarchy.

---

### 4. Elevation & Depth
Depth in this system is a tactical tool, not just an aesthetic choice.

*   **The Layering Principle:** Instead of shadows, stack your tokens. A `surface-container-highest` card placed on a `surface-container-low` background creates a "mechanical lift" effect.
*   **Ambient Shadows:** For floating modals, use a custom shadow: `0px 24px 48px rgba(0, 0, 0, 0.5)`. Never use harsh black; the shadow must feel like it's absorbing the surrounding cyan glow.
*   **The Ghost Border:** For high-density data tables where containment is required, use a 1px border with `outline-variant` at 15% opacity. It should be felt, not seen.
*   **Glassmorphism Specs:** 
    *   **Background:** `rgba(18, 34, 39, 0.7)`
    *   **Border:** `1px solid rgba(133, 148, 145, 0.1)`
    *   **Blur:** `blur(16px)`

---

### 5. Components

#### Buttons
*   **Primary:** Gradient background (`#6FF7E8` to `#1F7EA1`), `on-primary` text, `0.25rem` radius. Apply a subtle outer glow (0px 0px 12px) using `primary-fixed-dim` at 30% opacity.
*   **Secondary:** Ghost style. `outline` border at 20% opacity. On hover, the border opacity increases to 100%.

#### Order Cards
*   **Structure:** No divider lines. Use `surface-container-low` for the card body. 
*   **Interaction:** On hover, the card should transition to `surface-container-high` and the "Ghost Border" should illuminate with a `primary` tint.

#### Data Inputs
*   **States:** Background should be `surface-container-lowest`. The focus state is not a thicker border, but a 1px `primary` glow and a slight background shift to `surface-container-high`.

#### Chips (Status Indicators)
*   **Neural Status:** Use `secondary-container` for "Processing" and `error-container` for "Flagged/Cancelled." Chips should be pill-shaped (`9999px`) with `label-sm` typography.

#### Lists & Tables
*   **Row Separation:** Strictly forbidden to use lines. Use a 12px vertical gap between rows, or alternating background tints between `surface` and `surface-container-low`.

---

### 6. Do's and Don'ts

*   **DO:** Use asymmetrical layouts (e.g., a wide table next to a narrow, tall "Order Details" glass panel).
*   **DO:** Use the `primary` cyan gradient sparingly for high-value actions (Ship Order, Process Refund).
*   **DON'T:** Use "Flat" cards. Every container must have either a backdrop blur or a tonal shift.
*   **DON'T:** Use standard grey shadows. Shadows must be deep, tinted, and ultra-diffused.
*   **DO:** Prioritize the `0.25rem` (DEFAULT) roundedness for a sharp, "precision-machined" look. Avoid overly rounded `xl` corners except for status chips.
*   **DON'T:** Use 100% white. Always use `#EAFAF8` to maintain the cool, atmospheric temperature of the archive.