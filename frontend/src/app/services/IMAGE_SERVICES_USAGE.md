# Image Integration Services Usage Guide

This guide demonstrates how to use the ImageService, LogoService, and LazyImageComponent for the Professional IT Institute UI redesign.

## ImageService

The ImageService provides integration with Unsplash API for professional stock photography.

### Basic Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html'
})
export class HeroSectionComponent implements OnInit {
  heroImageUrl: string = '';

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    // Get a hero image about technology
    this.heroImageUrl = this.imageService.getImage('students learning technology', 1200, 800);
  }
}
```

### Methods

#### `getImage(query: string, width?: number, height?: number): string`
Returns a URL for an Unsplash image matching the query.

**Parameters:**
- `query`: Search term (e.g., "technology", "coding classroom")
- `width`: Image width in pixels (default: 800)
- `height`: Image height in pixels (default: 600)

**Example:**
```typescript
const courseImage = this.imageService.getImage('web development', 600, 400);
```

#### `getRandomImage(query: string, width?: number, height?: number): string`
Returns a random image URL with a timestamp to ensure uniqueness.

**Example:**
```typescript
const randomTechImage = this.imageService.getRandomImage('programming', 800, 600);
```

#### `buildUnsplashUrl(query: string, width: number, height: number): string`
Builds a static Unsplash Source API URL.

**Example:**
```typescript
const url = this.imageService.buildUnsplashUrl('data science', 1920, 1080);
// Returns: https://source.unsplash.com/1920x1080/?data%20science
```

---

## LogoService

The LogoService provides integration with Clearbit Logo API for company logos.

### Basic Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { LogoService } from '../../services/logo.service';

@Component({
  selector: 'app-companies-section',
  templateUrl: './companies-section.component.html'
})
export class CompaniesSectionComponent implements OnInit {
  companyLogos: string[] = [];

  constructor(private logoService: LogoService) {}

  ngOnInit(): void {
    const companies = ['google.com', 'microsoft.com', 'amazon.com'];
    this.companyLogos = companies.map(domain => 
      this.logoService.getCompanyLogo(domain)
    );
  }
}
```

### Methods

#### `getCompanyLogo(domain: string, size?: number): string`
Returns a URL for a company logo from Clearbit.

**Parameters:**
- `domain`: Company domain (e.g., "google.com", "microsoft.com")
- `size`: Optional size parameter (e.g., 128 for 128x128px)

**Example:**
```typescript
const googleLogo = this.logoService.getCompanyLogo('google.com', 128);
// Returns: https://logo.clearbit.com/google.com?size=128
```

**Domain Cleaning:**
The service automatically cleans domains by removing:
- Protocols (http://, https://)
- www prefix
- Trailing slashes
- Paths and query parameters

```typescript
// All of these return the same URL:
this.logoService.getCompanyLogo('google.com');
this.logoService.getCompanyLogo('https://www.google.com/');
this.logoService.getCompanyLogo('http://google.com/search');
```

#### `getCompanyLogoWithFallback(domain: string, companyName: string): object`
Returns an object with logo URL and fallback text.

**Example:**
```typescript
const logo = this.logoService.getCompanyLogoWithFallback('google.com', 'Google');
// Returns: { logoUrl: 'https://logo.clearbit.com/google.com', fallbackText: 'Google' }
```

**Usage in template:**
```html
<img [src]="logo.logoUrl" 
     [alt]="logo.fallbackText + ' logo'"
     (error)="showFallbackText(logo.fallbackText)">
```

#### `isValidDomain(domain: string): boolean`
Validates if a domain string is valid.

**Example:**
```typescript
this.logoService.isValidDomain('google.com'); // true
this.logoService.isValidDomain('localhost'); // false
this.logoService.isValidDomain(''); // false
```

---

## LazyImageComponent

The LazyImageComponent provides optimized image loading with loading states, error handling, and fade-in animations.

### Basic Usage

```html
<app-lazy-image
  [src]="imageUrl"
  [alt]="'Students learning technology'"
  [loading]="'lazy'">
</app-lazy-image>
```

### Properties

#### `src: string` (required)
The image source URL.

#### `alt: string` (required)
Alternative text for accessibility.

#### `loading: 'lazy' | 'eager'` (optional, default: 'lazy')
Loading strategy:
- `'lazy'`: For below-fold images (deferred loading)
- `'eager'`: For above-fold images (immediate loading)

#### `imageClass: string` (optional)
Custom CSS class to apply to the image element.

#### `fallbackSrc: string` (optional)
Fallback image URL to display if the primary image fails to load.

#### `showFallbackText: boolean` (optional, default: true)
Whether to show "Image unavailable" text on error.

### Complete Example

```html
<!-- Hero section image (above-fold, eager loading) -->
<app-lazy-image
  [src]="heroImageUrl"
  [alt]="'Professional IT training environment'"
  [loading]="'eager'"
  [imageClass]="'hero-image'">
</app-lazy-image>

<!-- Course card image (below-fold, lazy loading) -->
<app-lazy-image
  [src]="courseImageUrl"
  [alt]="'Web Development Course'"
  [loading]="'lazy'"
  [fallbackSrc]="'assets/images/course-placeholder.jpg'">
</app-lazy-image>

<!-- Company logo with error handling -->
<app-lazy-image
  [src]="companyLogoUrl"
  [alt]="companyName + ' logo'"
  [loading]="'lazy'"
  [showFallbackText]="false"
  [imageClass]="'company-logo'">
</app-lazy-image>
```

### States

The component has three states:

1. **Loading**: Shows a spinner while the image loads
2. **Loaded**: Image successfully loaded with fade-in animation
3. **Error**: Shows error icon and optional fallback text

### Styling

The component uses CSS custom properties from the design system:

```css
/* Override in your component CSS if needed */
.lazy-image-container {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
```

### Accessibility Features

- Proper alt text for screen readers
- Loading state announced to screen readers
- Error state with descriptive text
- Respects `prefers-reduced-motion` setting

---

## Complete Integration Example

Here's a complete example showing all three services working together:

```typescript
// internship-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { LogoService } from '../../services/logo.service';

interface Internship {
  id: string;
  title: string;
  company: string;
  companyDomain: string;
  description: string;
}

@Component({
  selector: 'app-internship-card',
  templateUrl: './internship-card.component.html',
  styleUrls: ['./internship-card.component.css']
})
export class InternshipCardComponent implements OnInit {
  @Input() internship!: Internship;
  
  companyLogoUrl: string = '';
  backgroundImageUrl: string = '';

  constructor(
    private imageService: ImageService,
    private logoService: LogoService
  ) {}

  ngOnInit(): void {
    // Get company logo
    this.companyLogoUrl = this.logoService.getCompanyLogo(
      this.internship.companyDomain,
      128
    );

    // Get background image
    this.backgroundImageUrl = this.imageService.getImage(
      'office workspace',
      800,
      400
    );
  }
}
```

```html
<!-- internship-card.component.html -->
<div class="internship-card">
  <!-- Background image -->
  <div class="card-background">
    <app-lazy-image
      [src]="backgroundImageUrl"
      [alt]="'Office workspace'"
      [loading]="'lazy'"
      [imageClass]="'background-image'">
    </app-lazy-image>
  </div>

  <!-- Company logo -->
  <div class="company-logo">
    <app-lazy-image
      [src]="companyLogoUrl"
      [alt]="internship.company + ' logo'"
      [loading]="'lazy'"
      [showFallbackText]="false"
      [imageClass]="'logo-image'">
    </app-lazy-image>
  </div>

  <!-- Content -->
  <div class="card-content">
    <h3>{{ internship.title }}</h3>
    <p class="company-name">{{ internship.company }}</p>
    <p class="description">{{ internship.description }}</p>
    <button class="btn-primary">Apply Now</button>
  </div>
</div>
```

---

## Best Practices

### 1. Use Descriptive Queries
```typescript
// Good
this.imageService.getImage('students learning programming in classroom', 1200, 800);

// Less effective
this.imageService.getImage('tech', 1200, 800);
```

### 2. Choose Appropriate Loading Strategy
```html
<!-- Above-fold: Use eager loading -->
<app-lazy-image [loading]="'eager'" ...>

<!-- Below-fold: Use lazy loading (default) -->
<app-lazy-image [loading]="'lazy'" ...>
```

### 3. Always Provide Alt Text
```html
<!-- Good -->
<app-lazy-image 
  [src]="imageUrl" 
  [alt]="'Students collaborating on a coding project'">

<!-- Bad -->
<app-lazy-image [src]="imageUrl" [alt]="''">
```

### 4. Handle Errors Gracefully
```typescript
// Provide fallback images
<app-lazy-image
  [src]="primaryImageUrl"
  [fallbackSrc]="'assets/images/fallback.jpg'"
  [alt]="'Course image'">
```

### 5. Validate Domains Before Using LogoService
```typescript
if (this.logoService.isValidDomain(companyDomain)) {
  this.logoUrl = this.logoService.getCompanyLogo(companyDomain);
} else {
  this.logoUrl = 'assets/images/company-placeholder.svg';
}
```

---

## Requirements Validation

These services fulfill the following requirements:

- **Requirement 11.1**: Real-time imagery from professional sources (Unsplash)
- **Requirement 11.2**: Actual company logos (Clearbit)
- **Requirement 11.3**: Optimized images for web performance
- **Requirement 11.6**: Lazy loading implementation
- **Requirement 11.7**: Fallback states for failed images
- **Requirement 14.3**: Performance optimization with lazy loading

---

## Testing

All services include comprehensive unit tests. Run tests with:

```bash
# Test ImageService
npm test -- --include='**/image.service.spec.ts'

# Test LogoService
npm test -- --include='**/logo.service.spec.ts'

# Test LazyImageComponent
npm test -- --include='**/lazy-image.component.spec.ts'

# Test all three
npm test -- --include='**/image.service.spec.ts' --include='**/logo.service.spec.ts' --include='**/lazy-image.component.spec.ts'
```
