# Design Document: Professional IT Institute UI Redesign

## Overview

This design document specifies a comprehensive UI redesign for the WebVibes Technology IT Institute website. The redesign moves away from the current purple/blue gradient aesthetic with glassmorphism effects to deliver a modern, professional, and eye-catching design suitable for a credible IT education institution.

### Design Goals

- Create a professional, trustworthy visual identity appropriate for an IT institute
- Implement a modern, clean aesthetic that feels current and sophisticated
- Use real professional imagery and actual company logos for authenticity
- Ensure consistent design patterns across all pages
- Deliver excellent user experience across all devices (mobile, tablet, desktop)
- Meet WCAG 2.1 Level AA accessibility standards
- Optimize for performance with fast load times

### Design Principles

1. **Professional First**: Every design decision prioritizes credibility and professionalism
2. **Clarity Over Complexity**: Clean, uncluttered layouts that communicate clearly
3. **Authentic Imagery**: Real photographs and actual company logos, not generic placeholders
4. **Consistent Patterns**: Reusable components and predictable interactions
5. **Accessible by Default**: Accessibility built into every component from the start
6. **Performance Conscious**: Optimized assets and efficient rendering

## Architecture

### Technology Stack

- **Frontend Framework**: Angular 15.x
- **Styling Approach**: Component-scoped CSS with global design tokens
- **Image Sources**: Unsplash API for professional stock photography, Clearbit API for company logos
- **Icon Library**: Font Awesome 6.x for consistent iconography
- **Typography**: Google Fonts (Inter font family)
- **Build System**: Angular CLI with production optimizations

### Component Hierarchy

```
App Component
├── Navigation Component (fixed header)
├── Router Outlet
│   ├── Home Page Component
│   │   ├── Hero Section Component
│   │   ├── Features Section Component
│   │   ├── Courses Preview Component
│   │   ├── Companies Section Component
│   │   └── CTA Section Component
│   ├── About Page Component
│   ├── Courses Page Component
│   ├── Internships Page Component
│   ├── Projects Page Component
│   └── Contact Page Component
└── Footer Component
```


### File Structure

```
frontend/src/
├── styles.css (global design tokens and utilities)
├── app/
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── navigation.component.ts
│   │   │   ├── navigation.component.html
│   │   │   └── navigation.component.css
│   │   ├── hero-section/
│   │   │   ├── hero-section.component.ts
│   │   │   ├── hero-section.component.html
│   │   │   └── hero-section.component.css
│   │   ├── footer/
│   │   │   ├── footer.component.ts
│   │   │   ├── footer.component.html
│   │   │   └── footer.component.css
│   │   ├── home/
│   │   ├── about/
│   │   ├── courses/
│   │   ├── internship/
│   │   ├── projects/
│   │   └── contact/
│   └── services/
│       ├── image.service.ts (Unsplash integration)
│       └── logo.service.ts (Clearbit integration)
```

## Components and Interfaces

### Design System Tokens

The design system uses CSS custom properties (variables) defined in `styles.css` for consistent theming across all components.

#### Color Palette

Moving away from purple/blue gradients, the new professional color scheme uses:

**Primary Colors** (Technology Blue - Professional and Trustworthy)
- `--primary-50`: #E3F2FD (lightest blue tint)
- `--primary-100`: #BBDEFB
- `--primary-200`: #90CAF9
- `--primary-300`: #64B5F6
- `--primary-400`: #42A5F5
- `--primary-500`: #2196F3 (main primary color)
- `--primary-600`: #1E88E5
- `--primary-700`: #1976D2
- `--primary-800`: #1565C0
- `--primary-900`: #0D47A1 (darkest blue)

**Secondary Colors** (Energetic Orange - Call-to-Action)
- `--secondary-50`: #FFF3E0
- `--secondary-100`: #FFE0B2
- `--secondary-200`: #FFCC80
- `--secondary-300`: #FFB74D
- `--secondary-400`: #FFA726
- `--secondary-500`: #FF9800 (main secondary color)
- `--secondary-600`: #FB8C00
- `--secondary-700`: #F57C00
- `--secondary-800`: #EF6C00
- `--secondary-900`: #E65100

**Accent Colors**
- `--accent-success`: #4CAF50 (green for success states)
- `--accent-warning`: #FFC107 (amber for warnings)
- `--accent-error`: #F44336 (red for errors)
- `--accent-info`: #00BCD4 (cyan for informational elements)

**Neutral Colors** (Gray Scale)
- `--neutral-white`: #FFFFFF
- `--neutral-50`: #FAFAFA
- `--neutral-100`: #F5F5F5
- `--neutral-200`: #EEEEEE
- `--neutral-300`: #E0E0E0
- `--neutral-400`: #BDBDBD
- `--neutral-500`: #9E9E9E
- `--neutral-600`: #757575
- `--neutral-700`: #616161
- `--neutral-800`: #424242
- `--neutral-900`: #212121
- `--neutral-black`: #000000


**Semantic Color Tokens**
- `--color-background`: var(--neutral-50)
- `--color-surface`: var(--neutral-white)
- `--color-text-primary`: var(--neutral-900)
- `--color-text-secondary`: var(--neutral-700)
- `--color-text-disabled`: var(--neutral-400)
- `--color-border`: var(--neutral-300)
- `--color-divider`: var(--neutral-200)

#### Typography System

**Font Family**
- Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Monospace: 'Fira Code', 'Courier New', monospace (for code snippets if needed)

**Font Sizes**
- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)
- `--font-size-5xl`: 3rem (48px)
- `--font-size-6xl`: 3.75rem (60px)

**Font Weights**
- `--font-weight-light`: 300
- `--font-weight-regular`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700
- `--font-weight-extrabold`: 800

**Line Heights**
- `--line-height-tight`: 1.25
- `--line-height-normal`: 1.5
- `--line-height-relaxed`: 1.75
- `--line-height-loose`: 2

**Typography Scale Usage**
- H1: font-size-5xl (48px), font-weight-extrabold, line-height-tight
- H2: font-size-4xl (36px), font-weight-bold, line-height-tight
- H3: font-size-3xl (30px), font-weight-bold, line-height-normal
- H4: font-size-2xl (24px), font-weight-semibold, line-height-normal
- H5: font-size-xl (20px), font-weight-semibold, line-height-normal
- H6: font-size-lg (18px), font-weight-semibold, line-height-normal
- Body Large: font-size-lg (18px), font-weight-regular, line-height-relaxed
- Body: font-size-base (16px), font-weight-regular, line-height-relaxed
- Body Small: font-size-sm (14px), font-weight-regular, line-height-normal
- Caption: font-size-xs (12px), font-weight-medium, line-height-normal

#### Spacing System

**Spacing Scale** (based on 4px grid)
- `--spacing-0`: 0
- `--spacing-1`: 0.25rem (4px)
- `--spacing-2`: 0.5rem (8px)
- `--spacing-3`: 0.75rem (12px)
- `--spacing-4`: 1rem (16px)
- `--spacing-5`: 1.25rem (20px)
- `--spacing-6`: 1.5rem (24px)
- `--spacing-8`: 2rem (32px)
- `--spacing-10`: 2.5rem (40px)
- `--spacing-12`: 3rem (48px)
- `--spacing-16`: 4rem (64px)
- `--spacing-20`: 5rem (80px)
- `--spacing-24`: 6rem (96px)


#### Border Radius

- `--radius-none`: 0
- `--radius-sm`: 0.25rem (4px)
- `--radius-md`: 0.5rem (8px)
- `--radius-lg`: 0.75rem (12px)
- `--radius-xl`: 1rem (16px)
- `--radius-2xl`: 1.5rem (24px)
- `--radius-full`: 9999px (pill shape)

#### Shadows and Elevation

**Shadow Levels**
- `--shadow-xs`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `--shadow-sm`: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- `--shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- `--shadow-lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- `--shadow-xl`: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
- `--shadow-2xl`: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

**Elevation Usage**
- Level 0: No shadow (flat surfaces)
- Level 1: shadow-sm (cards at rest)
- Level 2: shadow-md (raised cards, dropdowns)
- Level 3: shadow-lg (floating action buttons, hover states)
- Level 4: shadow-xl (modals, popovers)
- Level 5: shadow-2xl (maximum elevation for critical overlays)

#### Transitions and Animations

**Duration**
- `--duration-fast`: 150ms
- `--duration-base`: 200ms
- `--duration-slow`: 300ms
- `--duration-slower`: 500ms

**Easing Functions**
- `--easing-default`: cubic-bezier(0.4, 0, 0.2, 1)
- `--easing-in`: cubic-bezier(0.4, 0, 1, 1)
- `--easing-out`: cubic-bezier(0, 0, 0.2, 1)
- `--easing-in-out`: cubic-bezier(0.4, 0, 0.2, 1)

**Standard Transitions**
- Hover states: all var(--duration-fast) var(--easing-default)
- Color changes: color var(--duration-base) var(--easing-default)
- Transform: transform var(--duration-base) var(--easing-default)
- Opacity: opacity var(--duration-base) var(--easing-default)

#### Breakpoints

**Responsive Breakpoints**
- `--breakpoint-xs`: 0px (mobile portrait)
- `--breakpoint-sm`: 576px (mobile landscape)
- `--breakpoint-md`: 768px (tablet portrait)
- `--breakpoint-lg`: 992px (tablet landscape)
- `--breakpoint-xl`: 1200px (desktop)
- `--breakpoint-2xl`: 1400px (large desktop)

**Container Max Widths**
- Mobile: 100% (with 16px padding)
- Tablet: 720px
- Desktop: 960px
- Large Desktop: 1140px
- Extra Large: 1320px


### Navigation Bar Component

**Purpose**: Fixed header navigation providing access to all main pages with professional styling.

**Visual Design**:
- Background: White (--neutral-white) with subtle shadow on scroll
- Height: 64px (fixed)
- Position: Fixed to top of viewport
- Z-index: 1000 (above all content)
- Border bottom: 1px solid --neutral-200 (appears on scroll)

**Layout**:
- Container: Full width with max-width constraint
- Logo/Brand: Left-aligned, font-size-xl, font-weight-bold, color primary-600
- Navigation Links: Right-aligned horizontal list
- Spacing: 16px between nav items

**Navigation Links**:
- Font: font-size-base, font-weight-medium
- Color: --neutral-700 (default), --primary-600 (hover/active)
- Padding: 8px 16px
- Border-radius: radius-md
- Background: transparent (default), --primary-50 (hover)
- Active indicator: font-weight-semibold, color primary-600

**Mobile Behavior** (< 768px):
- Hamburger menu icon: Right-aligned, 24x24px, color neutral-700
- Menu drawer: Slides in from right, full height, 280px wide
- Overlay: Semi-transparent dark background (rgba(0,0,0,0.5))
- Menu items: Stacked vertically with 12px spacing
- Touch targets: Minimum 44x44px

**Accessibility**:
- ARIA labels for hamburger menu
- Focus indicators: 2px solid primary-500 outline with 2px offset
- Keyboard navigation support
- Active page indication for screen readers

**Interactions**:
- Hover: Background color change (150ms transition)
- Scroll: Shadow appears (300ms transition)
- Mobile menu: Slide animation (300ms cubic-bezier)

### Hero Section Component

**Purpose**: Eye-catching above-the-fold section communicating value proposition with professional imagery.

**Visual Design**:
- Background: Gradient from --neutral-50 to --neutral-white (top to bottom)
- Padding: 120px vertical, responsive horizontal
- Min-height: 600px (desktop), auto (mobile)

**Layout** (Desktop):
- Two-column grid: 50/50 split
- Left column: Text content
- Right column: Hero image with decorative elements
- Gap: 64px between columns

**Content Elements**:

1. **Badge/Tag**:
   - Background: --primary-50
   - Color: --primary-700
   - Padding: 8px 20px
   - Border-radius: radius-full
   - Font: font-size-sm, font-weight-semibold
   - Icon: Optional emoji or icon (24px)

2. **Headline**:
   - Font: font-size-5xl (desktop), font-size-4xl (mobile)
   - Weight: font-weight-extrabold
   - Color: --neutral-900
   - Line-height: line-height-tight
   - Margin-bottom: 24px
   - Highlight words: color primary-600 for emphasis

3. **Subtitle**:
   - Font: font-size-lg
   - Weight: font-weight-regular
   - Color: --neutral-700
   - Line-height: line-height-relaxed
   - Max-width: 540px
   - Margin-bottom: 32px

4. **CTA Buttons**:
   - Primary button: "Explore Courses"
   - Secondary button: "Talk to Expert"
   - Layout: Horizontal with 16px gap
   - Mobile: Stack vertically

5. **Statistics Bar**:
   - Background: --neutral-white
   - Border: 1px solid --neutral-200
   - Border-radius: radius-xl
   - Padding: 32px
   - Shadow: shadow-sm
   - Layout: Three columns with dividers
   - Each stat: Number (font-size-4xl, font-weight-bold, color primary-600) + Label (font-size-sm, color neutral-600)


**Hero Image**:
- Source: Unsplash API (search: "students learning technology" or "coding classroom")
- Dimensions: 600x500px (desktop), full width (mobile)
- Border-radius: radius-2xl
- Shadow: shadow-xl
- Overlay: Optional subtle gradient overlay for text readability
- Decorative elements: Floating cards with icons showing key features

**Floating Feature Cards** (Desktop only):
- Position: Absolute, positioned around hero image
- Background: --neutral-white with backdrop-filter blur
- Padding: 16px 20px
- Border-radius: radius-lg
- Shadow: shadow-md
- Animation: Subtle floating animation (translateY -10px to 10px, 3s ease-in-out infinite)
- Content: Icon (32px) + Title (font-weight-semibold) + Subtitle (font-size-sm, color neutral-600)

**Mobile Layout** (< 768px):
- Single column stack
- Image first, then content
- Remove floating cards
- Reduce padding and font sizes
- Statistics: Stack vertically or 2-column grid

**Accessibility**:
- Alt text for hero image
- Sufficient contrast for all text
- Focus indicators on buttons
- Semantic HTML structure (h1 for headline)

### Footer Component

**Purpose**: Comprehensive footer with links, contact information, and social media.

**Visual Design**:
- Background: --neutral-900
- Color: --neutral-300 (text), --neutral-white (headings)
- Padding: 64px vertical, responsive horizontal
- Border-top: 4px solid --primary-600

**Layout** (Desktop):
- Four-column grid
- Column 1: Brand + description (40% width)
- Columns 2-4: Link groups (20% width each)

**Content Structure**:

1. **Brand Column**:
   - Logo/Brand name: font-size-2xl, font-weight-bold, color white
   - Description: 2-3 sentences about institute
   - Social media icons: Horizontal row, 40x40px touch targets
   - Icon colors: --neutral-400 (default), --primary-400 (hover)

2. **Quick Links Column**:
   - Heading: "Quick Links" (font-size-lg, font-weight-semibold, color white)
   - Links: Home, About, Courses, Internships, Projects, Contact
   - Styling: font-size-base, color neutral-300, hover color primary-400

3. **Courses Column**:
   - Heading: "Popular Courses"
   - Links: Top 4-5 course names
   - Same link styling as Quick Links

4. **Contact Column**:
   - Heading: "Contact Us"
   - Address: Icon + text
   - Phone: Icon + text
   - Email: Icon + text
   - Icons: Font Awesome, 16px, color primary-400

**Bottom Bar**:
- Background: --neutral-black
- Padding: 24px vertical
- Layout: Two columns (copyright left, legal links right)
- Copyright: "© 2024 WebVibes Technology. All rights reserved."
- Legal links: Privacy Policy, Terms of Service (optional)

**Mobile Layout** (< 768px):
- Single column stack
- Each section full width
- Spacing: 32px between sections
- Social icons: Centered
- Bottom bar: Stack vertically, center-aligned

**Accessibility**:
- ARIA labels for social media links
- Focus indicators on all links
- Sufficient contrast ratios
- Keyboard navigation support


### Feature Card Component

**Purpose**: Reusable card for displaying benefits and features on home page.

**Visual Design**:
- Background: --neutral-white
- Border: 1px solid --neutral-200
- Border-radius: radius-xl
- Padding: 40px 32px
- Shadow: shadow-sm (default), shadow-lg (hover)
- Transition: transform 300ms, shadow 300ms

**Layout**:
- Vertical stack: Icon → Title → Description
- Text-align: center
- Max-width: 360px

**Elements**:

1. **Icon Container**:
   - Size: 80x80px
   - Background: Linear gradient (primary-500 to primary-600)
   - Border-radius: radius-xl
   - Display: Flex center
   - Margin-bottom: 24px
   - Icon: Font Awesome, 40px, color white

2. **Title**:
   - Font: font-size-xl, font-weight-semibold
   - Color: --neutral-900
   - Margin-bottom: 12px

3. **Description**:
   - Font: font-size-base
   - Color: --neutral-600
   - Line-height: line-height-relaxed

**Hover State**:
- Transform: translateY(-8px)
- Shadow: shadow-lg
- Border-color: --primary-300
- Icon container: Scale(1.05)

**Accessibility**:
- Semantic HTML (article or div with role)
- Icon decorative (aria-hidden="true")
- Sufficient contrast for text

### Course Card Component

**Purpose**: Display course information with imagery, metadata, and CTA.

**Visual Design**:
- Background: --neutral-white
- Border: 1px solid --neutral-200
- Border-radius: radius-xl
- Overflow: hidden
- Shadow: shadow-md (default), shadow-xl (hover)
- Transition: transform 300ms, shadow 300ms

**Layout**:
- Vertical stack: Image → Content
- Max-width: 400px

**Elements**:

1. **Course Image**:
   - Aspect ratio: 16:9
   - Height: 240px
   - Object-fit: cover
   - Source: Unsplash API (technology-related images)
   - Overlay: Gradient overlay (bottom) for badge visibility
   - Badge: Positioned top-right, 8px margin

2. **Badge**:
   - Background: --secondary-500 (Bestseller), --accent-info (Trending), --accent-success (New)
   - Color: --neutral-white
   - Padding: 6px 16px
   - Border-radius: radius-full
   - Font: font-size-sm, font-weight-semibold
   - Shadow: shadow-md

3. **Content Area**:
   - Padding: 24px

4. **Course Title**:
   - Font: font-size-xl, font-weight-semibold
   - Color: --neutral-900
   - Margin-bottom: 12px
   - Line-clamp: 2 lines

5. **Course Description**:
   - Font: font-size-base
   - Color: --neutral-600
   - Line-height: line-height-relaxed
   - Margin-bottom: 16px
   - Line-clamp: 3 lines

6. **Metadata Row**:
   - Display: Flex, gap 16px
   - Border-top: 1px solid --neutral-200
   - Padding-top: 16px
   - Margin-bottom: 16px
   - Items: Duration icon + text, Students icon + text
   - Font: font-size-sm, color neutral-600

7. **CTA Button**:
   - Full width
   - Primary button style
   - Text: "Learn More" or "Enroll Now"

**Hover State**:
- Transform: translateY(-8px)
- Shadow: shadow-xl
- Image: Scale(1.05) with 500ms transition

**Accessibility**:
- Alt text for course image
- Semantic HTML structure
- Focus indicators on button
- ARIA labels for metadata icons


### Internship Card Component

**Purpose**: Display internship opportunities with company branding and details.

**Visual Design**:
- Background: --neutral-white
- Border: 1px solid --neutral-200
- Border-radius: radius-xl
- Padding: 32px
- Shadow: shadow-sm (default), shadow-lg (hover)
- Transition: transform 300ms, shadow 300ms

**Layout**:
- Vertical stack: Company Logo → Title → Details → CTA

**Elements**:

1. **Company Logo**:
   - Source: Clearbit Logo API (https://logo.clearbit.com/{domain})
   - Size: 80x80px
   - Border: 1px solid --neutral-200
   - Border-radius: radius-md
   - Padding: 12px
   - Background: --neutral-50
   - Object-fit: contain
   - Margin-bottom: 20px

2. **Internship Title**:
   - Font: font-size-xl, font-weight-semibold
   - Color: --neutral-900
   - Margin-bottom: 8px

3. **Company Name**:
   - Font: font-size-base, font-weight-medium
   - Color: --primary-600
   - Margin-bottom: 16px

4. **Details List**:
   - Display: Vertical stack, gap 12px
   - Each item: Icon (16px, color primary-500) + Text (font-size-sm, color neutral-700)
   - Items: Duration, Location, Stipend, Requirements

5. **Tags/Skills**:
   - Display: Flex wrap, gap 8px
   - Each tag: Background --neutral-100, color neutral-700, padding 4px 12px, border-radius radius-full
   - Font: font-size-xs, font-weight-medium
   - Margin: 16px 0

6. **Apply Button**:
   - Full width
   - Primary button style
   - Text: "Apply Now"

**Hover State**:
- Transform: translateY(-4px)
- Shadow: shadow-lg
- Border-color: --primary-300

**Accessibility**:
- Alt text for company logo
- Semantic HTML structure
- Focus indicators on button
- ARIA labels for icons

### Contact Form Component

**Purpose**: Professional contact form with validation and feedback.

**Visual Design**:
- Background: --neutral-white
- Border: 1px solid --neutral-200
- Border-radius: radius-xl
- Padding: 40px
- Shadow: shadow-md
- Max-width: 600px

**Form Fields**:

1. **Input Fields** (Name, Email, Phone):
   - Height: 48px
   - Padding: 12px 16px
   - Border: 2px solid --neutral-300
   - Border-radius: radius-md
   - Font: font-size-base
   - Background: --neutral-white
   - Transition: border-color 200ms

2. **Textarea** (Message):
   - Min-height: 120px
   - Padding: 12px 16px
   - Border: 2px solid --neutral-300
   - Border-radius: radius-md
   - Font: font-size-base
   - Resize: vertical

3. **Labels**:
   - Font: font-size-sm, font-weight-semibold
   - Color: --neutral-700
   - Margin-bottom: 8px
   - Required indicator: Red asterisk

**States**:

1. **Focus**:
   - Border-color: --primary-500
   - Outline: 3px solid rgba(33, 150, 243, 0.1)
   - Outline-offset: 0

2. **Error**:
   - Border-color: --accent-error
   - Error message: font-size-sm, color accent-error, margin-top 4px

3. **Success**:
   - Border-color: --accent-success
   - Success icon: Checkmark in input (right side)

4. **Disabled**:
   - Background: --neutral-100
   - Color: --neutral-400
   - Cursor: not-allowed

**Submit Button**:
- Full width
- Primary button style
- Height: 48px
- Text: "Send Message"
- Loading state: Spinner icon + "Sending..."

**Validation**:
- Real-time validation on blur
- Required field validation
- Email format validation
- Phone number format validation
- Character limits for textarea

**Feedback Messages**:
- Success: Green banner with checkmark icon
- Error: Red banner with error icon
- Position: Above form
- Auto-dismiss: 5 seconds

**Accessibility**:
- Associated labels for all inputs
- Error messages linked with aria-describedby
- Focus management
- Keyboard navigation
- Screen reader announcements for validation


### Button Component Variants

**Primary Button**:
- Background: Linear gradient (primary-500 to primary-600)
- Color: --neutral-white
- Padding: 12px 32px
- Border-radius: radius-md
- Font: font-size-base, font-weight-semibold
- Shadow: shadow-sm
- Transition: all 200ms
- Hover: Transform translateY(-2px), shadow-md, brightness(1.05)
- Active: Transform translateY(0), shadow-sm
- Disabled: Opacity 0.5, cursor not-allowed

**Secondary Button**:
- Background: --neutral-white
- Color: --primary-600
- Border: 2px solid --primary-600
- Padding: 12px 32px
- Border-radius: radius-md
- Font: font-size-base, font-weight-semibold
- Transition: all 200ms
- Hover: Background primary-600, color white
- Active: Background primary-700
- Disabled: Opacity 0.5, cursor not-allowed

**Outline Button**:
- Background: transparent
- Color: --primary-600
- Border: 2px solid --primary-600
- Padding: 12px 32px
- Border-radius: radius-md
- Font: font-size-base, font-weight-semibold
- Transition: all 200ms
- Hover: Background primary-50
- Active: Background primary-100
- Disabled: Opacity 0.5, cursor not-allowed

**Text Button**:
- Background: transparent
- Color: --primary-600
- Padding: 8px 16px
- Border-radius: radius-md
- Font: font-size-base, font-weight-semibold
- Transition: all 200ms
- Hover: Background primary-50
- Active: Background primary-100
- Disabled: Opacity 0.5, cursor not-allowed

**Icon Button**:
- Size: 40x40px
- Background: transparent
- Color: --neutral-700
- Border-radius: radius-md
- Transition: all 200ms
- Hover: Background neutral-100, color primary-600
- Active: Background neutral-200

**Button Sizes**:
- Small: padding 8px 20px, font-size-sm
- Medium (default): padding 12px 32px, font-size-base
- Large: padding 16px 40px, font-size-lg

**Accessibility**:
- Minimum touch target: 44x44px
- Focus indicator: 2px solid primary-500 outline with 2px offset
- Disabled state: aria-disabled="true"
- Loading state: aria-busy="true" with spinner

### Section Header Component

**Purpose**: Consistent section headers across all pages.

**Visual Design**:
- Text-align: center
- Margin-bottom: 64px
- Max-width: 800px
- Margin: 0 auto

**Elements**:

1. **Badge/Label**:
   - Background: --primary-50
   - Color: --primary-700
   - Padding: 8px 20px
   - Border-radius: radius-full
   - Font: font-size-sm, font-weight-bold
   - Text-transform: uppercase
   - Letter-spacing: 0.05em
   - Margin-bottom: 16px
   - Display: inline-block

2. **Heading**:
   - Font: font-size-4xl (desktop), font-size-3xl (mobile)
   - Weight: font-weight-extrabold
   - Color: --neutral-900
   - Line-height: line-height-tight
   - Margin-bottom: 16px
   - Highlight words: color primary-600 for emphasis

3. **Subtitle**:
   - Font: font-size-lg
   - Weight: font-weight-regular
   - Color: --neutral-600
   - Line-height: line-height-relaxed
   - Max-width: 600px
   - Margin: 0 auto

**Accessibility**:
- Semantic heading levels (h2, h3, etc.)
- Sufficient contrast
- Readable line length


## Data Models

### Image Service Interface

```typescript
interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  width: number;
  height: number;
}

interface ImageRequest {
  query: string;
  width?: number;
  height?: number;
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

interface ImageService {
  getImage(request: ImageRequest): Observable<UnsplashImage>;
  getRandomImage(query: string): Observable<UnsplashImage>;
  buildImageUrl(image: UnsplashImage, width: number, height: number): string;
}
```

### Logo Service Interface

```typescript
interface CompanyLogo {
  domain: string;
  logoUrl: string;
  fallbackUrl?: string;
}

interface LogoService {
  getCompanyLogo(domain: string): string;
  getCompanyLogoWithFallback(domain: string, fallback: string): string;
}
```

### Component Data Models

```typescript
interface NavigationLink {
  label: string;
  route: string;
  icon?: string;
  external?: boolean;
}

interface HeroContent {
  badge: string;
  headline: string;
  subtitle: string;
  primaryCta: {
    text: string;
    route: string;
  };
  secondaryCta: {
    text: string;
    route: string;
  };
  statistics: Statistic[];
  imageQuery: string;
}

interface Statistic {
  value: string;
  label: string;
}

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface CourseCard {
  id: string;
  title: string;
  description: string;
  imageQuery: string;
  duration: string;
  studentsCount: number;
  badge?: {
    text: string;
    type: 'bestseller' | 'trending' | 'new';
  };
}

interface InternshipCard {
  id: string;
  title: string;
  company: string;
  companyDomain: string;
  duration: string;
  location: string;
  stipend?: string;
  requirements: string[];
  skills: string[];
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormValidationError {
  field: string;
  message: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following consolidations to eliminate redundancy:

**Consolidated Properties**:
- Multiple criteria about "design system tokens being used" (1.5, 2.7, 4.6, 5.6, 6.5, 7.5, 8.4, 10.1-10.6) → Single property about consistent token usage across all components
- Multiple criteria about "real-time imagery" (3.1, 4.3, 4.4, 5.2, 6.2, 7.1, 11.1, 11.2) → Single property about authentic imagery usage
- Multiple criteria about "responsive layout at different breakpoints" (12.1, 12.2, 12.3, 12.4) → Single property about responsive adaptation
- Multiple criteria about "accessibility features" (13.2-13.8) → Consolidated into focused properties for each accessibility aspect
- Multiple criteria about "hover/interaction states" (15.1, 15.2, 15.7) → Single property about interactive feedback

**Removed Redundancies**:
- Property about "visual consistency when components are reused" (10.8) is redundant with property about consistent token usage (10.7)
- Property about "images representing diversity" (11.5) is subjective and cannot be tested
- Property about "cross-browser testing" (12.7) is integration testing, not unit/property testing
- Property about "subtle animations" (15.6) is subjective

### Property 1: Color Contrast Compliance

*For all* text elements and their backgrounds in the UI system, the color contrast ratio SHALL meet or exceed WCAG 2.1 Level AA requirements (4.5:1 for normal text, 3:1 for large text or UI components).

**Validates: Requirements 1.3, 1.7, 9.5, 13.2**

### Property 2: Design System Token Consistency

*For all* components in the UI system, styling values for colors, typography, spacing, shadows, and transitions SHALL use design system CSS custom properties rather than hardcoded values.

**Validates: Requirements 1.5, 2.7, 4.6, 5.6, 6.5, 7.5, 8.4, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7**

### Property 3: Authentic Imagery Usage

*For all* images displayed in the UI system, the image source SHALL be either Unsplash API, Clearbit Logo API, or actual institute photo URLs (not placeholder image services like placeholder.com or via.placeholder.com).

**Validates: Requirements 3.1, 4.3, 4.4, 5.2, 6.2, 7.1, 11.1, 11.2**

### Property 4: Image Accessibility

*For all* image elements in the UI system, an alt attribute SHALL be present with meaningful descriptive text (or empty string for decorative images with aria-hidden="true").

**Validates: Requirements 11.4, 13.6**

### Property 5: Image Lazy Loading

*For all* images positioned below the fold (outside initial viewport), the loading="lazy" attribute SHALL be applied to enable browser-native lazy loading.

**Validates: Requirements 11.6, 14.3**

### Property 6: Image Fallback Handling

*For all* image elements in the UI system, an onerror handler or fallback mechanism SHALL be implemented to display alternative content when image loading fails.

**Validates: Requirements 11.7**

### Property 7: Responsive Layout Adaptation

*For all* viewport widths (mobile: 320-767px, tablet: 768-1023px, desktop: 1024px+), the layout SHALL adapt appropriately using CSS media queries with content remaining accessible and readable.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.6**

### Property 8: Mobile Touch Target Size

*For all* interactive elements (buttons, links, form inputs) when viewed at mobile breakpoints (< 768px), the minimum touch target size SHALL be 44x44 pixels.

**Validates: Requirements 12.5**

### Property 9: Navigation Active State

*For all* navigation links, when the current route matches the link's route, an active class SHALL be applied providing visual distinction from inactive links.

**Validates: Requirements 2.5**

### Property 10: Navigation Fixed Positioning

*For all* scroll positions, the navigation bar SHALL remain fixed at the top of the viewport with position: fixed and appropriate z-index.

**Validates: Requirements 2.4**

### Property 11: Mobile Navigation Behavior

*For all* viewport widths below 768px, the navigation SHALL display a hamburger menu icon, and clicking it SHALL toggle a slide-in menu drawer with smooth transitions.

**Validates: Requirements 2.6**

### Property 12: Course Card Required Fields

*For all* course cards displayed, the card SHALL include and display all required fields: title, description, duration, and student count.

**Validates: Requirements 5.3**

### Property 13: Internship Card Required Fields

*For all* internship cards displayed, the card SHALL include and display all required fields: title, company name, duration, and requirements.

**Validates: Requirements 6.3**

### Property 14: Hover State Visual Feedback

*For all* interactive elements (buttons, links, cards), hover styles SHALL be defined providing immediate visual feedback with smooth transitions (150-300ms duration).

**Validates: Requirements 2.8, 5.7, 15.1, 15.2, 15.3, 15.7**

### Property 15: Form Validation Feedback

*For all* form inputs, when validation fails, the input SHALL display error styling (border color change) and an associated error message SHALL be visible below the input.

**Validates: Requirements 8.5, 8.7, 15.5**

### Property 16: Form Submission States

*For all* form submissions, during the async operation, a loading state SHALL be displayed (button disabled with spinner), and upon completion, either a success or error message SHALL be shown.

**Validates: Requirements 8.7, 15.4, 15.5**

### Property 17: Keyboard Navigation Support

*For all* interactive elements (buttons, links, form inputs, navigation items), the element SHALL be keyboard accessible (focusable via Tab key) and operable via keyboard (Enter/Space for activation).

**Validates: Requirements 13.3**

### Property 18: Focus Indicator Visibility

*For all* focusable elements, when focused via keyboard navigation, a visible focus indicator SHALL be displayed (minimum 2px outline with sufficient contrast).

**Validates: Requirements 13.4**

### Property 19: Form Label Association

*For all* form input elements, an associated label element SHALL be present, linked via for/id attributes or by wrapping the input.

**Validates: Requirements 13.7**

### Property 20: ARIA Attributes for Semantics

*For all* interactive components that lack native semantic meaning (custom dropdowns, modals, hamburger menus), appropriate ARIA roles, labels, and states SHALL be applied.

**Validates: Requirements 13.5**

### Property 21: Reduced Motion Respect

*For all* animated elements, when the user's system has prefers-reduced-motion: reduce set, animations SHALL be disabled or significantly reduced in duration and intensity.

**Validates: Requirements 13.8, 15.8**

### Property 22: Image Format Optimization

*For all* images served by the application, the image SHALL be provided in modern formats (WebP) with fallback formats (JPEG/PNG) for browser compatibility.

**Validates: Requirements 11.3, 14.5**

### Property 23: Footer Content Responsive Stacking

*For all* viewport widths below 768px, the footer content SHALL stack vertically (single column) rather than maintaining multi-column layout.

**Validates: Requirements 9.7**

### Property 24: Contact Form Responsive Usability

*For all* viewport widths below 768px, the contact form SHALL maintain full usability with appropriately sized inputs, labels, and buttons.

**Validates: Requirements 8.8**

### Property 25: About Page Responsive Hierarchy

*For all* viewport widths below 768px, the about page SHALL maintain content hierarchy with proper heading levels and reading order.

**Validates: Requirements 7.7**


## Error Handling

### Image Loading Errors

**Scenario**: Image fails to load from Unsplash API or Clearbit API

**Handling**:
1. Implement onerror event handler on all img elements
2. Display fallback image or placeholder with appropriate styling
3. Log error to console for debugging
4. For company logos: Display company name text as fallback
5. For hero/course images: Display gradient background with icon

**Implementation**:
```typescript
handleImageError(event: Event, fallbackType: 'logo' | 'photo'): void {
  const img = event.target as HTMLImageElement;
  if (fallbackType === 'logo') {
    img.src = 'assets/images/company-placeholder.svg';
  } else {
    img.src = 'assets/images/photo-placeholder.jpg';
  }
  console.warn('Image failed to load:', img.dataset['originalSrc']);
}
```

### Form Validation Errors

**Scenario**: User submits form with invalid data

**Handling**:
1. Validate on blur for immediate feedback
2. Validate on submit before API call
3. Display field-specific error messages below inputs
4. Apply error styling to invalid fields
5. Focus first invalid field
6. Prevent form submission until all fields valid

**Validation Rules**:
- Name: Required, min 2 characters, max 100 characters
- Email: Required, valid email format
- Phone: Required, valid phone format (10-15 digits)
- Message: Required, min 10 characters, max 1000 characters

### API Communication Errors

**Scenario**: Backend API request fails

**Handling**:
1. Display user-friendly error message
2. Provide retry option for transient failures
3. Log detailed error for debugging
4. Maintain form data so user doesn't lose input
5. Show specific error messages when possible

**Error Types**:
- Network error: "Unable to connect. Please check your internet connection."
- 400 Bad Request: Display specific validation errors from API
- 401 Unauthorized: Redirect to login (for admin features)
- 404 Not Found: "The requested resource was not found."
- 500 Server Error: "Something went wrong. Please try again later."
- Timeout: "Request timed out. Please try again."

### Responsive Layout Errors

**Scenario**: Layout breaks at certain viewport sizes

**Handling**:
1. Test at all breakpoints during development
2. Use CSS Grid and Flexbox with fallbacks
3. Implement mobile-first responsive design
4. Use container queries where appropriate
5. Test on actual devices, not just browser DevTools

### Accessibility Errors

**Scenario**: Accessibility violations detected

**Handling**:
1. Run automated accessibility tests (axe-core)
2. Fix violations before deployment
3. Provide skip links for keyboard navigation
4. Ensure all interactive elements are keyboard accessible
5. Test with screen readers (NVDA, JAWS, VoiceOver)

### Performance Degradation

**Scenario**: Page load time exceeds acceptable thresholds

**Handling**:
1. Monitor Core Web Vitals (LCP, FID, CLS)
2. Implement lazy loading for below-fold content
3. Optimize images (compression, modern formats)
4. Minimize and bundle CSS/JS
5. Use CDN for static assets
6. Implement service worker for caching

**Thresholds**:
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1


## Testing Strategy

### Dual Testing Approach

This design requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points
**Property Tests**: Verify universal properties across all inputs through randomization

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Unit Testing

**Framework**: Jasmine + Karma (Angular default)

**Component Testing**:
- Test component rendering with mock data
- Test user interactions (clicks, form submissions)
- Test routing and navigation
- Test conditional rendering
- Test error states and edge cases

**Service Testing**:
- Test API integration with mock HTTP responses
- Test image URL generation
- Test data transformation
- Test error handling

**Example Unit Tests**:

```typescript
describe('NavigationComponent', () => {
  it('should display all required navigation links', () => {
    const links = ['Home', 'About', 'Internships', 'Courses', 'Projects', 'Contact'];
    const compiled = fixture.nativeElement;
    links.forEach(link => {
      expect(compiled.textContent).toContain(link);
    });
  });

  it('should apply active class to current route', () => {
    router.navigate(['/courses']);
    fixture.detectChanges();
    const coursesLink = compiled.querySelector('a[routerLink="/courses"]');
    expect(coursesLink.classList.contains('active')).toBe(true);
  });

  it('should toggle mobile menu on hamburger click', () => {
    component.isMenuCollapsed = true;
    const hamburger = compiled.querySelector('.hamburger-menu');
    hamburger.click();
    expect(component.isMenuCollapsed).toBe(false);
  });
});

describe('ContactFormComponent', () => {
  it('should show error for invalid email', () => {
    const emailControl = component.contactForm.get('email');
    emailControl.setValue('invalid-email');
    emailControl.markAsTouched();
    fixture.detectChanges();
    expect(compiled.querySelector('.invalid-feedback')).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    component.contactForm.patchValue({ name: '', email: '', phone: '', message: '' });
    fixture.detectChanges();
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(true);
  });
});
```

**Visual Regression Testing**:
- Use Percy or Chromatic for visual regression testing
- Capture screenshots at different breakpoints
- Compare against baseline images
- Flag visual changes for review

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with reference to design document property
- Tag format: `Feature: professional-it-institute-ui, Property {number}: {property_text}`

**Property Test Examples**:

```typescript
import * as fc from 'fast-check';

describe('Property 1: Color Contrast Compliance', () => {
  it('should meet WCAG AA contrast requirements for all text/background combinations', () => {
    // Feature: professional-it-institute-ui, Property 1: Color Contrast Compliance
    fc.assert(
      fc.property(
        fc.constantFrom(...textColors),
        fc.constantFrom(...backgroundColors),
        (textColor, bgColor) => {
          const contrast = calculateContrastRatio(textColor, bgColor);
          const isLargeText = false; // Test both cases
          const minContrast = isLargeText ? 3 : 4.5;
          expect(contrast).toBeGreaterThanOrEqual(minContrast);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 4: Image Accessibility', () => {
  it('should have alt text for all images', () => {
    // Feature: professional-it-institute-ui, Property 4: Image Accessibility
    fc.assert(
      fc.property(
        fc.array(fc.record({
          src: fc.webUrl(),
          isDecorative: fc.boolean()
        })),
        (images) => {
          images.forEach(img => {
            const element = createImageElement(img);
            if (img.isDecorative) {
              expect(element.alt).toBe('');
              expect(element.getAttribute('aria-hidden')).toBe('true');
            } else {
              expect(element.alt).toBeTruthy();
              expect(element.alt.length).toBeGreaterThan(0);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 7: Responsive Layout Adaptation', () => {
  it('should adapt layout for all viewport widths', () => {
    // Feature: professional-it-institute-ui, Property 7: Responsive Layout Adaptation
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const layout = getComputedLayout();
          
          if (viewportWidth < 768) {
            expect(layout.columns).toBe(1); // Mobile: single column
          } else if (viewportWidth < 1024) {
            expect(layout.columns).toBeGreaterThanOrEqual(1);
            expect(layout.columns).toBeLessThanOrEqual(2); // Tablet: 1-2 columns
          } else {
            expect(layout.columns).toBeGreaterThanOrEqual(2); // Desktop: 2+ columns
          }
          
          expect(layout.isAccessible).toBe(true);
          expect(layout.hasOverflow).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 8: Mobile Touch Target Size', () => {
  it('should ensure 44x44px minimum touch targets on mobile', () => {
    // Feature: professional-it-institute-ui, Property 8: Mobile Touch Target Size
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        fc.constantFrom('button', 'a', 'input'),
        (viewportWidth, elementType) => {
          setViewportWidth(viewportWidth);
          const elements = document.querySelectorAll(elementType);
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            expect(rect.width).toBeGreaterThanOrEqual(44);
            expect(rect.height).toBeGreaterThanOrEqual(44);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 14: Hover State Visual Feedback', () => {
  it('should provide hover feedback with smooth transitions', () => {
    // Feature: professional-it-institute-ui, Property 14: Hover State Visual Feedback
    fc.assert(
      fc.property(
        fc.constantFrom('.btn', '.nav-link', '.card', 'a'),
        (selector) => {
          const element = document.querySelector(selector);
          const styles = getComputedStyle(element);
          
          // Check transition is defined
          expect(styles.transition).toBeTruthy();
          
          // Check transition duration is in acceptable range (150-300ms)
          const duration = parseTransitionDuration(styles.transitionDuration);
          expect(duration).toBeGreaterThanOrEqual(150);
          expect(duration).toBeLessThanOrEqual(300);
          
          // Simulate hover and check for style changes
          element.classList.add('hover');
          const hoverStyles = getComputedStyle(element);
          expect(hoverStyles).not.toEqual(styles);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 18: Focus Indicator Visibility', () => {
  it('should show visible focus indicators for all focusable elements', () => {
    // Feature: professional-it-institute-ui, Property 18: Focus Indicator Visibility
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a', 'input', 'textarea', 'select'),
        (elementType) => {
          const elements = document.querySelectorAll(elementType);
          elements.forEach(el => {
            el.focus();
            const styles = getComputedStyle(el);
            
            // Check for visible outline or box-shadow focus indicator
            const hasOutline = styles.outline !== 'none' && 
                              parseInt(styles.outlineWidth) >= 2;
            const hasFocusRing = styles.boxShadow.includes('0 0 0');
            
            expect(hasOutline || hasFocusRing).toBe(true);
            
            // Check contrast of focus indicator
            if (hasOutline) {
              const contrast = calculateContrastRatio(
                styles.outlineColor, 
                styles.backgroundColor
              );
              expect(contrast).toBeGreaterThanOrEqual(3);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Accessibility Testing

**Automated Testing**:
- Use axe-core for automated accessibility testing
- Run on every component and page
- Fail build if critical violations found

**Manual Testing**:
- Keyboard navigation testing (Tab, Enter, Space, Arrow keys)
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- Color contrast verification with tools
- Focus management verification
- ARIA attribute validation

**Accessibility Test Example**:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations on home page', async () => {
    const results = await axe(compiled);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard navigable', () => {
    const focusableElements = compiled.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((el, index) => {
      el.focus();
      expect(document.activeElement).toBe(el);
    });
  });
});
```

### Performance Testing

**Lighthouse CI**:
- Run Lighthouse in CI pipeline
- Fail build if scores below thresholds:
  - Desktop Performance: 90+
  - Mobile Performance: 80+
  - Accessibility: 100
  - Best Practices: 95+
  - SEO: 95+

**Core Web Vitals Monitoring**:
- Monitor LCP, FID, CLS in production
- Set up alerts for degradation
- Use Real User Monitoring (RUM)

**Load Testing**:
- Test image loading performance
- Test lazy loading implementation
- Test bundle size impact
- Test caching effectiveness

### Visual Regression Testing

**Tools**: Percy or Chromatic

**Coverage**:
- All pages at mobile, tablet, desktop breakpoints
- All component states (default, hover, focus, active, disabled, error)
- Dark mode (if implemented)
- Different data scenarios (empty states, full states, error states)

**Process**:
1. Capture baseline screenshots
2. Run visual tests on every PR
3. Review and approve visual changes
4. Update baselines when intentional changes made

### Integration Testing

**E2E Testing Framework**: Cypress or Playwright

**Test Scenarios**:
- Complete user journeys (browse courses → view details → enroll)
- Form submissions (contact form, enrollment form)
- Navigation flows
- Responsive behavior
- Error handling flows

**Example E2E Test**:

```typescript
describe('Course Enrollment Flow', () => {
  it('should allow user to browse and enroll in a course', () => {
    cy.visit('/');
    cy.get('a[routerLink="/courses"]').click();
    cy.url().should('include', '/courses');
    
    cy.get('.course-card').first().within(() => {
      cy.get('h3').should('be.visible');
      cy.get('.btn-primary').click();
    });
    
    cy.get('form').within(() => {
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('input[name="phone"]').type('1234567890');
      cy.get('button[type="submit"]').click();
    });
    
    cy.get('.success-message').should('be.visible');
  });
});
```

### Test Coverage Goals

- Unit Test Coverage: 80%+ for components and services
- Property Test Coverage: All 25 correctness properties implemented
- Accessibility: 100% automated test pass rate
- Visual Regression: All pages and components covered
- E2E: Critical user journeys covered

### Continuous Integration

**CI Pipeline Steps**:
1. Lint code (ESLint, Stylelint)
2. Run unit tests
3. Run property-based tests
4. Run accessibility tests
5. Run Lighthouse CI
6. Build production bundle
7. Run E2E tests
8. Run visual regression tests
9. Deploy to staging (if all pass)

**Quality Gates**:
- All tests must pass
- Code coverage must meet thresholds
- No accessibility violations
- Performance scores must meet thresholds
- No visual regressions (or approved)


## Page-Specific Design Specifications

### Home Page

**Sections** (in order):
1. Hero Section (full viewport height)
2. Features Section (4-column grid on desktop)
3. Courses Preview (3 featured courses)
4. Companies Section (6 company logos)
5. CTA Section (full-width with gradient background)

**Spacing**: 96px between sections (desktop), 64px (mobile)

**Animations**:
- Fade in on scroll for each section
- Stagger animation for feature cards (100ms delay between each)
- Hover animations on course cards and company logos

### About Page

**Sections**:
1. Page Header (breadcrumb + title)
2. Mission & Vision (two-column layout)
3. Team Section (grid of team member cards)
4. Achievements Section (statistics + certifications)
5. Testimonials (carousel or grid)

**Team Member Card**:
- Photo: 200x200px circular
- Name: font-size-xl, font-weight-semibold
- Role: font-size-base, color neutral-600
- Bio: font-size-sm, 2-3 lines
- Social links: LinkedIn, Twitter icons

**Layout**: Max-width 1140px, centered

### Courses Page

**Layout**:
- Page header with search/filter options
- Grid: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Pagination or infinite scroll

**Filters**:
- Category dropdown (All, Web Development, Data Science, Mobile, etc.)
- Duration filter (< 2 months, 2-4 months, 4+ months)
- Level filter (Beginner, Intermediate, Advanced)

**Sort Options**:
- Most Popular
- Newest First
- Duration (Short to Long)
- Alphabetical

**Empty State**:
- Icon + message when no courses match filters
- "Clear Filters" button

### Internships Page

**Layout**:
- Page header with search bar
- Grid: 2 columns (desktop), 1 column (mobile)
- Filter sidebar (desktop) or dropdown (mobile)

**Filters**:
- Location (Remote, On-site, Hybrid)
- Duration (1-3 months, 3-6 months, 6+ months)
- Stipend range
- Company type (Startup, MNC, Product, Service)

**Search**:
- Search by title, company, or skills
- Real-time filtering as user types

**Application Flow**:
1. Click "Apply Now" button
2. Modal opens with application form
3. Fields: Name, Email, Phone, Resume upload, Cover letter
4. Submit → Success message → Email confirmation

### Projects Page

**Layout**:
- Grid: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Each project card shows: Image, Title, Description, Technologies, GitHub link

**Project Card**:
- Image: 16:9 aspect ratio
- Technologies: Badges/tags
- Links: GitHub icon, Live demo icon (if available)
- Hover: Overlay with "View Details" button

**Project Detail View** (optional):
- Full-screen modal or separate page
- Large image gallery
- Full description
- Technologies used
- Team members
- Links to GitHub and live demo

### Contact Page

**Layout**: Two-column (desktop), single-column (mobile)

**Left Column**: Contact form (60% width)
**Right Column**: Contact information + map (40% width)

**Contact Information**:
- Address with map icon
- Phone with phone icon
- Email with email icon
- Office hours
- Social media links

**Map Integration** (optional):
- Embed Google Maps iframe
- Height: 300px
- Border-radius: radius-xl
- Marker at institute location

**Form Success**:
- Replace form with success message
- Checkmark icon
- "Thank you" message
- "Send another message" button to reset form


## Implementation Guidelines

### Image Integration

**Unsplash API Integration**:

```typescript
// image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY';
  private unsplashApiUrl = 'https://api.unsplash.com';

  constructor(private http: HttpClient) {}

  getImage(query: string, width: number = 800, height: number = 600): Observable<string> {
    return this.http.get(`${this.unsplashApiUrl}/photos/random`, {
      params: {
        query: query,
        client_id: this.unsplashAccessKey,
        w: width.toString(),
        h: height.toString(),
        fit: 'crop'
      }
    }).pipe(
      map((response: any) => response.urls.regular)
    );
  }

  buildUnsplashUrl(query: string, width: number, height: number): string {
    // For static builds, use Unsplash Source API
    return `https://source.unsplash.com/${width}x${height}/?${query}`;
  }
}
```

**Clearbit Logo API Integration**:

```typescript
// logo.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  getCompanyLogo(domain: string, size: number = 128): string {
    return `https://logo.clearbit.com/${domain}?size=${size}`;
  }

  getCompanyLogoWithFallback(domain: string, companyName: string): string {
    const logoUrl = this.getCompanyLogo(domain);
    // Return object with URL and fallback text
    return logoUrl;
  }
}
```

**Image Component with Lazy Loading**:

```typescript
// lazy-image.component.ts
@Component({
  selector: 'app-lazy-image',
  template: `
    <img 
      [src]="src" 
      [alt]="alt"
      [loading]="loading"
      (error)="handleError($event)"
      [class.loaded]="isLoaded"
      (load)="onLoad()"
    />
    <div class="image-placeholder" *ngIf="!isLoaded && !hasError">
      <div class="spinner"></div>
    </div>
    <div class="image-error" *ngIf="hasError">
      <i class="fas fa-image"></i>
      <span>Image unavailable</span>
    </div>
  `,
  styles: [`
    :host {
      position: relative;
      display: block;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 300ms ease;
    }
    img.loaded {
      opacity: 1;
    }
    .image-placeholder, .image-error {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--neutral-100);
    }
  `]
})
export class LazyImageComponent {
  @Input() src: string;
  @Input() alt: string;
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  
  isLoaded = false;
  hasError = false;

  onLoad(): void {
    this.isLoaded = true;
  }

  handleError(event: Event): void {
    this.hasError = true;
    console.warn('Image failed to load:', this.src);
  }
}
```

### Responsive Breakpoint Utilities

**Breakpoint Service**:

```typescript
// breakpoint.service.ts
import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobile(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .pipe(map(result => result.matches));
  }

  isTablet(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(min-width: 768px) and (max-width: 1023px)'])
      .pipe(map(result => result.matches));
  }

  isDesktop(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(map(result => result.matches));
  }
}
```

### Accessibility Utilities

**Focus Management**:

```typescript
// focus.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FocusService {
  focusFirstInvalidField(formElement: HTMLFormElement): void {
    const invalidField = formElement.querySelector('.is-invalid') as HTMLElement;
    if (invalidField) {
      invalidField.focus();
    }
  }

  trapFocus(element: HTMLElement): void {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    element.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
}
```

### Performance Optimization

**Image Optimization Strategy**:
1. Use Unsplash API with specific dimensions (avoid oversized images)
2. Implement lazy loading for all below-fold images
3. Use modern image formats (WebP) with fallbacks
4. Implement progressive image loading (blur-up technique)
5. Set explicit width/height to prevent layout shift

**Bundle Optimization**:
1. Enable Angular production build optimizations
2. Use lazy loading for route modules
3. Tree-shake unused code
4. Minimize CSS and JS
5. Use CDN for Font Awesome and Google Fonts

**Caching Strategy**:
1. Set appropriate cache headers for static assets
2. Use service worker for offline support (optional)
3. Implement HTTP caching for API responses
4. Use browser cache for images

### Browser Support

**Target Browsers**:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Mobile (last 2 versions)

**Fallbacks**:
- CSS Grid with Flexbox fallback
- WebP images with JPEG/PNG fallback
- CSS custom properties with fallback values
- Modern JavaScript with polyfills for older browsers

### Development Workflow

**Setup**:
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables (Unsplash API key)
4. Run development server: `ng serve`
5. Run tests: `ng test`

**Code Style**:
- Follow Angular style guide
- Use ESLint for JavaScript/TypeScript
- Use Stylelint for CSS
- Use Prettier for code formatting
- Commit messages follow conventional commits

**Git Workflow**:
1. Create feature branch from main
2. Implement feature with tests
3. Run linting and tests locally
4. Create pull request
5. Pass CI checks
6. Code review
7. Merge to main

### Deployment

**Build Process**:
```bash
ng build --configuration production
```

**Production Optimizations**:
- AOT compilation enabled
- Build optimizer enabled
- Source maps disabled
- CSS minification enabled
- JS minification enabled
- Bundle budgets enforced

**Deployment Checklist**:
- [ ] All tests passing
- [ ] Lighthouse scores meet thresholds
- [ ] No accessibility violations
- [ ] Visual regression tests approved
- [ ] Environment variables configured
- [ ] CDN configured for static assets
- [ ] Analytics tracking implemented
- [ ] Error monitoring configured (Sentry, etc.)
- [ ] Performance monitoring configured

## Conclusion

This design document provides comprehensive specifications for redesigning the WebVibes Technology IT Institute website with a professional, modern aesthetic. The design moves away from purple/blue gradients to a clean, technology-focused color palette with authentic imagery and consistent design patterns.

Key deliverables:
- Professional color system with WCAG AA compliance
- Comprehensive component library with reusable patterns
- Responsive layouts for all devices
- Accessibility-first approach
- Performance-optimized implementation
- Comprehensive testing strategy with 25 correctness properties

The design prioritizes credibility, usability, and performance to create a website that effectively represents a professional IT education institution.

