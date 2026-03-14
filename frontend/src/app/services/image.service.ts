import { Injectable } from '@angular/core';

/**
 * Service for integrating with image APIs for professional stock photography
 * Requirements: 11.1, 11.2
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  /**
   * Get an image URL from Picsum Photos API (Lorem Picsum)
   * This is a free placeholder image service that works reliably
   * 
   * @param query - Search query for the image (used for seed to get consistent images)
   * @param width - Desired image width in pixels (default: 800)
   * @param height - Desired image height in pixels (default: 600)
   * @returns URL string for the image
   */
  getImage(query: string, width: number = 800, height: number = 600): string {
    // Use query as seed for consistent images per query
    const seed = this.hashCode(query);
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }

  /**
   * Build an image URL with specific dimensions
   * 
   * @param query - Search query (used as seed)
   * @param width - Image width in pixels
   * @param height - Image height in pixels
   * @returns Complete image URL
   */
  buildUnsplashUrl(query: string, width: number, height: number): string {
    return this.getImage(query, width, height);
  }

  /**
   * Get a random image URL for a specific query
   * Adds a random parameter to ensure different images on each call
   * 
   * @param query - Search query for the image
   * @param width - Image width in pixels (default: 800)
   * @param height - Image height in pixels (default: 600)
   * @returns URL string for a random image
   */
  getRandomImage(query: string, width: number = 800, height: number = 600): string {
    // Add timestamp to ensure different images on each call
    const timestamp = Date.now();
    const seed = this.hashCode(query + timestamp);
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }

  /**
   * Generate a hash code from a string to use as seed
   * @param str - String to hash
   * @returns Hash code as number
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
