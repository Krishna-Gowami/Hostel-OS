# Design System Strategy: The Tactile Concierge

## 1. Overview & Creative North Star
This design system is built upon the **"Tactile Concierge"** North Star. In the world of premium hostel management, we move away from the "industrial efficiency" of standard SaaS and toward a "hospitality-first" digital environment. 

We are not just building a dashboard; we are creating a layered, physical space. By leveraging Material Design 3 (MD3) logic but stripping away its "out-of-the-box" sterility, we use intentional asymmetry, expansive white space, and 3D-inspired layering to make the complex task of property management feel light, airy, and premium.

## 2. Color Architecture & The "No-Line" Philosophy
Our palette is rooted in deep Indigos and soft architectural Greys, creating an atmosphere of trust and modern sophistication.

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are strictly prohibited** for sectioning. Boundaries must be defined through tonal shifts.
- **Example:** A `surface-container-low` (#f3f4f5) sidebar should sit against a `surface` (#f8f9fa) main canvas without a dividing line. 
- Use the **Surface Hierarchy** to nest elements: Place a `surface-container-lowest` (#ffffff) card inside a `surface-container` (#edeeef) section to create natural definition.

### The "Glass & Gradient" Signature
- **Primary CTAs:** Use a subtle linear gradient from `primary` (#24389c) to `primary_container` (#3f51b5) at a 135-degree angle. This adds "soul" and depth that flat colors lack.
- **Floating Overlays:** Use Glassmorphism for notification panels and dropdowns. Apply `surface_container_lowest` at 80% opacity with a `16px` backdrop-blur to allow the management grid to peek through, maintaining context.

## 3. Typography: Editorial Authority
We pair **Manrope** (Headlines) with **Inter** (Body) to balance character with high-speed legibility.

- **Display & Headlines (Manrope):** These are our "Editorial" voices. Use `display-lg` for key metrics (e.g., "98% Occupancy") to create a bold, confident focal point.
- **Title & Body (Inter):** These are our "Functional" voices. Use `body-md` for standard data and `label-md` for metadata. 
- **Hierarchy Tip:** Contrast a `headline-sm` title with a `label-sm` subtitle in `on_surface_variant` (#454652) to create a clear informational scent without using heavy weights.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." In this system, depth is a result of light and material stacking.

### The Layering Principle
Think of the UI as sheets of fine paper stacked on a light table. 
1. **Base:** `surface` (#f8f9fa)
2. **Structural Sections:** `surface-container` (#edeeef)
3. **Interactive Cards:** `surface-container-lowest` (#ffffff)

### Ambient Shadows & Hover Effects
When an element must "float" (e.g., an active booking card):
- **Shadows:** Use a 12% opacity shadow tinted with `primary` (#24389c) rather than pure black. Set blur to `24px` and spread to `-4px` for a soft, high-end glow.
- **Hover State:** On hover, a card should translate `-4px` on the Y-axis and transition to a `surface_bright` tone. This creates a tactile, 3D response.

### The Ghost Border Fallback
If accessibility requires a container edge, use a **"Ghost Border"**: `outline_variant` (#c5c5d4) at 20% opacity. It should be felt, not seen.

## 5. Component Guidelines

### Admin Sidebar (Dark Mode)
The primary navigation uses `inverse_surface` (#2e3132) to anchor the experience. 
- **Icons:** Use 24px "sharp" or "rounded" variants in `inverse_on_surface`.
- **Active State:** Instead of a highlight box, use a vertical "pill" of `primary_fixed` (#dee0ff) on the leading edge.

### Floating Cards (The Booking Engine)
Cards are the heart of the hostel app.
- **Rules:** No dividers. Use `spacing-6` (1.5rem) internal padding.
- **Status Badges:** Use `tertiary_container` for "Pending" and `primary_container` for "Confirmed." Badges should use the `full` roundedness scale for a soft, pill-like appearance.

### Data Tables (The Occupancy Grid)
- **Constraint:** Forbid horizontal lines between rows. 
- **Separation:** Use alternating row fills of `surface_container_low` or simple `spacing-4` vertical gaps between row-containers.
- **Interactive Rows:** On hover, the entire row should lift using the `surface_container_highest` tone.

### Avatar Chips & Notifications
- **Avatar Chips:** Use `secondary_container` for the background. Avatars should have a `2px` "halo" of the underlying surface color to make them "pop" from the UI.
- **Notification Bell:** When active, use a `primary` dot with a pulse animation rather than a red "error" color to keep the mood professional and calm.

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-8` and `spacing-10` to separate major content blocks. Breathing room is a luxury.
- **Do** use `surface_tint` at 5% opacity as an overlay on images to align them with the Indigo brand palette.
- **Do** align all text to a 4px baseline grid to ensure the editorial typography feels "locked in."

### Don't
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1d) to maintain a soft, premium contrast.
- **Don't** use standard `0.5rem` rounding for everything. Mix `xl` (1.5rem) for large containers and `full` for interactive chips to create visual rhythm.
- **Don't** use "Drop Shadows" on flat buttons. Use tonal shifts or subtle `ghost borders` instead.