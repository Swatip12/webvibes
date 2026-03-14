import { Component, Input } from '@angular/core';

/**
 * Lazy loading image component with loading states and error handling
 * Requirements: 11.3, 11.6, 11.7, 14.3
 */
@Component({
  selector: 'app-lazy-image',
  templateUrl: './lazy-image.component.html',
  styleUrls: ['./lazy-image.component.css']
})
export class LazyImageComponent {
  /**
   * Image source URL
   */
  @Input() src: string = '';

  /**
   * Alternative text for accessibility
   */
  @Input() alt: string = '';

  /**
   * Loading strategy: 'lazy' for below-fold images, 'eager' for above-fold
   * Default: 'lazy' for performance optimization
   */
  @Input() loading: 'lazy' | 'eager' = 'lazy';

  /**
   * Optional CSS class to apply to the image element
   */
  @Input() imageClass: string = '';

  /**
   * Optional fallback image URL to display on error
   */
  @Input() fallbackSrc: string = '';

  /**
   * Whether to show fallback text when image fails to load
   */
  @Input() showFallbackText: boolean = true;

  /**
   * Track if image has loaded successfully
   */
  isLoaded: boolean = false;

  /**
   * Track if image failed to load
   */
  hasError: boolean = false;

  /**
   * Handle successful image load
   * Triggers fade-in animation by setting isLoaded to true
   */
  onLoad(): void {
    this.isLoaded = true;
    this.hasError = false;
  }

  /**
   * Handle image load error
   * Attempts to use fallback image if provided, otherwise shows error state
   * 
   * @param event - Error event from image element
   */
  handleError(event: Event): void {
    const img = event.target as HTMLImageElement;
    
    // If we have a fallback and haven't tried it yet
    if (this.fallbackSrc && img.src !== this.fallbackSrc) {
      img.src = this.fallbackSrc;
      return;
    }
    
    // No fallback or fallback also failed
    this.hasError = true;
    this.isLoaded = false;
    
    // Log error for debugging
    console.warn('Image failed to load:', this.src);
  }

  /**
   * Get the current display state for styling
   */
  get displayState(): 'loading' | 'loaded' | 'error' {
    if (this.hasError) return 'error';
    if (this.isLoaded) return 'loaded';
    return 'loading';
  }
}
