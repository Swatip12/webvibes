import { Injectable } from '@angular/core';

/**
 * Service for integrating with Clearbit Logo API for company logos
 * Requirements: 11.1, 11.2
 */
@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private readonly clearbitBaseUrl = 'https://logo.clearbit.com';

  /**
   * Get company logo URL from Clearbit Logo API
   * 
   * @param domain - Company domain (e.g., "google.com", "microsoft.com")
   * @param size - Optional size parameter for the logo (default: not specified, uses Clearbit default)
   * @returns URL string for the company logo
   * 
   * @example
   * getCompanyLogo('google.com') // Returns: https://logo.clearbit.com/google.com
   * getCompanyLogo('microsoft.com', 128) // Returns: https://logo.clearbit.com/microsoft.com?size=128
   */
  getCompanyLogo(domain: string, size?: number): string {
    if (!domain || domain.trim() === '') {
      throw new Error('Domain parameter is required');
    }

    // Clean the domain (remove protocol, www, trailing slashes)
    const cleanDomain = this.cleanDomain(domain);
    
    // Build URL with optional size parameter
    let url = `${this.clearbitBaseUrl}/${cleanDomain}`;
    if (size && size > 0) {
      url += `?size=${size}`;
    }
    
    return url;
  }

  /**
   * Get company logo URL with fallback handling
   * Returns an object with the logo URL and fallback text
   * 
   * @param domain - Company domain
   * @param companyName - Company name to use as fallback text
   * @returns Object containing logoUrl and fallbackText
   * 
   * @example
   * getCompanyLogoWithFallback('google.com', 'Google')
   * // Returns: { logoUrl: 'https://logo.clearbit.com/google.com', fallbackText: 'Google' }
   */
  getCompanyLogoWithFallback(domain: string, companyName: string): { logoUrl: string; fallbackText: string } {
    const logoUrl = this.getCompanyLogo(domain);
    return {
      logoUrl,
      fallbackText: companyName || domain
    };
  }

  /**
   * Clean domain string by removing protocol, www prefix, and trailing slashes
   * 
   * @param domain - Raw domain string
   * @returns Cleaned domain string
   * 
   * @private
   */
  private cleanDomain(domain: string): string {
    let cleaned = domain.trim().toLowerCase();
    
    // Remove protocol (http://, https://)
    cleaned = cleaned.replace(/^https?:\/\//, '');
    
    // Remove www prefix
    cleaned = cleaned.replace(/^www\./, '');
    
    // Remove trailing slashes and paths
    cleaned = cleaned.split('/')[0];
    
    // Remove query parameters
    cleaned = cleaned.split('?')[0];
    
    return cleaned;
  }

  /**
   * Validate if a domain string is valid
   * 
   * @param domain - Domain string to validate
   * @returns true if domain appears valid, false otherwise
   */
  isValidDomain(domain: string): boolean {
    if (!domain || domain.trim() === '') {
      return false;
    }

    const cleaned = this.cleanDomain(domain);
    
    // Basic domain validation: should contain at least one dot and valid characters
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
    return domainRegex.test(cleaned);
  }
}
