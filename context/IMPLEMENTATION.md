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
    ├── data/
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

### Current Implementation

- The official `lenis/nuxt` module registers `VueLenis` and `useLenis`.
- Root Lenis is created in `app.vue` and driven by the GSAP ticker so ScrollTrigger stays in sync.
- Recommended Lenis CSS is loaded globally.
- Anchor links, reduced-motion, and mobile-menu overflow locking are handled with Lenis options (`anchors`, default `respectReducedMotion`, `autoToggle`) plus `lenis.stop()` / `lenis.start()` when the header menu is open.
- Route changes reset scroll immediately and refresh ScrollTrigger after the page finishes.

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

### Status
Implemented (first pass). Visual from `REFERENCES.md` nav header.

### Approach
Fixed inset header bar (`top`/`inset-x` offsets) in the default layout, not edge-to-edge. Frosted translucent background. Logo left, WhatsApp text CTA + circular menu button right. Page links live in a full-screen menu, not in the bar.

Hamburger bars are unequal and right-aligned; they animate to equal width on hover and to an X when open. Menu items stagger in with GSAP on open.

### Components
- `app/components/navigation/SiteHeader.vue`
- Locales: `i18n/locales/en.json`, `i18n/locales/ar.json`

### Notes
- WhatsApp URL is `runtimeConfig.public.whatsappUrl` (`NUXT_PUBLIC_WHATSAPP_URL`). Placeholder until the client number is supplied.
- Logo is cropped from `refs/top-bar.png` into `public/images/logo.png` until a source logo file is provided.

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

### Current data

- `app/data/services.ts` — service slugs, placeholder category icons, and swatch colors.
- `app/composables/useServices.ts` — localized names, icons, colors, and routes from i18n.
- `app/data/projects.ts` — project slugs, service links, cover media, masonry spans.
- `app/composables/useProjects.ts` — localized names, service labels, and routes from i18n.
- `app/data/clients.ts` — placeholder logo sources and intrinsic sizes from `app/assets/images/client-logos/`.
- `app/data/testimonials.ts` — placeholder photo sources and intrinsic sizes.
- `app/composables/useTestimonials.ts` — localized quotes, names, roles from i18n.
- Locales: `i18n/locales/en.json`, `i18n/locales/ar.json` (`services.items.*`, `projects.items.*`, `clients.*`, `testimonials.*`).

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

---

## 23. Placeholder Assets

During implementation, images and icons should initially use placeholders.

- Use clear placeholder images where final imagery is not available.
- Use placeholder icons where the final icon has not been selected.
- Do not spend implementation time searching for final assets.
- Placeholder assets will be replaced with the final project assets later.
- Keep the implementation structured so replacing a placeholder does not require changing the component layout.

---

## 24. Home — Hero

### Status
Implemented (first pass). Site header is a separate layout component.

### Approach
Single section component with a centered typographic headline and a full-bleed portrait strip. Copy lives in Nuxt i18n locale files. Images are picsum placeholders keyed by seed so they can be replaced later without layout changes.

### Components
- `app/components/sections/HeroSection.vue`
- `app/components/ui/Button.vue` — `primary` pill, `secondary` outline pill, and `text` (header Let’s Talk). Hover uses a fast GSAP `back.out` spring scale; the primary arrow rotates with the same ease. Nearby pointer movement magnetically pulls the button toward the cursor (`magnetic`, `magnetPad`, `magnetStrength` props) and springs back when it leaves. Let’s Talk sets `magnetic` to false. Skipped for touch and reduced motion.
- Locales: `i18n/locales/en.json`, `i18n/locales/ar.json`

### Layout
- Upper headline block uses extra vertical padding (`pt-32 pb-20` / `md:pt-40 md:pb-24`); it is not a full viewport.
- Headline is a 3-line centered composition with circular images inline between words.
- Two CTAs sit below the headline: **Our Works** (primary → `/projects`) and **Contact Us** (secondary → WhatsApp).
- Two horizontal rows of 3:4 tiles, overflowing the viewport on both sides.

### Typography
- Title face (Eurostile / Almarai) for the headline structure.
- Handwritten + primary color on “Idea”.
- Title + primary color on “Execution”.
- Light text color on connecting phrases (“to”, “for Brands around the”).

### Responsive
- Type scales with `clamp(2.25rem, 5.8vw, 5.5rem)`.
- Headline lines wrap and stay centered on small screens.
- Strip height: 12rem → 16rem → 20rem → 24rem.
- Strip track is forced LTR with `items-start` so image order and origin stay stable in Arabic.

### Animation
- GSAP ScrollTrigger scrubs both strips as the hero leaves the viewport (`start: top top` → `end: bottom top`). The section is not pinned.
- Top row moves left; bottom row moves right.
- Both edges stay cropped throughout the travel.
- Animation is skipped when `prefers-reduced-motion: reduce` is set.

### Assumptions
- No supporting paragraph in this pass.
- Header/navigation is a separate layout component (`NavigationSiteHeader`).
- “+50 client” wording is taken from the approved reference instruction.
- Contact Us uses the same WhatsApp URL as the header CTA.

---

## 25. Home — Service bands

### Status
Implemented (first pass).

### Approach
Two full-width diagonal ticker strips that cross in an X, directly below the hero. Copy is the core services list from `useServices()`, repeated and separated by ●. One strip is primary; the other is the dark text color. Names live in i18n; slugs live in `app/data/services.ts`. Labels are not links.

### Components
- `app/components/sections/ServiceBandsSection.vue`
- `app/components/ui/Marquee.vue`
- `app/composables/useServices.ts`
- `app/data/services.ts`
- Locales: `i18n/locales/en.json`, `i18n/locales/ar.json`

### Layout
- Section sits on the lightest background, with overflow clipped.
- Dark strip rotates `10deg` (behind); primary strip rotates `-10deg` (in front).
- Each strip is wider than the viewport so the rotated ends stay filled.
- Track direction is forced LTR so the X composition stays stable in Arabic.

### Typography
- Title face, semibold, lightest (white) labels on both strips.

### Responsive
- Type: `text-lg` → `md:text-2xl`.
- Band padding and crossing height scale up through `lg`.

### Animation
- `UiMarquee` (rAF, segment recycle) — not CSS animation. Native `ResizeObserver` instead of VueUse.
- Duration is 40s per segment so the loop stays slow and seamless.
- Primary strip travels left; dark strip travels right (`reverse`).
- Animation is skipped when `prefers-reduced-motion: reduce` is set.

### Assumptions
- Extra reference phrases (years of experience, customer counts, job titles) are not used.
- Service detail pages remain empty shells until that section is implemented.

---

## 26. Home — Featured Projects

### Status
Implemented (first pass).

### Approach
Editorial masonry wall of featured projects directly below the service bands. Imagery is the primary element until hover. Name, category pill, and a circular arrow appear together with a primary-color overlay. Composition uses mixed CSS Grid spans rather than identical cards. Optional `motionSrc` on a project (gif/webp or mp4/webm) replaces the still cover on hover. Copy lives in i18n; identity lives in `app/data/projects.ts`. Category icons and swatch colors live on the service records as placeholders.

### Components
- `app/components/sections/FeaturedProjectsSection.vue`
- `app/components/ui/ProjectTile.vue`
- `app/components/ui/CategoryPill.vue` — capsule chip, leading circular icon, category name. Icon and color come from `app/data/services.ts`.
- `app/components/ui/SectionHeading.vue` — reusable title + handwritten lockup from `refs/header.png`.
- `app/composables/useProjects.ts`
- `app/data/projects.ts`
- Locales: `i18n/locales/en.json`, `i18n/locales/ar.json`

### Layout
- XL fluid container (`max-w-[90rem]`).
- 12 featured tiles in an asymmetric 12-column grid on large screens.
- Visible heading **Our Works** with handwritten **featured**, masonry wall, then a centered **View All Projects** primary button to `/projects`.
- Tiles are large rounded media (`rounded-3xl`). Default state is image-only.

### Typography
- Title face for the section heading (`UiSectionHeading`) and project names. Heading scales with `clamp(1.875rem, 4.2vw, 3.5rem)` so it stays below the hero h1 max of `5.5rem` / 88px.
- Handwritten + primary color overlapping the end of the title (featured / مميزة).
- Paragraph face for the category pill label.

### Responsive
- Mobile: single column, hero and tall tiles span two rows.
- `sm`: 2 columns with mixed row spans.
- `md`: 6 columns.
- `lg+`: 12-column editorial composition.
- Tile row height scales from `16rem` to `17rem`.

### Animation
- GSAP ScrollTrigger stagger (`y` + `autoAlpha`) when the section enters view.
- CSS hover / focus-visible: image scale, primary overlay (`bg-primary/75`), caption and category pill fade in, arrow rotate/scale.
- Motion media (when supplied) fades in on hover/focus and plays if it is video.
- Animation is skipped when `prefers-reduced-motion: reduce` is set.

### Assumptions
- Project titles are generic placeholders, not client names.
- Cover images are picsum placeholders keyed by seed.
- No `motionSrc` values are set until real motion assets are supplied.
- Category icon names and hex colors are placeholders and can be replaced in `app/data/services.ts` without layout changes.
- Project detail pages remain empty shells until that section is implemented.

---

## 27. Home — Client logos

### Status
Implemented (first pass).

### Approach
Two full-bleed logo rows below featured projects. Continuous `UiMarquee` tickers: top row travels left, bottom row travels right. Placeholder Logoipsum SVGs live in `app/assets/images/client-logos/` and are listed in `app/data/clients.ts` so they can be replaced later without layout changes. Copy lives in i18n. Individual client names are not shown.

### Components
- `app/components/sections/ClientLogosSection.vue`
- `app/components/ui/Marquee.vue`
- `app/data/clients.ts`
- Locales: `i18n/locales/en.json`, `i18n/locales/ar.json`

### Layout
- Section heading **Our Clients** with handwritten **trusted**, then two overflowing rows.
- Logos keep a shared height (`h-8` → `md:h-12`) and intrinsic width.
- Bottom row is offset in the source order so the two rows do not line up.
- Track direction is forced LTR so the rows stay stable in Arabic.

### Typography
- Title face for the section heading (`UiSectionHeading`). Heading scales with `clamp(1.875rem, 4.2vw, 3.5rem)`.
- Handwritten + primary color overlapping the end of the title (trusted / موثوقون).

### Responsive
- Logo height: 2rem → 2.5rem → 3rem.
- Horizontal gap via logo side margins: `mx-6` → `md:mx-10`.
- Row gap: `gap-8` → `md:gap-12`.

### Animation
- `UiMarquee` (rAF, segment recycle) — not CSS animation, not scroll-scrubbed.
- Duration is 40s per segment so the loop stays slow and seamless.
- Top row travels left; bottom row travels right (`reverse`).
- Animation is skipped when `prefers-reduced-motion: reduce` is set.

### Assumptions
- Logo files are Logoipsum placeholders, not real clients.
- No client names, links, or alt text until real marks and names are supplied.
- Replacing a file in `app/data/clients.ts` should not require changing the section layout.

---

## 28. Home — Testimonials

### Status
Implemented (first pass).

### Approach
Quote slider below the services placeholder on the home page. Card follows `REFERENCES.md` testimonial card, without the star rating. Index stays top-right; quote in the middle; circular photo, name, and position/company at the bottom. Copy lives in i18n; identity and photos live in `app/data/testimonials.ts`. Quotes are clearly marked placeholders until the client supplies testimonials.

### Components
- `app/components/sections/TestimonialsSection.vue`
- `app/components/ui/TestimonialCard.vue`
- `app/composables/useTestimonials.ts`
- `app/data/testimonials.ts`
- Locales: `i18n/locales/en.json`, `i18n/locales/ar.json`

### Layout
- XL fluid container (`max-w-360`).
- Heading **Testimonials** with handwritten **voices**, circular prev/next on the trailing side.
- 12-column grid from `lg`: dark trust panel first (4 columns), then the quote Swiper (8 columns).
- Trust panel uses approved figures only (**+50** clients from the hero, **10+ years** from PROJECT.md) and the WhatsApp **Let's Talk** CTA (`light` button on dark fill).
- One card at a time. Peeking next card from the reference is not used.
- Cards use the light background (`#FFEECF`), large radius (`rounded-3xl`).
- Large handwritten quotation marks in primary color sit at the start and end of the quote.

### Typography
- Title face for the section heading, index, and name.
- Paragraph face for the quote and role line.
- Handwritten + primary color overlapping the end of the title (voices / قالوا).

### Responsive
- Heading stacks above nav buttons on small screens; they sit on one row from `sm`.
- Trust panel stacks above the Swiper on small screens; they sit in one row from `lg`.
- Quote type: `text-base` → `md:text-lg`.
- Card padding: `p-5` → `md:p-6` → `lg:p-8`.

### Animation
- GSAP ScrollTrigger stagger (`y` + `autoAlpha`) when the section enters view.
- Swiper slide transition at 400ms; looped when more than one quote is present.
- Animation is skipped when `prefers-reduced-motion: reduce` is set (GSAP off, Swiper speed 0).

### Assumptions
- Quotes, names, roles, and photos are placeholders.
- Company is optional; the fourth placeholder omits it.
- Star rating from the card reference is intentionally omitted.
- Replacing items in `app/data/testimonials.ts` and locale strings should not require changing the card layout.