<!--
  boilerplate
  Technical decisions
-->
# Mister Media — Implementation

## 1. Technology Stack

The website will be built with:

- Nuxt
- Vue
- Vue Router
- Nuxt Fonts
- Nuxt Icon
- Nuxt Image
- Nuxt i18n
- Nuxt Tailwind CSS
- Tailwind CSS
- Tailwind CSS Vite
- GSAP
- Lenis
- Swiper

### Library Usage

- **Nuxt** — application framework, SSR, routing structure, and project architecture.
- **Vue** — UI components and application logic.
- **Vue Router** — routing through Nuxt's routing system.
- **Nuxt i18n** — multilingual support and localized routing.
- **Nuxt Fonts** — font loading and optimization.
- **Nuxt Icon** — icons.
- **Nuxt Image** — image optimization and responsive images.
- **Nuxt Tailwind CSS** — Tailwind CSS integration with Nuxt.
- **Tailwind CSS** — styling, layouts, and responsive behavior.
- **Tailwind CSS Vite** — Tailwind CSS Vite integration.
- **GSAP** — animations and complex motion.
- **Lenis** — smooth scrolling.
- **Swiper** — sliders and carousels when required.

Do not introduce additional libraries unless explicitly approved.

---

## 2. Architecture

The website should use a clean and modular Nuxt architecture.

Initial structure:

    app/
    ├── assets/
    ├── components/
    │   ├── global/
    │   ├── navigation/
    │   ├── sections/
    │   └── ui/
    ├── composables/
    ├── layouts/
    ├── pages/
    ├── plugins/
    ├── app.vue
    └── ...

The exact structure may evolve as the project grows.

### Component Principles

- Build reusable components where repetition exists.
- Avoid creating abstractions for one-off elements without a clear reason.
- Keep components focused on one responsibility.
- Section-specific components should remain easy to modify independently.
- Global components should only contain genuinely shared functionality.
- Avoid over-engineering the component architecture.

---

## 3. Pages & Routing

The website is multi-page.

Initial routes:

    /
    /projects
    /projects/[slug]
    /services
    /services/[slug]

Additional pages may be introduced later.

Routing should use Nuxt's file-based routing and Vue Router underneath.

### Project Routes

Projects should use dynamic routes:

    /projects/[slug]

Each project should have a unique and stable slug.

### Service Routes

Services should use dynamic routes when individual service pages are required:

    /services/[slug]

---

## 4. Internationalization

The website will initially support:

- English
- Arabic

Turkish may be added later.

Use Nuxt i18n for all internationalization functionality.

### Routing

Use history mode for localized routes.

Localized routes should follow a clean structure such as:

    /en/...
    /ar/...

The default language behavior should be configured through Nuxt i18n.

### Language Principles

- All user-facing content must support localization.
- Do not hardcode translated content directly into components when it belongs to the translation system.
- Components must work correctly in both LTR and RTL layouts.
- Arabic must use RTL layout behavior.
- English must use LTR layout behavior.
- Do not assume that translated text will have the same length between languages.
- Layouts must remain flexible enough to accommodate Arabic and English content differences.

### Future Language

The architecture must allow Turkish to be added without restructuring the application.

---

## 5. Styling

Tailwind CSS is the primary styling system.

### Rules

- Use Tailwind utility classes for styling.
- Use Tailwind theme variables for design tokens.
- Avoid writing normal CSS unless Tailwind cannot reasonably handle the requirement.
- Do not create unnecessary CSS files.
- Do not use inline style attributes for normal styling.
- Do not duplicate design values across components.
- Reuse Tailwind variables for colors, spacing, typography, radius, and other design tokens.

### Design Tokens

Values defined in DESIGN.md should be represented through Tailwind variables.

Design token categories include:

- Colors
- Typography
- Spacing
- Border Radius
- Container Sizes
- Breakpoints where necessary

Current colors:

    Primary:       --color-primary      #F18F00
    Main:          --color-main         #36393B
    Light Text:    --color-light-text   #B4B6B5
    Light BG:      --color-light-bg     #FFEECF
    Lightest BG:   --color-lightest-bg  #FFFFFF

Current typography:

    Title:         --font-title        (Eurostile / Almarai)
    Handwritten:   --font-handwritten  (Caveat / Shekari)
    Paragraph:     --font-paragraph    (Exo / Almarai)

---

## 6. Layout System

The website uses a fluid main container.

The primary layout should use a 12-column grid on larger screens.

Some sections may use an XL container when required by the design.

### Layout Principles

- Prefer CSS Grid through Tailwind for structured layouts.
- Use Flexbox for linear layouts.
- Avoid unnecessary absolute positioning.
- Absolute positioning is allowed when it is part of the intended visual composition.
- Do not force every section into the same grid structure.
- Preserve intentional asymmetry from approved references.
- Maintain consistent horizontal alignment between related sections.

---

## 7. Responsive Implementation

The website must be responsive across:

- Desktop
- Tablet
- Mobile

Use Tailwind responsive utilities.

### Principles

- Desktop and mobile do not need to use identical compositions.
- Sections may change their layout structure at different breakpoints.
- Typography should scale responsively.
- Grid columns should simplify on smaller screens.
- Large visual compositions may change structure instead of simply shrinking.
- Large media must remain visually useful and properly cropped.
- Interactive elements must remain touch-friendly.
- Navigation must remain usable on small screens.
- Animations must remain performant on mobile.
- Avoid unnecessary horizontal overflow.

Exact responsive behavior should be documented for each section during implementation.

---

## 8. Animation

Use GSAP for animation.

Use Lenis for smooth scrolling.

### Motion Direction

Motion should follow the principles defined in DESIGN.md:

- Fast
- Energetic
- High-Momentum

### GSAP Principles

- Use GSAP for meaningful animation rather than unnecessary decoration.
- Keep animation timing consistent across related interactions.
- Prefer transform and opacity animations for performance.
- Avoid unnecessary animation on every element.
- Animation should support visual hierarchy and storytelling.
- Avoid slow, overly luxurious, or unnecessarily complicated animation.
- Animation should not interfere with usability.
- Respect reduced-motion preferences where appropriate.

### Animation Scope

Animation should be implemented section by section.

Do not create a large global animation system before the actual sections require it.

---

## 9. Smooth Scrolling

Lenis should provide the website's smooth scrolling experience.

Smooth scrolling must not interfere with:

- Native browser navigation
- Keyboard navigation
- Touch interaction
- Accessibility
- Anchor navigation

Lenis configuration should remain simple unless the design requires additional behavior.

---

## 10. Image Handling

Use Nuxt Image for website images.

Images should be:

- Responsive
- Optimized
- Properly sized
- Served in appropriate formats when supported

Avoid loading unnecessarily large source images when a smaller variant is sufficient.

Portfolio media should be optimized according to its actual display size.

Image dimensions and aspect ratios should be considered during implementation to reduce layout shifts.

Large project media should not be loaded at full resolution when the displayed size does not require it.

---

## 11. Icons

Use Nuxt Icon for interface icons.

Do not introduce another icon library.

Icons should:

- Be used consistently.
- Support the visual language of the website.
- Have appropriate sizing.
- Remain accessible when interactive.
- Include accessible labels when the icon itself is the interactive control.

---

## 12. Sliders & Carousels

Swiper is optional.

Use Swiper only when a section genuinely benefits from slider or carousel behavior.

Do not use Swiper simply because it is available.

Possible use cases include:

- Project galleries
- Testimonials
- Horizontal project collections
- Client/logo presentations

If a section can be implemented more effectively using normal layout and GSAP, prefer the simpler implementation.

Avoid unnecessary sliders that make content harder to browse.

---

## 13. Navigation

Navigation should be implemented as reusable components.

Navigation must support:

- English
- Arabic
- Future Turkish
- Responsive layouts
- Active routes
- Primary WhatsApp CTA

Language switching should use Nuxt i18n.

Navigation behavior and visual design will be defined by the approved references and section implementation.

---

## 14. Content Architecture

Content should remain separated from presentation where practical.

Reusable content such as:

- Projects
- Services
- Clients
- Testimonials
- Navigation labels

should not be unnecessarily duplicated across components.

Project and service pages should use structured content/data so that the same information can be presented across listing and detail pages.

The exact content architecture will be defined after the project's content and assets are collected.

Do not introduce a CMS or external content system unless explicitly approved.

---

## 15. Section-by-Section Implementation

Implementation will follow the website section by section.

For every section:

1. Review the section definition in SECTIONS.md.
2. Review the relevant design rules in DESIGN.md.
3. Review the relevant content in CONTENT.md.
4. Review the relevant reference analysis in REFERENCES.md.
5. Check PROJECT.md for project requirements and constraints.
6. Implement the section using the approved stack.
7. Implement responsive behavior.
8. Implement required animation.
9. Review the result visually.
10. Correct issues.
11. Document reusable/general lessons in LEARNINGS.md when appropriate.

Do not implement the entire website blindly before individual sections have been reviewed.

---

## 16. Reference Implementation

References are used as visual and interaction inspiration.

When implementing a reference:

- Recreate the intended visual principle rather than unnecessary source-code complexity.
- Adapt the reference to Mister Media's brand.
- Do not copy unrelated branding.
- Do not introduce libraries simply because the reference website may use them.
- If a reference requires functionality unavailable through the approved stack, simplify or adapt the interaction instead of adding a new dependency.
- Preserve the intent of the reference while keeping the implementation maintainable.

---

## 17. Performance

Performance is a priority, especially because the website contains significant visual media and animation.

### Principles

- Optimize images through Nuxt Image.
- Avoid unnecessarily large media.
- Lazy-load content where appropriate.
- Avoid unnecessary JavaScript.
- Keep animations efficient.
- Avoid excessive simultaneous animations.
- Prefer transform and opacity-based animation.
- Do not initialize expensive functionality until required.
- Avoid unnecessary third-party scripts.
- Keep page payloads as small as reasonably possible.

Portfolio media should be treated as a major performance consideration.

---

## 18. Accessibility

The implementation should maintain basic accessibility standards.

- Use semantic HTML.
- Provide accessible labels for interactive icons.
- Maintain keyboard accessibility.
- Maintain visible focus states.
- Ensure sufficient text contrast.
- Provide meaningful alt text for informative images.
- Decorative images should not create unnecessary screen-reader content.
- Do not rely on animation alone to communicate important information.
- Respect reduced-motion preferences.
- Interactive elements must have appropriate accessible names.
- RTL/LTR behavior must remain usable and accessible.

---

## 19. SEO

Use Nuxt's built-in capabilities for SEO.

Each page should have:

- Appropriate title
- Meta description
- Relevant metadata
- Correct language information
- Appropriate canonical behavior where required

Project detail pages should generate page-specific metadata.

Do not introduce an additional SEO library unless explicitly approved.

---

## 20. Technical Constraints

### Allowed Libraries

Only use the following approved technologies and libraries:

- Nuxt
- Vue
- Vue Router
- Nuxt Fonts
- Nuxt Icon
- Nuxt Image
- Nuxt i18n
- Nuxt Tailwind CSS
- Tailwind CSS
- Tailwind CSS Vite
- GSAP
- Lenis
- Swiper

### Strict Dependency Rule

Do not add a new library or external dependency to implement a feature without explicit approval.

When a requirement can be solved using the existing stack, prefer the existing stack.

### Styling Rule

Use Tailwind variables and utilities by default.

Normal CSS should not be used unless there is a clear technical reason that Tailwind cannot reasonably solve the requirement.

### Simplicity Rule

Do not over-engineer.

Prefer:

- Native Nuxt functionality
- Native Vue functionality
- Tailwind utilities
- Existing approved libraries
- Simple reusable components

before introducing additional abstractions or dependencies.

---

## 21. Implementation Priorities

When technical decisions conflict, prioritize:

1. Explicit project/client requirements
2. Correct visual implementation
3. Responsive behavior
4. Performance
5. Accessibility
6. Maintainable architecture
7. Simplicity

The implementation should be as simple as possible while accurately achieving the intended design and interaction.

---

## 22. GEO — Generative Engine Optimization

The website should be structured so AI search and answer engines can clearly understand Mister Media, its services, experience, and location.

### Principles

- Use clear semantic HTML and logical heading hierarchy.
- Clearly identify Mister Media, its location in Turkey, 10+ years of experience, and core services.
- Keep important information available as crawlable text, not only inside images or animations.
- Use consistent service and company terminology across pages.
- Provide meaningful text context for projects and services.
- Use appropriate structured data such as Organization, Service, WebSite, and BreadcrumbList when applicable.
- Support GEO across English and Arabic, with Turkish possible later.
- Use meaningful internal links between related projects, services, and pages.
- Do not use keyword stuffing, artificial content, or unnecessary FAQs.