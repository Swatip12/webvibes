# Implementation Plan: Professional IT Institute UI Redesign

## Overview

This implementation plan transforms the WebVibes Technology IT Institute website from its current purple/blue gradient aesthetic to a modern, professional design system. The redesign implements a clean technology-focused color palette (blue primary, orange secondary), authentic imagery from Unsplash and Clearbit APIs, comprehensive accessibility features, and responsive layouts across all devices.

The implementation uses Angular 15.x with TypeScript, component-scoped CSS with global design tokens, Font Awesome icons, and the Inter font family. All 25 correctness properties from the design document will be validated through property-based tests.

**Key Context**: The institute logo is "WebVibes Technologies" with tagline "WHERE VIBES MEETS INNOVATION" using vibrant orange/yellow colors with blue background.

## Tasks

- [x] 1. Set up design system foundation
  - Create CSS custom properties in styles.css for colors, typography, spacing, shadows, transitions, and breakpoints
  - Define all color tokens (primary, secondary, accent, neutral, semantic)
  - Define typography scale (font sizes, weights, line heights)
  - Define spacing system (based on 4px grid)
  - Define border radius, shadow levels, transition durations, and easing functions
  - Define responsive breakpoints and container max-widths
  - Add Inter font family from Google Fonts
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.1, 10.2, 10.3, 10.5, 10.6_

- [ ]* 1.1 Write property test for design system token consistency
  - **Property 2: Design System Token Consistency**
  - **Validates: Requirements 1.5, 2.7, 4.6, 5.6, 6.5, 7.5, 8.4, 10.1-10.7**
  - Verify all components use CSS custom properties instead of hardcoded values

- [ ]* 1.2 Write property test for color contrast compliance
  - **Property 1: Color Contrast Compliance**
  - **Validates: Requirements 1.3, 1.7, 9.5, 13.2**
  - Verify all text/background combinations meet WCAG 2.1 Level AA (4.5:1 for normal text, 3:1 for large text)


- [x] 2. Implement navigation bar component
  - [x] 2.1 Update navigation component structure and styling
    - Update navigation.component.html with WebVibes Technologies logo and tagline
    - Implement fixed positioning with white background and subtle shadow
    - Add navigation links (Home, About, Internships, Courses, Projects, Contact)
    - Style with professional typography and spacing from design system
    - Add active route highlighting with primary color
    - Implement smooth hover states with background color transitions
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.8_

  - [x] 2.2 Implement mobile hamburger menu
    - Add hamburger menu icon for viewports < 768px
    - Create slide-in menu drawer (280px wide, full height)
    - Add semi-transparent overlay (rgba(0,0,0,0.5))
    - Implement smooth slide animation (300ms cubic-bezier)
    - Stack menu items vertically with proper spacing
    - Ensure touch targets are minimum 44x44px
    - _Requirements: 2.6, 12.5_

  - [ ]* 2.3 Write property test for navigation active state
    - **Property 9: Navigation Active State**
    - **Validates: Requirements 2.5**
    - Verify active class is applied when current route matches link route

  - [ ]* 2.4 Write property test for navigation fixed positioning
    - **Property 10: Navigation Fixed Positioning**
    - **Validates: Requirements 2.4**
    - Verify navigation remains fixed at top for all scroll positions

  - [ ]* 2.5 Write property test for mobile navigation behavior
    - **Property 11: Mobile Navigation Behavior**
    - **Validates: Requirements 2.6**
    - Verify hamburger menu displays and toggles correctly below 768px

  - [ ]* 2.6 Add accessibility features to navigation
    - Add ARIA labels for hamburger menu and navigation
    - Implement focus indicators (2px solid primary-500 outline)
    - Ensure keyboard navigation support (Tab, Enter, Space)
    - Add screen reader support for active page indication
    - _Requirements: 13.3, 13.4, 13.5_


- [x] 3. Create image integration services
  - [x] 3.1 Implement ImageService for Unsplash API integration
    - Create image.service.ts with Unsplash API methods
    - Implement getImage() method with query, width, height parameters
    - Implement buildUnsplashUrl() for static image URLs
    - Add error handling for API failures
    - _Requirements: 11.1, 11.2_

  - [x] 3.2 Implement LogoService for Clearbit API integration
    - Create logo.service.ts with Clearbit Logo API methods
    - Implement getCompanyLogo() method with domain parameter
    - Implement getCompanyLogoWithFallback() for error handling
    - _Requirements: 11.1, 11.2_

  - [x] 3.3 Create LazyImageComponent for optimized image loading
    - Create lazy-image.component.ts with lazy loading support
    - Implement loading states (placeholder, loaded, error)
    - Add error handling with fallback display
    - Implement fade-in animation on load
    - Add loading="lazy" attribute for below-fold images
    - _Requirements: 11.3, 11.6, 11.7, 14.3_

  - [ ]* 3.4 Write property test for authentic imagery usage
    - **Property 3: Authentic Imagery Usage**
    - **Validates: Requirements 3.1, 4.3, 4.4, 5.2, 6.2, 7.1, 11.1, 11.2**
    - Verify all images use Unsplash, Clearbit, or actual institute URLs (not placeholder services)

  - [ ]* 3.5 Write property test for image accessibility
    - **Property 4: Image Accessibility**
    - **Validates: Requirements 11.4, 13.6**
    - Verify all images have alt attributes with meaningful text or empty with aria-hidden for decorative images

  - [ ]* 3.6 Write property test for image lazy loading
    - **Property 5: Image Lazy Loading**
    - **Validates: Requirements 11.6, 14.3**
    - Verify below-fold images have loading="lazy" attribute

  - [ ]* 3.7 Write property test for image fallback handling
    - **Property 6: Image Fallback Handling**
    - **Validates: Requirements 11.7**
    - Verify all images have error handlers or fallback mechanisms


- [x] 4. Redesign hero section component
  - [x] 4.1 Update hero section structure and layout
    - Update hero-section.component.html with two-column grid layout
    - Add badge/tag with primary-50 background and primary-700 text
    - Create headline with font-size-5xl, font-weight-extrabold, highlight words in primary-600
    - Add subtitle with font-size-lg, max-width 540px
    - Implement primary CTA button ("Explore Courses") and secondary CTA ("Talk to Expert")
    - Add statistics bar with three columns showing key metrics
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Integrate Unsplash imagery for hero section
    - Use ImageService to fetch hero image (query: "students learning technology")
    - Set dimensions to 600x500px for desktop
    - Add border-radius-2xl and shadow-xl styling
    - Implement responsive behavior (full width on mobile)
    - Add decorative floating feature cards (desktop only) with subtle animations
    - _Requirements: 3.1, 3.7, 11.1_

  - [x] 4.3 Style hero section with design system tokens
    - Apply gradient background (neutral-50 to neutral-white)
    - Set padding to 120px vertical, responsive horizontal
    - Implement min-height 600px for desktop
    - Style statistics bar with white background, border, shadow
    - Add responsive layout for mobile (single column stack)
    - _Requirements: 3.6, 3.8, 10.7_

  - [ ]* 4.4 Write unit tests for hero section component
    - Test component renders with all required elements
    - Test CTA buttons navigate to correct routes
    - Test statistics display correctly
    - Test responsive layout changes at breakpoints
    - _Requirements: 3.1-3.8_


- [x] 5. Update home page sections
  - [x] 5.1 Implement features section component
    - Create grid layout (4 columns desktop, 2 tablet, 1 mobile)
    - Create FeatureCard component with icon, title, description
    - Style cards with white background, border, shadow, hover effects
    - Add icon containers with gradient backgrounds (primary-500 to primary-600)
    - Implement hover animations (translateY -8px, shadow-lg)
    - Add stagger animation on scroll (100ms delay between cards)
    - _Requirements: 4.2, 10.4_

  - [x] 5.2 Implement courses preview section
    - Display 3 featured courses in grid layout
    - Integrate Unsplash images for course topics
    - Show course title, description, duration, student count
    - Add badges for Bestseller/Trending/New courses
    - Implement "Learn More" CTA buttons
    - Add hover effects (translateY -8px, image scale 1.05)
    - _Requirements: 4.3, 5.1-5.8_

  - [x] 5.3 Implement companies section
    - Create grid layout for company logos (6 logos, 3 columns desktop)
    - Integrate Clearbit Logo API for actual company logos
    - Add grayscale filter with color on hover
    - Implement error handling with company name fallback
    - Style with neutral background and proper spacing
    - _Requirements: 4.4, 11.2_

  - [x] 5.4 Implement CTA section
    - Create full-width section with gradient background
    - Add compelling headline and description
    - Include primary CTA button for enrollment
    - Style with proper padding and typography
    - Ensure responsive layout for mobile
    - _Requirements: 4.5_

  - [ ]* 5.5 Write unit tests for home page sections
    - Test features section renders all feature cards
    - Test courses preview displays correct course data
    - Test companies section displays logos with fallbacks
    - Test CTA section buttons navigate correctly
    - _Requirements: 4.1-4.8_


- [x] 6. Redesign courses page
  - [x] 6.1 Update course card component structure
    - Update courses.component.html with grid layout (3 columns desktop, 2 tablet, 1 mobile)
    - Create CourseCard component with image, content, metadata, CTA
    - Integrate Unsplash images (16:9 aspect ratio, 240px height)
    - Add badges (Bestseller, Trending, New) with appropriate colors
    - Display title, description (line-clamp 3), duration, student count
    - Implement "Enroll Now" CTA button
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.2 Style course cards with design system
    - Apply white background, border, border-radius-xl
    - Add shadow-md (default) and shadow-xl (hover)
    - Implement hover animation (translateY -8px, image scale 1.05)
    - Style metadata row with icons and proper spacing
    - Add smooth transitions (300ms for transform, 500ms for image)
    - _Requirements: 5.6, 5.7, 10.7_

  - [x] 6.3 Add search and filter functionality
    - Implement search bar for course titles
    - Add category filter dropdown (All, Web Development, Data Science, Mobile)
    - Add duration filter (< 2 months, 2-4 months, 4+ months)
    - Add level filter (Beginner, Intermediate, Advanced)
    - Implement sort options (Most Popular, Newest, Duration, Alphabetical)
    - Add empty state with "Clear Filters" button
    - _Requirements: 5.1, 5.8_

  - [ ]* 6.4 Write property test for course card required fields
    - **Property 12: Course Card Required Fields**
    - **Validates: Requirements 5.3**
    - Verify all course cards display title, description, duration, and student count

  - [ ]* 6.5 Write unit tests for courses page
    - Test course cards render with correct data
    - Test search filters courses correctly
    - Test category/duration/level filters work
    - Test sort options reorder courses
    - Test empty state displays when no matches
    - _Requirements: 5.1-5.8_


- [x] 7. Redesign internships page
  - [x] 7.1 Update internship card component structure
    - Update internship.component.html with grid layout (2 columns desktop, 1 mobile)
    - Create InternshipCard component with logo, title, company, details, CTA
    - Integrate Clearbit Logo API for company logos (80x80px)
    - Display title, company name, duration, location, stipend, requirements
    - Add skills tags with neutral-100 background
    - Implement "Apply Now" CTA button
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.2 Style internship cards with design system
    - Apply white background, border, border-radius-xl, padding 32px
    - Add shadow-sm (default) and shadow-lg (hover)
    - Implement hover animation (translateY -4px)
    - Style company logo with border and neutral-50 background
    - Format details list with icons and proper spacing
    - Add smooth transitions for hover states
    - _Requirements: 6.5, 10.7_

  - [x] 7.3 Add search and filter functionality
    - Implement search bar for title, company, skills
    - Add location filter (Remote, On-site, Hybrid)
    - Add duration filter (1-3 months, 3-6 months, 6+ months)
    - Add stipend range filter
    - Add company type filter (Startup, MNC, Product, Service)
    - Implement real-time filtering as user types
    - _Requirements: 6.1, 6.7_

  - [ ]* 7.4 Write property test for internship card required fields
    - **Property 13: Internship Card Required Fields**
    - **Validates: Requirements 6.3**
    - Verify all internship cards display title, company, duration, and requirements

  - [ ]* 7.5 Write unit tests for internships page
    - Test internship cards render with correct data
    - Test company logos load with fallbacks
    - Test search filters internships correctly
    - Test location/duration/stipend filters work
    - Test skills tags display correctly
    - _Requirements: 6.1-6.7_


- [x] 8. Redesign about page
  - [ ] 8.1 Update about page structure and layout
    - Update about.component.html with page header (breadcrumb + title)
    - Create mission & vision section (two-column layout)
    - Implement team section with grid of team member cards
    - Add achievements section with statistics and certifications
    - Integrate Unsplash images for institute/instructors/facilities
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 8.2 Style about page with design system
    - Apply consistent color palette and typography
    - Style team member cards (200x200px circular photos, name, role, bio)
    - Add visual elements to break up text for readability
    - Implement max-width 1140px centered layout
    - Add responsive layout for mobile (single column stack)
    - _Requirements: 7.5, 7.6, 7.7_

  - [ ]* 8.3 Write property test for about page responsive hierarchy
    - **Property 25: About Page Responsive Hierarchy**
    - **Validates: Requirements 7.7**
    - Verify content hierarchy maintained at mobile breakpoints with proper heading levels

  - [ ]* 8.4 Write unit tests for about page
    - Test mission and vision sections render correctly
    - Test team member cards display with photos and info
    - Test achievements section shows statistics
    - Test responsive layout at different breakpoints
    - _Requirements: 7.1-7.7_


- [ ] 9. Redesign contact page
  - [ ] 9.1 Update contact form component structure
    - Update contact.component.html with two-column layout (form 60%, info 40%)
    - Create form with fields: name, email, phone, message
    - Style input fields (height 48px, padding 12px 16px, border 2px)
    - Style textarea (min-height 120px, vertical resize)
    - Add labels with required indicators (red asterisk)
    - Implement submit button with loading state
    - _Requirements: 8.1, 8.2_

  - [ ] 9.2 Implement form validation and feedback
    - Add real-time validation on blur
    - Implement required field validation
    - Add email format validation
    - Add phone number format validation (10-15 digits)
    - Add character limits (name: 2-100, message: 10-1000)
    - Display field-specific error messages below inputs
    - Apply error styling (border-color: accent-error)
    - Focus first invalid field on submit
    - _Requirements: 8.5, 8.7_

  - [ ] 9.3 Add contact information and styling
    - Display institute contact info (address, phone, email)
    - Add office hours information
    - Include social media links with icons
    - Optionally add Google Maps iframe (300px height)
    - Style with professional color palette and spacing
    - Implement responsive layout for mobile (single column)
    - _Requirements: 8.2, 8.3, 8.4, 8.6, 8.8_

  - [ ]* 9.4 Write property test for form validation feedback
    - **Property 15: Form Validation Feedback**
    - **Validates: Requirements 8.5, 8.7, 15.5**
    - Verify invalid inputs display error styling and messages

  - [ ]* 9.5 Write property test for form submission states
    - **Property 16: Form Submission States**
    - **Validates: Requirements 8.7, 15.4, 15.5**
    - Verify loading state during submission and success/error messages after

  - [ ]* 9.6 Write property test for contact form responsive usability
    - **Property 24: Contact Form Responsive Usability**
    - **Validates: Requirements 8.8**
    - Verify form maintains usability at mobile breakpoints

  - [ ]* 9.7 Write unit tests for contact page
    - Test form fields render correctly
    - Test validation rules work for each field
    - Test error messages display appropriately
    - Test submit button disabled when form invalid
    - Test success message displays after submission
    - Test responsive layout at mobile breakpoints
    - _Requirements: 8.1-8.8_


- [ ] 10. Redesign projects page
  - [ ] 10.1 Update projects page structure and layout
    - Update projects.component.html with grid layout (3 columns desktop, 2 tablet, 1 mobile)
    - Create ProjectCard component with image, title, description, technologies, links
    - Display project image (16:9 aspect ratio)
    - Show technologies as badges/tags
    - Add GitHub and live demo links with icons
    - Implement hover overlay with "View Details" button
    - _Requirements: 10.7_

  - [ ] 10.2 Style projects page with design system
    - Apply consistent color palette and typography
    - Style project cards with white background, border, shadow
    - Add hover effects for cards and overlay
    - Style technology badges with appropriate colors
    - Implement responsive layout for mobile
    - _Requirements: 10.7_

  - [ ]* 10.3 Write unit tests for projects page
    - Test project cards render with correct data
    - Test technology badges display correctly
    - Test GitHub and demo links work
    - Test hover overlay appears correctly
    - Test responsive layout at different breakpoints
    - _Requirements: 10.7_


- [ ] 11. Redesign footer component
  - [ ] 11.1 Update footer structure and layout
    - Update footer.component.html with four-column grid layout
    - Add brand column (40% width) with logo, description, social media icons
    - Add Quick Links column (20% width) with page links
    - Add Popular Courses column (20% width) with course links
    - Add Contact column (20% width) with address, phone, email
    - Create bottom bar with copyright and legal links
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 11.2 Style footer with design system
    - Apply neutral-900 background with neutral-300 text
    - Add 4px solid primary-600 border-top
    - Style headings with neutral-white color
    - Style social media icons (40x40px touch targets, neutral-400 default, primary-400 hover)
    - Add bottom bar with neutral-black background
    - Implement responsive layout for mobile (single column stack)
    - _Requirements: 9.5, 9.6, 9.7_

  - [ ]* 11.3 Write property test for footer responsive stacking
    - **Property 23: Footer Content Responsive Stacking**
    - **Validates: Requirements 9.7**
    - Verify footer stacks vertically at mobile breakpoints

  - [ ]* 11.4 Write unit tests for footer component
    - Test all footer sections render correctly
    - Test links navigate to correct routes
    - Test social media icons display and link correctly
    - Test copyright information displays
    - Test responsive layout at mobile breakpoints
    - _Requirements: 9.1-9.7_


- [ ] 12. Implement reusable button components
  - [ ] 12.1 Create button component variants
    - Create button component with primary, secondary, outline, text, icon variants
    - Implement size variants (small, medium, large)
    - Add loading state with spinner and disabled styling
    - Add disabled state with opacity 0.5 and cursor not-allowed
    - Style with design system tokens (colors, spacing, transitions)
    - _Requirements: 10.3_

  - [ ] 12.2 Style button hover and active states
    - Implement primary button hover (translateY -2px, shadow-md, brightness 1.05)
    - Implement secondary button hover (background primary-600, color white)
    - Implement outline button hover (background primary-50)
    - Add smooth transitions (200ms for all states)
    - Ensure minimum 44x44px touch targets
    - _Requirements: 10.3, 12.5, 15.1, 15.2_

  - [ ]* 12.3 Write property test for hover state visual feedback
    - **Property 14: Hover State Visual Feedback**
    - **Validates: Requirements 2.8, 5.7, 15.1, 15.2, 15.3, 15.7**
    - Verify all interactive elements have hover styles with smooth transitions (150-300ms)

  - [ ]* 12.4 Write unit tests for button components
    - Test all button variants render correctly
    - Test size variants apply correct styling
    - Test loading state displays spinner
    - Test disabled state prevents clicks
    - Test hover and active states apply correctly
    - _Requirements: 10.3, 15.1, 15.2_


- [ ] 13. Implement section header component
  - [ ] 13.1 Create reusable section header component
    - Create SectionHeader component with badge, heading, subtitle
    - Style badge with primary-50 background, primary-700 text, uppercase, letter-spacing
    - Style heading with font-size-4xl (desktop), font-size-3xl (mobile), font-weight-extrabold
    - Style subtitle with font-size-lg, neutral-600 color, max-width 600px
    - Center-align all content with max-width 800px
    - Add support for highlighting words in primary-600 color
    - _Requirements: 10.7_

  - [ ]* 13.2 Write unit tests for section header component
    - Test badge displays correctly
    - Test heading renders with proper styling
    - Test subtitle displays with correct max-width
    - Test component is center-aligned
    - Test highlighted words apply primary color
    - _Requirements: 10.7_

- [ ] 14. Checkpoint - Ensure all components render correctly
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 15. Implement responsive design across all pages
  - [ ] 15.1 Add responsive breakpoint utilities
    - Create BreakpointService with isMobile(), isTablet(), isDesktop() methods
    - Use Angular CDK BreakpointObserver for responsive detection
    - Define breakpoints: mobile (< 768px), tablet (768-1023px), desktop (1024px+)
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 15.2 Implement responsive layouts for all components
    - Update all components to use responsive grid layouts
    - Implement mobile-first CSS with media queries
    - Ensure content stacks vertically on mobile
    - Adjust font sizes for mobile (reduce by one step)
    - Adjust spacing for mobile (reduce padding/margins)
    - Test all pages at 320px, 768px, 1024px, 1440px widths
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.6_

  - [ ]* 15.3 Write property test for responsive layout adaptation
    - **Property 7: Responsive Layout Adaptation**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.6**
    - Verify layouts adapt appropriately for all viewport widths (320-2560px)

  - [ ]* 15.4 Write property test for mobile touch target size
    - **Property 8: Mobile Touch Target Size**
    - **Validates: Requirements 12.5**
    - Verify all interactive elements are minimum 44x44px at mobile breakpoints

  - [ ]* 15.5 Write unit tests for responsive behavior
    - Test components adapt at different breakpoints
    - Test mobile navigation displays correctly
    - Test grid layouts change column counts
    - Test font sizes adjust appropriately
    - Test spacing adjusts for mobile
    - _Requirements: 12.1-12.6_


- [ ] 16. Implement comprehensive accessibility features
  - [ ] 16.1 Add keyboard navigation support
    - Ensure all interactive elements are focusable via Tab key
    - Implement Enter/Space activation for buttons and links
    - Add keyboard shortcuts for navigation (optional)
    - Test keyboard-only navigation through all pages
    - _Requirements: 13.3_

  - [ ] 16.2 Implement focus indicators
    - Add visible focus indicators to all focusable elements
    - Style with 2px solid primary-500 outline with 2px offset
    - Ensure focus indicators have sufficient contrast (minimum 3:1)
    - Test focus indicators are visible on all backgrounds
    - _Requirements: 13.4_

  - [ ] 16.3 Add ARIA attributes and semantic HTML
    - Add ARIA labels for hamburger menu, modals, dropdowns
    - Add ARIA roles for custom interactive components
    - Add ARIA states (aria-expanded, aria-hidden, aria-current)
    - Use semantic HTML elements (nav, main, article, section, footer)
    - Add skip links for keyboard navigation
    - _Requirements: 13.5_

  - [ ] 16.4 Implement form accessibility
    - Associate all form inputs with labels (for/id or wrapping)
    - Add aria-describedby for error messages
    - Add aria-invalid for invalid fields
    - Add aria-required for required fields
    - Implement focus management (focus first invalid field)
    - _Requirements: 13.7_

  - [ ] 16.5 Add reduced motion support
    - Detect prefers-reduced-motion: reduce setting
    - Disable or reduce animations when setting is active
    - Reduce transition durations to 50ms or remove
    - Test with system reduced motion setting enabled
    - _Requirements: 13.8, 15.8_

  - [ ]* 16.6 Write property test for keyboard navigation support
    - **Property 17: Keyboard Navigation Support**
    - **Validates: Requirements 13.3**
    - Verify all interactive elements are keyboard accessible and operable

  - [ ]* 16.7 Write property test for focus indicator visibility
    - **Property 18: Focus Indicator Visibility**
    - **Validates: Requirements 13.4**
    - Verify visible focus indicators (minimum 2px outline) on all focusable elements

  - [ ]* 16.8 Write property test for form label association
    - **Property 19: Form Label Association**
    - **Validates: Requirements 13.7**
    - Verify all form inputs have associated labels

  - [ ]* 16.9 Write property test for ARIA attributes
    - **Property 20: ARIA Attributes for Semantics**
    - **Validates: Requirements 13.5**
    - Verify appropriate ARIA roles, labels, and states on custom components

  - [ ]* 16.10 Write property test for reduced motion respect
    - **Property 21: Reduced Motion Respect**
    - **Validates: Requirements 13.8, 15.8**
    - Verify animations are disabled/reduced when prefers-reduced-motion is set

  - [ ]* 16.11 Run automated accessibility tests
    - Use axe-core for automated accessibility testing
    - Test all pages and components for violations
    - Ensure WCAG 2.1 Level AA compliance
    - Fix any critical or serious violations
    - _Requirements: 13.1_


- [ ] 17. Implement performance optimizations
  - [ ] 17.1 Optimize image loading
    - Implement lazy loading for all below-fold images
    - Use Unsplash API with specific dimensions to avoid oversized images
    - Add explicit width/height attributes to prevent layout shift
    - Implement progressive image loading (blur-up technique)
    - Compress images appropriately for web
    - _Requirements: 14.3, 14.7_

  - [ ] 17.2 Optimize bundle size
    - Enable Angular production build optimizations (AOT, build optimizer)
    - Implement lazy loading for route modules
    - Tree-shake unused code
    - Minimize CSS and JavaScript
    - Use CDN for Font Awesome and Google Fonts
    - _Requirements: 14.4_

  - [ ] 17.3 Implement modern image formats
    - Serve images in WebP format with JPEG/PNG fallbacks
    - Use picture element with source sets for format selection
    - Test browser compatibility for image formats
    - _Requirements: 11.3, 14.5, 22_

  - [ ]* 17.4 Write property test for image format optimization
    - **Property 22: Image Format Optimization**
    - **Validates: Requirements 11.3, 14.5**
    - Verify images are provided in WebP with fallback formats

  - [ ]* 17.5 Run Lighthouse performance tests
    - Run Lighthouse CI on all pages
    - Ensure desktop performance score 90+
    - Ensure mobile performance score 80+
    - Ensure accessibility score 100
    - Ensure best practices score 95+
    - Fix any performance issues identified
    - _Requirements: 14.1, 14.2_

  - [ ]* 17.6 Test Core Web Vitals
    - Measure Largest Contentful Paint (target < 2.5s)
    - Measure First Input Delay (target < 100ms)
    - Measure Cumulative Layout Shift (target < 0.1)
    - Measure First Contentful Paint (target < 1.8s)
    - Optimize any metrics that don't meet targets
    - _Requirements: 14.7_


- [ ] 18. Implement animations and micro-interactions
  - [ ] 18.1 Add scroll animations
    - Implement fade-in animations for sections on scroll
    - Add stagger animations for card grids (100ms delay between items)
    - Use Intersection Observer API for scroll detection
    - Ensure animations respect prefers-reduced-motion
    - _Requirements: 3.7, 4.8, 15.6_

  - [ ] 18.2 Add hover and interaction animations
    - Implement smooth hover transitions for all interactive elements
    - Add active/pressed states for buttons and links
    - Implement loading states with spinners for async actions
    - Add success and error feedback animations
    - Ensure all transitions are 150-300ms duration
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.7_

  - [ ] 18.3 Add floating animations for hero decorative cards
    - Implement subtle floating animation (translateY -10px to 10px)
    - Use 3s ease-in-out infinite timing
    - Only display on desktop (hide on mobile)
    - Ensure animations don't distract from content
    - _Requirements: 3.7_

  - [ ]* 18.4 Write unit tests for animations
    - Test scroll animations trigger correctly
    - Test hover states apply transitions
    - Test loading states display spinners
    - Test animations respect reduced motion setting
    - _Requirements: 15.1-15.8_

- [ ] 19. Checkpoint - Ensure all features work correctly
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 20. Implement error handling and edge cases
  - [ ] 20.1 Add image loading error handling
    - Implement onerror handlers for all image elements
    - Display fallback images or placeholders on error
    - For company logos: Display company name text as fallback
    - For hero/course images: Display gradient background with icon
    - Log errors to console for debugging
    - _Requirements: 11.7_

  - [ ] 20.2 Add form validation error handling
    - Implement field-specific validation rules
    - Display error messages below invalid fields
    - Apply error styling to invalid inputs
    - Focus first invalid field on submit attempt
    - Prevent form submission until all fields valid
    - _Requirements: 8.5, 8.7_

  - [ ] 20.3 Add API communication error handling
    - Display user-friendly error messages for API failures
    - Provide retry option for transient failures
    - Maintain form data so user doesn't lose input
    - Show specific error messages when possible
    - Handle network errors, timeouts, 400/401/404/500 errors
    - _Requirements: 8.7_

  - [ ]* 20.4 Write unit tests for error handling
    - Test image error handlers display fallbacks
    - Test form validation shows error messages
    - Test API errors display user-friendly messages
    - Test retry functionality works correctly
    - _Requirements: 8.5, 8.7, 11.7_


- [ ] 21. Create utility services and helpers
  - [ ] 21.1 Create FocusService for accessibility
    - Implement focusFirstInvalidField() method for forms
    - Implement trapFocus() method for modals/drawers
    - Add keyboard event handling for focus management
    - _Requirements: 13.3, 13.4_

  - [ ] 21.2 Create contrast calculation utilities
    - Implement calculateContrastRatio() function
    - Use for testing color contrast compliance
    - Ensure all text/background combinations meet WCAG AA
    - _Requirements: 1.7, 13.2_

  - [ ] 21.3 Create responsive utilities
    - Implement viewport width detection utilities
    - Create helper functions for breakpoint checks
    - Add utilities for touch target size validation
    - _Requirements: 12.1-12.5_

  - [ ]* 21.4 Write unit tests for utility services
    - Test FocusService methods work correctly
    - Test contrast calculation is accurate
    - Test responsive utilities detect breakpoints correctly
    - _Requirements: 13.2, 13.3, 13.4, 12.1-12.5_


- [ ] 22. Set up testing infrastructure
  - [ ] 22.1 Configure property-based testing with fast-check
    - Install fast-check library: npm install --save-dev fast-check
    - Configure Jasmine/Karma to run property tests
    - Set minimum 100 iterations per property test
    - Add test tagging format: "Feature: professional-it-institute-ui, Property {number}: {property_text}"
    - _Requirements: All properties_

  - [ ] 22.2 Configure accessibility testing with axe-core
    - Install axe-core and jest-axe: npm install --save-dev axe-core jest-axe
    - Configure automated accessibility tests for all pages
    - Set up CI to fail build on critical violations
    - _Requirements: 13.1_

  - [ ] 22.3 Set up visual regression testing
    - Choose tool (Percy or Chromatic)
    - Configure screenshot capture at all breakpoints
    - Set up baseline images
    - Configure CI integration for visual tests
    - _Requirements: 14.1, 14.2_

  - [ ] 22.4 Configure Lighthouse CI
    - Install Lighthouse CI: npm install --save-dev @lhci/cli
    - Configure performance thresholds (desktop 90+, mobile 80+)
    - Set up CI integration
    - Configure to fail build if thresholds not met
    - _Requirements: 14.1, 14.2_


- [ ] 23. Write comprehensive property-based tests
  - [ ]* 23.1 Write remaining property tests for design system
    - All property tests should already be written as sub-tasks above
    - This task ensures all 25 properties are covered
    - Verify each property test references correct requirements
    - Ensure all tests use proper tagging format
    - Run all property tests and verify they pass
    - _Requirements: All requirements_

  - [ ]* 23.2 Verify property test coverage
    - Property 1: Color Contrast Compliance ✓ (Task 1.2)
    - Property 2: Design System Token Consistency ✓ (Task 1.1)
    - Property 3: Authentic Imagery Usage ✓ (Task 3.4)
    - Property 4: Image Accessibility ✓ (Task 3.5)
    - Property 5: Image Lazy Loading ✓ (Task 3.6)
    - Property 6: Image Fallback Handling ✓ (Task 3.7)
    - Property 7: Responsive Layout Adaptation ✓ (Task 15.3)
    - Property 8: Mobile Touch Target Size ✓ (Task 15.4)
    - Property 9: Navigation Active State ✓ (Task 2.3)
    - Property 10: Navigation Fixed Positioning ✓ (Task 2.4)
    - Property 11: Mobile Navigation Behavior ✓ (Task 2.5)
    - Property 12: Course Card Required Fields ✓ (Task 6.4)
    - Property 13: Internship Card Required Fields ✓ (Task 7.4)
    - Property 14: Hover State Visual Feedback ✓ (Task 12.3)
    - Property 15: Form Validation Feedback ✓ (Task 9.4)
    - Property 16: Form Submission States ✓ (Task 9.5)
    - Property 17: Keyboard Navigation Support ✓ (Task 16.6)
    - Property 18: Focus Indicator Visibility ✓ (Task 16.7)
    - Property 19: Form Label Association ✓ (Task 16.8)
    - Property 20: ARIA Attributes for Semantics ✓ (Task 16.9)
    - Property 21: Reduced Motion Respect ✓ (Task 16.10)
    - Property 22: Image Format Optimization ✓ (Task 17.4)
    - Property 23: Footer Content Responsive Stacking ✓ (Task 11.3)
    - Property 24: Contact Form Responsive Usability ✓ (Task 9.6)
    - Property 25: About Page Responsive Hierarchy ✓ (Task 8.3)


- [ ] 24. Integration and final polish
  - [ ] 24.1 Wire all components together
    - Ensure all components are properly imported in app.module.ts
    - Verify routing is configured for all pages
    - Test navigation between all pages works correctly
    - Ensure services are properly injected where needed
    - Verify data flows correctly from services to components
    - _Requirements: All requirements_

  - [ ] 24.2 Add final styling touches
    - Review all pages for visual consistency
    - Ensure spacing is consistent across all sections
    - Verify color palette is applied consistently
    - Check typography hierarchy is correct
    - Ensure shadows and borders are consistent
    - Test hover states on all interactive elements
    - _Requirements: 10.7, 10.8_

  - [ ] 24.3 Test cross-browser compatibility
    - Test on Chrome (latest 2 versions)
    - Test on Firefox (latest 2 versions)
    - Test on Safari (latest 2 versions)
    - Test on Edge (latest 2 versions)
    - Test on iOS Safari (latest 2 versions)
    - Test on Chrome Mobile (latest 2 versions)
    - Fix any browser-specific issues
    - _Requirements: 12.7_

  - [ ] 24.4 Optimize production build
    - Enable AOT compilation
    - Enable build optimizer
    - Disable source maps for production
    - Enable CSS and JS minification
    - Configure bundle budgets
    - Test production build locally
    - _Requirements: 14.4_

  - [ ]* 24.5 Run full test suite
    - Run all unit tests (target 80%+ coverage)
    - Run all property-based tests (all 25 properties)
    - Run accessibility tests (100% pass rate)
    - Run Lighthouse tests (meet all thresholds)
    - Run visual regression tests
    - Fix any failing tests
    - _Requirements: All requirements_


- [ ] 25. Documentation and deployment preparation
  - [ ] 25.1 Update documentation
    - Document design system tokens and usage
    - Document component API and props
    - Document accessibility features implemented
    - Document performance optimizations applied
    - Update README with setup instructions
    - _Requirements: All requirements_

  - [ ] 25.2 Prepare deployment checklist
    - Verify all tests passing
    - Verify Lighthouse scores meet thresholds
    - Verify no accessibility violations
    - Verify visual regression tests approved
    - Configure environment variables (Unsplash API key)
    - Configure CDN for static assets
    - Set up error monitoring (Sentry or similar)
    - Set up performance monitoring
    - _Requirements: 14.1, 14.2_

  - [ ] 25.3 Create deployment build
    - Run production build: ng build --configuration production
    - Verify bundle sizes are within budgets
    - Test production build locally
    - Verify all assets load correctly
    - Verify API integrations work in production
    - _Requirements: 14.4_

- [ ] 26. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all 25 correctness properties are validated
  - Confirm all requirements are met
  - Review implementation against design document

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests validate all 25 correctness properties from the design document
- Unit tests validate specific examples, edge cases, and integration points
- Checkpoints ensure incremental validation at key milestones
- The implementation uses TypeScript with Angular 15.x framework
- All styling uses CSS custom properties from the design system
- Images are sourced from Unsplash API and Clearbit Logo API
- Accessibility is built into every component from the start
- Performance optimizations are applied throughout implementation

## Implementation Context

**Logo Information**: WebVibes Technologies logo with tagline "WHERE VIBES MEETS INNOVATION" uses vibrant orange/yellow colors with blue background. This should be prominently displayed in the navigation bar and footer.

**Color Scheme**: Professional technology-focused palette with blue primary (#2196F3), orange secondary (#FF9800), and comprehensive neutral grays. No purple/blue gradients from old design.

**Typography**: Inter font family from Google Fonts with comprehensive scale from 12px to 60px.

**Imagery**: All images must be from Unsplash API (for photos) or Clearbit API (for company logos). No placeholder services allowed.

**Accessibility**: WCAG 2.1 Level AA compliance is mandatory, not optional. All interactive elements must be keyboard accessible with visible focus indicators.

**Performance**: Lighthouse scores must meet thresholds (90+ desktop, 80+ mobile) before deployment.

