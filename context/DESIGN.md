<!--
  boilerplate:
  Design direction
  Brand personality
  Colors
  Typography
  Grid
  Spacing
  Imagery
  Components
  Motion principles
  Responsive behavior
-->

# Mister Media — Design System

## 1. Design Direction

The visual direction is minimal, bold, energetic, and modern.

Key characteristics:
- Minimal overall composition
- Large, bold typography as a primary visual element
- Handwritten typography used as an expressive accent
- Primary yellow/orange used strongly in handwritten elements and selected highlights
- Large light-weight typography with stroke-only treatment where appropriate
- High border radius across cards, media, buttons, and other UI elements
- Generous whitespace
- Strong contrast between typography, imagery, and background
- Visual hierarchy should remain clear despite the energetic personality

The design should feel creative and dynamic without becoming visually cluttered.

---

## 2. Brand Personality

The website should communicate the following personality traits:

- Joyful
- Professional
- Modern
- Dynamic
- Results-Driven
- Sleek
- Client-Centric

The visual language should balance creativity and energy with the credibility expected from an established creative agency.

---

## 3. Color System

### Primary
- Primary: `#F18F00`

### Text
- Main Text: `#36393B`
- Light Text: `#B4B6B5`

### Backgrounds
- Light Background: `#FFEECF`
- Lightest Background: `#FFFFFF`

### Usage Principles

- `#F18F00` should act as the main visual accent and brand-energy color.
- Use the primary color selectively for highlights, handwritten elements, CTAs, interactive states, and important visual moments.
- `#36393B` is the primary text color.
- `#B4B6B5` is reserved for secondary or supporting text.
- `#FFEECF` provides a warm, softer background alternative to white.
- `#FFFFFF` should be used for clean, high-contrast sections and visual breathing space.

Avoid introducing additional colors unless they are required by project content or approved later.

---

## 4. Typography

### Arabic

- Titles: Almarai (Google Fonts)
- Handwritten: Shekari (`app/assets/fonts/shekari.ttf`)
- Paragraph: Almarai (Google Fonts)

### English

- Titles: Eurostile (`app/assets/fonts/Eurostile LT Demi.ttf`, `app/assets/fonts/EurostileNextLTPro-Regular.otf`)
- Handwritten: Caveat (Google Fonts)
- Paragraph: Exo (Google Fonts)

Typography should prioritize:
- Strong visual hierarchy
- Large expressive headlines
- Clear readability
- Distinct separation between display and body typography
- Handwritten typography as an accent rather than the default typography

---

## 5. Grid & Layout

The main website container should use a fluid layout.

Some sections may use an XL container when a wider composition is required.

### Grid

- 12-column grid system
- Fluid container
- Flexible column spans depending on section requirements
- Grid should support both structured layouts and intentionally asymmetric compositions
- Sections should not feel constrained to a rigid template

The grid should act as a structural foundation while allowing the visual direction to remain expressive.

---

## 6. Spacing

The website should use generous spacing and intentional whitespace.

### Spacing Principle

Use an **8px spacing system** as the base rule.

Spacing should generally follow multiples of 8:

`8 → 16 → 24 → 32 → 40 → 48 → 64 → 80 → 96 → 128...`

Large sections should have generous vertical spacing to create visual breathing room.

Whitespace is an important part of the design and should not be reduced simply to fit more content on screen.

---

## 7. Imagery

To be defined after reviewing the available project media and visual references.

The imagery direction should support:
- Strong portfolio presentation
- Creative visual storytelling
- Professional production quality
- Branding and packaging work
- Print and physical work
- Digital/marketing work

Image treatment, aspect ratios, cropping, borders, radius, and gallery behavior will be defined through the references and section design process.

---

## 8. Components

Components will be defined progressively from the visual references collected in `REFERENCES.md`.

Each component should be documented when its reference and intended usage become clear.

Possible component categories include:
- Navigation
- Buttons / CTAs
- Project cards
- Project galleries
- Client logos
- Service cards
- Testimonials
- Typography treatments
- Media blocks
- Tags / metadata
- Footer elements

Components should follow the overall design direction rather than introducing unrelated visual patterns.

---

## 9. Motion Principles

Motion should feel:

- Fast
- Energetic
- High-Momentum

Animation should reinforce the dynamic personality of Mister Media without making the website feel chaotic.

Key principles:
- Prefer quick, responsive interactions
- Use motion to create momentum between sections
- Typography can be an important animation element
- Large visual elements may enter, move, reveal, or transform with strong momentum
- Avoid slow, overly luxurious, or unnecessarily decorative animations
- Motion should support content and hierarchy rather than compete with them

Specific animations will be defined progressively through `REFERENCES.md` and `IMPLEMENTATION.md`.

---

## 10. Responsive Behavior

To be defined during the implementation and section-design process.

General principles:
- Preserve the visual hierarchy across screen sizes
- Maintain generous whitespace where possible
- Adapt the 12-column desktop grid into simpler layouts on smaller screens
- Typography should scale responsively
- Large visual compositions may need to change structure rather than simply shrink
- Interactive and animated elements must remain usable on touch devices
- Mobile layouts should prioritize clarity and content hierarchy over preserving the exact desktop composition

Detailed responsive rules will be defined per section in `IMPLEMENTATION.md`.

---

## 11. Design Rules

- Minimal does not mean empty; every element should have a purpose.
- Typography is a major visual element.
- Use large typography confidently.
- Handwritten typography should create personality and contrast.
- Use the primary color intentionally rather than everywhere.
- Preserve generous whitespace.
- Use rounded/high-radius visual elements consistently.
- Keep layouts clean even when motion is energetic.
- Creativity should coexist with professional credibility.
- Do not introduce visual patterns without a clear purpose or reference.